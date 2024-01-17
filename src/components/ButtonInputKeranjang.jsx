import { useState } from "react"

/* eslint-disable react/prop-types */
const ButtonInputKeranjang = ({ keranjang, decrementButton, incrementButton }) => {
  const [jumlah, setJumlah] = useState(keranjang.jumlah)

  const tambah = () => {
    incrementButton()
    setJumlah(jumlah + 1)
  }

  const kurang = () => {
    decrementButton()
    setJumlah(jumlah - 1)
  }

  return (
    <>
      <button onClick={kurang} className="px-2 bg-white border-none">-</button>
      <p className="text-center w-7">{jumlah}</p>
      <button onClick={tambah} className="px-2 bg-white border-none">+</button>
    </>
  )
}

export default ButtonInputKeranjang