import { useEffect,useState } from "react";
//import { useHistory } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";

import { useSelector } from 'react-redux';

function NavigatorValidator() {
  const [isExists,setIsExists] = useState(true);
  //const history = useHistory();
  const navigate = useNavigate();

  const userMeta = useSelector((state) => {
    return state.user;
  });
  const location = useLocation()
  /*
    - DONE:
      - Get logged in usr information
      - if current url is available in routes do nothing
      - else redirect to dashboard
  */
  useEffect(() => {
    if(userMeta?.role && userMeta?.access?.length) {  
      const exists =  userMeta.access.some(item => {
       return item === location.pathname || item.includes('administration/employee-details') || item.includes('prisoner/prisoner-details')
      })
      setIsExists(exists);
    } else if  (userMeta?.role === 'Admin' || userMeta?.role === 'Super Admin' || userMeta?.role === 'Court Production Branch') {
      setIsExists(true)
    } else {
      setIsExists(false)
    }
    
  },[location.pathname])
  return isExists;
}

export default NavigatorValidator;