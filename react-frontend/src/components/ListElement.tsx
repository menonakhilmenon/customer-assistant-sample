import NumberCounter from "./NumberCounter";

export default function ListElement({ item, setItemCount }) {
    const updateCount = (count) => {
        setItemCount(item.type, count);
        console.log(`Rerendering ${item.type}`);
    };
    return (
        <li className="shadow-lg rounded-md p-3 m-1 bg-gray-500 flex justify-between items-center">
            <div>
                <p className="font-bold">
                    {item.type}
                </p>
                <br />
            </div>
            <NumberCounter setValue={updateCount} initialValue={item.count}></NumberCounter>
        </li>
    );
}