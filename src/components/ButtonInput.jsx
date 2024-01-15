/* eslint-disable react/prop-types */
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "../config/firebase"
import { useDispatch } from "react-redux"
import { initializeUser } from "../reducers/userReducer"

const ButtonInput = ({ sellerId, product, user }) => {
  const [keranjang, setKeranjang] = useState()
  const [jumlah, setJumlah] = useState(0)
  const dispatch = useDispatch()

  const keranjangCollectionRef = collection(db, "keranjang")

  const getKeranjang = async () => {
    try {
      const data = await getDocs(keranjangCollectionRef)
      const dataMap = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      const userFiltered = user.keranjang.find((data) => data.productId === product.id)
      const filteredData = dataMap
        .filter((data) => data.productId === product.id)
        .find((data) => data.id === userFiltered?.idKeranjang)
      if (filteredData) {
        // console.log('keranjang ', filteredData)
        setKeranjang(filteredData)
      }
      setJumlah(filteredData?.jumlah || jumlah)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    dispatch(initializeUser())
    getKeranjang()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const decrementKeranjang = async () => {
    if (jumlah <= 0) return alert('tidak bisa kurang dari satu')
    setJumlah(jumlah - 1)
    let finalJumlah = jumlah - 1
    if (!keranjang) {
      try {
        const newKeranjang = await addDoc(keranjangCollectionRef, {
          nama: product.nama,
          catatan: 0,
          harga: product.harga,
          totalHarga: product.harga * finalJumlah,
          jumlah: finalJumlah,
          warnaKertas: 0,
          ukuranKertas: 0,
          jenisKertas: 0,
          printUrl: 0,
          productId: product.id,
          sellerId: sellerId,
          userId: auth.currentUser.uid
        })
        const userDoc = doc(db, "user", user.id)
        await updateDoc(userDoc, {
          ...user, keranjang: [
            ...user.keranjang, {
              idKeranjang: newKeranjang.id,
              productId: product.id,
              sellerId
            }
          ]
        })
        setKeranjang(newKeranjang)
        return
      } catch (error) {
        console.error(error)
      }
      alert('sukses')
    }
    try {
      const keranjangUpdateCollectionRef = collection(db, "keranjang")
      const data = await getDocs(keranjangUpdateCollectionRef)
      const dataMap = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).filter((item) => item.productId === product.id)
      const filterData = dataMap.find((item) => item.productId === product.id)
      const keranjangDoc = doc(db, "keranjang", filterData.id)
      const totalHarga = product.harga * finalJumlah
      await updateDoc(keranjangDoc, { ...filterData, jumlah: finalJumlah, totalHarga })
      setKeranjang({ ...filterData, jumlah: finalJumlah })
    } catch (error) {
      console.error(error)
    }
  }

  const incrementKeranjang = async () => {
    setJumlah(jumlah + 1)
    let finalJumlah = jumlah + 1
    if (!keranjang) {
      try {
        const newKeranjang = await addDoc(keranjangCollectionRef, {
          nama: product.nama,
          catatan: 0,
          harga: product.harga,
          totalHarga: product.harga * finalJumlah,
          jumlah: finalJumlah,
          warnaKertas: 0,
          ukuranKertas: 0,
          jenisKertas: 0,
          printUrl: 0,
          productId: product.id,
          sellerId: sellerId,
          userId: auth.currentUser.uid
        })
        const userDoc = doc(db, "user", user.id)
        await updateDoc(userDoc, {
          ...user, keranjang: [
            ...user.keranjang, {
              idKeranjang: newKeranjang.id,
              productId: product.id,
              sellerId
            }
          ]
        })
        setKeranjang(newKeranjang)
        return
      } catch (error) {
        console.error(error)
      }
    }
    try {
      const keranjangUpdateCollectionRef = collection(db, "keranjang")
      const data = await getDocs(keranjangUpdateCollectionRef)
      const dataMap = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).filter((item) => item.productId === product.id)
      const filterData = dataMap.find((item) => item.productId === product.id)
      const keranjangDoc = doc(db, "keranjang", filterData.id)
      const totalHarga = product.harga * finalJumlah
      await updateDoc(keranjangDoc, { ...filterData, jumlah: finalJumlah, totalHarga })
      setKeranjang({ ...filterData, jumlah: finalJumlah })
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div>
      <div>
        <button className="px-3 py-1 bg-[#7077A1] text-white rounded-l-lg border-t border-b border-l border-r-0">-</button>
        <input
          className="text-center py-1 w-12 border-t border-b border-l-0 border-r-0 text-black"
          value={0}
          type="number"
          disabled
        />
        <button className="px-3 py-1 bg-[#7077A1] text-white rounded-r-lg border-t border-b border-r- border-l-0">+</button>
      </div>







      <div className="hidden">
        <button onClick={decrementKeranjang}>-</button>
        <input
          type="number"
          value={jumlah}
          disabled
        />
        <button onClick={incrementKeranjang}>+</button>
      </div>
    </div>
  )
}

export default ButtonInput