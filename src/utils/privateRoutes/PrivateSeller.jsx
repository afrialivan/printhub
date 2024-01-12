/* eslint-disable react/prop-types */
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { Context } from "../../context/AuthContext"

const PrivateSeller = ({ children }) => {
  const { user, role } = useContext(Context)
  console.log(role);
  if (!user || role !== 'seller') {
    return <Navigate to="" replace />
  } else {
    return children
  }
}



export default PrivateSeller