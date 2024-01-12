/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import ListKonfirmasi from "../../../components/ListKonfirmasi"
import InputKonfirmasiPembayaran from "../../../components/InputKonfirmasiPembayaran"
import { Link } from "react-router-dom"

const Konfirmasi = () => {
  const [orderList, setOrderList] = useState([])
  const [orderAllList, setOrderAllList] = useState([])


  const orderCollectionRef = collection(db, "order")
  const sellerCollectionRef = collection(db, "seller")

  const getOrder = async () => {
    try {
      const dataSeller = await getDocs(sellerCollectionRef)
      const filteredSeller = dataSeller.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find(data => data.userId === auth?.currentUser?.uid)

      const data = await getDocs(orderCollectionRef)
      const orders = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      const filteredOrdersWithPrint = orders.map((data) => (
        {
          ...data,
          keranjang: data.keranjang.filter((data) => data.printUrl !== 0)
        }
      )).filter((data) => data.sellerId === filteredSeller.id)

      const filteredOrders = orders.filter((data) => data.sellerId === filteredSeller.id)

      setOrderAllList(filteredOrders)
      setOrderList(filteredOrdersWithPrint)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div>
      <div>
        Konfirmasi Harga
        <br /><br />
        {orderList.filter((data) => Number(data.status) === 0).map((data) =>
          <ListKonfirmasi key={data.id} dataOrder={data} orderList={orderAllList} />
        )}
      </div>
      <br /><br />
      <div>
        Konfirmasi Pembayaran
        <br />
        {orderList.filter((data) => data.status === 'belum' && data.bukti !== 0).map((data) =>
          <div key={data.id}>
            <Link to={data.bukti} target="_blank" >Preview</Link>
            <InputKonfirmasiPembayaran allData={orderAllList} data={orderList} />
          </div>
        )}
      </div>
      <br /><br />
      <div>
        proses pesanan
        <br />
        {orderList.filter((data) => data.status === 'proses').map((data) =>
          <div key={data.id}>
            <Link to={`/seller/pesanan/${data.id}`} >lihat pesanan</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Konfirmasi