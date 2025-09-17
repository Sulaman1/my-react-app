/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useRef, useEffect } from 'react';
const Button = ({icon = '',classes='btn btn-secondary',label='Generic Button',handleClick,...props}) => {
    return (
           <button
            id={props.id}
            type="button"
            onClick={handleClick}
            className={classes}
          >
            {icon && <i className={icon}></i>}
            {label && <span>{label}</span>}
          </button>
    );
};

export default Button;

