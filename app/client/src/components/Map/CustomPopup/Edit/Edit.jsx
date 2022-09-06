import "./Edit.scss";
import {
  HiLocationMarker,
  HiCalendar,
} from 'react-icons/hi';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateActivity } from "../../../../features/activity/activitySlice";

const Edit = ({ activity, type }) => {

  const dispatch = useDispatch()

  // Update form
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: ""
  }
  );
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Date
  var now = new Date();
  var day = ('0' + now.getDate()).slice(-2);
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + '-' + month + '-' + day;
  const [date, setDate] = useState(today)

  const handleDate = (e) => {
    setDate(e.target.value)
  }

  // submit
  const handleUpdate = () => {
    const object = {
      name: form.name ? form.name : activity.name,
      description: form.description ? form.description : activity.description,
      address: form.address ? form.address : activity.address,
      date: date ? date : activity.date,
    }
    dispatch(updateActivity({ activityId: activity.id, activityData: { ...object, type } }))
  }

  return (
    <div className='editContainer'>
      <div className='activityHeader'>
        <input
          name='name'
          onChange={handleChange}
          defaultValue={activity.name}
        />
      </div>
      <div className='dateContainer'>
        <HiCalendar className='smIcon' />
        <input type='date' onChange={handleDate} />
      </div>
      <div className='locationContainer'>
        <HiLocationMarker className='smIcon' />
        <input
          name='address'
          onChange={handleChange}
          defaultValue={activity.address}
        />
      </div>
      <div className='descriptionContainer'>
        <textarea
          name='description'
          id='description'
          onChange={handleChange}
          defaultValue={activity.description}
        >
        </textarea>
      </div>
      <div className='buttonContainer'>
        <button type='submit' className='btn' onClick={handleUpdate}>
          Enregistrer
        </button>
      </div>
    </div>
  )
}
export default Edit