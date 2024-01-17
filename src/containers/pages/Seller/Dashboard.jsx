import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../../config/firebase"
import Default from "../../templates/Default"
import images from "../../../assets/img/Image"
const { avatar } = images

const Dashboard = () => {
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error(err)
    }
  }


  return (
    <Default>
      <div className="flex justify-between items-center pt-2">
        <div>
          <p className="text-[#2D3250] font-medium -mb-1">Hiii Seller</p>
          <p className="text-[#F6B17A] text-sm">Bagaimana keadaanmu sekarang?</p>
        </div>
        <details className="dropdown bg-transparent">
          <summary className="m-1 btn bg-transparent shadow-none">
            <div className="w-12 h-12 rounded-full bg-[#2D3250] ring-2 border-[#2D3250] overflow-hidden block">
              <img src={avatar} alt="" className="m-auto w-full" />
            </div>
          </summary>
          <ul className="p-2 mt-1 shadow menu bg-white dropdown-content z-[1] rounded-box w-20">
            <li>
              <div onClick={logout} >Logout</div>
            </li>
          </ul>
        </details>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => navigate('/seller/konfirmasi')} className="flex justify-center items-center bg-[#7077A1] w-full h-32 rounded-xl px-3 box-border">
          <p className="text-center text-white font-semibold text-lg">Konfirmasi Pesanan</p>
        </div>
        <div onClick={() => navigate('/seller/chat')} className="flex justify-center items-center bg-[#7077A1] w-full h-32 rounded-xl px-3 box-border">
          <p className="text-center text-white font-semibold text-xl">Chat</p>
        </div>
        <div onClick={() => navigate('/seller/product')} className="flex justify-center items-center bg-[#7077A1] w-full h-32 rounded-xl px-3 box-border">
          <p className="text-center text-white font-semibold text-lg">Produk</p>
        </div>
        <div onClick={() => navigate('/seller/history-pesanan')} className="flex justify-center items-center bg-[#7077A1] w-full h-32 rounded-xl px-3 box-border">
          <p className="text-center text-white font-semibold text-lg">History Pesanan</p>
        </div>
      </div>
    </Default>
  )
}

export default Dashboard