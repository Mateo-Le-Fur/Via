import "./NotFound.scss"
import img from "../../assets/images/not-found.svg";
import {Link} from "react-router-dom";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <main className='notFound'>
       <div>
        <img src={img} alt="404" />
        <h3>Nous n'avons pas trouver la page que vous recherchez </h3>
        <Link to="/">Retour à la page d'accueil</Link>
      </div>
    </main>
  )
}
export default NotFound