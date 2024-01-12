import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../../config/firebase"
import { useParams } from "react-router-dom"

const Chat = () => {
  // const [seller, setSeller] = useState({})
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const { id, room } = useParams()
  const chatRef = collection(db, "chat")

  // const getData = async () => {
  //   const sellerCollectionRef = collection(db, "seller")
  //   const data = await getDocs(sellerCollectionRef)
  //   const dataSellerMap = data?.docs?.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id
  //   })).find((item) => item.id === id)
  //   setSeller(dataSellerMap)

  // }


  useEffect(() => {
    // getData()
    const queryMessages = query(chatRef, where("room", "==", room + id))
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = []
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
      })
      setMessages(messages)
    })

    return () => unsuscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newMessage === "") return;

    // const replacedString = seller.sellerName.replace(/\s+/g, '-');

    await addDoc(chatRef, {
      text: newMessage,
      createAt: serverTimestamp(),
      userId: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      sellerId: id,
      room: room + id
    })
    setNewMessage("")
  }

  return (
    <div>
      <div>
        {messages.map((message) => <h1 key={message.id}> {message.text} </h1>)}
      </div>
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          placeholder="type your massage here..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default Chat