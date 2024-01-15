/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { initializeProduct } from "../../../reducers/productReducer";
import ButtonInput from "../../../components/ButtonInput";
import SubmitBar from "../../../components/SubmitBar";
import { auth, db } from "../../../config/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import images from "../../../assets/img/Image";
import "../../../assets/styles/seller.css";
const { homeIcon, arah, bintangOutline, chatIcon, keranjang } = images

const Seller = () => {
  const [seller, setSeller] = useState({})
  const { id } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  const getData = async () => {
    const sellerCollectionRef = collection(db, "seller")
    const data = await getDocs(sellerCollectionRef)
    const dataSellerMap = data?.docs?.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find((item) => item.id === id)
    setSeller(dataSellerMap)
  }

  useEffect(() => {
    getData()
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

    // console.log(dataUserSellerMap);

    const replacedString = dataSellerMap.sellerName.replace(/\s+/g, '-');

    const filterRoomUser = dataUserMap.room.find((item) => item.roomId === replacedString.toLowerCase() + auth.currentUser.uid)
    // console.log(filterRoomUser);

    if (!filterRoomUser && dataUserMap.role === 'user') {
      const userUpdateCollectionRef = doc(db, "user", dataUserMap.id)
      const sellerUpdateCollectionRef = doc(db, "user", dataUserSellerMap.id)
      const updatedData = (data) => {
        return {
          ...data,
          room: [
            ...data.room,
            { roomId: replacedString.toLowerCase() + auth.currentUser.uid }
          ]
        }
      }
      // console.log(updatedData(dataUserSellerMap));
      await updateDoc(userUpdateCollectionRef, updatedData(dataUserMap))
      await updateDoc(sellerUpdateCollectionRef, updatedData(dataUserSellerMap))
      console.log('update');
    }
    navigate(`/chat/${replacedString.toLowerCase() + auth.currentUser.uid}/${id}`)
  }

  useEffect(() => {
    dispatch(initializeProduct(id))
    // console.log(user)
  }, [])


  const products = useSelector(state => state.product)

  // const back = () => {
  //   navigate(-1)
  // }

  return (
    <div className="overflow-x-hidden bg-white text-black px-5 mt-3 relative">
      <div className="w-full h-24 bg-black rounded-t-xl">
        img
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
          <button onClick={() => { navigate('/seller/print', { state: { seller: JSON.stringify(seller) } }) }} className="bg-[#F6B17A] px-5 py-2 rounded-lg border-none text-white">Print Sekarang</button>
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
                <ButtonInput />
              </div>
              <div className="w-20 h-20 bg-black rounded-lg">
                img
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
          <div className='flex items-center flex-col z-20' onClick={() => { navigate('/seller/map', { replace: true, state: { seller: JSON.stringify(seller) } }) }}>
            <div className="rounded-full bg-white w-10 h-10 flex justify-center items-center">
              <img src={arah} className='w-7' alt="" />
            </div>
            <p className='font-medium text-white -mt-0'>Petunjuk</p>
          </div>
        </div>
        <div onClick={() => { navigate('/seller/keranjang', { state: { seller: JSON.stringify(seller) } }) }} className="flex justify-center items-center -top-[65px] right-1 absolute w-14 h-14 rounded-full keranjang-icon">
          <img src={keranjang} alt="" className="w-9" />
        </div>
      </div>










      <div className="hidden">
        <Link to="/" >
          <button>Back</button>
        </Link>
        <div>
          seller
        </div>
        <br />
        <div>
          {/* <Link to={`/chat/${id}`}> */}
          <button onClick={checkBeforeChat} >Chat</button>
          {/* </Link> */}
        </div>
        <br />
        <div>
          <Link to={`/seller/print/${id}`}>
            <button>print</button>
          </Link>
        </div>
        <h1>ATK</h1>
        <div>
          {products.map(product => (
            <div key={product.id} >
              <p>{product.nama}</p>
              <ButtonInput user={user} sellerId={id} product={product} />
            </div>
          ))}
        </div>
        <br /><br />
        <SubmitBar sellerId={id} />
      </div>
    </div >
  )
}

export default Seller