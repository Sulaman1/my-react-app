/* eslint-disable no-tabs */
/* eslint-disable react/prop-types */
import React from 'react';
import InputWidget from '../../../../droppables/InputWidget';
import { transfromStringArray, validateDate, getFormattedDate, transformData } from '../../../../common/Helpers';
import DatePicker from 'react-datepicker';


const OffenceForm = props => {
  const [offences, setOffences] = React.useState([]);
  const handleOffenceTypeChange = value => {
    try {
      const response = props?.lookups?.RawOffences.filter(offence => offence.offenseTypeId === value);
      setOffences(transformData(response));
    } catch (error) {
      
    }
  }
  return (
    <>
      <div className=''>
        <form>
          <div className='row '>
            <div className='col-md-12'>
                <InputWidget
                  type={'multiSelect'}
                  ismulti={false}
                  inputType={'select'}
                  label={'Offence Type (جرم کی قسم)'}
                  id={'relation'}
                  require={false}
                  icon={'icon-like'}
                  options={props?.lookups?.OffenceTypes || []}
                  defaultValue={
                    transfromStringArray(
                      props?.lookups?.OffenceTypes,
                      props?.formPayload?.offenseTypeId
                    ) || []
                  }
                  setValue={value => {
                    handleOffenceTypeChange(value.value);
                    const payload = {
                      ...props.formPayload
                    };
                    payload['offenseTypeId'] =
                      value.value;
                    props.setFormPayload(payload);
                  }}
                />
            </div>
            <div className='col-md-12'>
              <InputWidget
                type={'multiSelect'}
                ismulti={false}
                inputType={'select'}
                label={'Offence (جرم)'}
                id={'relation'}
                require={false}
                icon={'icon-like'}
                options={offences || []}
                defaultValue={
                  transfromStringArray(
                    offences,
                    props?.formPayload?.OffenseId
                  ) || []
                }
                setValue={value => {
                  const payload = {
                    ...props.formPayload
                  };
                  payload['OffenseId'] =
                    value.value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            <div className='col-md-12'>
              <div className='inputs force-active'>
                <label>Offence Date </label>
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
                  id={'start-offence-date'}
                  selected={validateDate(props?.formPayload?.offenseDate) ? getFormattedDate(props?.formPayload?.offenseDate) : null}
                  onChange={date => {
                    const payload = {
                      ...props.formPayload
                    };
                    payload['offenseDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                    props.setFormPayload(payload);
                  }}
                />
              </div>
              <div className='col-md-12'>
                <div className='inputs force-active'>
                  <InputWidget
                    type={'input'}
                    inputType={'name'}
                    label={'Remarks (تبصرے)'}
                    id={'remarks'}
                    require={false}
                    onlyLetters={true}
                    icon={'icon-operator'}
                    defaultValue={
                      props?.formPayload?.remarks || ''
                    }
                    setValue={value => {
                      const payload = {
                        ...props.formPayload
                      };
                      payload['remarks'] =
                        value;
                      props.setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default OffenceForm;
