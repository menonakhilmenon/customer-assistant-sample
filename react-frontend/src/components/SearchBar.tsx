import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
export default function SearchBar({purpose, onSubmit}) {
    const [searchText, changeSearchText] = useState(purpose);
    const onPurposeChanged = function(e : FormEvent) {
        e.preventDefault();
        onSubmit( searchText, []);
    };
    return (
        <form className="flex-grow flex justify-center max-w-128 w-128" onSubmit={onPurposeChanged}>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative block w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                <input type="search" id="default-search"
                    className="block w-full font-bold p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="What are we looking for today ?"
                    onChange={e => changeSearchText(e.target.value)}
                    value={searchText}
                    required />
                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
        </form>
    )
}