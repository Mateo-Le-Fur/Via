import { useEffect, useState } from "react";
import "./Profile.scss";
import img from "../../assets/images/no-user.png";
import Card from "../Card/Card";
import { useDispatch, useSelector } from "react-redux";
import {
  handleHideSuggestionBox,
  handleShowSuggestionBox,
} from "../../features/global/globalSlice";
import SuggestionBox from "./SeuggestionBox";
import { reset, updateUser } from "../../features/user/userSlice";

const Profile = () => {
  const { isError, message } = useSelector((state) => state.user);
  const { activities } = useSelector((state) => state.activity);
  const [filtered, setFiltered] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { showSuggestionBox } = useSelector((state) => state.global);

  useEffect(() => {
    setFiltered(activities.filter((activity) => activity.user_id === user.id));
  }, [activities, user.id]);

  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(reset());
      }, 3000);
    }
  }, [message, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Address

  const [address, setAddress] = useState("");
  const [inputAddress, setInputAddress] = useState("");
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

  // Avatar
  const [avatar, setAvatar] = useState("");

  getUserAvatar(user.id);

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
    } catch (error) {}
  }

  async function getUserAvatar(id) {
    const userAvatar = await fetch(`/api/user/${id}/avatar`, {
      method: "GET",
    });
    if (userAvatar.ok) {
      setTimeout(() => {
        setAvatar(userAvatar.url);
      }, 1000);
    }
  }

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, address });
    console.log(user.id);
    dispatch(updateUser({ userId: user.id, userData: { ...form, address } }));
  };

  return (
    <div className="profile">
      {isError && message && <p className="server-error">{message}</p>}
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
        </div>
        <div
          className={
            form.firstname.length > 0 ? "field field--has-content" : "field"
          }
        >
          <input
            className="field-input"
            name="firstname"
            type="text"
            id="firstname"
            value={form.nickname}
            placeholder="Prénom"
            onChange={handleChange}
          />
          <label className="field-label" htmlFor="firstname">
            Prénom
          </label>
        </div>
        <div
          className={
            form.lastname.length > 0 ? "field field--has-content" : "field"
          }
        >
          <input
            value={form.lastname}
            name="lastname"
            className="field-input"
            type="text"
            id="lastname"
            placeholder="Nom"
            onChange={handleChange}
          />
          <label htmlFor="lastname" className="field-label">
            Nom
          </label>
        </div>
        <div
          className={
            inputAddress.length > 0
              ? "field field--has-content field-address"
              : "field field-address"
          }
        >
          <input
            value={inputAddress}
            className="field-input"
            type="text"
            id="address"
            placeholder="Adresse"
            onChange={handleChangeAddress}
          />
          {showSuggestionBox && (
            <SuggestionBox
              inputAddress={inputAddress}
              handleAddress={handleAddress}
            />
          )}
          <label htmlFor="lastname" className="field-label">
            Adresse
          </label>
        </div>
        <div
          className={
            form.phone.length > 0 ? "field field--has-content" : "field"
          }
        >
          <input
            value={form.phone}
            name="phone"
            className="field-input"
            type="text"
            id="phone"
            placeholder="Téléphone"
            onChange={handleChange}
          />
          <label htmlFor="phone" className="field-label">
            Téléphone
          </label>
        </div>
        <div className="areaContainer">
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
          <h2>Vous n'avez pas encore créé d'actvitiés</h2>
        )}
      </div>
    </div>
  );
};

export default Profile;
