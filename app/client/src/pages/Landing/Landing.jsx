import "./Landing.scss";
import Map from "../../components/Map/Map"
import LandingForm from "./LandingForm"
import "./Landing.scss";
import Banner from "./Banner";

const Landing = () => {
  return (
    <div className='landing'>
      <Map zoom={13} center={[48.86, 2.33]} blur={true} doubleClickZoom={false} scrollWheelZoom={false} dragging={true} />
      <LandingForm />
      <Banner />
    </div>
  )
}
export default Landing