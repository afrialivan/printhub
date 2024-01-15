/* eslint-disable react/prop-types */
import Navbar from '../../components/Navbar'

const Main = ({ children, title }) => {
  return (
    <div className='overflow-x-hidden bg-white text-black px-5 mt-3 relative'>
      { children }
      <Navbar title={title} />
    </div>
  )
}

export default Main