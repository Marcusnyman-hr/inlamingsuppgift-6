import React, {useReducer, useContext, useEffect} from 'react';
import axios from 'axios';
import { AuthTokenContext } from '../../context/Auth-token-context/AuthTokenContext'
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component'
import onClickOutside from "react-onclickoutside";

import './add-post.styles.scss'
//Component to add new income or expense entry
function AddPost({toggleAddEntry, setEditEntry, type, addEntry, entryToEdit, editExistingEntry }) {

  const [newPost, setNewPost] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
    id: '',
    title: '',
    desc: '',
    account: 'income',
    amount: '',
    currency: 'EUR',
    date: ''
    }
  )
  useEffect(() => {
    if(entryToEdit) {
      setNewPost(entryToEdit)
    }
  }, [])
  
  //handle submits.
  function handleSubmit(event) {
    event.preventDefault();
    const newId = Math.random().toString(36).substr(5, 7)
    const post = {
      id: newPost.id ? newPost.id : newId,
      account: newPost.account,
      title: newPost.title,
      desc: newPost.desc,
      amount: newPost.amount,
      currency: newPost.currency,
      //date from form, if date-input is empty it sets it current date.
      date: newPost.date ? newPost.date : new Date().toLocaleDateString()
    }

    //run prop-function to add or edit post 
    if(type === 'edit') {
      editExistingEntry(post)
      setEditEntry({toggle: false})
      return
    } else {
      addEntry(post);
    }
    //toggle bool to close the add-post form
    toggleAddEntry();

    

  //Handles form changes
  }
  function handleChange(event) {
    event.preventDefault();
    const {name, value} = event.target;
    setNewPost({[name]:value})
  }
  //Handle click outside and close outside component.
  AddPost.handleClickOutside = () => {
    if (type === 'add') toggleAddEntry();
    if (type === 'edit') setEditEntry({toggle: false});
  }
  return (
    <div className='add-post'>
      <div className='add-post-header'>
        <h3 className='add-post-header-heading'>{ type === 'edit' ? 'Edit entry' : 'Add entry'}</h3>
        <span className='close-btn' onClick={() => {
          if (type === 'add') toggleAddEntry();
          if (type === 'edit') setEditEntry({toggle: false});
        }}>x</span>
      </div>
      <form className="add-post-form" onSubmit={handleSubmit}>
        <FormInput 
          label='Title'
          type='text'
          name='title'
          value={newPost.title}
          autoComplete="off"
          required
          onChange={handleChange}
        />
        <FormInput 
          label='Description'
          type='text'
          name='desc'
          value={newPost.desc}
          autoComplete="off"
          onChange={handleChange}
        />
         <FormInput 
          label='Amount'
          type='number'
          name='amount'
          value={newPost.amount}
          autoComplete="off"
          required
          onChange={handleChange}
        />
        <div className='add-post-form-select-container'>
        <select name="currency" onChange={handleChange} className='add-post-form-currency-select' value={newPost.currency}>
          <option value="EUR">Euro</option>
          <option value="HRK">Hrk</option>
          <option value="SEK">Sek</option>
        </select>
        <select name="account" onChange={handleChange} className='add-post-form-account-select' value={newPost.account}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        </div>
        <input className='add-post-date-picker' type="date" name="date" onChange={handleChange} value={newPost.date}></input>
        <CustomButton>Add</CustomButton>
      </form>
      
    </div>
  )
}
//Config for handle click outside
const clickOutsideConfig = {
  handleClickOutside: () => AddPost.handleClickOutside
};

export default onClickOutside(AddPost, clickOutsideConfig);