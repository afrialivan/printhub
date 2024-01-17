/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getUser } from "../services/user"

const SubmitBar = ({ keranjang }) => {
  // const [totalHarga, setTotalHarga] = useState(0)
  // const [keranjang, setKeranjang] = useState('tes')
  const location = useLocation()
  const seller = location.state ? JSON.parse(location.state.seller) : {}
  const [user, setUser] = useState()
  const navigate = useNavigate()
  const orderCollectionRef = collection(db, "order")
  // const sellerCollectionRef = collection(db, "seller")
  // const keranjangCollectionRef = collection(db, "keranjang")

  useEffect(() => {
    const userData = async () => {
      const userData = await getUser()
      setUser(userData)
    }
    userData();
  }, [])

  const createOrder = async () => {
    try {
      const totalHarga = keranjang.reduce((total, item) => total + item.totalHarga, 0);
      const checkPrint = keranjang.find((item) => item.printUrl !== 0)
      const myOrder = await addDoc(orderCollectionRef, {
        keranjang: keranjang,
        konfirmasiPembayaran: false,
        sellerId: seller.id,
        total: totalHarga,
        userId: auth.currentUser.uid,
        bukti: 0,
        status: checkPrint ? 0 : 'belum',
        namaSeller: seller.sellerName,
        alamatUser: user.alamat,
        alamatSeller: seller.alamat,
        driverId: 0
      })

      const withoutSameKeranjang = user.keranjang.filter((item) =>
        !keranjang.find((data) => item.idKeranjang === data.id)
      )
      const userDoc = doc(db, "user", user.id)
      await updateDoc(userDoc, {
        ...user,
        order: [
          ...user.order, {
            orderId: myOrder.id
          }
        ],
        keranjang: withoutSameKeranjang
      })

      const sellerDoc = doc(db, "seller", seller.id)
      await updateDoc(sellerDoc, {
        ...seller,
        order: [
          ...seller.order, myOrder
        ]
      })

      try {
        keranjang.map((item) => {
          const keranjangDoc = doc(db, "keranjang", item.id)
          deleteDoc(keranjangDoc)
        })
      } catch (error) {
        console.error(error);
      }

      console.log('Orders created successfully!');

      navigate('/pesanan')

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed bottom-5 left-4 right-4">
      <button onClick={createOrder} className="w-full py-4 rounded-3xl border-none bg-[#F6B17A] text-white font-semibold ">Pesan</button>
    </div>
  )
}

export default SubmitBar