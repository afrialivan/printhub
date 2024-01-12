/* eslint-disable react-hooks/exhaustive-deps */
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import PrivateRoutes from "./utils/privateRoutes/PrivateRoutes"
import Auth from "./containers/pages/Auth"
import Home from "./containers/pages/User/Home"
import Tes from "./containers/pages/Tes"
import NotFound from './containers/pages/NotFound'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import RegisterSeller from './containers/pages/Seller/RegisterSeller'
import Seller from './containers/pages/User/Seller'
import Print from './containers/pages/User/Print'
import { initializeUser } from './reducers/userReducer'
import { auth } from './config/firebase'
import Pesanan from './containers/pages/User/Pesanan'
import Konfirmasi from './containers/pages/Seller/Konfirmasi'
import PesananDetail from './containers/pages/User/PesananDetail'
import DetailPesananUser from './containers/pages/Seller/DetailPesananUser'
import Chat from './containers/pages/Chat'
import Dashboard from './containers/pages/Seller/Dashboard'
import ChatSeller from './containers/pages/Seller/ChatSeller'
import DashboardDriver from './containers/pages/Driver/DashboardDriver'
import ViewOrder from './containers/pages/Driver/ViewOrder'
import NewUser from './containers/pages/NewUser'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (auth) {
      dispatch(initializeUser())
    }
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PrivateRoutes><Home /></PrivateRoutes>
    },
    {
      path: "/login",
      element: <Auth />
    },
    {
      path: "/new-user",
      element: <PrivateRoutes><NewUser /></PrivateRoutes>
    },
    {
      path: "/chat/:room/:id",
      element: <PrivateRoutes><Chat /></PrivateRoutes>
    },
    {
      path: "/seller/chat",
      element: <PrivateRoutes><ChatSeller /></PrivateRoutes>
    },
    {
      path: "/pesanan",
      element: <PrivateRoutes><Pesanan /></PrivateRoutes>
    },
    {
      path: "/pesanan/pesanan-detail/:id",
      element: <PrivateRoutes><PesananDetail /></PrivateRoutes>
    },
    {
      path: "/seller/konfirmasi",
      element: <PrivateRoutes><Konfirmasi /></PrivateRoutes>
    },
    {
      path: "/seller/pesanan/:id",
      element: <PrivateRoutes><DetailPesananUser /></PrivateRoutes>
    },
    {
      path: "/seller/dashboard",
      element: <PrivateRoutes><Dashboard /></PrivateRoutes>
    },
    {
      path: "/tes",
      element: <PrivateRoutes><Tes /></PrivateRoutes>
    },
    {
      path: "/driver",
      element: <PrivateRoutes><DashboardDriver /></PrivateRoutes>
    },
    {
      path: "/driver/dashboard/toko/:id",
      element: <PrivateRoutes><ViewOrder /></PrivateRoutes>
    },
    {
      path: "/seller/:id",
      element: <PrivateRoutes><Seller /></PrivateRoutes>
    },
    {
      path: "/seller/print/:id",
      element: <PrivateRoutes><Print /></PrivateRoutes>
    },
    {
      path: "/register-seller",
      element: <RegisterSeller />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ])

  return (
    <AuthContext>
      <RouterProvider router={router} />
    </AuthContext>
  )
}

export default App