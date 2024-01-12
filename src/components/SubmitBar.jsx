/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase"
import { useNavigate } from "react-router-dom"

const SubmitBar = ({ sellerId }) => {
  // const [totalHarga, setTotalHarga] = useState(0)
  // const [keranjang, setKeranjang] = useState('tes')

  const navigate = useNavigate()

  const orderCollectionRef = collection(db, "order")
  const sellerCollectionRef = collection(db, "seller")

  const keranjangCollectionRef = collection(db, "keranjang")

  const createOrder = async () => {
    try {
      const userCollectionRef = collection(db, "user")
      const dataUser = await getDocs(userCollectionRef)
      const filteredUser = dataUser.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find(data => data.userId === auth.currentUser.uid)

      const data = await getDocs(keranjangCollectionRef)
      const dataMap = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))

      const userFiltered = filteredUser.keranjang.filter((data) => data.sellerId === sellerId);
      const keranjang = userFiltered.map((u) => {
        const tes = dataMap.find((data) => data.id === u.idKeranjang);
        return {
          ...tes
        };
      });

      const totalHarga = keranjang.reduce((total, item) => total + item.totalHarga, 0);
      console.log('Total Harga:', totalHarga);

      const checkPrint = keranjang.filter((item) => item.printUrl !== 0)

      const dataSeller = await getDocs(sellerCollectionRef)
      const filteredSeller = dataSeller.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find((data) => data.id === sellerId)

      const myOrder = await addDoc(orderCollectionRef, {
        keranjang: keranjang,
        konfirmasiPembayaran: false,
        sellerId,
        total: totalHarga,
        userId: auth.currentUser.uid,
        bukti: 0,
        status: checkPrint[0] ? 0 : 'belum',
        namaSeller: filteredSeller.sellerName,
        alamatUser: filteredUser.alamat,
        alamatSeller: filteredSeller.alamat,
        driverId: 0
      })

      const withoutSameKeranjang = filteredUser.keranjang.filter((item) =>
        !keranjang.find((data) => item.idKeranjang === data.id)
      )

      const userDoc = doc(db, "user", filteredUser.id)
      await updateDoc(userDoc, {
        ...filteredUser,
        order: [
          ...filteredUser.order, {
            orderId: myOrder.id
          }
        ],
        keranjang: withoutSameKeranjang
      })

      const sellerDoc = doc(db, "seller", sellerId)
      await updateDoc(sellerDoc, {
        ...filteredSeller,
        order: [
          ...filteredSeller.order, myOrder
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
    <div>
      <button onClick={createOrder} >Konfirmasi Pesanan</button>
      {/* {' Total Harga Rp' + totalHarga} */}
      <h4><i>belum termasuk biaya print</i></h4>
    </div>
  )
}

export default SubmitBar