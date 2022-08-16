import "./Landing.scss";
import Map from "../../components/Map/Map"
import LandingForm from "./LandingForm"
import "./Landing.scss";

const Landing = () => {
  
  return (
    <div className='landing'>
      <Map zoom={13} center={[48.86, 2.33]} />
      <LandingForm />
    </div>
  )
}
export default Landing