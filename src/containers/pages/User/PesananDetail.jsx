import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db, storage } from "../../../config/firebase"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const PesananDetail = () => {
  const { id } = useParams()
  const [myOrder, setMyOrder] = useState({ status: 0, keranjang: [] })
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
      })).find(data => data.id === id)
      const dataSeller = await getDocs(sellerCollectionRef)
      const filteredSeller = dataSeller.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find(item => Number(item.id) !== filteredOrder.sellerId)
      // console.log(dataOrder);

      const filterPay = filteredOrder.keranjang.find((data) => Number(data.harga) === 0)

      setSeller(filteredSeller)
      setPaymentView(filterPay ? false : true)
      setMyOrder(filteredOrder)

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

      const orderDoc = doc(db, "order", myOrder.id)
      await updateDoc(orderDoc, { ...myOrder, bukti: urls })
      setMyOrder({ ...myOrder, bukti: urls })
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
      const orderDoc = doc(db, "order", myOrder.id)
      await updateDoc(orderDoc, { ...myOrder, status: 'selesai' })
      setMyOrder({ ...myOrder, status: 'selesai' })
      navigate('/')
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div>
      detail pesanan
      <div>
        <ul>
          {myOrder?.keranjang.map((item) =>
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
          total harga {myOrder?.total}
        </div>
        <br />
        <div>
          {paymentView && Number(myOrder.bukti) === 0 &&
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
          {myOrder.status === 'dikirim' &&
            <button onClick={terimaPesanan}>Pesanan Diterima</button>
          }
        </div>
      </div>
    </div>
  )
}

export default PesananDetail