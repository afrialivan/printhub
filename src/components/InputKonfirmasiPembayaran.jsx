/* eslint-disable react/prop-types */
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const InputKonfirmasiPembayaran = ({ allData, data }) => {
  const updatedData = async () => {
    try {
      const myDataOrder = allData.find((item) => data.find((theData) => theData.id === item.id))
      const dataOrder = {
        ...myDataOrder,
        status: 'proses'
      }
      const orderDoc = doc(db, "order", dataOrder.id)
      await updateDoc(orderDoc, dataOrder)
      alert('berhasi diperbarui')
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div>
      <button onClick={updatedData}>konfirmasi Pembayaran</button>
    </div>
  )
}

export default InputKonfirmasiPembayaran