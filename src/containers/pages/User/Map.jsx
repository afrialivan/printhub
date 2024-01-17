import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import osm from "../../../utils/osm-providers";
import { Link, useLocation } from "react-router-dom"
import Default from "../../templates/Default";
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

const Map = () => {
  const location = useLocation()
  const seller = JSON.parse(location.state.seller)

  const center = { lat: -5.198196, lng: 119.454078 }
  const ZOOM_LEVEL = 30
  const mapRef = useRef()

  // const getLocation = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords
  //     setLat(latitude)
  //     setLng(longitude)
  //     setCenter({ lat: latitude, lng: longitude })
  //   })
  // }

  return (
    <Default>
      <p className="text-lg text-center text-[#2D3256] font-semibold mb-5">Lokasi {seller.sellerName}</p>


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
            <b>{seller.sellerName}</b>
          </Popup>
        </Marker>
      </MapContainer >

      <p className='mt-3 font-medium'>Alamat: {seller.alamat}</p>


      <div className="fixed top-3 left-3 z-20">
        <Link to={`/toko/${seller.id}`}>
          <img src={backIcon} alt="" />
        </Link>
      </div>
    </Default>
  )
}

export default Map