import InputUpdateHarga from "./InputUpdateHarga"

/* eslint-disable react/prop-types */
const ListKonfirmasi = ({ dataOrder, orderList }) => {
  return (
    <div>
      <div>
        {'total harga Rp' + dataOrder.total}
      </div>
      {dataOrder.keranjang.map((data) =>
        <InputUpdateHarga key={data.id} data={data} id={dataOrder.id} orderList={orderList} />
      )}
    </div>
  )
}

export default ListKonfirmasi