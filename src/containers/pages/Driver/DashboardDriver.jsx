import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const DashboardDriver = () => {
  const [orderList, setOrderList] = useState([])
  const [driverOrder, setDriverOrder] = useState({ id: 'tes' })

  const getOrder = async () => {
    try {
      const orderCollectionRef = collection(db, "order")
      const dataOrder = await getDocs(orderCollectionRef)
      const orderMap = dataOrder.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      const filteredOrder = orderMap.filter(data => data.status === "proses")
      const findOrder = orderMap.find(data => data.status === "dikirim" && data.driverId === auth.currentUser.uid)
      console.log(orderMap);
      setDriverOrder(findOrder)
      setOrderList(filteredOrder)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
  }, [])

  return (
    <div>
      <div>Dashboard Driver</div>
      <div>
        <ul>
          {orderList.map((data) =>
            <li key={data.id}>
              <Link to={`/driver/dashboard/toko/${data.id}`}>
                <div>
                  <p>
                    Nama Toko: {data.namaSeller}
                  </p>
                  <p>
                    Alamat Toko: {data.alamatSeller}
                  </p>
                </div>
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        {driverOrder &&
          <div>
            Lihat pesanan yang diambil
            <div>
              <Link to={`/driver/dashboard/toko/${driverOrder?.id}`}>View</Link>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default DashboardDriver