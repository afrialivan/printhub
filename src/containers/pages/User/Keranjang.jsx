import { useEffect } from "react"
import { getUser } from "../../../services/user"

const Keranjang = () => {

  useEffect(() => {
    const tes = async () => {
      console.log(await getUser())
    }
    tes()
  },)

  return (
    <div className="overflow-x-hidden bg-white text-black px-5 mt-3 relative">
      <p className="text-lg text-center text-[#2D3256] font-semibold">Keranjang</p>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-black rounded-lg">
              img
            </div>
            <div className="pl-3">
              <p className="text-[#2D3256] font-semibold text-lg">Buku Tulis</p>
              <p className="text-[#7077A1] text-md -mt-1 mb-1">Rp.5.000</p>
              {/* <ButtonInput /> */}
            </div>
          </div>
          <div className="flex h-6 border border-solid rounded-xl overflow-hidden">
            <button className="px-2 bg-white border-none">-</button>
            <p className="text-center w-7">0</p>
            <button className="px-2 bg-white border-none">+</button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-black rounded-lg">
              img
            </div>
            <div className="pl-3">
              <p className="text-[#2D3256] font-semibold text-lg">Jasa Print</p>
              <p className="text-[#7077A1] text-md -mt-1 mb-1 w-[150px] text-sm italic font-light leading-4">
                Harga akan ditentukan oleh toko
              </p>
              {/* <ButtonInput /> */}
            </div>
          </div>
          <div className="flex h-6 border border-solid rounded-xl overflow-hidden">
            <button className="px-2 bg-white border-none">View</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 left-4 right-4">
        <button className="w-full py-4 rounded-3xl border-none bg-[#F6B17A] text-white font-semibold ">Pesan</button>
      </div>

    </div>
  )
}

export default Keranjang