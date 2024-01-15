/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { auth, db, googleProvider } from '../../config/firebase'
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from "firebase/firestore"
import '../../assets/styles/login.css'
import images from '../../assets/img/Image'
import InputButton from "../../components/InputButton"
import Button from "../../components/Button"
const { emailIcon, passwordIcon, viewDisable, googleIcon } = images


const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const userCollectionRef = collection(db, "user")

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/')
    }
  }, [])

  const register = async (event) => {
    event.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  const login = async (event) => {
    event.preventDefault()
    try {
      const data = await signInWithEmailAndPassword(auth, email, password)
      const dataUser = await getDocs(userCollectionRef)
      const userFiltered = dataUser?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find((item) => item.userId === data.user.uid)
      if (userFiltered) {
        if (userFiltered.role === 'driver') navigate('/driver')
        if (userFiltered.role === 'seller') navigate('/seller/dashboard')
        if (userFiltered.role === 'user') navigate('/')
      }
      navigate('/new-user')
    } catch (error) {
      console.error(error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const data = await signInWithRedirect(auth, googleProvider)
      const dataUser = await getDocs(userCollectionRef)
      const userFiltered = dataUser?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find((item) => item.userId === data.user.uid)
      if (userFiltered.role === 'driver') navigate('/driver')
      if (userFiltered.role === 'seller') navigate('/seller/dashboard')
      if (userFiltered.role === 'user') navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="overflow-x-hidden">
      <div className='login-bg w-screen h-96 bg-cover bg-top'>
        <div className="w-screen h-2/3 bg-white absolute bottom-0 rounded-t-3xl">
          <div>
            <h1 className="text-center text-[#2D3250] font-semibold mt-7 -mb-2">welcome</h1>
            <p className="text-center text-[#A5A7B3] font-light text-[12px] mb-5">Ayo mulai dengan memasukkan nomor telepon</p>
          </div>
          <InputButton
            icon={emailIcon}
            placeholder='Email'
            marginTop='5'
            setInput={setEmail}
            type={'email'}
          />
          <InputButton
            icon={passwordIcon}
            placeholder='Password'
            buttonIcon={viewDisable}
            marginTop='5'
            setInput={setPassword}
            type={'password'}
          />

          <div className="grid mx-6 mt-5 relative">
            <button className="h-14 rounded-3xl border-none bg-[#F6B17A] text-white"
              onClick={login}
            >
              Continue
            </button>
          </div>

          <div className="divider mx-6">
            <p className="text-sm text-[#838383]" >or with</p>
          </div>

          <Button onClick={signInWithGoogle} icon={googleIcon}>
            Google
          </Button>

        </div>
      </div>







      <div className="hidden">
        register
        <form onSubmit={register}>
          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email..."
          />
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password..."
          />
          <button type="submit">Login</button>
        </form>
        login
        <form onSubmit={login}>
          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email..."
          />
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password..."
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={signInWithGoogle}>Login with Google</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default Auth