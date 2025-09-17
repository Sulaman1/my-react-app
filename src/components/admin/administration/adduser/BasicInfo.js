/* eslint-disable no-tabs */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { transfromStringArray, getFormattedDate, validateDate, getIds, transformData } from '../../../../common/Helpers';
import InputWidget from '../../../../droppables/InputWidget';
import { getData, postData } from '../../../../services/request';
import CnicProfile from '../../../prisoners/Components/CnicProfile';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { TabButton } from '../../../../common/TabButton';
import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import GuardInfo from '../../../reusable/guardInfo/guardInfo';


const BasicInfo = props => {

  const [isOpen, setIsOpen] = useState(false);
  const [foundCNICData, setFoundCNICData] = useState({});
  const [date, setDate] = useState(null);
  const [defaultFocus, setDefaultFocus] = useState(false);
  const currentTime = new Date();
  const [sectOptions, setSectOptions] = useState([]);
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [time, setTime] = useState({
    hour: formattedTime.substring(0, 2),
    minute: formattedTime.substring(3, 5),
    meridiem: formattedTime.substring(6, 8)
  });

  useEffect(() => {
    const regId = props.formPayload?.personalInfo?.religionId
    if (regId !== null) {
      const filteredSects = props?.lookUps?.allSect?.filter(
        (sect) => sect.religionId === regId
      );
      setSectOptions(transformData(filteredSects));
    }
  }, [props.formPayload?.personalInfo?.religionId, props?.lookUps?.allSect]);
  
  useEffect(() => {
    if (!props.formPayload?.prisonerNumber?.darbanEntryDate) {
      const currentDate = new Date();
      setDate(currentDate);
      const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${time.hour || 12}:${time.minute} ${time.meridiem}`;
      const initialPayload = {
        ...props.formPayload,
        prisonerNumber: {
          ...props.formPayload?.prisonerNumber,
          darbanEntryDate: formattedDate
        }
      };
      props.setFormPayload(initialPayload);
    } else {
      setDate(new Date(props.formPayload.prisonerNumber.darbanEntryDate));
    }
  }, [props.formPayload]);

  const handleDateChange = (date) => {
    const currentDate = date || new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${time.hour || 12}:${time.minute} ${time.meridiem}`;
    const updatedPayload = {
      ...props.formPayload,
      prisonerNumber: {
        ...props.formPayload?.prisonerNumber,
        darbanEntryDate: formattedDate
      }
    };
    setDate(currentDate);
    props.setFormPayload(updatedPayload);
  };


  const handleTimeChange = (newTime) => {
    if (date) {
      const payload = {
        ...props.formPayload,
        prisonerNumber: {
          ...props.formPayload?.prisonerNumber,
          darbanEntryDate: date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${newTime.hour || 12}:${newTime.minute} ${newTime.meridiem}` : ''
        }
      };
      props.setFormPayload(payload);
    }
    setTime(newTime);
  };


  const checkCNIC = value => {
    if (props.isPrisoner || props.isDarban) {
      let valLength = value.length;
      if (valLength === 15) {
        const paylaod = { cnic: value };
        const checkURL =
          '/services/app/AddPrisonerAppServices/CheckCnic';
        postData(checkURL, paylaod)
          .then(res => {
            if (res.success == true) {
              if (res.result.data != null) {
                const foundData = res.result.data;
                setIsOpen(true);
                const payload = {
                  ...props.formPayload
                };
                payload['personalInfo']['foundCnic'] = true;
                setFoundCNICData(foundData);
                props.setFormPayload(payload);
              } else {
                const payload = {
                  ...props.formPayload
                };
                payload['personalInfo']['foundCnic'] = false;
                props.setFormPayload(payload);
              }
            }
          })
          .catch(err => {
            swal("Something went wrong!", err, "warning")
            console.log(err, 'getting error while fetching API {CheckCnic} & fileName is {BasicInfo}');
          });
      }
    }
  };

  const getDefaultNationalityOption = (nationlities) => {
    const defaultNationality = nationlities?.find(option => option.label === 'Pakistan' || option.label === 'Pakistani');
    return defaultNationality || {};  
  };

  const getDefaultReligion = (religions) => {
    const religion = religions?.find(option => option?.label?.toLowerCase() === 'islam');
    const payload = {
      ...props.formPayload,
    };
    payload['personalInfo']['religionId'] = religion?.value || null;
    return religion;
  }

  return (
    <>
      {!props.isVisitor && (
        <CnicProfile
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          data={foundCNICData}
        />
      )}
      <div className='tabs-wraper'>
        {/* REFACTOR IS IMPORTANT Abdullah */}
        {!props.isVisitor && (
          <ul className='custom-nav tabs-style'>
            {/* if prison only */}
            {!props.isDarban && !props.isEmployee && (
              <TabButton step={1} progress={'14.2'} title={'Prisoner Info'} props={props} />
            )}
            <TabButton active={'active'} step={props.isEmployee ? 1 : 2} progress={props.isEmployee ? '20' : '28.4'} title={'Basic Information'} props={props} />
            {/* employee only */}
            {props.isEmployee && (
              <TabButton step={2} progress={'40'} title={'User Information'} props={props} />
            )}
            {/* employee or prisoner */}
            {!props.isDarban && (
              <>
                {!props.isEmployee && (
                  <TabButton step={3} progress={'42.6'} title={'Professional Information'} props={props} />
                )}
                <TabButton step={props.isEmployee ? 3 : 4} progress={props.isEmployee ? '60' : '58.6'} title={'Bio Metric Information'} props={props} />
                <TabButton step={props.isEmployee ? 4 : 5} progress={props.isEmployee ? '80' : '71'} title={'Contact Information'} props={props} />
                {!props.isEmployee && (
                  <>
                    <TabButton step={6} progress={'85.2'} title={'Prisoner Info'} props={props} />
                  </>
                )}
                {props.isEmployee && (
                  <TabButton step={5} progress={'100'} title={'Employee Information'} props={props} />
                )}
              </>
            )}
          </ul>
        )}
        <div className='tabs-panel '>
          <div className='row '>
            <h4 className='third-heading'>{props.title}</h4>
          </div>
          <div className='row '>
            {/* categories for darbans */}
            {props.isDarban && (<>
              <div className='col-lg-6'>
                <InputWidget
                  type={'multiSelect'}
                  ismulti={false}
                  inputType={'select'}
                  label={'Category (قیدی کی درجہ بندی)'}
                  id={'category'}
                  require={false}
                  icon={'icon-planer'}
                  options={props?.lookUps?.category || []}
                  defaultValue={
                    transfromStringArray(
                      props?.lookUps?.category,
                      props?.formPayload?.prisonerNumber
                        ?.category
                    ) || []
                  }
                  setValue={value => {
                    const payload = {
                      ...props.formPayload
                    };
                    payload['prisonerNumber'][
                      'category'
                    ] = value.value;
                    props.setFormPayload(payload);
                  }}
                />
              </div>
              </>
              )}
            <div className='col-lg-6'>
              <InputWidget
                type={'input'}
                inputType={'name'}
                label={'Full Name (پورا نام)'}
                id={'full_name'}
                onlyLetters={true}
                require={false}
                icon={'icon-operator'}
                defaultValue={
                  props?.formPayload?.personalInfo?.fullName
                }
                autoFocus={(element) => {
                  if (!defaultFocus) {
                    setDefaultFocus(true)
                    element.focus();
                  }
                }}
                setValue={value => {
                  const payload = {
                    ...props.formPayload
                  };
                  payload['personalInfo']['fullName'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            <div className='col-lg-6'>
            <InputWidget
                    type={'multiSelect'}
                    ismulti={false}
                    inputType={'select'}
                    label={'Relationship Type'}
                    id={'relation'}
                    require={false}
                    icon={'icon-web'}
                    options={
                      props?.lookUps?.relationshipTypes || []
                    }
                    defaultValue={
                      transfromStringArray(
                        props?.lookUps?.relationshipTypes,
                        props?.formPayload?.personalInfo?.relationshipTypeId
                      ) || []
                    }
                    setValue={value => {
                      const payload = {
                        ...props.formPayload
                      };
                      payload['personalInfo'][
                        'relationshipTypeId'
                      ] = value.value;
                      props.setFormPayload(payload);
                    }}
                  />
            </div>

<div className='col-lg-6'>
              <InputWidget
                type={'input'}
                inputType={'name'}
                label={'Relation Name'}
                id={'father'}
                onlyLetters={true}
                require={false}
                icon={'icon-operator'}
                defaultValue={
                  props?.formPayload?.personalInfo?.relationshipName
                }
                setValue={value => {
                  const payload = {
                    ...props.formPayload
                  };
                  payload['personalInfo']['relationshipName'] =
                    value;
                  props.setFormPayload(payload);
                }}
              />
            </div>

            {!props.isEmployee && (
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  inputType={'name'}
                  label={'Nick Name (عرفی نام)'}
                  id={'nick_name'}
                  require={false}
                  onlyLetters={true}
                  icon={'icon-operator'}
                  defaultValue={
                    props?.formPayload?.personalInfo
                      ?.nickName
                  }
                  setValue={value => {
                    const payload = {
                      ...props.formPayload
                    };
                    payload['personalInfo']['nickName'] =
                      value;
                    props.setFormPayload(payload);
                  }}
                />
              </div>
            )}
            {!props.isEmployee && (
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  inputType={'name'}
                  label={'Official ID No (For Foreigners Only)'}
                  id={'passport_number'}
                  require={false}
                  icon={'icon-number'}
                  defaultValue={
                    props?.formPayload?.personalInfo
                      ?.passportNumber
                  }
                  setValue={value => {
                    const payload = {
                      ...props.formPayload
                    };
                    payload['personalInfo'][
                      'passportNumber'
                    ] = value;
                    props.setFormPayload(payload);
                  }}
                />
              </div>
            )}
            {!props.isDarban && (
              <>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'input'}
                    inputType={'name'}
                    label={'Grand Father Name (دادا کا نام)'}
                    id={'grand_father_name'}
                    onlyLetters={true}
                    require={false}
                    icon={'icon-operator'}
                    defaultValue={
                      props?.formPayload?.personalInfo
                        ?.grandFatherName
                    }
                    setValue={value => {
                      const payload = {
                        ...props.formPayload
                      };
                      payload['personalInfo'][
                        'grandFatherName'
                      ] = value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
                {!props.isEmployee && (
                  <div className='col-lg-6'>
                    <InputWidget
                      type={'input'}
                      inputType={'name'}
                      label={'Brother Name (بھائی کا نام)'}
                      id={'brother_name'}
                      onlyLetters={true}
                      require={false}
                      icon={'icon-operator'}
                      defaultValue={
                        props?.formPayload?.personalInfo
                          ?.brotherName
                      }
                      setValue={value => {
                        const payload = {
                          ...props.formPayload
                        };
                        payload['personalInfo'][
                          'brotherName'
                        ] = value;
                        props.setFormPayload(payload);
                      }}
                    />
                  </div>)}
                <div className='col-lg-6'>
                  <InputWidget
                    type={'multiSelect'}
                    ismulti={false}
                    inputType={'select'}
                    label={'Nationality (قومیت)'}
                    id={'nationality'}
                    require={false}
                    icon={'icon-web'}
                    options={
                      props?.lookUps?.nationlities || []
                    }
                    defaultValue={
                      transfromStringArray(
                        props?.lookUps?.nationlities,
                        props?.formPayload?.personalInfo?.nationalityId
                      ) || getDefaultNationalityOption(props?.lookUps?.nationlities)
                    }
                    setValue={value => {
                      const payload = {
                        ...props.formPayload
                      };
                      payload['personalInfo'][
                        'nationalityId'
                      ] = value.value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'multiSelect'}
                    ismulti={false}
                    inputType={'select'}
                    label={'Marital Status (ازدواجی حیثیت)'}
                    id={'marital_status'}
                    require={false}
                    icon={'icon-like'}
                    options={props?.lookUps?.marital || []}
                    defaultValue={
                      transfromStringArray(
                        props?.lookUps?.marital,
                        props?.formPayload?.personalInfo
                          ?.maritalStatusId
                      ) || []
                    }
                    setValue={value => {
                      const payload = {
                        ...props.formPayload
                      };
                      payload['personalInfo'][
                        'maritalStatusId'
                      ] = value.value;
                      
                      if(!payload?.personalInfo?.nationalityId) {
                        const defaultNationality = getDefaultNationalityOption(props?.lookUps?.nationlities)
                        payload['personalInfo']['nationalityId'] = defaultNationality?.value;
                      }

                      props.setFormPayload(payload);
                    }}
                  />
                </div>
              </>
            )}
            <div className='col-lg-6'>
              <InputWidget
                type={'multiSelect'}
                ismulti={false}
                inputType={'select'}
                label={'Gender (جنس)'}
                id={'gender'}
                options={props?.lookUps?.genders || []}
                require={false}
                icon={'icon-gender'}
                defaultValue={
                  transfromStringArray(
                    props?.lookUps?.genders,
                    props?.formPayload?.personalInfo
                      ?.genderId
                  ) || []
                }
                setValue={value => {
                  const payload = {
                    ...props.formPayload
                  };
                  payload['personalInfo']['genderId'] =
                    value.value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            <div className='col-lg-6'>
              <InputWidget
                type={'cnic'}
                inputType={'text'}
                label={'CNIC (شناختی کارڈ نمبر)'}
                id={'cnic'}
                icon={'icon-visitor-card'}
                onlyNumbers={true}
                defaultValue={
                  props?.formPayload?.personalInfo?.cnic
                }
                setValue={(value, event) => {
                  checkCNIC(value);
                  const payload = {
                    ...props.formPayload
                  };
                  payload['personalInfo']['cnic'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            {props.isDarban && (
              <>
                <div className='col-lg-6 row'>
                  <div className='col-lg-6'>
                    <div className='inputs force-active'>
                      <label>Darban Admission Date</label>
                      <DatePicker
                        selected={date}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        icon={'icon-operator'}
                        isClearable
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        id={'darban-admission-date'}
                      />
                    </div>
                  </div>
                  <div className='col-lg-6' style={{zIndex:  '99999'}}>

                    <TimePicker
                      time={`${time.hour}:${time.minute} ${time.meridiem}`}
                      theme="material"
                      timeMode="12"
                      minuteStep={1}
                      onTimeChange={handleTimeChange}
                    />
                  </div>
                </div>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'input'}
                    inputType={'name'}
                    onlyNumbers={true}
                    label={'No of warrants (وارنٹ)'}
                    id={'warrant'}
                    require={false}
                    icon={'icon-operator'}
                    defaultValue={
                      props?.formPayload?.prisonerNumber?.noOfWarrantsUponAdmission
                    }
                    setValue={value => {
                      const payload = {
                        ...props.formPayload
                      };
                      payload['prisonerNumber']['noOfWarrantsUponAdmission'] = value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
                <GuardInfo
                  setFormPayload={props.setFormPayload}
                  formPayload={props.formPayload}
                  forDarban={true}
                />
                  <InputWidget
                    type={'switch'}
                    inputType={'checkbox'}
                    label={'has opposition (مدحئ)'}
                    id={'has-opposition'}
                    require={false}
                    icon={'icon-prisoner'}
                    defaultValue={props?.formPayload?.hasOpposition
                    }
                    setValue={checked => {
                      const payload = {
                        ...props?.formPayload
                      };
                      payload['hasOpposition'] = checked;
                      props.setFormPayload(payload);
                    }}
                  />
              </>
            )}

            {!props.isDarban && (
              <>
                {!props.isDarban && (
                  <>
                    <div className='col-lg-6'>
                      <InputWidget
                        type={'multiSelect'}
                        ismulti={false}
                        inputType={'select'}
                        label={'Cast (قوم)'}
                        id={'Cast'}
                        require={false}
                        icon={'icon-operator'}
                        options={
                          props?.lookUps?.caste || []
                        }
                        defaultValue={
                          transfromStringArray(
                            props?.lookUps?.caste,
                            props?.formPayload
                              ?.personalInfo
                              ?.casteId
                          ) || []
                        }
                        setValue={value => {
                          const payload = {
                            ...props.formPayload
                          };
                          payload['personalInfo'][
                            'casteId'
                          ] = value.value;
                          props.setFormPayload(
                            payload
                          );
                        }}
                      />
                    </div>
                    <div className='col-lg-6 '>
                      <div className='inputs force-active'>
                        <label>Date Of Birth (تارخ پیدائش)</label>
                        <DatePicker
                          dateFormat='dd/MM/yyyy'
                          maxDate={new Date()}
                          icon={'icon-operator'}
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={120}
                          showMonthDropdown
                          placeholderText={''}
                          id={'date-of-birth'}
                          selected={validateDate(props?.formPayload?.personalInfo?.dateOfBirth) ? getFormattedDate(props?.formPayload?.personalInfo?.dateOfBirth) : null}
                          onChange={date => {
                            const payload = {
                              ...props.formPayload
                            };
                            payload['personalInfo'][
                              'dateOfBirth'
                            ] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                            props.setFormPayload(payload);
                          }}
                        />
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <InputWidget      
                        type={'multiSelect'}
                        ismulti={false}
                        inputType={'select'}
                        label={'Religion (مذہب)'}
                        id={'religion'}
                        require={false}
                        icon={'fa-solid fa-mosque'}
                        options={
                          props?.lookUps?.religion || []
                        }
                        defaultValue={
                          transfromStringArray(
                            props?.lookUps
                              ?.religion,
                            props?.formPayload
                              ?.personalInfo
                              ?.religionId
                          ) || getDefaultReligion(props?.lookUps
                            ?.religion) || []
                        }
                        setValue={(value) => {
                          const payload = {
                            ...props.formPayload,
                          };
                          payload['personalInfo']['religionId'] = value.value;
                          payload['personalInfo']['sectId'] = null;
                          props.setFormPayload(payload);
                        }}
                      />
                    </div>
                    <div className='col-lg-6'>
                      <InputWidget
                        type={"multiSelect"}
                        label={"Sect"}
                        isMulti={false}
                        require={false}
                        icon={"icon-operator"}
                        id={"sec-id"}
                        options={sectOptions}
                        defaultValue={
                          transfromStringArray(
                            props?.lookUps?.sect,
                            props?.formPayload
                              ?.personalInfo
                              ?.sectId
                          ) || []
                        }
                        setValue={(value) => {
                          const payload = {
                            ...props.formPayload,
                          };
                          payload["personalInfo"]["sectId"] = value.value;
                          props.setFormPayload(payload);
                        }}
                      />
                    </div>
                    {!props.isEmployee &&
                      <div className='col-lg-6'>
                        <InputWidget
                          type={"multiSelect"}
                          label={"Mother Tongue"}
                          isMulti={false}
                          require={false}
                          icon={"icon-operator"}
                          id={"tongue-id"}
                          options={props?.lookUps?.languages}
                          defaultValue={
                            transfromStringArray(
                              props?.lookUps?.languages,
                              props?.formPayload
                                ?.personalInfo
                                ?.motherTongueId
                            ) || []
                          }
                          setValue={(value) => {
                            const payload = {
                              ...props.formPayload,
                            };
                            payload["personalInfo"]["motherTongueId"] = value.value;
                            props.setFormPayload(payload);
                          }}
                        />
                      </div>
                    }
                  </>
                )}
              </>
            )}
          </div>
          <div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
            {props.isPrisoner && (
              <button
                onClick={() => {
                  props.previousStep();
                  props.setProgress(props.isEmployee ? '20' : '14.2');
                }}
                type='button'
                className='btn rounded-pill w-lg btn-prim-off waves-effect waves-light'
              >
                <i className='icon-leftangle ml-2'></i> Back
              </button>
            )}
            {props.isDarban ? null : (
              <button
                id="next-btn"
                onClick={() => {
                  props.nextStep();
                  props.setProgress(props.isEmployee ? '40' : '42.6');
                }}
                type='button'
                className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
              >
                Next <i className='icon-rightangle ml-2'></i>
              </button>
            )}
            {props.isDarban && (
              <button
                id="add-prisoner-btn"
                type='submit'
                onClick={props?.handleSubmit}
                className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
              >
                <i className='icon-add ml-2'></i> Add Prisoner
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicInfo;
