import './App.css'
import { useState } from 'react'

async function initPayment(body) {
  const res = await fetch('http://localhost:4000/create', {
    method: "POST", body: JSON.stringify(body), headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()
  return data
}

const onSuccess = (response) => {
  console.log(response)
}

const onError = (error) => {
  console.log(error)
}

function App() {
  const amount = 1000
  const [customer, setCustomer] = useState(null)
  const [notes, setNotes] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [apiKey, setApiKey] = useState(null)
  const [theme, setTheme] = useState(null)
  const [currency, setCurrency] = useState(null)

  let rzp = null
  if (apiKey && orderId) {
    const options = {
      key: apiKey,
      prefill: customer,
      notes,
      order_id: orderId,
      amount: amount * 100,
      theme,
      currency,
      handler: onSuccess
    }

    rzp = new window.Razorpay(options)

    rzp.on('payment.failed', onError)

    rzp.open()
  }

  return <div>
    <h1>Hello</h1>
    <button type='button' onClick={() => {
      initPayment({ amount }).then((data) => {
        setCustomer(data.prefill)
        setNotes(data.notes)
        setOrderId(data.order_id)
        setApiKey(data.api_key)
        setTheme(data.theme)
        setCurrency(data.currency)
      })
    }}>Pay 1000</button>
  </div>
}

export default App
