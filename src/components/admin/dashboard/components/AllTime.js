import React, { useEffect, useMemo, useState } from 'react';
import StatsCounter from './StatsCounter';


const AllTime = (props) => {
  const counts = props.hospitalStats

  return (
    <>


      <div className="row">
        <h4 className="third-heading db-heading">All time stats for Prisoners treatment</h4>
        <div className='cards-wraper-3'>

          <div className="card-simple  card-animate green-light animation-left"
          onClick={() => {
            props.handleCardClick('hospital', { 
              type: 2, 
              duration: 0
            });
          }}
          style={{ cursor: 'pointer' }}
          >
            <StatsCounter icon={'icon-hospital'} title={'TOTAL IPD PATIENTS'} href={"hospital/ipd-admission"} topCounter={18.24} counter={counts?.totalIpd} />
          </div>

          <div className="card-simple  card-animate blue-dark animation-left"
          onClick={() => {
            props.handleCardClick('hospital', { 
              type: 1, 
              duration: 0
            });
          }}
          style={{ cursor: 'pointer' }}
          >
            <StatsCounter icon={'icon-hospital'} title={'TOTAL OPD PATIENTS'} href={"hospital/opd-admission"} topCounter={18.24} counter={counts?.totalOpd} />
          </div>

          <div className="card-simple  card-animate red-light animation-left"
          onClick={() => {
            props.handleCardClick('hospital', { 
              type: 3, 
              duration: 0
            });
          }}
          style={{ cursor: 'pointer' }}
          >
            <StatsCounter icon={'icon-hospital'} title={'TOTAL OUTSIDE HOSPITAL'} href={"hospital/outside-admission"} topCounter={18.24} counter={counts?.totalOutsideHospital} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTime;
