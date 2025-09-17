/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useRef, useEffect } from 'react';
import Logo from '../assets/images/1.png';

const Loader2 = props => {


    return (
        <>
            <div className="loading-overlay">
            <div class="loader align-center d-flex gap-2">
                <b>Please wait...</b>
                <div class="lds-ring">
                    <div>
                    </div>
                    <div>
                    </div>
                    <div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
            </div>
            
        </>
    );
};

export default Loader2;

