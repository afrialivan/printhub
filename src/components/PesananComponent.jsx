import { useNavigate } from "react-router-dom"

/* eslint-disable react/prop-types */
const PesananComponent = ({ orderList, aktif }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3 mt-5">
      {orderList.map((item) =>
        <div key={item.id} className="bg-[#7077A1] rounded-lg px-4 py-2" onClick={() => navigate('/pesanan/detail', { state: { order: JSON.stringify(item) } })}>
          <p className="text-white font-medium text-center">Rincian Pesanan</p>
          <div>
            <div className="mb-3">
              <p className="text-white">{item.namaSeller} {`>`}</p>
            </div>
            <div className="flex justify-between">
              <div className="flex">
                <div className="w-20 h-20 bg-black rounded-lg">
                  img
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium text-lg">{item.keranjang[0].nama}</p>
                  <p className="text-white">Rp.{item.keranjang[0].harga}</p>
                  <p className="text-white">status: {aktif}</p>
                </div>
              </div>
              <div>
                <p className="text-white text-lg">x2</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-white text-xl font-semibold -mb-1">Rp.{item.total}</p>
              <p className="text-sm text-white">Nomor invoice: {item.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PesananComponent