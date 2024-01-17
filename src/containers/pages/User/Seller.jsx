/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { initializeProduct } from "../../../reducers/productReducer";
import ButtonInput from "../../../components/ButtonInput";
import { auth, db } from "../../../config/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import "../../../assets/styles/seller.css";
import Default from "../../templates/Default";
import { initializeUser } from "../../../reducers/userReducer";
import images from "../../../assets/img/Image";
const { homeIcon, arah, bintangOutline, chatIcon, keranjangIcon, backIcon } = images

const Seller = () => {
  const [seller, setSeller] = useState({})
  const [keranjang, setKeranjang] = useState([])
  const [products, setProducts] = useState([])
  const [user, setUser] = useState()
  const { id } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const user = useSelector(state => state.user)
  const keranjangCollectionRef = collection(db, "keranjang")

  const getData = async () => {
    try {
      const userCollectionRef = collection(db, "user")
      const dataUser = await getDocs(userCollectionRef)
      const dataFilteredUser = dataUser.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find((data) => data.userId === auth.currentUser.uid)
      setUser(dataFilteredUser)

      const sellerCollectionRef = collection(db, "seller")
      const data = await getDocs(sellerCollectionRef)
      const dataSellerMap = data?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find((item) => item.id === id)
      setSeller(dataSellerMap)

      const keranjangCollectionRef = collection(db, "keranjang")
      const dataKeranjang = await getDocs(keranjangCollectionRef)
      const dataMap = dataKeranjang.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).filter((item) => item.sellerId === dataSellerMap.id && item.userId === auth.currentUser.uid)
      setKeranjang(dataMap)

      const productCollectionRef = collection(db, "product")
      const dataProduct = await getDocs(productCollectionRef)
      const findedProduct = dataProduct.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).filter((item) => item.sellerId === dataSellerMap.id)
      setProducts(findedProduct)

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData()
    dispatch(initializeProduct(id))
    dispatch(initializeUser())
  }, [])

  const checkBeforeChat = async () => {
    const sellerCollectionRef = collection(db, "seller")
    const data = await getDocs(sellerCollectionRef)
    const dataSellerMap = data?.docs?.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find((item) => item.id === id)
    // setSeller(dataSellerMap)

    const userCollectionRef = collection(db, "user")
    const dataUser = await getDocs(userCollectionRef)
    const dataUserMap = dataUser?.docs?.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find((item) => item.userId === auth.currentUser.uid)

    const dataUserSellerMap = dataUser?.docs?.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find((item) => item.sellerId === id)

    const replacedString = dataSellerMap.sellerName.replace(/\s+/g, '-');

    const filterRoomUser = dataUserMap.room.find((item) => item.roomId === replacedString.toLowerCase() + auth.currentUser.uid + seller.id)
    // console.log(filterRoomUser);

    if (!filterRoomUser && dataUserMap.role === 'user') {
      const userUpdateCollectionRef = doc(db, "user", dataUserMap.id)
      const sellerUpdateCollectionRef = doc(db, "user", dataUserSellerMap.id)
      const updatedData = (data, nama) => {
        return {
          ...data,
          room: [
            ...data.room,
            {
              roomId: replacedString.toLowerCase() + auth.currentUser.uid + seller.id,
              nama
            }
          ]
        }
      }
      // console.log(updatedData(dataUserSellerMap));
      await updateDoc(userUpdateCollectionRef, updatedData(dataUserMap, seller.sellerName))
      await updateDoc(sellerUpdateCollectionRef, updatedData(dataUserSellerMap, user.nama))
      console.log('update');
    }
    // navigate(`/chat/${replacedString.toLowerCase() + auth.currentUser.uid}/${id}`)
    navigate(`/chat`, {
      state: {
        seller: JSON.stringify(seller),
        idRoom: replacedString.toLowerCase() + auth.currentUser.uid + seller.id,
        nama: seller.sellerName,
        backLink: `/toko/${seller.id}`
      }
    })
  }

  // const products = useSelector(state => state.product)

  const incrementButton = async (product) => {
    try {
      const keranjangUpdateCollectionRef = collection(db, "keranjang")
      const data = await getDocs(keranjangUpdateCollectionRef)
      const dataMap = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).filter((item) => item.productId === product.id)
      const filterData = dataMap.find((item) => item.productId === product.id)
      if (filterData === undefined) {
        const newKeranjang = {
          nama: product.nama,
          catatan: 0,
          harga: product.harga,
          totalHarga: product.harga * 1,
          jumlah: 1,
          warnaKertas: 0,
          ukuranKertas: 0,
          jenisKertas: 0,
          printUrl: 0,
          productId: product.id,
          sellerId: seller.id,
          userId: auth.currentUser.uid,
          gambar: product.gambar
        }
        const keranjangCreated = await addDoc(keranjangCollectionRef, newKeranjang)
        const dataUpdate = await getDocs(keranjangUpdateCollectionRef)
        const dataFiteredUpdate = dataUpdate.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        })).filter((item) => item.productId === product.id).find((item) => item.productId === product.id)
        const keranjangDoc = doc(db, "keranjang", dataFiteredUpdate.id)
        await updateDoc(keranjangDoc, { ...dataFiteredUpdate })

        const userDoc = doc(db, "user", user.id)
        await updateDoc(userDoc, {
          ...user, keranjang: [
            ...user.keranjang, {
              idKeranjang: keranjangCreated.id,
              productId: product.id,
              sellerId: seller.id
            }
          ]
        })
        getData()
        return
      }

      const keranjangDoc = doc(db, "keranjang", filterData.id)
      const jumlah = filterData.jumlah + 1
      const totalHarga = filterData.harga * jumlah
      updateDoc(keranjangDoc, { ...filterData, jumlah, totalHarga })
      getData()
    } catch (error) {
      console.error(error);
    }
  }

  const decrementButton = async (product) => {
    try {
      const keranjangUpdateCollectionRef = collection(db, "keranjang")
      const data = await getDocs(keranjangUpdateCollectionRef)
      const dataMap = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))

      const filterData = dataMap.filter((item) => item.productId === product.id).find((item) => item.userId === auth.currentUser.uid)
      const keranjangDoc = doc(db, "keranjang", filterData.id)

      if (filterData.jumlah === 1) {
        await deleteDoc(keranjangDoc)
        const userDoc = doc(db, "user", user.id)
        await updateDoc(userDoc, {
          ...user, keranjang: user.keranjang.filter((item) => item.idKeranjang !== filterData.id)
        })
        getData()
        return
      }

      const jumlah = filterData.jumlah - 1
      const totalHarga = filterData.harga * jumlah
      updateDoc(keranjangDoc, { ...filterData, jumlah, totalHarga })
      getData()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Default>
      <div style={{ backgroundImage: `url(${seller.gambar})` }} className="bg-cover w-full h-24 bg-black rounded-t-xl">

      </div>

      <div className="mt-2">
        <p className="text-[#272F49] text-2xl font-semibold">{seller.sellerName}</p>
        <p className="text-[#7077A1] font-medium">{seller.alamat}</p>
        <div className="flex justify-between">
          <p className="text-green-700 text-sm">Buka | <span className="text-blue-600">10.00 - 20.00</span></p>
          <div>
            <p className="text-sm">4.9 (210 reviews)</p>
          </div>
        </div>
      </div>

      <div className="divider -mt-0 mb-1"></div>

      <div className="flex flex-col justify-center items-center bg-[#7077A1] h-40 rounded-3xl mt-2 px-4">
        <div>
          <img src={homeIcon} alt="" />
        </div>
        <div>
          <button onClick={() => { navigate('/toko/print', { state: { seller: JSON.stringify(seller) } }) }} className="bg-[#F6B17A] px-5 py-2 rounded-lg border-none text-white">Print Sekarang</button>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold text-lg mb-2">ATK</p>
        <div className="flex flex-col gap-4">
          {products.map(product => (
            <div key={product.id} className="flex justify-between">
              <div>
                <p className="text-[#2D3256] font-semibold text-lg">{product.nama}</p>
                <p className="text-[#7077A1] text-md -mt-1 mb-1">Rp.{product.harga}</p>
                <ButtonInput
                  id={product.id}
                  keranjang={keranjang}
                  decrementButton={() => decrementButton(product)}
                  incrementButton={() => incrementButton(product)}
                />
              </div>
              <div style={{ backgroundImage: `url(${product.gambar})` }} className="w-20 h-20 bg-cover overflow-hidden bg-[#2D3256] rounded-lg flex justify-center items-center">
                {/* <img src={product.gambar} className="w-full " alt="" /> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed left-2 right-2 bottom-5 ">
        <div className="flex justify-around items-center rounded-3xl pb-2 pt-3 bg-[#7077A1]">
          <div className='flex items-center flex-col z-20'>
            <div className="rounded-full bg-white w-10 h-10 flex justify-center items-center">
              <img src={bintangOutline} className='w-6' alt="" />
            </div>
            <p className='font-medium text-white -mt-0'>Ulasan</p>
          </div>
          <div className='flex items-center flex-col z-20' onClick={checkBeforeChat}>
            <div className="rounded-full bg-white w-10 h-10 flex justify-center items-center">
              <img src={chatIcon} className='w-6' alt="" />
            </div>
            <p className='font-medium text-white -mt-0'>Hubungi</p>
          </div>
          <div className='flex items-center flex-col z-20' onClick={() => { navigate('/toko/map', { replace: true, state: { seller: JSON.stringify(seller) } }) }}>
            <div className="rounded-full bg-white w-10 h-10 flex justify-center items-center">
              <img src={arah} className='w-7' alt="" />
            </div>
            <p className='font-medium text-white -mt-0'>Petunjuk</p>
          </div>
        </div>
        {keranjang.length !== 0 &&
          <div onClick={() => { navigate('/toko/keranjang', { state: { seller: JSON.stringify(seller) } }) }} className="flex justify-center items-center -top-[65px] right-1 absolute w-14 h-14 bg-white rounded-full keranjang-icon">
            <img src={keranjangIcon} alt="" className="w-9" />
          </div>
        }
      </div>

      <div className="fixed top-3 left-3">
        <Link to={'/'}>
          <img src={backIcon} alt="" />
        </Link>
      </div>
    </ Default>
  )
}

export default Seller