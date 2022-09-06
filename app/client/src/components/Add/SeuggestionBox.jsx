import { useEffect, useState } from "react"
import axios from "axios";
import { handleHideSuggestionBox } from "../../features/global/globalSlice";
import { useDispatch } from "react-redux";
import { FaArrowRight } from "react-icons/fa"

const SuggestionBox = ({ inputAddress, handleAddress }) => {

  const dispatch = useDispatch()

  const [suggestions, setSuggestions] = useState([])
  useEffect(() => {
    const queryAPI = async () => {
      const res = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${inputAddress}&type=housenumber&autocomplete=1`)
      if (res.data.features.length > 0) {
        setSuggestions(res.data.features)
      }
    }

    queryAPI()

  }, [inputAddress])

  return (
    <div className="suggestionBox">
      {suggestions.length > 0 && suggestions.map(suggestion => (
        <div key={suggestion.properties.label} onClick={() => {
          handleAddress(suggestion.properties.label)
          dispatch(handleHideSuggestionBox())
        }}>
          <FaArrowRight className="arrow" />
          {suggestion.properties.label}
        </div>
      ))}
    </div>
  )
}
export default SuggestionBox