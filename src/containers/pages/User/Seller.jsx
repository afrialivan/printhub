/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import Main from "../../templates/Main"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initializeProduct } from "../../../reducers/productReducer";
import ButtonInput from "../../../components/ButtonInput";
import SubmitBar from "../../../components/SubmitBar";
import { auth, db } from "../../../config/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

const Seller = () => {
  const { id } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

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
    <Main>
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
    </Main>
  )
}

export default Seller