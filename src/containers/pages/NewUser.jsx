/* eslint-disable react-hooks/exhaustive-deps */
import { addDoc, collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../config/firebase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const NewUser = () => {
  const [nama, setNama] = useState()
  const [alamat, setAlamat] = useState()
  const navigate = useNavigate()

  const getUser = async () => {
    const userCollectionRef = collection(db, "user")
    const dataUser = await getDocs(userCollectionRef)
    const filteredUser = dataUser.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find(data => data.userId === auth.currentUser.uid)

    if (filteredUser) {
      navigate('/')
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const uploadUser = async () => {
    const userCollectionRef = collection(db, "user")
    if (nama === '' && alamat === '') return

    await addDoc(userCollectionRef, {
      nama,
      alamat,
      keranjang: [],
      order: [],
      role: 'user',
      room: [],
      sellerId: 0,
      userId: auth.currentUser.uid
    })

    navigate('/')
  }

  return (
    <div>
      new user
      <div>
        <input type="text" placeholder="nama" onChange={(e) => setNama(e.target.value)} />
        <input type="text" placeholder="alamat" onChange={(e) => setAlamat(e.target.value)} />
        <div>
          <button onClick={uploadUser}>submit</button>
        </div>
      </div>
    </div>
  )
}

export default NewUser