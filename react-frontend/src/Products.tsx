import './App.css'
import Header from './components/Header';
import "./AppStates";
import FormInput from './components/FormInput';
import { FormEvent, useState } from 'react';
import { addProduct } from './services/BackendService';
export default function Products() {
  const [itemType, setItemType] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const submitForm = async (e : FormEvent) => {
    e.preventDefault();
    await addProduct({description: itemDescription, type: itemType});
    setItemType('');
    setItemDescription('');
  }
  return (
    <div className='flex-col flex flex-grow items-center'>
      <Header text={'Product Management'} />
      <form className='w-128 flex flex-col' onSubmit={(e) => submitForm(e)}>
        <FormInput initialValue={itemType} onTextChanged={setItemType} placeholder={'Item Type'}></FormInput>
        <FormInput initialValue={itemDescription} onTextChanged={setItemDescription} placeholder={'Item Description'}></FormInput>
        <button type="submit" className="text-white m-4 justify-end bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Product</button>
      </form>
    </div>
  )
}