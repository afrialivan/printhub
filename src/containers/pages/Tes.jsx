/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import axios from 'axios'

const Tes = () => {
  const [name, setName] = useState("")
  const [order_id, setOrder_id] = useState("")
  const [total, setTotal] = useState(0)
  const [token, setToken] = useState("")

  const process = async () => {
    const data = {
      name,
      order_id,
      total
    }

    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }

    const response = await axios.post("http://localhost:3000/api/payment/process-transaction", data, config)

    setToken(response.data.token);
  }

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result))
          setToken("")
        },
        onPending: (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result))
          setToken("")
        },
        onError: (error) => {
          console.log(error);
          setToken("")
        },
        onClose: () => {
          console.log('anda belum menyelesaikan pembayaran');
          setToken("")
        }
      })
      setName("")
      setOrder_id("")
      setTotal("")
    }
  }, [token])

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js"

    let scriptTag = document.createElement("script")
    scriptTag.src = midtransUrl

    const midtransClienKey = "SB-Mid-client-nA3Fa4O3PqBvop0O"
    scriptTag.setAttribute("data-client-key", midtransClienKey)

    document.body.appendChild(scriptTag)

    return () => {
      document.body.removeChild(scriptTag)
    }

  })


  return (
    <div>
      <input type="text" onChange={(e) => setName(e.target.value)} placeholder="name" />
      <input type="text" onChange={(e) => setOrder_id(e.target.value)} placeholder="order_id" />
      <input type="text" onChange={(e) => setTotal(e.target.value)} placeholder="total" />
      <button onClick={process}>submit</button>
    </div>
  )
}

export default Tes