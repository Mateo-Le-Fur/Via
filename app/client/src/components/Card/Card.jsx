import './Card.scss';
import { FaGuitar, FaStar} from 'react-icons/fa';
import {
  HiLocationMarker,
  HiCalendar,
  HiSearch,
  HiTrash,
  HiUser,
  HiPencil,
  HiThumbUp
} from 'react-icons/hi';

const Card = () => {
  return (
    <div className='card'>
      <div className='top'>
        <div className='name'>Nom de l'activité</div>
        <div className='type'>
          <FaGuitar className='iconCard' />
        </div>
      </div>
      <div className='middle'>
        <div className='row first'>
          <div>
            {' '}
            <HiUser className='smIcon' /> Créé par <span>John Doe</span>
          </div>
          <div>
            {' '}
            <HiCalendar className='smIcon' /> 20/19/2022
          </div>
        </div>
        <div className='row'>
          <div>
            <HiLocationMarker className='smIcon' />
            12 rue Jeanne D'Arc
          </div>
        </div>
        <main>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque,
          ratione cum nobis necessitatibus asperiores voluptatibus dolor
          suscipit hic. Tempora eos dolores, natus officia facere architecto
          ipsam. Dolorem totam perferendis architecto eum, repellat minus
          delectus saepe deserunt exercitationem tempora ad laboriosam
          cupiditate dolores. Omnis, hic libero vitae cum ipsum provident
          laboriosam perspiciatis error maiores soluta at? Voluptas eius
          distinctio nulla tempore repellat iste porro harum quam libero, hic
          impedit iure quaerat, veritatis, adipisci pariatur saepe! Iusto, a
          beatae qui eius minima sequi id doloribus ut voluptas eveniet
          repellendus atque debitis. Enim!
        </main>
      </div>
      <div className='bottom'>
        <div className='left'>
          <HiSearch className='actionIcon' />
          <HiThumbUp className='actionIcon' />
          <FaStar className='actionIcon' />
        </div>

        <div className='right'>
          <HiPencil className='actionIcon' />
          <HiTrash className='actionIcon' />
        </div>
      </div>
    </div>
  );
};
export default Card;
