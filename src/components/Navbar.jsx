/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'
import images from '../assets/img/Image'

const Navbar = ({ title }) => {
  const navigate = useNavigate()
  const { homeNav, chatNav, pesananNav } = images
  const aktif = () => {
    if (title === 'Pesanan') return 'right-0' 
    if (title === 'Home') return 'left-0' 
    return 
  }

  return (
    <div className="fixed flex justify-around items-center bottom-5 rounded-3xl left-2 right-2 h-16 bg-[#7077A1]">
      <div className={`absolute w-2/6 h-16 bg-[#F6B17A] ${aktif()} rounded-3xl -z-0`}></div>
      <div className='flex items-center flex-col z-20' onClick={() => navigate('/')}>
        <img src={homeNav} className='w-6' alt="" />
        <p className='font-medium text-white -mt-2'>Beranda</p>
      </div>
      <div className='flex items-center flex-col z-20' onClick={() => navigate('/chat-list')}>
        <img src={chatNav} className='w-7' alt="" />
        <p className='font-medium text-white -mt-0'>Obrolan</p>
      </div>
      <div className='flex items-center flex-col z-20' onClick={() => navigate('/pesanan')}>
        <img src={pesananNav} className='w-7' alt="" />
        <p className='font-medium text-white -mt-1'>Pesanan</p>
      </div>
    </div>
  )
}

export default Navbar