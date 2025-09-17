/* eslint-disable max-len */
import React, { useState } from 'react';
import StatsCounter from './StatsCounter';

const AllTimeBarrackDetails = (props) => {
    const [showMore, setShowMore] = useState(false);
    const [cardHeight, setCardHeight] = useState("auto");

    const barrackStats = props?.barrackStats
    let stats = props?.outOfBDetails?.outOfBarracks
    let values = stats?.split(",").slice(0, 6);
    const barrack = barrackStats?.barrackNameOv?.split(",").slice(0, -1);
    const current = barrackStats?.currentPopulationOv?.split(",");
    const total = barrackStats?.totalPopulationOv?.split(",");
    const prison = barrackStats?.prisonNameOv?.split(",");

    const handleClick = () => {
        setShowMore(!showMore);
        setCardHeight(showMore ? "auto" : "200px");
    };
    return (
        <>
            <div className="row">
                <div className='cards-wraper-3'>
                    {!props.normalAdmin && <>
                    
                        <div className="card-simple  card-animate green-light state-icon mb-2 animation-left">
                            
                            <StatsCounter icon={'fas fa-sign-out'} title={'Checkouts in process'} href={"circleoffice/checkout-checkin"} topCounter={18.24} counter={props?.outOfBDetails?.totalOutOfBarracks} />
                        </div>
                        <div className="card-simple  card-animate gray-dark state-icon mb-2 animation-left"
                        onClick={() => {
                            props.handleCardClick('barrack', { 
                              allocated: 0
                            });
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                            <StatsCounter icon={'icon-prison'} title={'Total In Prison'} href={"circleoffice/checkout-checkin"} topCounter={18.24} counter={props?.outOfBDetails?.totalInBarracks} />
                        </div>
                        <div className="card-simple  card-animate blue-light state-icon mb-2 animation-left"
                        onClick={() => {
                            props.handleCardClick('barrack', { 
                              allocated: 2
                            });
                          }}
                          style={{ cursor: 'pointer' }}
                        >   
                            <StatsCounter icon={'icon-culutural'} title={'Total Unallocated Prisoners'} href={"administration/barrack-allocation/allocation"} topCounter={18.24} counter={barrackStats?.totalUnallocatedPrisoners} />
                        </div>
                        <div className="card-simple  card-animate gray-dark state-icon animation-left"
                        onClick={() => {
                            props.handleCardClick('barrack', { 
                              allocated: 1
                            });
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                            <StatsCounter icon={'icon-culutural'} title={'Total Allocated Prisoners'} href={"administration/barrack-allocation/allocation"} topCounter={18.24} counter={barrackStats?.totalAllocatedPrisoners} />
                        </div>
                    </>}

                    <div className={props.ig ? 'card-simple animation-left card-animate blue-dark state-icon' : 'card-simple animation-left card-animate blue-dark state-icon  last-two'}>
                        <div className="">
                            <div className="card-body ">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="pera">Checkouts in process</p>
                                    </div>

                                </div>

                                <div className="d-flex align-items-end justify-content-between mt-0">
                                    <ul>
                                        <div style={{ color: "#ffff" }}>
                                            {values?.map((value, index) => {
                                                value = value.replace("=", " = ");
                                                return (
                                                    <div key={index}>{value}</div>
                                                );
                                            })}
                                        </div>
                                    </ul>
                                    <div>
                                        <h4 className="heading">
                                            <span className="counter-value" data-target="559.25">

                                            </span>
                                        </h4>

                                    </div>
                                    <div className="state-icon">
                                        <i className=" text-primary fas fa-sign-out text-primary"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-simple  card-animate red-dark state-icon animation-left">
                        <div className="">
                            <div className="card-body" style={{ overflow: "hidden", height: cardHeight }}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="pera">Over Crowded Barracks</p>
                                    </div>

                                </div>

                                <div className="d-flex align-items-end justify-content-between mt-0 ">
                                    <div >
                                        {barrack?.slice(0, showMore ? barrack?.length : 2)?.map((b, i) => (
                                            <ul key={i} >
                                                <li style={{ color: "#ffff" }}>({b}) {current[i]} / {total[i]} : {prison[i]}</li>
                                               
                                            </ul>
                                        ))}
                                        {barrack?.length > 2 && (
                                            <p style={{ textAlign: "center", cursor: "pointer" }} onClick={handleClick}>
                                                <ul style={{ textAlign: "center", color: "#ffff" }}>{showMore ? "Show Less" : "Show More"}</ul>
                                            </p>
                                        )}
                                         {barrack?.length < 1 &&(
                                                <p className='text-white' style={{fontSize: "21px", fontWeight: "lighter"}}>No over Crowded Barracks ☺</p>)}
                                    </div>
                                    <div>
                                        <h4 className="heading">
                                            <span className="counter-value" data-target="559.25">

                                            </span>
                                        </h4>

                                    </div>
                                    <div className="state-icon">
                                        <i className=" text-primary icon-culutural text-primary"></i>
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

export default AllTimeBarrackDetails;
