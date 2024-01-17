/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import Default from "../../templates/Default"
import images from "../../../assets/img/Image"
import { auth, db, storage } from "../../../config/firebase"
import { useEffect, useState } from "react"
import { addDoc, collection, getDocs } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
const { backIcon } = images

const Product = () => {
  const productCollectionRef = collection(db, "product")
  const [harga, setHarga] = useState()
  const [jumlah, setJumlah] = useState()
  const [file, setFile] = useState()
  const [previewFile, setPreviewFile] = useState()
  const [nama, setNama] = useState()
  const [seller, setSeller] = useState({})
  const [product, setProduct] = useState([])

  const getData = async () => {
    const sellerCollectionRef = collection(db, "seller")
    const dataSeller = await getDocs(sellerCollectionRef)
    const findedSeller = dataSeller.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find((item) => item.userId === auth.currentUser.uid)
    setSeller(findedSeller)

    const dataProduct = await getDocs(productCollectionRef)
    const findedProduct = dataProduct.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).filter((item) => item.sellerId === findedSeller.id)
    setProduct(findedProduct)
  }

  useEffect(() => {
    getData()
  }, [])

  const fileInput = (event) => {
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setFile(file)
    setPreviewFile(url)
  }

  const createProduct = async () => {

    const fileRef = ref(storage, `files/${file.name}`)
    const snapshot = await uploadBytes(fileRef, file)
    const urls = await getDownloadURL(snapshot.ref)
    const newProduct = {
      harga,
      jumlah,
      nama,
      gambar: urls,
      sellerId: seller.id,
      userId: auth.currentUser.uid
    }
    console.log(newProduct);
    await addDoc(productCollectionRef, newProduct)

    setHarga('')
    setJumlah('')
    setNama('')
    getData()
  }

  return (
    <Default>
      <p className="text-lg text-center text-[#2D3256] font-semibold">Halaman Chat</p>

      <div className="mt-5">
        <button className="btn bg-[#2D3256] text-white" onClick={() => document.getElementById('my_modal_1').showModal()}>Buat Product Baru</button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box ">
            <h3 className="font-bold text-lg">Product baru</h3>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Nama Product</span>
              </div>
              <input onChange={(e) => setNama(e.target.value)} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs bg-white" />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Harga Product</span>
              </div>
              <input onChange={(e) => setHarga(e.target.value)} type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs bg-white" />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Stok Product</span>
              </div>
              <input onChange={(e) => setJumlah(e.target.value)} type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs bg-white" />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Gambar Product</span>
              </div>
              <input type="file" onChange={fileInput} className="file-input file-input-bordered w-full max-w-xs bg-white" />
            </label>
            {
              previewFile ?
                <Link to={previewFile} target="_blank" >
                  <button className="btn bg-white text-black mt-3">Lihat File</button>
                  {/* <div>Lihat File</div> */}
                </Link>
                : ''
            }

            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn" >Batal</button>
                <button onClick={createProduct} className="btn btn-success text-white" >Buat</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>


      <div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Harga</th>
                <th>Stok</th>
              </tr>
            </thead>
            <tbody>
              {product.map((item) =>
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>Rp.{item.harga}</td>
                  <td>{item.jumlah}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      <div className="fixed top-3 left-3">
        <Link to={'/seller/dashboard'}>
          <img src={backIcon} alt="" />
        </Link>
      </div>
    </Default>
  )
}

export default Product