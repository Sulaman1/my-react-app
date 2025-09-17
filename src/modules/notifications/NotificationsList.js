/* eslint-disable max-len */
/* eslint-disable react/jsx-key */
import React from 'react';

import img from '../../assets/images/small/1.jpg';
import { useSelector } from 'react-redux';
import moment from 'moment-mini';


const NotificationsList = (props) => {
  const notes = useSelector((state) => state.notification.notifications);
  return (
    <><>
      <h2 className='mt-5'><i className="icon-notification mx-2"></i>Notifications List</h2>
      {/* DONT REMOVE THIS COMMENT */}
      {/* <div className="row py-3">
        <div className='col-md-4'>
          <div className='card notification  danger '>
            <div>
              <h5 className='title'>prison</h5>
              <p className='message'>AOA Hi this message from Prison Management AOA Hi this message from Prison Management</p>
              <p className='date'>14 AUG 2023</p>

            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card notification info'>
            <div>
              <h5 className='title'>hr</h5>
              <p className='message'>AOA Hi this message from Prison Management AOA Hi this message from Prison Management</p>
              <p className='date'>14 AUG 2023</p>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card notification primary'>
            <div>
              <h5 className='title'>medical</h5>
              <p className='message'>AOA Hi this message from Prison Management AOA Hi this message from Prison Management</p>
              <p className='date'>14 AUG 2023</p>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card notification secondary'>
            <div>
              <h5 className='title'>addmission</h5>
              <p className='message'>AOA Hi this message from Prison Management AOA Hi this message from Prison Management</p>
              <p className='date'>14 AUG 2023</p>
            </div>
          </div>
        </div>
     


      </div> */}
      <div role="dialog" aria-modal="true" className="fade modal show" tabindex="-1" >

     
      <div className='modal-dialog modal-xl'>
      <div className='card notification popup green circleoffice'>
        <button type="button" class="btn-close" aria-label="Close"></button>
        <div>
          <h5 className='title'>circleoffice</h5>

          <p className='date'>14 AUG 2023</p>
        </div>
        <div>
          <p className='message mt-3'>AOA Hi this message from Prison Management AOA Hi this message from Prison Management AOA Hi this message from Prison Management AOA Hi this message from Prison Management AOA Hi this message from Prison Management AOA Hi this message from Prison Management
            AOA Hi this message from Prison Management AOA Hi this message from Prison Management
            AOA Hi this message from Prison Management AOA Hi this message from Prison Management</p>
        </div>
      </div>
      </div>
      </div>
    </>
      <React.Fragment>
        {notes?.map((item) => {
          return (
            <div className="row">
              <div className="col-lg-12">
                <div>
                  <div className="team-list list-view-filter row">
                    <div className="col">
                      <div className="card team-box list-box">
                        <div className="team-cover">
                          <img src={img} alt="" className="img-fluid" />

                        </div>
                        <div className="card-body p-4">
                          <div className="row align-items-center team-row">
                            <div className="col team-settings">
                              <div className="row">
                                <div className="col">
                                  <div className="bookmark-icon flex-shrink-0 me-2">
                                    <input type="checkbox" id="favourite1" className="bookmark-input bookmark-hide" />
                                    <label htmlFor="favourite1" className="btn-star">
                                      <svg width="20" height="20">
                                        <use href="#icon-star" />
                                      </svg>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col">
                              <div className="team-profile-img">
                                <div className="avatar-lg img-thumbnail rounded-circle flex-shrink-0">
                                  <div className="avatar-title bg-soft-danger text-danger rounded-circle" >
                                    N
                                  </div>
                                </div>

                                <div className="team-content">
                                  <a data-bs-toggle="offcanvas" href="#" aria-controls="offcanvasExample">
                                    <h5 className="fs-20 mb-2">
                                      {item.message}
                                    </h5>
                                  </a>
                                  <p className="text-muted mb-0">{moment(item.createTime).fromNow()}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col">

                            </div>
                            <div className="col-lg-2 col">
                              <div className="text-end">
                                <a href="#" className="btn btn-light view-btn">Navigate</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>

                </div>
              </div>
            </div>
          )
        })}
      </React.Fragment></>
  );
};



export default NotificationsList;
