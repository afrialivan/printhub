import { useState } from "react"

const RegisterSeller = () => {
  const [sellerName, setSellerName] = useState()
  const [alamat, setAlamat] = useState()
  const [atk, setAtk] = useState(false)
  const [print, setPrint] = useState(true)

  

  return (
    <div>
      <input type="text" placeholder="seller name" onChange={(e) => setSellerName(e.target.value)} />
      <input type="text" placeholder="alamat" onChange={(e) => setAlamat(e.target.value)} />
      <input type="text" placeholder="deskripsi" onChange={(e) => setAlamat(e.target.value)} />
      atk
      <input type="checkbox" onClick={() => setAtk(!atk)} />
      print
      <input type="checkbox" onClick={() => setPrint(!print)} />

    </div>
  )
}

export default RegisterSeller