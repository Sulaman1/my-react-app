import React, { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';

const StatsCounter = props => {
    return (
        <>
            <div className="">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                            <p className="pera">{props.title}</p>

                        </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                            <h4 className="heading">
                                <span className="counter-value" data-target="559.25">
                                    <CountUp end={props.counter} />
                                </span>
                            </h4>
                        </div>
                        <div className="state-icon">
                            
                            <i className={props.icon ? props.icon + ' text-primary' : 'icon-building text-primary'}></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StatsCounter;