import React, { useEffect, useMemo, useState } from 'react';
import StatsCounter from './StatsCounter';


const MedicineCards = (props) => {
    const counts = props.medicine

    return (
        <>


            <div className="row">
                <h4 className="third-heading db-heading">Medicines Stats</h4>
                <div className='cards-wraper-3'>

                    <div className="card-simple  card-animate green-light animation-left">
                        
                        <StatsCounter icon={'fas fa-calendar-check'} title={'Medicine Expiring TODAY'} href={"#"} topCounter={18.24} counter={counts?.medicineExpiringToday} />
                    </div>

                    <div className="card-simple  card-animate blue-dark animation-left">
                        <StatsCounter icon={'fas fa-calendar-week'} title={'Medicine Expiring THIS WEEK'} href={"#"} topCounter={18.24} counter={counts?.medicineExpiringWeek} />
                    </div>

                    <div className="card-simple  card-animate red-light animation-left">
                        <StatsCounter icon={'fas fa-calendar-alt'} title={'Medicine Expiring THIS MONTH'} href={"#"} topCounter={18.24} counter={counts?.medicineExpiringMonth} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MedicineCards;
