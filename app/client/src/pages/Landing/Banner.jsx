import logo from "../../assets/images/logo.png"

const Banner = () => {

  return (
    <div className="banner">
      <img src={logo} alt="" />
      <h2 className="tile">A neighbours social application</h2>
    </div>
  )
}

export default Banner