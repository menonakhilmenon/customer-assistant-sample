import { useContext } from 'react';
import * as Constants from '../AppStates';
import ListElement from './ListElement';
export default function SearchList({appState, ItemsContext, setItemCount}) {
    if(appState == Constants.LOADING_STATE) {
        return (
            <h2>
                Loading
            </h2>
        )
    } else if (appState == Constants.INIT_STATE){
        return (<></>)
    }
    const items : Array<any> = useContext(ItemsContext);
    return (
        <ul className='box-border shadow-md w-128 mt-5'>
            {
                items.map(item => {
                    return(
                        <ListElement key={item.type} item={item} setItemCount={setItemCount}></ListElement>
                    );
                })
            }
        </ul>
    )
}