import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../../config/firebase"
import { Link, useLocation } from "react-router-dom"
import Default from "../templates/Default"
import images from "../../assets/img/Image";
const { backIcon } = images

const Chat = () => {
  const location = useLocation()
  const seller = JSON.parse(location.state.seller)
  const idRoom = location.state.idRoom
  const backLink = location.state.backLink
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const chatRef = collection(db, "chat")

  useEffect(() => {
    // getData()
    const queryMessages = query(chatRef, where("room", "==", idRoom))
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = []
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
      })
      // const compareByTime = (a, b) => {
      //   const timeA = new Date(a.createAt).getTime();
      //   const timeB = new Date(b.createAt).getTime();

      //   return timeA - timeB;
      // }
      let sortedArray = messages.sort((a, b) => a.createAt?.seconds - b.createAt?.seconds);
      setMessages(sortedArray)
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
      sellerId: seller.id,
      room: idRoom
    })
    setNewMessage("")
  }

  return (
    <Default>
      <div>
        <p className="text-lg text-center text-[#2D3256] font-semibold">{seller.sellerName}</p>
      </div>
      {messages.map((message, i) =>
        <div key={i}>
          {message.userId !== auth.currentUser.uid ?
            <div className="chat chat-start">
              {/* <div className="chat-bubble">Itover Anakin, <br />I have the high ground.</div> */}
              <div className="chat-bubble bg-[#7077A1]">{message.text}</div>
            </div>
            :
            <div className="chat chat-end">
              <div className="chat-bubble bg-[#7077A1]">{message.text}</div>
            </div>
          }
        </div>
      )}

      <form onSubmit={handleSubmit} className="fixed flex bottom-3 left-3 right-3 border-[#7077A1] border-solid rounded-lg border">
        <input
          className="w-5/6 input"
          type="text"
          placeholder="type your massage here..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button className="w-1/6 border-none bg-[#F6B17A]" type="submit">Send</button>
      </form>

      <div className="fixed top-3 left-3">
        <Link to={backLink}>
          <img src={backIcon} alt="" />
        </Link>
      </div>
    </Default>
  )
}

export default Chat