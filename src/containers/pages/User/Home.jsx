/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux"
import Main from "../../templates/Main"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { initializeSeller } from "../../../reducers/sellerReducer";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import images from "../../../assets/img/Image";
import { signOut } from "firebase/auth";

const Home = () => {
  const { avatar, homeIcon, printIcon, atkIcon, lainnyaIcon } = images
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

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Main title="Home" >
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-[#2D3250] font-medium -mb-1">Hi tes</p>
          <p className="text-[#F6B17A] text-sm">Bagaimana keadaanmu sekarang?</p>
        </div>
        <details className="dropdown bg-transparent">
          <summary className="m-1 btn bg-transparent shadow-none">
            <div className="w-12 h-12 rounded-full bg-[#2D3250] ring-2 border-[#2D3250] overflow-hidden block">
              <img src={avatar} alt="" className="m-auto w-full" />
            </div>
          </summary>
          <ul className="p-2 mt-1 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-20">
            <li>
              <div onClick={logout}>Logout</div>
            </li>
          </ul>
        </details>
      </div>

      <div className="flex justify-between items-center bg-[#7077A1] h-40 rounded-3xl mt-7 px-4">
        <div>
          <p className="text-white text-sm">Lorem ipsum dolor sit amet.</p>
          <button className="bg-[#F6B17A] px-5 py-2 rounded-lg border-none mt-4 text-white">ini tombol</button>
        </div>
        <div>
          <img src={homeIcon} alt="" />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[#2D3250] font-semibold">Layanan Kami</p>
        <div className="flex gap-3 justify-between mt-3">
          <div className="flex flex-col items-center">
            <div className="border-2 border-solid border-[#7077A1] w-20 h-20 rounded-xl flex justify-center items-center">
              <img src={printIcon} className="w-16" alt="" />
            </div>
            <p className="text-[#F6B17A] font-semibold mt-1">Print</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="border-2 border-solid border-[#7077A1] w-20 h-20 rounded-xl flex justify-center items-center">
              <img src={atkIcon} className="w-12" alt="" />
            </div>
            <p className="text-[#F6B17A] font-semibold mt-1">ATK</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="border-2 border-solid border-[#7077A1] w-20 h-20 rounded-xl flex justify-center items-center">
              <img src={lainnyaIcon} className="w-16" alt="" />
            </div>
            <p className="text-[#F6B17A] font-semibold mt-1">Lainnya</p>
          </div>
        </div>
      </div>

      <div className="">
        <p className="text-[#2D3250] font-semibold mt-5">Toko Terdekat</p>
        <div className="mt-4 flex flex-col gap-3">
          {sellers.map(seller => (
            // <Link key={seller.id} to={`/seller/${seller.id}`} >
            <div className="no-underline" key={seller.id} onClick={() => navigate(`/seller/${seller.id}`)}>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-black rounded-2xl overflow-hidden">
                  img
                </div>
                <div className="ml-3">
                  <p className="text-[#2D3256] font-semibold">{seller.sellerName}</p>
                  <p className="text-[#7077A1] text-sm">{seller.alamat}</p>
                  <p className="text-sm">4.9</p>
                </div>
              </div>
            </div>
            // </Link>
          ))}
        </div>
      </div>



      <div className="hidden">
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
      </div>
    </Main>
  )
}

export default Home