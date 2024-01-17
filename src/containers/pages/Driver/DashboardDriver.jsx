import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Default from "../../templates/Default"
import images from "../../../assets/img/Image"
import { signOut } from "firebase/auth"
const { avatar } = images

const DashboardDriver = () => {
  const [orderList, setOrderList] = useState([])
  const [driverOrder, setDriverOrder] = useState({ id: 'tes' })
  const navigate = useNavigate()

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

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Default>
      <div className="flex justify-between items-center pt-2 mb-3">
        <div>
          <p className="text-[#2D3250] font-medium -mb-1">Hiii Driver</p>
          <p className="text-[#F6B17A] text-sm">Bagaimana keadaanmu sekarang?</p>
        </div>
        <details className="dropdown bg-transparent">
          <summary className="m-1 btn bg-transparent shadow-none">
            <div className="w-12 h-12 rounded-full bg-[#2D3250] ring-2 border-[#2D3250] overflow-hidden block">
              <img src={avatar} alt="" className="m-auto w-full" />
            </div>
          </summary>
          <ul className="p-2 mt-1 shadow menu bg-white dropdown-content z-[1] rounded-box w-20">
            <li>
              <div onClick={logout} >Logout</div>
            </li>
          </ul>
        </details>
      </div>

      <p className="text-[#2D3250] font-semibold mb-2">Orderan yang tersedia</p>

      <div className="flex flex-col gap-3">
        {orderList.map((data) =>
          // <Link to={`/driver/dashboard/toko/${data.id}`}>
          <div
            key={data.id}
            onClick={() => navigate('/driver/dashboard/toko', { state: { order: JSON.stringify(data) } })}
            className="bg-[#7077A1] rounded-lg text-white font-semibold px-4 py-2">
            <div>
              <p>
                Nama Toko: {data.namaSeller}
              </p>
              <p>
                Alamat Toko: {data.alamatSeller}
              </p>
            </div>
          </div>
          // </Link>
        )}

      </div>

      <div className="mt-5">
        {driverOrder &&
          <div>
            <p className="text-[#2D3250] font-semibold mb-2">Lihat pesanan yang sedang diambil</p>
            <div
              className="btn btn-info text-white"
              onClick={() => navigate('/driver/dashboard/toko', { state: { order: JSON.stringify(driverOrder) } })}
            >
              View
            </div>
          </div>
        }
      </div>

      <div className="hidden">
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
    </Default>
  )
}

export default DashboardDriver