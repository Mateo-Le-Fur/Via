import { useEffect, useState } from "react";
import "./Profile.scss";
import Card from "../Card/Card";
import { RiFileEditFill, } from "react-icons/ri"
import { BsFillTelephoneFill } from "react-icons/bs"
import { HiLocationMarker, HiInformationCircle } from "react-icons/hi"
import { FaCog } from "react-icons/fa"

import { useDispatch, useSelector } from "react-redux";
import {
  handleHideSuggestionBox,
  handleShowSuggestionBox,
} from "../../features/global/globalSlice";
import SuggestionBox from "./SeuggestionBox";
import { deleteAccount, reset, updateUser } from "../../features/auth/authSlice";

const Profile = () => {

  const { activities } = useSelector((state) => state.activity);
  const [filtered, setFiltered] = useState([]);
  const { user, isError, message, isSuccess } = useSelector((state) => state.auth);
  const { showSuggestionBox } = useSelector((state) => state.global);

  useEffect(() => {
    setFiltered(activities.filter((activity) => activity.user_id === user.id));
  }, [activities, user.id]);

  const dispatch = useDispatch();

  // Form 
  const [form, setForm] = useState({
    firstname: user.firstname ? user.firstname : "",
    lastname: user.lastname ? user.lastname : "",
    phone: user.phone ? user.phone : "",
    description: user.description ? user.description : "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Address

  const [address, setAddress] = useState(user.address ? user.address : "");
  const [inputAddress, setInputAddress] = useState(user.address ? user.address : "");

  const handleChangeAddress = (e) => {
    setInputAddress(e.target.value);
    if (e.target.value.length > 0) {
      dispatch(handleShowSuggestionBox());
    } else {
      dispatch(handleHideSuggestionBox());
    }
  };

  const handleAddress = (value) => {
    setInputAddress(value);
    setAddress(value);
  };

  // Avatar upload
  const [avatar, setAvatar] = useState(user.url);

  const handleAvatar = (e) => {
    const formData = new FormData();
    const reader = new FileReader();
    const file = e.target.files[0];
    formData.append("image", file);
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
    uploadImage(user.id, formData);
  };

  async function uploadImage(id, name) {
    try {
      await fetch(`/api/user/${id}/avatar`, {
        method: "POST",
        body: name,
      });
    } catch (error) { }
  }

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, address });
    console.log(user.id);
    dispatch(updateUser({ userId: user.id, userData: { ...form, address } }));
  };

  // Delete account
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(reset());
      }, 3000);
    }
  }, [message, dispatch]);


  if (user) {
    return (
      <div className="profile">
        {isError && message && <p className="server-error">{message}</p>}
        {isSuccess && message && <p className="server-success">{message}</p>}
        <form className="editForm" onSubmit={handleSubmit}>
          <div className="avatar">
            <input
              type="file"
              id="avatar"
              onChange={handleAvatar}
              name="avatar"
            />
            <label htmlFor="avatar">
              <img src={avatar} alt="avatar" />
            </label>
            <div className="cog" onClick={() => setShowDelete(!showDelete)}>
              <FaCog style={{ fill: "white" }} />
            </div>
            {showDelete && (
              <div className="delete" onClick={() => dispatch(deleteAccount(user.id))}>
                Supprimer mon compte
              </div>
            )}
          </div>
          <div className="pseudo">
            {!showDelete && (
              <h2>{user.nickname}</h2>
            )}
          </div>
          <div
            className="profile-field"
          >
            <RiFileEditFill className="smIcon" />
            <input
              className="input-profile"
              name="firstname"
              type="text"
              id="firstname"
              value={form.firstname}
              placeholder="Prénom"
              onChange={handleChange}
            />
          </div>
          <div
            className="profile-field"
          >
            <RiFileEditFill className="smIcon" />
            <input
              value={form.lastname}
              name="lastname"
              className="input-profile"
              type="text"
              id="lastname"
              placeholder="Nom"
              onChange={handleChange}
            />
          </div>
          <div
            className="profile-field"
          >
            <BsFillTelephoneFill className="smIcon" />
            <input
              value={form.phone}
              name="phone"
              className="input-profile"
              type="text"
              id="phone"
              placeholder="Téléphone"
              onChange={handleChange}
            />
          </div>
          <div
            className="profile-field field-address"
          >
            <HiLocationMarker className="smIcon" />
            <input
              value={inputAddress}
              className="input-profile"
              type="text"
              id="address"
              autoComplete="off"
              placeholder="Adresse"
              onChange={handleChangeAddress}
            />
            {showSuggestionBox && (

              <SuggestionBox
                inputAddress={inputAddress}
                handleAddress={handleAddress}
              />
            )}
          </div>
          <div className="areaContainer">
            <HiInformationCircle className="smIcon" />
            <textarea
              onChange={handleChange}
              value={form.description}
              name="description"
              id="description"
              placeholder="Description"
            ></textarea>
          </div>
          <div className="buttonContainer">
            <button type="submit" className="btn">
              Enregistrer
            </button>
          </div>
        </form>
        <h2>Mes activités</h2>
        <div className="activityList">
          {filtered.length > 0 ? (
            filtered.map((activity) => (
              <Card type="profile" activity={activity} key={activity.id} />
            ))
          ) : (
            <p>Vous n'avez pas encore créé d'actvitiés</p>
          )}
        </div>
      </div>
    );
  };
}

export default Profile;
