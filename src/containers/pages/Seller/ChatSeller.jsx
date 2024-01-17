/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Default from "../../templates/Default"
import images from "../../../assets/img/Image";
const { backIcon } = images

const ChatSeller = () => {
  const [user, setUser] = useState({ room: [] })
  const [seller, setSeller] = useState({})
  const navigate = useNavigate()

  const getData = async () => {
    const sellerCollectionRef = collection(db, "seller")
    const dataSeller = await getDocs(sellerCollectionRef)
    const dataMap = dataSeller.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find((item) => item.userId === auth.currentUser.uid)
    setSeller(dataMap)

    const userCollectionRef = collection(db, "user")
    const data = await getDocs(userCollectionRef)
    const dataFiltered = data?.docs?.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find((item) => item.userId === auth.currentUser.uid)
    setUser(dataFiltered)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Default>
      <p className="text-lg text-center text-[#2D3256] font-semibold">Halaman Chat</p>

      <div className="flex flex-col gap-4 mt-5">
        {user?.room.map((item) =>
          <div onClick={() => navigate('/chat', {
            state: {
              backLink: '/seller/chat',
              idRoom: item.roomId,
              nama: item.nama,
              seller: JSON.stringify(seller)
            }
          })}
            key={item.roomId}
            className="bg-[#7077A1] rounded-lg text-white font-semibold px-4 py-2"
          >
            <p>{item.nama}</p>
          </div>
        )}

      </div>

      <div className="fixed top-3 left-3">
        <Link to={'/seller/dashboard'}>
          <img src={backIcon} alt="" />
        </Link>
      </div>
    </Default>
  )
}

export default ChatSeller