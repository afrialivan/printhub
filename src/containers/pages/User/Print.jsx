import { useState } from "react"
import { auth, db, storage } from '../../../config/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
// import images from "../../../assets/img/Image";
// const { info } = images

const Print = () => {
  const [fileUpload, setFileUpload] = useState(null)
  const [catatan, setCatatan] = useState()
  const [jumlah, setJumlah] = useState()
  const [warnaKertas, setWarnaKertas] = useState("Berwarna")
  const [jenisKertas, setJenisKertas] = useState()
  const [ukuranKertas, setUkuranKertas] = useState()
  const [previewFile, setPreviewFile] = useState()

  const location = useLocation()
  const seller = JSON.parse(location.state.seller)
  // const { id } = useParams();
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  const fileInput = (event) => {
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setFileUpload(file)
    setPreviewFile(url)
  }

  const uploadFile = async () => {
    const keranjangCollectionRef = collection(db, "keranjang")
    if (!fileUpload && !jumlah && !jenisKertas && !ukuranKertas) return console.log('isi');
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
        sellerId: seller.id,
        userId: auth.currentUser.uid,
        gambar: 'https://firebasestorage.googleapis.com/v0/b/printhub-5acff.appspot.com/o/files%2Fprint.png?alt=media&token=a87a5a47-0085-417b-9568-8dcb784d3a8e'
      })
      const userDoc = doc(db, "user", user.id)
      await updateDoc(userDoc, {
        ...user, keranjang: [
          ...user.keranjang,
          {
            idKeranjang: newKeranjang.id,
            productId: 0,
            sellerId: seller.id
          }
        ]
      })
      navigate(`/toko/${seller.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="overflow-x-hidden bg-white text-black px-5 pt-3 min-h-screen relative">
      <p className="text-lg text-center text-[#2D3256] font-semibold">Unggah File</p>

      <div className="mt-4">
        <div>
          <div>
            <div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radio-1"
                    className="w-5 h-5 radio border border-solid"
                    checked
                    onClick={() => setWarnaKertas('Berwarna')}
                  />
                  <p>Berwarna</p>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radio-1"
                    className="w-5 h-5 radio border border-solid"
                    onClick={() => setWarnaKertas('Hitam Putih')}
                  />
                  <p>Hitam Putih</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 grid-flow-row">
              <select
                onChange={(e) => setUkuranKertas(e.target.value)}
                className="select select-bordered max-w-xs"
              >
                <option value="" disabled selected>Ukuran Kertas</option>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="F4">F4</option>
                <option value={"-"}>Tidak ada</option>
              </select>

              <select
                onChange={(e) => setJenisKertas(e.target.value)}
                className="select select-bordered max-w-xs"
              >
                <option value={""} disabled selected>Jenis Kertas</option>
                <option value={"HVS"}>HVS</option>
                <option value={"-"}>Tidak ada</option>
              </select>
            </div>
            <div className="grid">
              <input
                onChange={(e) => setJumlah(e.target.value)}
                type="number"
                placeholder="Jumlah Print"
                className="input input-bordered max-w-xs"
              />
              <textarea
                placeholder="Catatan"
                className="textarea textarea-bordered textarea-md max-w-xs"
                onChange={(e) => setCatatan(e.target.value)}
              ></textarea>
            </div>

            <div className="mt-4">
              <input
                className="file-input file-input-bordered file-input-md w-full max-w-xs"
                type="file"
                onChange={fileInput} />
              {
                previewFile ?
                  <Link to={previewFile} target="_blank" >
                    <button className="btn btn-info btn-sm text-white mt-3">Lihat File</button>
                    {/* <div>Lihat File</div> */}
                  </Link>
                  : ''
              }
            </div>

            <div className="mt-4">
              <p className="text-[#2D3256]">Syarat dan ketentuan</p>
              <ol className="ml-4">
                <li className="text-sm text-[#7077A1]">Unggah dalam format PDF, JPEG, atau PNG; format lain tidak didukung.</li>
                <li className="text-sm text-[#7077A1]">Batas 10 MB; pastikan ukuran file sesuai agar proses cetak berjalan lancar.</li>
                <li className="text-sm text-[#7077A1]">Pastikan gambar memiliki resolusi tinggi, setidaknya 300 dpi, untuk hasil cetak optimal.</li>
                <li className="text-sm text-[#7077A1]">Hanya unggah file dengan hak cipta atau izin cetak; kami tidak bertanggung jawab atas pelanggaran hak cipta atau sengketa hukum.</li>
              </ol>
            </div>

            <div className="fixed bottom-5 left-4 right-4">
              <button onClick={uploadFile} className="w-full py-4 rounded-3xl border-none bg-[#F6B17A] text-white font-semibold">Upload</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Print