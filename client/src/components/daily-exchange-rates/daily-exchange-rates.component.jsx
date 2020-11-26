import React from 'react';
import './daily-exchange-rates.styles.scss';

//Simple component that shows current exchange-rates
export default function DailyExchangeRates({rates}) {
  return (
    <div className='daily-exchange-rates'>
      <h4>Daily rates:</h4>
      <span>1 EUR = {rates.eurToSek} SEK</span>
      <span>1 HRK = {rates.hrkToSek} SEK</span>
      <span>1 EUR = {rates.eurToHrk} HRK</span>
    </div>
  )
}
