import { useEffect, useState } from "react"

/* eslint-disable react/prop-types */
const ButtonInput = ({ id, keranjang, decrementButton, incrementButton }) => {
  const [jumlah, setJumlah] = useState(0)
  
  const filtereddata = keranjang?.find((item) => item.productId === id) || 0

  useEffect(() => {
    setJumlah(filtereddata.jumlah || 0)
  }, [filtereddata.jumlah])

  const tambah = () => {
    incrementButton()
    setJumlah(jumlah + 1)
  }

  const kurang = () => {
    decrementButton()
    setJumlah(jumlah - 1)
  }

  return (
    <div>
      <div>
        <button onClick={kurang} className="px-3 py-1 bg-[#7077A1] text-white rounded-l-lg border-t border-b border-l border-r-0">-</button>
        <input
          className="text-center py-1 w-12 border-t border-b border-l-0 border-r-0 text-black"
          value={jumlah}
          type="number"
          disabled
        />
        <button onClick={tambah} className="px-3 py-1 bg-[#7077A1] text-white rounded-r-lg border-t border-b border-r- border-l-0">+</button>
      </div>
    </div>
  )
}

export default ButtonInput