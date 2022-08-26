import { useEffect, useState } from 'react';
import './Profile.scss';
import img from "../../assets/images/no-user.png"
import Card from "../Card/Card";
import {useDispatch, useSelector} from "react-redux"
import { handleHideSuggestionBox, handleShowSuggestionBox } from '../../features/global/globalSlice';
import SuggestionBox from './SeuggestionBox';
import { getUser, reset, updateUser } from '../../features/user/userSlice';

const Profile = ({user}) => {

  const dispatch = useDispatch()
const {isError, message} = useSelector(state => state.user)
const {activities} = useSelector(state => state.activity)
const [filtered, setFiltered] = useState([])
const {user:current} = useSelector(state => state.auth)
const {showSuggestionBox} = useSelector(state => state.global)



useEffect(() => {
   setFiltered(activities.filter(activity => activity.user_id === current.id))
   dispatch(getUser(current.id))
}, [activities, current.id, dispatch])

const [form, setForm] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    phone: user.phone,
    description: user.description
})



useEffect(() => {
  if(message){
    setTimeout(() => {
      dispatch(reset())
    }, 3000)
  }
  
}, [message, dispatch])

const handleChange = (e) => {
    setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
}


// Address

const [address, setAddress] = useState(user.address)
const  [inputAddress, setInputAddress] = useState(user.address);
  const handleChangeAddress = (e) => {
    setInputAddress(e.target.value)
    if(e.target.value.length > 0 ){
      dispatch(handleShowSuggestionBox())
    } else {
      dispatch(handleHideSuggestionBox())
    }
  }

  const handleAddress = (value) => {
    setInputAddress(value)
    setAddress(value)
  }


// Avatar 
const [avatar, setAvatar] = useState("")

const handleAvatar = (e) => {
  const formData = new FormData();
    formData.append('image', e.target.files[0]);
    uploadImage(current.id, formData);
}


async function uploadImage(id, formData) {
  try {
    await fetch(`/api/user/${id}/avatar/`, {
      method: 'POST',
      body: formData,
    });
    getUserAvatar(id, true)
  } catch (error) {
  }
}

  const  getUserAvatar = async (id, uploading) =>  {
    const userAvatar = await fetch(`/api/user/${id}/avatar`, {
      method: 'GET',
    });
    if (userAvatar.ok) {
      if (uploading) {
        setTimeout(() => {
          setAvatar(userAvatar.url)
        }, 1000);
      } else {
        setAvatar(userAvatar.url)
      }
    }
  }

  useEffect(() => {
    const fetchAvatar = async () => {
      const userAvatar = await fetch(`/api/user/${current.id}/avatar`, {
        method: 'GET',
      });

      setAvatar(userAvatar.url)
    }
    
    fetchAvatar()
  }, [current.id])

// submit
const handleSubmit = (e) => {
  e.preventDefault()
  console.log({...form, address})
  console.log(current.id)
  dispatch(updateUser({userId: current.id, userData: {...form, address}}))
}

if(user){


  return (
    <div className='profile'>
      {message && <p className={isError ? 'server-error' : "server-success"} >{message}</p>}
      <form className='editForm' onSubmit={handleSubmit}>
      <div className='avatar'>
        <input type="file" id="avatar"   onChange={handleAvatar}
 name="avatar" />
        <label htmlFor="avatar">
        <img
              src={avatar}
              alt="avatar"
            />
        </label>
      </div>
      <div className="field">
            <input className='field-input' name="firstname" type="text" id="firstname" value={form.firstname} placeholder="Prénom" onChange={handleChange} />
            <label className='field-label' htmlFor="firstname">Prénom</label>
        </div>
         <div className="field">
            <input value={form.lastname} name="lastname" className='field-input' type="text" id="lastname" placeholder='Nom'  onChange={handleChange} />
            <label htmlFor="lastname" className="field-label">Nom</label>
        </div>
        <div className="field field-address">
            <input value={inputAddress}  className='field-input' type="text" id="address" placeholder='Adresse'  onChange={handleChangeAddress} />
            {showSuggestionBox &&    <SuggestionBox inputAddress={inputAddress} handleAddress={handleAddress}/>}
            <label htmlFor="lastname" className="field-label">Adresse</label>
        </div>
        <div className="field">
            <input value={form.phone} name="phone" className='field-input' type="text" id="phone" placeholder='Téléphone'  onChange={handleChange} />
            <label htmlFor="phone" className="field-label">Téléphone</label>
        </div>
        <div className='areaContainer'>
              <textarea onChange={handleChange} value={form.description} name="description" id="description" placeholder='Description'></textarea>
        </div>
        <div className='buttonContainer'>
          <button type="submit" className="btn">Enregistrer</button>
        </div>
      </form>
        <h2>Mes activités</h2>
      <div className="activityList">
      {filtered.length > 0 ? filtered.map(activity => (
        <Card type="profile" activity={activity} key={activity.id}/>
      )): (
        <h2>Vous n'avez pas encore créé d'actvitiés</h2>
      )}
      </div>
    </div>
  );
};
}
export default Profile;
