import { useEffect, useState } from "react"
import axios from "axios";
import { handleHideSuggestionBox } from "../../../features/global/globalSlice";
import { useDispatch } from "react-redux";

const SuggestionBox = ({inputCity, handleCity }) => {

  const dispatch = useDispatch()

  const [suggestions, setSuggestions] = useState([])
  useEffect(() => {
    const queryAPI = async () => {
      const res = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${inputCity}&type=municipality&autocomplete=1`)
      if(res.data.features.length > 0){
        setSuggestions(res.data.features)
      }
    }

    queryAPI()

  }, [inputCity ])

  return (
    <div className="suggestionBox">
      {suggestions.length > 0 &&  suggestions.map(suggestion => (
        <div key={suggestion.properties.label} onClick={() => {
          handleCity(suggestion.properties.label)
          dispatch(handleHideSuggestionBox())
        }}>
          {suggestion.properties.label}
        </div>
      ))}
    </div>
  )
}
export default SuggestionBox