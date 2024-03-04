import { createContext, useState } from 'react'
import './App.css'
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import "./AppStates";
import * as Constants from './AppStates';
import SearchList from './components/SearchList';
import { requestItemsList, requestRecommendations } from "./services/BackendService";
import Recommendation from './components/Recommendation';
export default function App() {
  const [purpose, setPurpose] = useState('');
  const [appState, setAppState] = useState(Constants.INIT_STATE);
  const [items, setItems] = useState([]);
  const [sessionId, setSessionId] = useState();
  const [recommendation, setRecommendation] = useState();
  const ItemsContext = createContext([]);

  const submitSearchQuery = async function (purpose: string) {
    setPurpose(purpose);
    setAppState(Constants.LOADING_STATE);
    const response = await requestItemsList(purpose);
    const inventory = [];
    response.items.forEach(i => {
      inventory.push({
        type: i.type,
        count: 0
      });
    })
    setItems(inventory);
    setSessionId(response.sessionId);
    setAppState(Constants.RES_AVAILABLE);
  };

  const setItemCount = async (itemType, count) => {
    let requiresNewRecommend = false;
    const modifiedItems = items.map(currItem => {
      if (currItem.type === itemType) {
        if (!currItem.count || (count === 0 && currItem.count > 0)) {
          requiresNewRecommend = true;
          console.log("Should request recommendation");
        }
        return { type: itemType, count: count };
      } else {
        return { type: currItem.type, count: currItem.count };
      }
    });
    setItems(modifiedItems);
    if (requiresNewRecommend) {
      console.log("Requesting recommendation");
      const recommendation = await requestRecommendations(modifiedItems, sessionId);
      const itemRecommended = modifiedItems.find(item => item.type === recommendation.item);
      if(itemRecommended && itemRecommended.count <= 0) {
        setRecommendation(recommendation);
      } else {
        setRecommendation(undefined);
      }
    }
  }
  const addRecommendation = async (itemType) => {
    await setItemCount(itemType, 1);
  }

  return (
    <div className='flex-col flex flex-grow items-center'>
      <Header text={'Shopping Made Easy'}/>
      <SearchBar purpose={purpose} onSubmit={submitSearchQuery} />
      <Recommendation appState={appState} itemInfo={recommendation} addItem={addRecommendation}></Recommendation>
      <ItemsContext.Provider value={items}>
        <SearchList appState={appState} ItemsContext={ItemsContext} setItemCount={setItemCount}></SearchList>
      </ItemsContext.Provider>
    </div>
  )
}