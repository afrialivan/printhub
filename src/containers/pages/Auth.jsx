import { useState } from "react"
import { auth, db, googleProvider } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from "firebase/firestore"

const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const userCollectionRef = collection(db, "user")

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
      const data = await signInWithPopup(auth, googleProvider)
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
    <div>
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
  )
}

export default Auth