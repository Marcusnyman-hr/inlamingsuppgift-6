import React, {useState, useEffect, useContext} from 'react';
import { AuthTokenContext } from '../../context/Auth-token-context/AuthTokenContext'
import {withRouter} from 'react-router-dom';

import axios from 'axios';
import MoneyHeader from '../money-header/money-header.component';
import DailyExchangeRates from '../daily-exchange-rates/daily-exchange-rates.component';
import MoneyEntry from '../money-entry/money-entry.component';
import AddPost from '../add-post/add-post.component';
import MoneySummary from '../money-summary/money-summary.component';
import DeleteAccount from '../delete-account/delete-account.component';

import './money.styles.scss';
//Main component for handleing income and expenses
function Money({history}) {
  //Get authToken from context for fetching data
  const [authToken] = useContext(AuthTokenContext);

  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [rates, setRates] = useState([]);
  const [addEntryToggle, setAddEntryToggle] = useState(false);
  const [editEntry, setEditEntry] = useState({
    toggle: false,
  });
  const [deleteAccountToggle, setDeleteAccountToggle] = useState(false);

  //fetch rates and userentries
  useEffect(() => {
    fetchRates()
    fetchUsersEntries();
  }, [])

  return (
    <div className='money'>
    {addEntryToggle ? <AddPost toggleAddEntry={toggleAddEntry} addEntry={addEntry} type='add'/> : null}
    {editEntry.toggle ? <AddPost 
    toggleAddEntry={toggleAddEntry} 
    addEntry={addEntry} 
    entryToEdit={editEntry}
    setEditEntry={setEditEntry}
    editExistingEntry={editExistingEntry}
    deleteEntry={deleteEntry}
    type='edit'/> : null}
    {deleteAccountToggle ? <DeleteAccount deleteAccount={deleteAccount} toggleDeleteAccount={toggleDeleteAccount}/> : null}
    <div className='money-container'>
    <MoneyHeader toggleAddEntry={toggleAddEntry} toggleDeleteAccount={toggleDeleteAccount}/>
    <div className='income'>
      <h3 className='money-container-h3'>Income</h3>
      
      <div className='money-container-income'>
      {income.length === 0 ? <span className='no-data-msg'>No data to show yet!</span> : null}
        <ul>
          {mapEntries(income)}
        </ul>
        {editEntry.toggle}
      </div>
    </div>
   
    <div className='expenses'>
    <h3 className='money-container-h3 red'>Expenses</h3>
    <div className='money-container-expenses'>
    {expenses.length === 0 ? <span className='no-data-msg'>No data to show yet!</span> : null}
    <ul>
      {mapEntries(expenses)}
    </ul>
    </div>
    </div>
   
    <MoneySummary expenses={expenses} income={income} rates={rates} />
    </div>
      <DailyExchangeRates rates={rates} />
    </div>
  )

  //toggle add new entry component
  function toggleAddEntry() {
    setAddEntryToggle(!addEntryToggle)
  }
  function toggleDeleteAccount() {
    setDeleteAccountToggle(!deleteAccountToggle)
  }

  //Delete account
  function deleteAccount() {
    const url = '/api/user/deleteuser'
    const token = authToken.token;

    axios.delete(url,  {headers: {'auth-token': token}})
      .then((res) => {
        if (res.status === 200) {  
        history.push('/')
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  //add a new entry 
  function addEntry(newEntry) {
    const url = '/api/money/add'
    const token = authToken.token;
    axios.post(url, newEntry, {headers: {'auth-token': token}})
    .then((res) => {
      if (res.status === 200) {
        const {account} = newEntry;
        if (account === 'income') {
          setIncome(sortEntries([...income, newEntry]))
        }
        if (account === 'expense') {
          setExpenses(sortEntries([...expenses, newEntry]))
        }
      }
    })
    .catch((error) => {
      console.log(error)
    });
  }

  //Edit existing entry
  function editExistingEntry(updatedEntry){
    const url = `/api/money/update/${updatedEntry.account}`
    const token = authToken.token;
    axios.put(url, updatedEntry, {headers: {'auth-token': token}})
    .then((res) => {
      if (res.status === 200) {
        fetchUsersEntries();
      }
    })
    .catch((error) => {
      console.log(error)
    });
  }

  //Delete entry
  function deleteEntry(id, account) {
    const url = '/api/money/delete'
    const token = authToken.token;
    const entryToDelete = {
      id,
      account
    }

    axios.delete(url, entryToDelete, {headers: {'auth-token': token}})
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((error) => {
        console.log(error)
      });
      //delete the entry locally
      if(account === 'income') {
        const updatedArray = income.filter((entry) => {
          return entry.id !== id
        });
        setIncome(updatedArray)
      }
      if(account === 'expense') {
        const updatedArray = expenses.filter((entry) => {
          return entry.id !== id
        });
        setExpenses(updatedArray)
      }
  }

  //sort the entries
  function sortEntries(entries) {
    const sortedArray = entries.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    return sortedArray;
  }

  //Map the fetched entries
  function mapEntries(entriesToMap) {
    const entries = entriesToMap.map((entry, index) => {
      console.log(index)
      return <MoneyEntry entryData={entry} account={entry.account} key={entry.id} index={index} deleteEntry={deleteEntry} setEditEntry={setEditEntry}/>
    })
    return entries
  }

  //Fetch the users income and expense entries and set them in state
  function fetchUsersEntries() {
    const apiUrl = '/api/money'
    const token = authToken.token;
    axios.get(apiUrl, {headers: {"auth-token": token}})
    .then((response) => {   
      setIncome(sortEntries(response.data.income));
      setExpenses(sortEntries(response.data.expenses));
    })
    .catch(error => console.log(error))
  }

  //Fetch exchange rates, calculate them and set them in state
  function fetchRates() {
    const currencyUrl = 'https://v6.exchangerate-api.com/v6/301ab926c4abc33219fb613b/latest/SEK';
    axios.get(currencyUrl)
    .then((response) => {
      const {EUR, HRK} = response.data.conversion_rates;
      const fetchedRates = {
        eurToSek: calcRates(EUR), 
        hrkToSek: calcRates(HRK), 
        eurToHrk: calcRates(HRK, EUR)
      }
      setRates(fetchedRates);
    })
    .catch(error => console.log(error))

    //Calculate the rates
    function calcRates(data, secondData){
      if(arguments.length === 2) {
        return (data / secondData).toFixed(2)
      } else {
        return (1 / data).toFixed(2)
      }
    }
  }

}

export default withRouter(Money)
