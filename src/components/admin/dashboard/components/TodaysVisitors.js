import React from 'react';
import StatsCounter from './StatsCounter';
const TodaysVisitors = (props) => {
    const counts = props.visitorStats

    return (
        <>
            <div className="row">

                <h4 className="third-heading db-heading">Today's Vistors</h4>

                <div className='cards-wraper-3'>

                    <div className="card-simple card-animate blue-dark text-success animation-left">
                        <StatsCounter icon={'icon-visitor-card'} title={"Today's Visitor"} topCounter={18.24} counter={counts?.todaysVisitors} />
                    </div>

                    <div className="card-simple card-animate pink-light text-info animation-left">
                        <StatsCounter icon={'icon-visitor-card'} title={"Meeting Awaited"} topCounter={18.24} counter={counts?.meetingAwaited} />
                    </div>

                    <div className="card-simple card-animate green-light text-warning animation-left">
                        <StatsCounter icon={'icon-visitor-card'} title={"In Meeting"} topCounter={18.24} counter={counts?.currentlyInMeeting} />
                    </div>

                </div>
            </div>
        </>
    );
};

export default TodaysVisitors;
