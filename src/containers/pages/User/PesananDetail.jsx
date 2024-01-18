/* eslint-disable react-hooks/exhaustive-deps */
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../../config/firebase"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Default from "../../templates/Default"
import axios from "axios"
import { useSelector } from "react-redux"
import images from "../../../assets/img/Image";
const { backIcon } = images

const PesananDetail = () => {
  // const { id } = useParams()
  const location = useLocation()
  const order = location.state ? JSON.parse(location?.state?.order) : { keranjang: [] }
  // const allOrder = location.state.allOrderList ? JSON.parse(location?.state?.allOrderList) : { keranjang: [] }
  const backLink = location.state.backLink
  // const [findDataOrder, setFinfindDataOrder] = useState({ status: 0, keranjang: [] })
  const [token, setToken] = useState("")
  const [harga, setHarga] = useState()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  useEffect(() => {

    if (!order.keranjang) {
      navigate('/pesanan')
    }
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js"

    let scriptTag = document.createElement("script")
    scriptTag.src = midtransUrl

    const midtransClienKey = "SB-Mid-client-nA3Fa4O3PqBvop0O"
    scriptTag.setAttribute("data-client-key", midtransClienKey)

    document.body.appendChild(scriptTag)

    return () => {
      document.body.removeChild(scriptTag)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const process = async () => {
    const data = {
      name: user.nama,
      order_id: order.id,
      total: order.total
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
        onSuccess: function (result) {
          /* You may add your own implementation here */
          const updatedData = async () => {
            try {
              const dataOrder = {
                ...order,
                bukti: result,
                status: 'proses'
              }
              const orderDoc = doc(db, "order", order.id)
              await updateDoc(orderDoc, dataOrder)
              alert('update');

            } catch (error) {
              console.error(error)
            }
          }

          updatedData()
          alert("payment success!"); console.log(result);
          window.stop()
          navigate('/pesanan')
          // controller.abort()
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          alert("wating your payment!"); console.log(result);
        },
        onError: function (result) {
          /* You may add your own implementation here */
          alert("payment failed!"); console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert('you closed the popup without finishing the payment');
        }
      })
      // localStorage.setItem("Pembayaran", JSON.stringify(result))
    }
  }, [token])

  const terimaPesanan = async () => {
    try {
      const orderDoc = doc(db, "order", order.id)
      await updateDoc(orderDoc, { ...order, status: 'selesai' })
      navigate('/')
    } catch (error) {
      console.error(error);
    }
  }

  const updateHarga = async (data) => {
    // const findOrder = allOrder.find((item) => item.id === order.id)
    const orderCollectionRef = collection(db, "order")
    const dataOrder = await getDocs(orderCollectionRef)
    const findDataOrder = dataOrder.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find(data => data.id === order.id)
    const totalHarga = harga * data.jumlah
    const keranjangFiltered = findDataOrder.keranjang.map((item) => {
      if (item.id === data.id) {
        return { ...data, harga: Number(harga), totalHarga }
      }
      return item
    })
    const total = keranjangFiltered.map((item) => item).reduce((total, item) => total + item.totalHarga, 0);

    // const checkPrint = order.keranjang.filter((item) => item.harga === 0)

    // const filterKeranjang = findDataOrder
    //   .keranjang
    //   .filter((item) => item.printUrl !== 0)
    //   .find((item) => item.harga === 0)


    const updateData = {
      ...findDataOrder,
      total,
      keranjang: keranjangFiltered
    }

    // // console.log(order); // sudah difilter hanya print
    // // console.log(allOrder); // belum
    // // console.log(checkPrint);
    const orderDoc = doc(db, "order", order.id)
    await updateDoc(orderDoc, updateData)

    const dataOrderAfter = await getDocs(orderCollectionRef)
    const findDataOrderAfter = dataOrderAfter.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find(data => data.id === order.id)
    const filterKeranjangAfter = findDataOrderAfter
      .keranjang
      .filter((item) => item.printUrl !== 0)
      .find((item) => item.harga === 0)

    if (filterKeranjangAfter?.harga !== 0) {
      const updateDataAfter = {
        status: 'belum',
      }

      await updateDoc(orderDoc, updateDataAfter)

      navigate('/seller/konfirmasi')

    } else {
      console.log('error');
    }
  }
  return (
    <Default>
      <p className="text-lg text-center text-[#2D3256] font-semibold">Pesanan {user.role === 'user' ? 'Saya' : 'User'}</p>
      <div className="bg-[#7077A1] rounded-lg px-4 py-2 mt-3">
        <p className="text-white font-medium text-center">Rincian Pesanan</p>
        <div className="flex flex-col gap-3">
          {order.keranjang.map((item) =>
            <div key={item.id}>
              {
                console.log(user.id )
              }
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div style={{ backgroundImage: `url(${item.gambar})` }} className="w-20 h-20 bg-cover overflow-hidden bg-[#2D3256] rounded-lg flex justify-center items-center">
                    {/* <img src={product.gambar} className="w-full " alt="" /> */}
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium text-lg">{item.nama}</p>
                    {user.role === 'seller' && item.printUrl !== 0 && order.status === 0 ?
                      <input type="text" className="w-28" onChange={(e) => setHarga(e.target.value)} />
                      :
                      <p className="text-white">Rp.{item.harga}</p>
                    }
                    {item.printUrl !== 0 &&
                      <>
                        <Link className="no-underline" to={item.printUrl} target="_blank">
                          <p className="text-white">Preview File</p>
                        </Link>
                        <p className="text-white">catatan: {item.catatan == 0 ? '-' : item.catatan}</p>
                      </>
                    }
                  </div>
                </div>
                <div>
                  {user.role === 'seller' && item.printUrl !== 0 && order.status === 0 ?
                    <button className="px-2 py-1 rounded-lg border-none bg-white" onClick={() => updateHarga(item)}>submit</button>
                    :
                    <p className="text-white text-lg">x{item.jumlah}</p>
                  }
                </div>
              </div>
            </div>
          )}

          <div className="mt-2">
            <p className="text-white text-xl font-semibold -mb-1">Rp.{order.total}</p>
            <p className="text-sm text-white">Nomor invoice: {order.id}</p>
          </div>
        </div>
      </div>
      {order.status === 'belum' && user.role === 'user' &&
        <div className="fixed bottom-7 left-5 right-5 bg-[#7077A1] rounded-lg px-4 py-4 mt-3" onClick={process}>
          <p className="text-sm text-white text-center font-semibold">Bayar Sekarang</p>
        </div>
      }

      {order.status === 'dikirim' && user.role === 'user' &&
        <div className="fixed bottom-7 left-5 right-5 bg-[#7077A1] rounded-lg px-4 py-4 mt-3" onClick={terimaPesanan}>
          <p className="text-sm text-white text-center font-semibold">Terima Pesanan</p>
        </div>
      }

      {order.status === 'selesai' && user.role === 'user' &&
        <div className="mt-4">
          <p className="text-[#2D3250] font-semibold mb-2">Beri  Rating</p>
          <div className="rating">
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" checked />
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
          </div>
        </div>
      }

      <div className="fixed top-3 left-3">
        <Link to={`${backLink}`}>
          <img src={backIcon} alt="" />
        </Link>
      </div>
    </ Default >
  )
}

export default PesananDetail