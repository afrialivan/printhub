import { collection, getDocs } from "firebase/firestore"
import { Link, useParams } from "react-router-dom"
import { db } from "../../../config/firebase"
import { useEffect, useState } from "react"

const DetailPesananUser = () => {
  const [order, setOrder] = useState({ keranjang: [] })
  const { id } = useParams()

  const getOrder = async () => {
    try {
      const orderCollectionRef = collection(db, "order")
      const data = await getDocs(orderCollectionRef)
      const orderFiltered = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })).find((item) => item.id === id)
      setOrder(orderFiltered)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      Detail Pesanan
      {order?.keranjang.map((item) =>
        <div key={item.id}>
          <div>
            <div>
              nama: {item.nama}
            </div>
            <div>
              jumlah: {item.jumlah}
            </div>
            <div>
              harga satuan: {item.harga}
            </div>
            <div>
              {item.printUrl !== 0 &&
                <Link to={item.printUrl} target="_blank" >preview</Link>
              }
            </div>
          </div>
        </div>
      )}

      <br /><br /><br />
      <div>
        total harga {order?.total}
      </div>

    </div>
  )
}

export default DetailPesananUser