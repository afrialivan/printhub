/* eslint-disable react/prop-types */
import Navbar from '../../components/Navbar'

const Main = ({ children }) => {
  return (
    <>
      <Navbar />
      { children }
    </>
  )
}

export default Main