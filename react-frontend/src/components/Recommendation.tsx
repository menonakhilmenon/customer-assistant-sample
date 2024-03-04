import { faLightbulb, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Constants from "../AppStates";

export default function Recommendation({ appState, itemInfo, addItem }) {
    if (!itemInfo || itemInfo.confidence === 'LOW' || appState !== Constants.RES_AVAILABLE) {
        return <></>
    }
    const addCurrentItem = () => {
        addItem(itemInfo.item);
    }
    return (
        <div className="bg-slate-800 rounded-md m-5 p-3 w-128 flex flex-col">
            <h3 className="text-lg font-bold mb-2">
                <FontAwesomeIcon icon={faLightbulb}></FontAwesomeIcon> Recommendation
            </h3>
            <div className="flex flex-row">
                <div>
                    <p className="text-lg font-">
                        {itemInfo.reason}
                    </p>
                </div>
                <button onClick={addCurrentItem} className="flex-row flex ml-2 p-3 w-32 items-center max-h-12 bg-slate-700 hover:bg-slate-600">
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                    <span className="ml-3">
                        Add
                    </span>
                </button>
            </div>
        </div>

    );
}