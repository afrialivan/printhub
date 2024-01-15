import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Main from "../../templates/Main"
import PesananComponent from "../../../components/PesananComponent"

const Pesanan = () => {
  const [orderList, setOrderList] = useState([])
  const [aktif, setAktif] = useState('wait')

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
    <Main title="Pesanan" >
      <p className="text-lg text-center text-[#2D3256] font-semibold">Pesanan Saya</p>
      <div className="flex gap-3 justify-center text-sm">
        <p className={`${aktif === 'wait' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('wait')} >Waiting</p>
        <p className={`${aktif === 'unpaid' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('unpaid')}>Unpaid</p>
        <p className={`${aktif === 'process' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('process')}>Process</p>
        <p className={`${aktif === 'deliver' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('deliver')}>Deliver</p>
        <p className={`${aktif === 'done' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('done')}>Done</p>
      </div>


      {aktif === 'wait' &&
        <PesananComponent
          orderList={orderList.filter((data) => data.status === 0)}
          aktif={aktif}
        />
      }
      {aktif === 'unpaid' &&
        <PesananComponent
          orderList={orderList.filter((data) => data.status === 'belum')}
          aktif={aktif}
        />
      }
      {aktif === 'process' &&
        <PesananComponent
          orderList={orderList.filter((data) => data.status === 'proses')}
          aktif={aktif}
        />
      }
      {aktif === 'deliver' &&
        <PesananComponent
          orderList={orderList.filter((data) => data.status === 'dikirim')}
          aktif={aktif}
        />
      }
      {aktif === 'done' &&
        <PesananComponent
          orderList={orderList.filter((data) => data.status === 'selesai')}
          aktif={aktif}
        />
      }

















      <div className="hidden">
        <div>
          <p>belum konfirmasi harga</p>
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
    </Main>
  )
}

export default Pesanan