/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../config/firebase"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const ChatSeller = () => {
  const [user, setUser] = useState({ room: [] })
  const [seller, setSeller] = useState({})

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
    <div>
      Halaman Chat
      <ul>
        {user?.room.map((item, i) =>
          <li key={i}>
            <Link to={`/chat/${item.roomId}/${seller.id}`}>
              user chat
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default ChatSeller