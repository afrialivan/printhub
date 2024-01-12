/* eslint-disable react-hooks/exhaustive-deps */
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { useParams } from "react-router-dom"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"

const ViewOrder = () => {
  const { id } = useParams()
  const [order, setOrder] = useState({ keranjang: [], namaSeller: 'tes' })

  const getData = async () => {
    try {
      const orderCollectionRef = collection(db, "order")
      const dataOrder = await getDocs(orderCollectionRef)
      const filteredOrder = dataOrder.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find(data => data.id === id)
      setOrder(filteredOrder)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData()
  }, [])

  // console.log(order);

  const ambilOrderan = async () => {
    const orderDoc = doc(db, "order", id)
    const updateData = {
      ...order,
      status: 'dikirim',
      driverId: auth.currentUser.uid
    }
    await updateDoc(orderDoc, updateData)
  }

  return (
    <div>
      view order
      <p>nama toko: {order.namaSeller}</p>
      <p>alamat toko: {order.alamatSeller}</p>
      <div>
        detail pesanan
        <ul>
          {order.keranjang.map((item, i) =>
            <li key={i}>
              <p>
                nama barang {item.nama}, jumlah: {item.jumlah}, total harga: Rp{item.totalHarga}
              </p>
            </li>
          )}
        </ul>
      </div>
      {order.status === 'proses' &&
        <div>
          <button onClick={ambilOrderan}>
            Ambil Orderan
          </button>
        </div>

      }
    </div>
  )
}

export default ViewOrder