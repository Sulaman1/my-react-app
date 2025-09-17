/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import StatsCounter from './StatsCounter';
import { useSelector } from 'react-redux';
const BasicStats = (props) => {
  const [showMore, setShowMore] = useState(false);
  const [cardHeight, setCardHeight] = useState("auto");

  const barrackStats = props?.barrackStats
	const userMeta = useSelector((state) => state.user);
	const isUTP = userMeta?.role === "Prison UTP Branch";
  const isConvict = userMeta?.role === "Prison Convict Branch";
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
        <h4 className="third-heading db-heading ">Basic Stats of Prisoners</h4>
        <div className='cards-wraper-3 '>
          <div 
            className="card-simple card-animate red-light animation-left" 
            onClick={() => {
              if(!(isUTP || isConvict)){
                props.handleCardClick('prisoners', { 
                  category: 0, 
                  admissionStatus: 0 
                });
              }
            }}
            style={{ cursor: isUTP || isConvict ? 'default' : 'pointer' }}
          >
            <StatsCounter icon={'icon-prisoner'} title={'Total Prisoners'} href={"prisoner-search"} topCounter={1.24} counter={props?.prisonerStats?.totalPrisoner} />
          </div>
          <div className="card-simple  card-animate orange-light animation-left"
           onClick={() => {
            if(!isConvict){
              props.handleCardClick('prisoners', { 
                category: 1, 
                admissionStatus: 0 
              });
            }
          }}
          style={{ cursor:  isConvict ? 'default' : 'pointer' }}>
            <StatsCounter icon={'icon-prison'} title={'Under Trial'} href={"prisoner-search"} topCounter={23.57} counter={props?.prisonerStats?.totalUTP} />
          </div>
          <div className="card-simple  card-animate red-dark animation-left"
           onClick={() => {
            if(!isUTP){
              props.handleCardClick('prisoners', { 
                category: 2, 
                admissionStatus: 0 
              });
            }
          }}
          style={{ cursor: isUTP ? 'default' : 'pointer' }}>
            <StatsCounter icon={'icon-convict'} title={'Convicted'} href={"prisoner-search"} topCounter={29.08} counter={props?.prisonerStats?.totalConvicted} />
          </div>

        </div>
        <div className='cards-wraper-2'>

          {props.normalAdmin && <> <div className='card-simple animation-left card-animate blue-dark state-icon'>
            <div className="">
              <div className="card-body">
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
                    <i className=" text-primary icon-building text-primary"></i>
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
                        <p className='text-white' style={{fontSize: "21px", fontWeight: "lighter"}}>No over Crowded Barracks ☺</p>
                        )}
                    </div>
                    <div>
                      <h4 className="heading">
                        <span className="counter-value" data-target="559.25">

                        </span>
                      </h4>

                    </div>
                    <div className="state-icon">
                      <i className=" text-primary icon-building text-primary"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>}

        </div>

      </div>
    </>
  );
};

export default BasicStats;
