import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { show } from '../../../store/language';

const ChangeLanguage = props => {
    const dispatch = useDispatch();
    const [isChecked, setIsChecked] = useState(localStorage.getItem('isChecked') === 'true');


    const handleClick = () => {
        dispatch(show());
        const newIsChecked = !isChecked;
        setIsChecked(newIsChecked);
        localStorage.setItem('isChecked', newIsChecked);
    }
    
    return (
        <>
            <div className="d-flex align-items-center">
                <div class="form-check languge-btn form-switch">
                    <input className="form-check-input mt-3"
                    id='language-switch'
                     type="checkbox" 
                     role="switch" 
                     checked={isChecked} 
                     onClick={() => handleClick()} 
                     style={{ width: '2.9rem', height: '1.5rem' }} />
                    <label className="mt-2 p-2">EN/UR </label>
                </div>
            </div>
        </>
    );
};

export default ChangeLanguage;
