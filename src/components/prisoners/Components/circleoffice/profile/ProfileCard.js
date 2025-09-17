/* eslint-disable react/jsx-dynamic-key */
/* eslint-disable react/prop-types */
import Carousel from 'react-bootstrap/Carousel';
import moment from 'moment-mini';
import React from 'react';
import { baseImageUrl } from '../../../../../services/request';
import { validateDate } from '../../../../../common/Helpers';
import Placeholder from '../../../../../../src/assets/images/users/1.jpg'
import { useSelector } from 'react-redux';


const ProfileCard = ({ data, caseInfo, extra, tabPos, tabTitle, type, phrase }) => {
  const show = useSelector((state) => state.language.urdu)

  let extraInfo = [];
  if (extra && tabTitle) {
    if (tabTitle === 'Checkout Request by CO') {
      extraInfo = [
        {
          'title': 'Request Checkout Date & Time (چیک آوٹ کی درخواست کا تاریخ و وقت)',
          'dynamic-value': extra && validateDate(extra?.checkOutRequestDateTime) ?
            moment(extra.checkOutRequestDateTime)
              .format('MMMM Do YYYY, hh:mm a') : '',
        },
        {
          'title': 'Checkout Reason',
          'dynamic-value': extra?.checkReason,
        },
      ];
    }
    if (tabTitle === 'Checkout Request by Darban') {
      extraInfo = [
        {
          'title': 'Apporved by SP Date & Time (سرکل آفس سے منظوری کی تاریخ و وقت)',
          'dynamic-value': extra && validateDate(extra?.checkOutDateTime) ?
            moment(extra.checkOutDateTime)
              .format('MMMM Do YYYY, hh:mm a') : '',
        },
        {
          'title': 'Checkout Reason',
          'dynamic-value': extra?.checkReason
        },
      ];
    }
    if (tabTitle === 'Checkin by Darban') {
      extraInfo = [
        {
          'title': 'Request Checkin Date & Time (چیک ان کی درخواست کا تاریخ و وقت)',
          'dynamic-value': extra && extra?.checkOutDarbanDateTime ?
            moment(extra.checkOutDarbanDateTime)
              .format('MMMM Do YYYY, hh:mm a') : '',
        },
        {
          'title': 'Checkout Reason',
          'dynamic-value': extra?.checkReason
        },
      ];
    }
    if (tabTitle === 'Checkin by CO') {
      extraInfo = [
        {
          'title': 'Darban Approve Date & Time',
          'dynamic-value': extra && extra?.checkInDarbanDateTime ?
            moment(extra.checkInDarbanDateTime)
              .format('MMMM Do YYYY, hh:mm a') : '',
        },
        {
          'title': 'Checkin Reason',
          'dynamic-value': extra?.checkReason
        },
      ];
    }
    if (tabTitle === 'Checkin by sp') {
      extraInfo = [
        {
          'title': 'Circle Office Check-out Date & Time',
          'dynamic-value': extra && extra?.checkOutDateTime ?
            moment(extra.checkOutDateTime)
              .format('MMMM Do YYYY, hh:mm a') : '',
        },
        {
          'title': 'Check Reason',
          'dynamic-value': extra?.checkReason
        },
      ];
    }
  }
  return (
    <>
      <div className="row card-row g-0">
        <div className="col-lg-8  grid align-center">
          <div className='card-left'>
            <div>
              <h2 className="lh-base text-left"> {data.fullName} <span className="text-danger">{data.relationshipType}</span>  {data.relationshipName}</h2>
              <div className="text-muted mb-4">
                <div className='inner-content'>
                  <div className='row no-wrap'>
                    <p className='dynamic-key col-lg-6'>
                      {' '} Prisoner Number {show && (<label className='urdu-font'>(قیدی نمبر)</label>)}{' '}
                    </p>{' '}
                    <p className='dynamic-value col-lg-6'>
                      {' '}
                      {data?.prisonerNumber}
                    </p>
                  </div>
                  <div className='row no-wrap'>
                    <p className='dynamic-key col-lg-6'>
                      {' '}
                      Prison Name {show && (<label className='urdu-font'>(نام)</label>)}{' '}
                    </p>{' '}
                    <p className='dynamic-value col-lg-6'>
                      {' '}
                      {data.prisonName}
                    </p>
                  </div>
                  <div className='row no-wrap'>
                    <p className='dynamic-key col-lg-6'>CNIC {show && (<label className='urdu-font'>(شناختی کارڈ)</label>)} </p>{' '}
                    <p className='dynamic-value col-lg-6'>
                      {' '}
                      {data.cnic}
                    </p>
                  </div>
                </div>
                {caseInfo && (
                  <div className='inner-content'>
                    <div className='row no-wrap'>
                      <p className='dynamic-key col-lg-6'>FIR No {show && (<label className='urdu-font'>(ایف آئی آر نمبر)</label>)}</p>{' '}
                      <p className='dynamic-value col-lg-6'>
                        {' '}
                        {caseInfo.firNo}
                      </p>
                    </div>
                    <div className='row no-wrap'>
                      <p className='dynamic-key col-lg-6'>
                        {' '}
                        FIR Date {show && (<label className='urdu-font'>(ایف آئی آر تاریخ)</label>)}{' '}
                      </p>{' '}
                      <p className='dynamic-value col-lg-6'>
                        {' '}
                          {validateDate(caseInfo.firDate) || ''}
                      </p>
                    </div>
                    <div className='row no-wrap'>
                      <p className='dynamic-key col-lg-6'>
                        Decision Date {show && (<label className='urdu-font'>(فیصلہ کی تاریخ)</label>)}{' '}
                      </p>{' '}
                      <p className='dynamic-value col-lg-6'>
                        {' '}
                        {validateDate(caseInfo.decisionDate) || ''}
                      </p>
                    </div>
                    <div className='row no-wrap'>
                      <p className='dynamic-key col-lg-6'>Sentence {show && (<label className='urdu-font'>(سزا)</label>)}</p>{' '}
                      <p className='dynamic-value col-lg-6'>
                        {' '}
                        {caseInfo.sentenceString}
                      </p>
                    </div>
                  </div>
                )}
                {extraInfo && extraInfo?.length > 0 && (
                  <div className='inner-content'>
                    {extraInfo.map((item) => {
                      return (
                        <div className='row no-wrap'>
                          <p className='dynamic-key  col-lg-6'>{item?.title}</p>{' '}
                          <p className='dynamic-value  col-lg-6'>
                            {' '}
                            {item?.['dynamic-value']}
                          </p>
                        </div>
                      );
                    })
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 card-slider  h-50">
          <Carousel>
            <Carousel.Item className="slide-item">
              <div className="profile">
                <img src={data.frontPic ? baseImageUrl + data.frontPic : Placeholder}
                  alt='' className="subscribe-modals-cover" />
              </div>
            </Carousel.Item>
            <Carousel.Item className="slide-item">
              <div className="profile">
                <img src={data.rightPic ? baseImageUrl + data.rightPic : Placeholder}
                  alt='' className="subscribe-modals-cover" />
              </div>
            </Carousel.Item>
            <Carousel.Item className="slide-item">
              <div className="profile">
                <img src={data.leftPic ? baseImageUrl + data.leftPic : Placeholder}
                  alt='' className="subscribe-modals-cover" />
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className='card-footer'>
          <div className='row'>
            <p className=''>
              ADMISSION DATE: {show && (<label className='urdu-font'>(داخلہ تاریخ)</label>)} {' '}
              {validateDate(data.admissionDate) || ''}
            </p>
          </div>
        </div>
      </div>

      {type && type == "appeal" &&
        <div className='row'>
          <p className=''>
            <b>{phrase}</b>
          </p>
        </div>
      }
    </>
  );
};

export default ProfileCard;
