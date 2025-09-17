import React from 'react';
import StatsCounter from './StatsCounter';

const PrisonerHearing = (props) => {
    const counts = props.hearingStats;

    return (
        <>
            <div className="row">
                <h4 className="third-heading db-heading">Prisoner Hearing Counts</h4>
                <div className='cards-wraper-3'>
                    <div className="card-simple  card-animate green-light text-warning animation-left"
                    onClick={() => {
                        props.handleCardClick('hearing', { 
                          duration: 1
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-court'} href={"court-production/add-hearing"} title={'Hearings Yesterday'} topCounter={18.24} counter={counts?.yesterdaysHearing} />
                    </div>

                    <div className="card-simple  card-animate pink-light text-warning animation-left"
                    onClick={() => {
                        props.handleCardClick('hearing', { 
                          duration: 2
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-court'} href={"court-production/add-hearing"} title={'Hearings Today'} topCounter={18.24} counter={counts?.todaysHearing} />
                    </div>

                    <div className="card-simple  card-animate slate-light text-warning animation-left"
                    onClick={() => {
                        props.handleCardClick('hearing', { 
                          duration: 3
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-court'} href={"court-production/add-hearing"} title={'Hearings Tommorow'} topCounter={18.24} counter={counts?.tommorowsHearing} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrisonerHearing;
