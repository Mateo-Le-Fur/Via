import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import "./Map.scss";

const Map = ({center, markers, zoom, zoomControl}) => {
  return (
    <MapContainer center={center} zoomControl={false} zoom={zoom} scrollWheelZoom={true} attributionControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zoomControl && <ZoomControl position="bottomLeft"/>}
        {markers && markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.long]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        ))}
      </MapContainer>
  )
}
export default Map