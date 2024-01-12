import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Pesanan = () => {
  const [orderList, setOrderList] = useState([])
  const getOrder = async () => {
    const orderCollectionRef = collection(db, "order")
    try {
      const dataOrder = await getDocs(orderCollectionRef)
      const filteredOrder = dataOrder.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).filter(data => data.userId === auth?.currentUser?.uid)

      setOrderList(filteredOrder)

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
        <p>belum konfirmasi harga</p>
        <ul>
        </ul>
        {orderList.filter((data) => data.status === 0).map((item) =>
          <div key={item.id}>
            <li>
              <Link to={`/pesanan/pesanan-detail/${item.id}`} >{item.namaSeller}</Link>
            </li>
          </div>
        )}
      </div>
      <div>
        <p>belum bayar</p>
        {orderList.filter((data) => data.status === 'belum').map((item) =>
          <div key={item.id}>
            <li>
              <Link to={`/pesanan/pesanan-detail/${item.id}`} >{item.namaSeller}</Link>
            </li>
          </div>
        )}
      </div>
      <div>
        <p>proses </p>
        {orderList.filter((data) => data.status == 'proses').map((item) =>
          <div key={item.id}>
            <li>
              <Link to={`/pesanan/pesanan-detail/${item.id}`} >{item.namaSeller}</Link>
            </li>
          </div>
        )}
      </div>
      <div>
        <p>dikirim</p>
        {orderList.filter((data) => data.status === 'dikirim').map((item) =>
          <div key={item.id}>
            <li>
              <Link to={`/pesanan/pesanan-detail/${item.id}`} >{item.namaSeller}</Link>
            </li>
          </div>
        )}
      </div>
      <div>
        <p>selesai</p>
        {orderList.filter((data) => data.status === 'selesai').map((item) =>
          <div key={item.id}>
            <li>
              <Link to={`/pesanan/pesanan-detail/${item.id}`} >{item.namaSeller}</Link>
            </li>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pesanan