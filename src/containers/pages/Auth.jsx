/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { auth, db, googleProvider } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
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
  const [regis, setRegis] = useState(false)
  const navigate = useNavigate()
  const userCollectionRef = collection(db, "user")

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/')
    }
  }, [])

  const register = async (event) => {
    if (!email && !password) return
    event.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/new-user')
    } catch (err) {
      console.error(err)
    }
  }

  const login = async (event) => {
    if (!email && !password) return
    event.preventDefault()
    try {
      const data = await signInWithEmailAndPassword(auth, email, password)
      const dataUser = await getDocs(userCollectionRef)
      const userFiltered = dataUser?.docs?.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })).find((item) => item.userId === data.user.uid)
      if (userFiltered.role == 'driver') navigate('/driver')
      if (userFiltered.role == 'seller') navigate('/seller/dashboard')
      if (userFiltered.role == 'user') navigate('/')
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

  return (
    <div className="overflow-x-hidden">
      <div className='login-bg w-screen h-96 bg-cover bg-top'>
        {regis ?
          <div className="w-screen h-4/5 bg-white absolute bottom-0 rounded-t-3xl">
            <div>
              <h1 className="text-center text-[#2D3250] font-semibold mt-7 -mb-2">Daftar Yuk</h1>
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
              <button className="font-semibold h-14 rounded-3xl border-none bg-[#F6B17A] text-white"
                onClick={register}
              >
                Daftar Sekarang
              </button>
            </div>

            <div className="divider mx-6">
              <p className="text-sm text-[#838383]" >or with</p>
            </div>

            <Button onClick={signInWithGoogle} icon={googleIcon}>
              Google
            </Button>

            <div className="mt-4" onClick={() => setRegis(false)}>
              <p className="text-center text-[#F6B17A] font-medium text-md mb-5">Sudah punya akun? Login Sekarang</p>
            </div>

          </div>
          :
          <div className="pb-3 w-screen h-2/3 bg-white absolute bottom-0 rounded-t-3xl">
            <div>
              <h1 className="text-center text-[#2D3250] font-semibold mt-7 -mb-2">welcome</h1>
              <p className="text-center text-[#A5A7B3] font-light text-[12px] mb-5">Ayo mulai dengan memasukkan email untuk login</p>
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
              <button className="font-semibold h-14 rounded-3xl border-none bg-[#F6B17A] text-white"
                onClick={login}
              >
                Login Sekarang
              </button>
            </div>

            <div className="divider mx-6">
              <p className="text-sm text-[#838383]" >or with</p>
            </div>

            <Button onClick={signInWithGoogle} icon={googleIcon}>
              Google
            </Button>

            <div className="mt-4" onClick={() => setRegis(true)}>
              <p className="text-center text-[#F6B17A] font-medium text-md mb-5">Belum punya akun? Daftar Sekarang</p>
            </div>

          </div>
        }
      </div>
    </div>
  )
}

export default Auth