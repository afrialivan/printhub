import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../config/firebase"


export const getUser = async () => {
  try {
    const userCollectionRef = collection(db, "user")
    const data = await getDocs(userCollectionRef)
    const dataMap = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    const filteredData = dataMap.find((data) => data.userId === auth?.currentUser?.uid ? data : undefined)
    return filteredData
  } catch (err) {
    console.error(err)
  }
}