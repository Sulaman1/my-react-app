/* eslint-disable no-tabs */
/* eslint-disable react/prop-types */
import React from 'react';
import { transfromStringArray } from '../../../../common/Helpers';
import InputWidget from '../../../../droppables/InputWidget';


const WomenGaurdian = props => {


  return (
    <>
        <div className=''>
          <form>
          <div className='row '>
            <div className='col-lg-6'>
              <InputWidget
                type={'input'}
                inputType={'name'}
                label={'Name (نام)'}
                id={'name'}
                onlyLetters={true}
                require={false}
                icon={'icon-operator'}
                defaultValue={
                  props?.formPayload?.fullName
                }
                setValue={value => {
                  const payload = {
                    ...props.formPayload
                  };
                  payload['fullName'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
              <div className='col-lg-6'>
                <InputWidget
                  type={'input'}
                  inputType={'number'}
                  label={'Mobile Number (نمبر)'}
                  id={'mobile_number'}
                  require={false}
                  icon={'icon-number'}
                  defaultValue={
                    props?.formPayload?.phoneNumber
                  }
                  setValue={value => {
                    const payload = {
                      ...props.formPayload
                    };
                    payload['phoneNumber'] = value;
                    props.setFormPayload(payload);
                  }}
                />
              </div>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'multiSelect'}
                    ismulti={false}
                    inputType={'select'}
                    label={'Relation'}
                    id={'relation'}
                    require={false}
                    icon={'icon-like'}
                    options={props?.lookups?.relationship || []}
                    defaultValue={
                      transfromStringArray(
                        props?.lookups?.relationship,
                        props?.formPayload?.relationshipId
                      ) || []
                    }
                    setValue={value => {
                      const payload = {
                        ...props.formPayload
                      };
                      payload['relationshipId'] =
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
                  props?.formPayload?.cnic
                }
                setValue={(value, event) => {
                  const payload = {
                    ...props.formPayload
                  };
                  payload['cnic'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
        </div>
        </form>
      </div>
    </>
  );
};

export default WomenGaurdian;
