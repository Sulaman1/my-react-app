import React, { useEffect, useMemo, useState } from 'react';
import StatsCounter from './StatsCounter';


const InventoryCards = (props) => {
  const stats = props?.stats

  return (
    <>


      <div className="row">
        <h4 className="third-heading db-heading">Inventory Stats</h4>
        <div className='cards-wraper-3'>

          <div className="card-simple  card-animate green-light animation-left">
            <StatsCounter icon={'icon-medical'} title={'Total Issued This Month'} href={"#"} topCounter={18.24} counter={stats?.monthly} />
          </div>

          <div className="card-simple  card-animate blue-dark animation-left">
            <StatsCounter icon={'icon-medical'} title={'Total Issued THIS Month'} href={"#"} topCounter={18.24} counter={stats?.today} />
          </div>

          <div className="card-simple  card-animate red-light animation-left">
            <StatsCounter icon={'icon-medical'} title={'Total Issued THIS week'} href={"#"} topCounter={18.24} counter={stats?.weakly} />
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryCards;
