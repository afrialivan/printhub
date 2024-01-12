/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux"
import Main from "../../templates/Main"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { initializeSeller } from "../../../reducers/sellerReducer";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../config/firebase";

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getUser = async () => {
    const userCollectionRef = collection(db, "user")
    const dataUser = await getDocs(userCollectionRef)
    const filteredUser = dataUser.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    })).find(data => data.userId === auth.currentUser.uid)

    if (!filteredUser) {
      navigate('/new-user')
    }
  }

  useEffect(() => {
    getUser()
    dispatch(initializeSeller())
  }, [])

  const sellers = useSelector(state => state.seller)

  return (
    <Main>
      <div>Halaman Home</div>
      <div>
        <ul>
          {sellers.map(seller => (
            <Link key={seller.id} to={`/seller/${seller.id}`} >
              <li>
                <p>{seller.sellerName}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <br /><br />
      <div>
        <Link to={'/pesanan'}>Lihat Pesanan</Link>
      </div>
    </Main>
  )
}

export default Home