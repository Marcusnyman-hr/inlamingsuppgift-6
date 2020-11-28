import React, {useState} from 'react'
import './delete-account.styles.scss'
import CustomButton from '../custom-button/custom-button.component'
import FormInput from '../form-input/form-input.component';

export default function DeleteAccount({deleteAccount, toggleDeleteAccount}) {
  const [accountToDelete, setAccountToDelete] = useState('')

  function handleChange(event) {
    event.preventDefault();
    const {value} = event.target;
    setAccountToDelete(value)
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('user-delete-submit ' + accountToDelete)
    }
  return (
    <div className='delete-account'>
      <h4>Do you want to delete your account?</h4>
      <ul className='delete-account-buttons'>
        <li className='delete-account-buttons-item'><span onClick={deleteAccount}>Yes!</span></li>
        <li className='delete-account-buttons-item'><span onClick={toggleDeleteAccount}>No!</span></li>
      </ul>
    </div>
  )
}
