import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import { Link } from "react-router-dom"

const Navbar = () => {
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div>
      {auth.currentUser ?
        <button onClick={logout}>Logout</button>
        :
        <Link to="/login">
          <button>Login</button>
        </Link>
      }
    </div>
  )
}

export default Navbar