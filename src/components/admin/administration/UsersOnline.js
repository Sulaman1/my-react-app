import React, { useEffect, useMemo, useState } from 'react';

import { Grid } from 'gridjs-react';



const UsersOnline = props => {


    return (
        <>


<div className="row gridjs">
<div class="row flex">
  <h4 class="third-heading  just-space"><span>Users Online</span></h4>
  </div>


                            <div className="col-xl-12">
                                <div className="card">
                                  
                                    <div className="card-body">
                                        <div className="card custom-card animation-fade-grids custom-card-scroll">
                                        <div className='row '>
                    <div className='col' style={{ }}>
                        <Grid
                            data={[
                                ['1', 'Name', 'Home Department', 'Branch' ],
                                ['2', 'Name', 'Inspector General Prisons', 'Branch'],
                                ['3', 'Name', 'DIG HQ', 'Branch'],
                                ['4', 'Name', 'DIG Prisons'],
                                ['5', 'Name', 'Prison Superintendent', 'Branch'],
                                ['1', 'Name', 'Home Department', 'Branch'],
                                ['2', 'Name', 'Inspector General Prisons', 'Branch'],
                                ['3', 'Name', 'DIG HQ', 'Branch'],
                                ['4', 'Name', 'DIG Prisons'],
                                ['5', 'Name', 'Prison Superintendent', 'Branch']
                               
                            ]}
                            columns={['Sr.No', 'User Name', 'Prison', 'Branch']}
                            search={true}
                          
                            pagination={{
                                enabled: true,
                                limit:3,
                            }}
                        />
                    </div>
                </div>
                                       
                                        </div>
                                     
                                    </div>
                                </div>
                            </div>
                        </div>
        </>
    );
};

export default UsersOnline;
