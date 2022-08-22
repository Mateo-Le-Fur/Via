import "./List.scss";
import {FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { handleHideList, handleShowList } from '../../../features/global/globalSlice';
import Card from '../../../components/Card/Card';


const List = () => {
    const dispatch = useDispatch()
    const {showList} = useSelector(state => state.global)
  return (
    <div className={showList ? "list showList" : "list"}>

        {showList ? (
            <div className='chevron' onClick={() => dispatch(handleHideList())}>
            <FaChevronDown className="chevronIcon"/>
        </div>
        ) : (
            <div className='chevron' onClick={() => dispatch(handleShowList())}>
            <FaChevronUp className="chevronIcon"/>
        </div>
        )}
        
        <div className="wrapper">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
    </div>
  )
}
export default List