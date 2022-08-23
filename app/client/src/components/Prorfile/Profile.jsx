import { useState } from 'react';
import './Profile.scss';

const Profile = () => {
//   const [form, setForm] = useState({
//     nickname: '',
//     email: '',
//   });

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };


const [nickname, setName] = useState("")
const [email, setEmail] = useState('')
  return (
    <div className='profile'>
      <h2>Mes informations</h2>
      <form className='editForm'>
      <div className="field">
            <input className='field-input' type="text" id="nickname" value={nickname} placeholder="Pseudo" onChange={(e) => setName(e.target.value)} />
            <label className='field-label' htmlFor="nickname">Nickname</label>
        </div>
         <div  className="field">
            <input value={email} className='field-input' type="text" id="email" placeholder='Email'  onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="email" className="field-label">Email</label>
        </div>

      </form>
    </div>
  );
};
export default Profile;
