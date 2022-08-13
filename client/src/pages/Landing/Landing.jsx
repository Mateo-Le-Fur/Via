import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './Landing.scss';

const Landing = () => {
  const center = [51.505, -0.09];
  const positions = [
    [51.505, -0.09],
    [51.33, -0.08],
    [51.23, -0.098],
    [51.13, -0.038],
    [51.33, -0.082],
    [51.23, -0.028],
    [51.63, -0.068],
  ];
  return (
    <div className='landing'>
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} attributionControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {positions.map((position, index) => (
          <Marker key={index} position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
export default Landing;
