import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function NumberCounter({ initialValue, setValue }) {
    const [value, updateValue] = useState(initialValue);
    const increment = () => {
        updateValue((currValue) => {
            const newVal = currValue + 1;
            setValue(newVal);
            return newVal;
        })
    };
    const decrement = () => {
        updateValue((currValue) => {
            const newVal = (currValue - 1) < 0 ? 0 : currValue - 1;
            setValue(newVal);
            return newVal;
        })
    }
    return (
        <div className="flex row-auto align-middle">
            <button onClick={increment} className="w-1 max-h-9 bg-gray-800 justify-center items-center flex rounded-r-none hover:bg-gray-700">
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </button>
            <p className="w-10 max-h-9 bg-gray-800 justify-center items-center flex font-bold">
                {value}
            </p>
            <button onClick={decrement} className="w-1 max-h-9 bg-gray-800 justify-center items-center flex rounded-l-none hover:bg-gray-700 disabled:bg-gray-600" disabled={(value <= 0)}>
                <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
            </button>
        </div>
    );
}