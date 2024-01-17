/* eslint-disable react-hooks/exhaustive-deps */
import { doc, updateDoc } from "firebase/firestore"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { auth, db } from "../../../config/firebase"
import Default from "../../templates/Default"
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import osm from "../../../utils/osm-providers";
import images from "../../../assets/img/Image";
import { useRef } from "react";
import L from 'leaflet'
import '../../../assets/styles/map.css'
import 'leaflet/dist/leaflet.css'
const { backIcon, marker } = images

const markerIcon = new L.Icon({
  iconUrl: marker,
  iconSize: [35, 45],
  iconAnchor: [17, 45], //left/right, top/bottom
  popupAnchor: [0, -46]
})

const ViewOrder = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const order = JSON.parse(location?.state?.order)
  // const seller = JSON.parse(location.state.seller)

  const center = { lat: -5.198196, lng: 119.454078 }
  const ZOOM_LEVEL = 30
  const mapRef = useRef()

  const ambilOrderan = async () => {
    const orderDoc = doc(db, "order", order.id)
    const updateData = {
      ...order,
      status: 'dikirim',
      driverId: auth.currentUser.uid
    }
    await updateDoc(orderDoc, updateData)
    navigate('/driver')
  }

  return (
    <Default>
      <p className="text-lg text-center text-[#2D3256] font-semibold">Order Detail</p>

      <div className="mt-4">
        <p>nama toko: {order.namaSeller}</p>
        <p>alamat toko: {order.alamatSeller}</p>
        <p>alamat user: {order.alamatUser}</p>
      </div>

      <div className="divider"></div>

      <div className="mt-4">
        <p className="text-[#2D3250] font-semibold mb-2">Detail Pesanan</p>
        <div className="flex flex-col gap-3">
          {order.keranjang.map((item, i) =>
            <div key={i}>
              <p>nama barang {item.nama}</p>
              <p>jumlah: {item.jumlah}</p>
              <p>total harga: Rp{item.totalHarga}</p>
              <div className="divider"></div>
            </div>
          )}
        </div>
      </div>

      <div>
        {order.status === 'proses' &&
          <div className="grid">
            <button
              className="bg-[#F6B17A] rounded-lg border-none px-3 py-3 text-white font-semibold"
              onClick={ambilOrderan}
            >
              Ambil Orderan
            </button>
          </div>
        }
      </div>

      <p className="text-[#2D3250] font-semibold mb-2">Lokasi Toko</p>

      <div className="divider"></div>

      <MapContainer MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef} >
        <TileLayer
          url={osm.maptiler.url}
          attribution={osm.maptiler.attribution}
        />

        <Marker
          position={[center.lat, center.lng]}
          icon={markerIcon}
        >
          <Popup>
            <b>{order.namaSeller}</b>
          </Popup>
        </Marker>
      </MapContainer >

      <div className="fixed top-3 left-3 z-30">
        <Link to={'/driver'}>
          <img src={backIcon} alt="" />
        </Link>
      </div>

      <div className="hidden">
        {order.status === 'proses' &&
          <div>
            <button onClick={ambilOrderan}>
              Ambil Orderan
            </button>
          </div>
        }
      </div>
    </Default>
  )
}

export default ViewOrder