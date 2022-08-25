
import React, { useRef, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { activePanel, handleHideList, handleHideSidebar, handleHideSuggestionBox} from '../features/global/globalSlice';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useClickOuside(ref, component) {
  const dispatch = useDispatch()
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
    
        if(component === "panel" && window.innerWidth > 600){
          dispatch(handleHideSidebar())
          dispatch(activePanel(""))
        }

        if(component === "list" && window.innerWidth > 600){
          dispatch(handleHideList())
        }

        if(component === "suggestion"){
          dispatch(handleHideSuggestionBox())
        }
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, component, dispatch]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideWrapper(props) {
  const wrapperRef = useRef(null);
      useClickOuside(wrapperRef, props.component);


  return <div ref={wrapperRef}>{props.children}</div>;
}