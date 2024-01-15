import { useLocation } from "react-router-dom"

const Map = () => {
  const location = useLocation()
  console.log(JSON.parse(location.state.seller));

  return (
    <div>Map</div>
  )
}

export default Map