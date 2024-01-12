import { useState } from "react"
import { auth, db, storage } from '../../../config/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Main from "../../templates/Main"
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"

const Print = () => {
  const [fileUpload, setFileUpload] = useState(null)
  const [catatan, setCatatan] = useState('')
  const [jumlah, setJumlah] = useState()
  const [warnaKertas, setWarnaKertas] = useState()
  const [jenisKertas, setJenisKertas] = useState()
  const [ukuranKertas, setUkuranKertas] = useState()
  const [previewFile, setPreviewFile] = useState()

  const { id } = useParams();

  const navigate = useNavigate()

  const keranjangCollectionRef = collection(db, "keranjang")

  const user = useSelector(state => state.user)

  const fileInput = (event) => {
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setFileUpload(file)
    setPreviewFile(url)
  }

  const uploadFile = async () => {
    if (!fileUpload) return
    try {
      const fileRef = ref(storage, `files/${fileUpload.name}`)
      const snapshot = await uploadBytes(fileRef, fileUpload)
      const urls = await getDownloadURL(snapshot.ref)
      const newKeranjang = await addDoc(keranjangCollectionRef, {
        nama: 'print',
        catatan: catatan,
        harga: 0,
        jumlah,
        warnaKertas,
        ukuranKertas,
        jenisKertas,
        printUrl: urls,
        productId: 0,
        totalHarga: 0,
        sellerId: id,
        userId: auth.currentUser.uid
      })
      const userDoc = doc(db, "user", user.id)
      await updateDoc(userDoc, {
        ...user, keranjang: [
          ...user.keranjang,
          {
            idKeranjang: newKeranjang.id,
            productId: 0,
            sellerId: id
          }
        ]
      })
      alert('sukses')
      navigate(`/seller/${id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Main>
      <br />
      halaman print
      <div>
        <br />
        <input
          type="file"
          onChange={fileInput} />
        {
          previewFile ?
            <Link to={previewFile} target="_blank" >
              <div>preview</div>
            </Link>
            : ''
        }
      </div>
      <br />
      <div>
        <div>
          <input type="text" onChange={(e) => setCatatan(e.target.value)} placeholder="catatan" />
        </div>
        <div>
          <input type="number" onChange={(e) => setJumlah(e.target.value)} placeholder="jumlah" />
        </div>
        <div>
          <input type="text" onChange={(e) => setWarnaKertas(e.target.value)} placeholder="warna" />
        </div>
        <div>
          <input type="text" onChange={(e) => setUkuranKertas(e.target.value)} placeholder="ukuran" />
        </div>
        <div>
          <input type="text" onChange={(e) => setJenisKertas(e.target.value)} placeholder="jenis" />
        </div>
      </div>

      <br />
      <br />
      <button onClick={uploadFile}>upload</button>
    </Main>
  )
}

export default Print