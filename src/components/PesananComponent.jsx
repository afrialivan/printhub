/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom"
import { auth, db } from "../config/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"

const PesananComponent = ({ orderList, allOrderList, aktif }) => {
  const navigate = useNavigate()
  const [backLink, setBackLink] = useState()

  const getData = async () => {
    const userCollectionRef = collection(db, "user")
    const dataSeller = await getDocs(userCollectionRef)
    const findUser = dataSeller.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find((item) => item.userId === auth.currentUser.uid)
    if (findUser.role === 'seller') setBackLink('/seller/konfirmasi')
    if (findUser.role === 'user') setBackLink('/pesanan')
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="flex flex-col gap-3 mt-5">
      {orderList.map((item) =>
        <div key={item.id} className="bg-[#7077A1] rounded-lg px-4 py-2" onClick={() => navigate('/pesanan/detail', { state: { backLink, order: JSON.stringify(item), allOrderList: JSON.stringify(allOrderList) } })}>
          <p className="text-white font-medium text-center">Rincian Pesanan</p>
          <div>
            <div className="mb-3">
              <p className="text-white">{item.namaSeller} {`>`}</p>
            </div>
            <div className="flex justify-between">
              <div className="flex">
                <div style={{ backgroundImage: `url(${item.keranjang[0].gambar})` }} className="w-20 h-20 bg-cover overflow-hidden bg-[#2D3256] rounded-lg flex justify-center items-center">
                  {/* <img src={product.gambar} className="w-full " alt="" /> */}
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium text-lg">{item.keranjang[0].nama}</p>
                  <p className="text-white">{item.keranjang[0].harga !== 0 ? 'Rp.' + item.keranjang[0].harga : 'menunggu konfirmasi'}</p>
                  <p className="text-white">status: {aktif}</p>
                </div>
              </div>
              <div>
                <p className="text-white text-lg">x2</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-white text-xl font-semibold -mb-1">Rp.{item.total}</p>
              <p className="text-sm text-white">Nomor invoice: {item.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PesananComponent