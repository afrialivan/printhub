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
import Map from './containers/pages/User/Map'
import Keranjang from './containers/pages/User/Keranjang'
import ChatList from './containers/pages/User/ChatList'
import Product from './containers/pages/Seller/Product'

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
      path: "/chat-list",
      element: <PrivateRoutes><ChatList /></PrivateRoutes>
    },
    {
      path: "/chat",
      element: <PrivateRoutes><Chat /></PrivateRoutes>
    },
    {
      path: "/seller/chat",
      element: <PrivateRoutes><ChatSeller /></PrivateRoutes>
    },
    {
      path: "/toko/map",
      element: <PrivateRoutes><Map /></PrivateRoutes>
    },
    {
      path: "/pesanan",
      element: <PrivateRoutes><Pesanan /></PrivateRoutes>
    },
    {
      path: "/pesanan/detail",
      element: <PrivateRoutes><PesananDetail /></PrivateRoutes>
    },
    {
      path: "/seller/product",
      element: <PrivateRoutes><Product /></PrivateRoutes>
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
      path: "/driver/dashboard/toko",
      element: <PrivateRoutes><ViewOrder /></PrivateRoutes>
    },
    {
      path: "/toko/:id",
      element: <PrivateRoutes><Seller /></PrivateRoutes>
    },
    {
      path: "/toko/print",
      element: <PrivateRoutes><Print /></PrivateRoutes>
    },
    {
      path: "/toko/keranjang",
      element: <PrivateRoutes><Keranjang /></PrivateRoutes>
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