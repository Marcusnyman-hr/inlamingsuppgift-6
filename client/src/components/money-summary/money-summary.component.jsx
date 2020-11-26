import React, {useEffect, useState} from 'react';
import './money-summary.styles.scss';

//Component that summarizes all the entries
export default function MoneySummary({income, expenses, rates}) {
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    setTotalIncome(calculateAndConvert(income))
    setTotalExpenses(calculateAndConvert(expenses))
  }, [income, expenses, rates]) 

    //calculate and convert all income and expense entries to sek.
  function calculateAndConvert(data) {
    let total = 0;
    data.forEach(entry => {
      if(entry.currency === 'EUR') total = total + (entry.amount * rates.eurToSek)
      if(entry.currency === 'HRK') total = total + (entry.amount * rates.hrkToSek)
      if(entry.currency === 'SEK') total = Number(total) + Number(entry.amount)
    })
    return Number(total).toFixed(2);
  }
  return (
    <div className='money-summary'>
      <h3>MONEY SUMMARY: </h3>
      <h3 className={(totalIncome > totalExpenses) ? 'money-summary-sum' : 'money-summary-sum minus'}>{(totalIncome - totalExpenses).toFixed(0)} sek</h3>
    </div>
  )
}
