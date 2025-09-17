import React, { useEffect, useMemo, useState } from 'react';

import InputWidget from '../../droppables/InputWidget';




const HelpSection = props => {


    return (
        <>


            <div className="row mt-5">
            
                <form className='col-lg-12 d-flex '>
                <div className='col-lg-12'>
                <div className='card p-4'>
                <h2 className='text-left py-2 px-0'><span>Help</span></h2>
                <div>
                <h4 className='text-left py-2 px-0'><span>1 Account</span></h4>
                <p className='text-left px-2'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                </div>
                <div>
                <h4 className='text-left py-2 px-0'><span>2 Account</span></h4>
                <p className='text-left px-2'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                </div>
                <div>
                <h4 className='text-left py-2 px-0'><span>3 Account</span></h4>
                <p className='text-left px-2'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                </div>
                </div>
                </div>
</form>
            
            </div>
           
        </>
    );
};

export default HelpSection;
