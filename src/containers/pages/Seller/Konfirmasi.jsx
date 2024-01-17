/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import ListKonfirmasi from "../../../components/ListKonfirmasi"
import InputKonfirmasiPembayaran from "../../../components/InputKonfirmasiPembayaran"
import PesananComponent from "../../../components/PesananComponent"
import { Link } from "react-router-dom"
import Default from "../../templates/Default"
import images from "../../../assets/img/Image";
const { backIcon } = images

const Konfirmasi = () => {
  const [orderList, setOrderList] = useState([])
  const [orderAllList, setOrderAllList] = useState([])
  const [aktif, setAktif] = useState('wait')


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
    <Default>
      <div>
        <p className="text-lg text-center text-[#2D3256] font-semibold pt-3">Pesanan</p>
        <div className="flex gap-3 justify-center text-sm">
          <p className={`${aktif === 'wait' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('wait')} >Waiting</p>
          <p className={`${aktif === 'unpaid' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('unpaid')}>Unpaid</p>
          <p className={`${aktif === 'process' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('process')}>Process</p>
          <p className={`${aktif === 'deliver' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('deliver')}>Deliver</p>
          <p className={`${aktif === 'done' ? 'text-[#2D3250] font-medium' : 'text-[#A2A2A2]'}`} onClick={() => setAktif('done')}>Done</p>
        </div>
      </div>


      {aktif === 'wait' &&
        <PesananComponent
          orderList={orderList.filter((data) => Number(data.status) === 0)}
          allOrderList={orderAllList.filter((data) => Number(data.status) === 0)}
          aktif={aktif}
        />
      }
      {aktif === 'unpaid' &&
        <PesananComponent
          orderList={orderAllList.filter((data) => data.status === 'belum')}
          aktif={aktif}
        />
      }
      {aktif === 'process' &&
        <PesananComponent
          orderList={orderAllList.filter((data) => data.status === 'proses')}
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

      <div className="fixed top-3 left-3">
        <Link to={`/seller/dashboard`}>
          <img src={backIcon} alt="" />
        </Link>
      </div>
    </Default>
  )
}

export default Konfirmasi