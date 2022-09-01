import "./Landing.scss";
import Map from "../../components/Map/Map"
import LandingForm from "./LandingForm"
import "./Landing.scss";
import Banner from "./Banner";
import { useEffect } from "react";

const Landing = () => {

  useEffect(() => {
    EventSource.close()
  
  
  }, [])
  
  
  return (
    <div className='landing'>
      <Map zoom={13} center={[48.86, 2.33]} blur={true} />
      <LandingForm />
      <Banner />
    </div>
  )
}
export default Landing