import React from 'react';
import StatsCounter from './StatsCounter';
const DailyCount = (props) => {
    const counts = props?.hospitalStats
    return (
        <>
            <div className="row">

                <h4 className="third-heading db-heading">Daily count for Prisoner Treatment</h4>

                <div className='cards-wraper-3'>

                    <div className="card-simple  card-animate green-light text-success animation-left"
                    onClick={() => {
                        props.handleCardClick('hospital', { 
                          type: 2, 
                          duration: 1
                        }); 
                      }}
                      style={{ cursor: 'pointer' }}
                    >   
                        <StatsCounter icon={'icon-hospital'} href={"hospital/ipd-admission"} title={"TODAY'S IPD PATIENTS"} topCounter={18.24} counter={counts?.totalTodayIpd} />
                    </div>

                    <div className="card-simple  card-animate blue-dark text-info animation-left"
                    onClick={() => {
                        props.handleCardClick('hospital', { 
                          type: 1, 
                          duration: 1
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-hospital'} href={"hospital/opd-admission"} title={"TODAY'S OPD PATIENTS"} topCounter={18.24} counter={counts?.totalTodayOpd} />
                    </div>

                    <div className="card-simple  card-animate red-light text-warning animation-left"
                    onClick={() => {
                        props.handleCardClick('hospital', { 
                          type: 3, 
                          duration: 1
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-hospital'} href={"hospital/outside-admission"} title={"TODAY'S OUTSIDE HOSPITAL PATIENTS"} topCounter={18.24} counter={counts?.totalTodayOutsideHospital} />
                    </div>

                </div>
            </div>
        </>
    );
};

export default DailyCount;
