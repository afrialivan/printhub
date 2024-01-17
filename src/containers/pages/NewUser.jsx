/* eslint-disable react-hooks/exhaustive-deps */
import { addDoc, collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../config/firebase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Default from '../templates/Default'
import images from "../../assets/img/Image"
const { bunga } = images

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
    <Default>
      <div className="pt-4">
        <img src={bunga} className="w-16" alt="" />
      </div>

      <p className="text-lg text-[#2D3256] font-semibold">Data Diri</p>
      <p className=" text-[#A5A7B3] font-light text-md mb-5">Sebelum masuk yuk lengkapi data diri dulu yaa</p>

      <div>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Nama Lengkap Anda</span>
          </div>
          <input
            type="text"
            placeholder="nama anda..."
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setNama(e.target.value)}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Alamat Lengkap Anda</span>
          </div>
          <input
            type="text"
            placeholder="alamat anda..."
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setAlamat(e.target.value)}
          />
        </label>
      </div>

      <div className="fixed bottom-5 left-4 right-4">
        <button onClick={uploadUser} className="w-full py-4 rounded-3xl border-none bg-[#F6B17A] text-white font-semibold">Buat Akun</button>
      </div>
    </Default>
  )
}

export default NewUser