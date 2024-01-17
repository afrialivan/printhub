/* eslint-disable react/prop-types */
import Navbar from '../../components/Navbar'

const Main = ({ children, title }) => {
  return (
    <div className='overflow-x-hidden bg-white text-black px-5 pt-3 pb-24 relative min-h-screen'>
      { children }
      <Navbar title={title} />
    </div>
  )
}

export default Main