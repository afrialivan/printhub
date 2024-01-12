import { Link } from "react-router-dom"



const Dashboard = () => {
  // const [seller, setSeller] = useState([])

  // const getSeller = async () => {
  //   const sellerCollectionRef = collection(db, "seller")
  //   const data = await getDocs(sellerCollectionRef)
  //   const dataMap = data.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id
  //   })).find((item) => item.userId === auth.currentUser.uid)
  //   setSeller(dataMap)
  // }

  // useEffect(() => {
  //   getSeller()
  // }, [])

  // console.log(seller)

  return (
    <div>
      <div>
        <Link to={`/seller/chat`}>Chat</Link>
      </div>
      <div>
        <Link to={`/seller/konfirmasi`}>Konfirmasi pesanan</Link>
      </div>
    </div>
  )
}

export default Dashboard