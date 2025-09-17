import React, { useEffect, useMemo, useState } from 'react';
import StatsCounter from './StatsCounter';


const AllTimeGuests = (props) => {
    const counts = props.daily

    return (
        <>


            <div className="row">
                <h4 className="third-heading db-heading">All time stats for Official Guests</h4>
                <div className='cards-wraper-3'>

                    <div className="card-simple  card-animate green-light animation-left"
                    onClick={() => {
                        props.handleCardClick('guest', { 
                          duration: 1
                        });
                      }}
                      style={{ cursor: 'pointer' }} 
                    >
                        <StatsCounter icon={'fas fa-calendar-check'} title={'TODAYS guests'} href={"#"} topCounter={18.24} counter={counts?.todayGuests} />
                    </div>

                    <div className="card-simple  card-animate blue-dark animation-left"
                    onClick={() => {
                        props.handleCardClick('guest', { 
                          duration: 2
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'fas fa-calendar-week'} title={'THIS WEEK GUESTS'} href={"#"} topCounter={18.24} counter={counts?.thisWeekGuests} />
                    </div>

                    <div className="card-simple  card-animate red-light animation-left"
                    onClick={() => {
                        props.handleCardClick('guest', { 
                          duration: 3
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'fas fa-calendar-alt'} title={'THIS MONTH GUESTS'} href={"#"} topCounter={18.24} counter={counts?.thisMonthGuests} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllTimeGuests;
