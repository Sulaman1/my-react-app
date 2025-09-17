import React from 'react';
import StatsCounter from './StatsCounter';

const MedicineUsed = (props) => {
    const counts = props.counts;

    return (
        <>
            <div className="row">
                <h4 className="third-heading db-heading">Medicine Issued Today To OPD and IPD</h4>
                <div className='cards-wraper-3'>
                    <div className="card-simple  card-animate green-light text-warning animation-left">
                        <StatsCounter icon={'icon-medical'} href={"#"} title={'Medicine Issued To Employees Today'} topCounter={18.24} counter={counts?.medicineIssuedToEmployeesToday} />
                    </div>

                    <div className="card-simple  card-animate pink-light text-warning animation-left">
                        <StatsCounter icon={'icon-medical'} href={"#"} title={'Medicine Issued To Prisoners Today'} topCounter={18.24} counter={counts?.medicineIssuedToPrisonersToday} />
                    </div>

                    <div className="card-simple  card-animate slate-light text-warning animation-left">
                        <StatsCounter icon={'icon-medical'} href={"#"} title={'Medicine Transferred Today'} topCounter={18.24} counter={counts?.medicineTransferredToday} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MedicineUsed;
