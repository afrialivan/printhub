import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db, storage } from "../../../config/firebase"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const PesananDetail = () => {
  // const { id } = useParams()
  const location = useLocation()
  const order = JSON.parse(location.state.order)
  // const [myOrder, setMyOrder] = useState({ status: 0, keranjang: [] })
  const [seller, setSeller] = useState()
  const [paymentView, setPaymentView] = useState()
  const [fileUpload, setFileUpload] = useState(null)
  const [previewFile, setPreviewFile] = useState()
  const navigate = useNavigate()

  const getOrder = async () => {
    const orderCollectionRef = collection(db, "order")
    const sellerCollectionRef = collection(db, "seller")
    try {
      const dataOrder = await getDocs(orderCollectionRef)
      const filteredOrder = dataOrder.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find(data => data.id === order.id)
      const dataSeller = await getDocs(sellerCollectionRef)
      const filteredSeller = dataSeller.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find(item => Number(item.id) !== filteredOrder.sellerId)
      // console.log(dataOrder);

      const filterPay = filteredOrder.keranjang.find((data) => Number(data.harga) === 0)

      setSeller(filteredSeller)
      setPaymentView(filterPay ? false : true)
      // setMyOrder(filteredOrder)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const uploadBukti = async () => {
    try {
      const fileRef = ref(storage, `files/${fileUpload.name}`)
      const snapshot = await uploadBytes(fileRef, fileUpload)
      const urls = await getDownloadURL(snapshot.ref)

      const orderDoc = doc(db, "order", order.id)
      await updateDoc(orderDoc, { ...order, bukti: urls })
      setFileUpload(urls)
      console.log('updated successfully');
      navigate('/pesanan')
    } catch (error) {
      console.error(error);
    }
  }

  const fileInput = (event) => {
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    setFileUpload(file)
    setPreviewFile(url)
  }

  const terimaPesanan = async () => {
    try {
      const orderDoc = doc(db, "order", order.id)
      await updateDoc(orderDoc, { ...order, status: 'selesai' })
      navigate('/')
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="overflow-x-hidden bg-white text-black px-5 mt-3 relative">
      <p className="text-lg text-center text-[#2D3256] font-semibold">Pesanan Saya</p>
      <div className="bg-[#7077A1] rounded-lg px-4 py-2 mt-3">
        <p className="text-white font-medium text-center">Rincian Pesanan</p>
        <div className="flex flex-col gap-3">
          {order.keranjang.map((item) =>
            <div key={item.id}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-black rounded-lg">
                    img
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium text-lg">{item.nama}</p>
                    <p className="text-white">Rp.{item.harga}</p>
                    {item.printUrl !== 0 &&
                      <>
                        <Link className="no-underline" to={item.printUrl}>
                          <p className="text-white">Preview File</p>
                        </Link>
                        <p className="text-white">catatan: {item.catatan == 0 ? '-' : item.catatan}</p>
                      </>
                    }
                  </div>
                </div>
                <div>
                  <p className="text-white text-lg">x{item.jumlah}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2">
            <p className="text-white text-xl font-semibold -mb-1">Rp.{order.total}</p>
            <p className="text-sm text-white">Nomor invoice: {order.id}</p>
          </div>
        </div>
      </div>


      <div className="hidden">
        detail pesanan
        <div>
          <ul>
            {order?.keranjang.map((item) =>
              <li key={item.id}>
                <div>{item.nama}</div>
                <div>jumlah {item.jumlah}</div>
                <div>harga satuan {item.harga}</div>
                {
                  item.printUrl !== 0 ?
                    <Link to={item.printUrl} target="_blank">Preview</Link> :
                    ''
                }
              </li>
            )}
          </ul>
          <div>
            total harga {order?.total}
          </div>
          <br />
          <div>
            {paymentView && Number(order.bukti) === 0 &&
              <div>
                <div>
                  <div>
                    atas nama {seller.namaRekening}, bank: {seller.bank}
                  </div>
                  Nomor Rekening: {seller.rekening}
                </div>
                <br />
                <div>
                  <input type="file" onChange={fileInput} />
                  <button onClick={uploadBukti}>Upload Bukti</button>
                  <div>
                    {
                      previewFile ?
                        <Link to={previewFile} target="_blank" >preview</Link>
                        : ''
                    }
                  </div>
                </div>
              </div>
            }
          </div>
          <div>
            {order.status === 'dikirim' &&
              <button onClick={terimaPesanan}>Pesanan Diterima</button>
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default PesananDetail