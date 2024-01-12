/* eslint-disable react/prop-types */
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Link } from "react-router-dom"
import { db } from "../config/firebase";

const InputUpdateHarga = ({ data, orderList, id }) => {
  const [updateHarga, setUpdateHarga] = useState()

  const updatedData = async () => {
    try {
      const filteredOrder = orderList.map((item) => {
        if (item.id == id) {
          const updatedKeranjang = item.keranjang.map((barang) => {
            if (barang.id == data.id) {
              let totalHarga = updateHarga * Number(data.jumlah)

              // Lakukan pembaruan pada objek yang sesuai
              return { ...barang, harga: Number(updateHarga), totalHarga: Number(totalHarga) };
            }
            return barang; // Tidak ada pembaruan untuk objek ini
          });
          // Mengganti array keranjang dengan yang sudah diperbarui
          return { ...item, keranjang: updatedKeranjang };
        }

        return item; // Tidak ada pembaruan untuk objek ini
      }).find((item) => item.id === id)

      const totalHarga = filteredOrder.keranjang.reduce((total, item) => total + item.totalHarga, 0);
      const updatedTotalHarga = {
        ...filteredOrder,
        total: totalHarga,
        status: 'belum'
      }
      const orderDoc = doc(db, "order", id)
      await updateDoc(orderDoc, updatedTotalHarga)
      alert('berhasi diperbarui')

    } catch (error) {
      console.error(error)
    }
  }

  // console.log(orderList);

  return (
    <div>
      <Link to={data.printUrl} target="_blank" >preview</Link>
      <input type="number" onChange={(e) => setUpdateHarga(e.target.value)} />
      <button onClick={updatedData}>konfirmasi</button>
    </div>
  )
}

export default InputUpdateHarga