/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import StatsCounter from './StatsCounter';
const EmployeesCards = (props) => {
    const counts = props?.employeeStats
    return (
        <>
            <div className="row">
                <h4 className="third-heading db-heading ">Basic Stats of Employees</h4>
                <div className='cards-wraper-3'>
                    <div className="card-simple  card-animate green-light animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 0
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >       
                        <StatsCounter icon={'icon-friends'} title={'Total Employees'} href={"#"} topCounter={18.24} counter={counts?.totalEmployees} />
                    </div>
                    <div className="card-simple  card-animate blue-light animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 1
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-prison'} title={'New Employees This Month'} href={"#"} topCounter={3.57} counter={counts?.newEmployeesThisMonth} />
                    </div>
                    <div className="card-simple  card-animate red-dark animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 2
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-operator'} title={'New Employees This year'} href={"#"} topCounter={29.08} counter={counts?.newEmployeesThisYear} />
                    </div>

                </div>
                <h4 className="third-heading db-heading ">Todays Stats of Employees</h4>
                <div className='cards-wraper-3'>
                    <div className="card-simple  card-animate blue-light state-icon animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 3
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-prison'} title={'Total Attendence Today'} href={"circleoffice/checkout-checkin"} topCounter={18.24} counter={counts?.totalAttendanceToday} />
                    </div>
                    <div className="card-simple  card-animate red-dark state-icon animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 6
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-convict'} title={'Total On Leave Today'} href={"#"} topCounter={18.24} counter={counts?.totalOnLeaveToday} />
                    </div>
                    <div className="card-simple  card-animate blue-light state-icon animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                            duration: 7
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-convict'} title={'Total Applied For Leaves Today'} href={"#"} topCounter={18.24} counter={counts?.totalAppliedForLeavesToday} />
                    </div>
                    <div className="card-simple  card-animate red-dark state-icon animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                            duration: 8
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-convict'} title={'Total Leaves Approved Today'} href={"#"} topCounter={18.24} counter={counts?.totalLeavesApprovedToday} />
                    </div>
                    <div className="card-simple  card-animate blue-light state-icon animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 9
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-cross-sign'} title={'Total Leaves Declined Today'} href={"#"} topCounter={18.24} counter={counts?.totalLeavesDeclinedToday} />
                    </div>
                    <div className="card-simple  card-animate red-dark state-icon animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 10
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-room'} title={'Total Leaves Cancelled Today'} href={"#"} topCounter={18.24} counter={counts?.totalLeavesCancelledToday} />
                    </div>
                </div>


                <h4 className="third-heading db-heading ">Total Stats of Employees</h4>
                <div className='cards-wraper-3'>
                        <div className="card-simple  card-animate blue-light state-icon animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 11
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-convict'} title={'Total On Leave This Month'} href={"#"} topCounter={18.24} counter={counts?.totalOnLeaveThisMonth} />
                    </div>
                    <div className="card-simple  card-animate green-light state-icon animation-left"    
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 4
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-prison'} title={'Total Inside Prison'} href={"#"} topCounter={18.24} counter={counts?.totalInsidePrison} />
                    </div>
                    <div className="card-simple  card-animate blue-light state-icon animation-left"
                    onClick={() => {
                        props.handleCardClick('employee', { 
                          duration: 5
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                        <StatsCounter icon={'icon-culutural'} title={'Total Outside Prison'} href={"#"} topCounter={18.24} counter={counts?.totalOutsidePrison} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeesCards;
