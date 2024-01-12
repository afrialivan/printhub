import { addDoc, collection, getDocs } from "firebase/firestore"
import { auth, db } from "../config/firebase"

const sellerCollectionRef = collection(db, "seller")
const productCollectionRef = collection(db, "product")

export const getSeller = async () => {
  try {
    const data = await getDocs(sellerCollectionRef)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    return filteredData
  } catch (err) {
    console.error(err)
  }
}

export const createSeller = async (data) => {
  try {
    await addDoc(sellerCollectionRef, {
      sellerName: data.sellerName,
      desc: data.desc,
      photo: data.photo,
      idUser: auth?.currentUser?.uid
    })

  } catch (err) {
    console.error(err)
  }
}

export const getProduct = async () => {
  try {
    const data = await getDocs(productCollectionRef)
    const filteredData = data.docs.map((doc) =>  ({
      ...doc.data(),
      id: doc.id
    }))
    return filteredData
  } catch (err) {
    console.error(err)
  }
}