/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import Default from "../../templates/Default"
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { Link, useLocation } from "react-router-dom"
import ButtonInputKeranjang from "../../../components/ButtonInputKeranjang"
import SubmitBar from "../../../components/SubmitBar"
import images from "../../../assets/img/Image";
const { backIcon } = images

const Keranjang = () => {
  const location = useLocation()
  const seller = JSON.parse(location.state.seller)
  const [keranjang, setKeranjang] = useState([])
  const [user, setUser] = useState({})

  const getData = async () => {
    try {
      const userCollectionRef = collection(db, "user")
      const dataUser = await getDocs(userCollectionRef)
      const dataFilteredUser = dataUser.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find((data) => data.userId === auth.currentUser.uid)
      setUser(dataFilteredUser)
      const keranjagCollectionRef = collection(db, "keranjang")
      const data = await getDocs(keranjagCollectionRef)
      const dataFilteredKeranjang = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
        .filter((data) => data.userId === auth.currentUser.uid)
        .filter((data) => data.sellerId === seller.id)
      setKeranjang(dataFilteredKeranjang)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData()
  }, [])


  const incrementButton = async (data) => {
    try {
      const keranjangDoc = doc(db, "keranjang", data.id)
      const jumlah = data.jumlah + 1
      const totalHarga = data.harga * jumlah
      updateDoc(keranjangDoc, { ...data, jumlah, totalHarga })
      getData()
      console.log('updated');
    } catch (error) {
      console.error(error);
    }
  }

  const decrementButton = async (data) => {
    try {
      const keranjangDoc = doc(db, "keranjang", data.id)

      if (data.jumlah === 1) {
        await deleteDoc(keranjangDoc)
        const userDoc = doc(db, "user", user.id)
        await updateDoc(userDoc, {
          ...user, keranjang: user.keranjang.filter((item) => item.idKeranjang !== data.id)
        })
        getData()
        console.log('deleted');
        return
      }

      const jumlah = data.jumlah - 1
      const totalHarga = data.harga * jumlah
      updateDoc(keranjangDoc, { ...data, jumlah, totalHarga })
      getData()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Default>
      <p className="text-lg text-center text-[#2D3256] font-semibold">Keranjang</p>

      <div className="flex flex-col gap-4 mt-5">
        {
          keranjang.length === 0 &&
          <p>belum ada pesanan...</p>
        }
        {keranjang.map((item) =>
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <div style={{ backgroundImage: `url(${item.gambar})` }} className="w-20 h-20 bg-cover overflow-hidden bg-[#2D3256] rounded-lg flex justify-center items-center">
                {/* <img src={product.gambar} className="w-full " alt="" /> */}
              </div>
              <div className="pl-3">
                <p className="text-[#2D3256] font-semibold text-lg">{item.nama}</p>
                {!item.printUrl ?
                  <p className="text-[#7077A1] text-md -mt-1 mb-1">Rp.{item.totalHarga}</p>
                  :
                  <p className="text-[#7077A1] text-md mt-0 mb-1 w-[150px] text-sm italic font-light leading-4">
                    Harga akan ditentukan oleh toko
                  </p>
                }
              </div>
            </div>
            {
              item.printUrl ?
                <Link className="no-underline" to={item.printUrl} target="_blank" >
                  <div className="flex h-6 border border-solid border-black rounded-xl overflow-hidden">
                    <button className="px-2 bg-white text-black border-none">View</button>
                  </div>
                </Link>
                :
                <div className="flex h-6 border border-solid rounded-xl overflow-hidden">
                  <ButtonInputKeranjang
                    keranjang={item}
                    incrementButton={() => incrementButton(item)}
                    decrementButton={() => decrementButton(item)}
                  />
                </div>
            }
          </div>
        )}
      </div>
      <SubmitBar keranjang={keranjang} />

      <div className="fixed top-3 left-3">
        <Link to={`/toko/${seller.id}`}>
          <img src={backIcon} alt="" />
        </Link>
      </div>
    </Default>
  )
}

export default Keranjang