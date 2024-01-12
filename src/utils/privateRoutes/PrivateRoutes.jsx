/* eslint-disable react/prop-types */
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { Context } from "../../context/AuthContext"

const PrivateRoutes = ({ children }) => {
  const { user } = useContext(Context)

  if (!user) {
    return <Navigate to="/login" replace />
  } else {
    return children
  }
}



export default PrivateRoutes