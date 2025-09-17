import InputWidget from '../../../../../droppables/InputWidget';
import { postData } from '../../../../../services/request';
import swal from 'sweetalert';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { transfromStringArray } from '../../../../../common/Helpers';

const VisitorInfo = (props) => {
  const { clearAll } = props;

  const checkCNIC = async (value) => {

    let valLength = value.length;
    if (valLength === 15) {
      const prisoner = JSON.parse(sessionStorage.getItem('prisonerEntry'));
      const checkURL = `${props.checkCNICURL}?CNIC=${value}&prisonerId=${prisoner.id}`;

      try {
        const res = await postData(checkURL, {});
        if (res.success) {
          if (res.result !== null) {
            const foundData = res.result;
            swal({
              title: 'This visitor already exists in the system',
              text: 'Do you want to load his/her details?.',
              icon: 'warning',
              buttons: true,
            }).then((willProceed) => {
              if (willProceed) {

                props.onFoundData(foundData);
                props.setFoundVisitor(true)
              }
            });
          }
        }
      } catch (err) {
        swal('Something went wrong!', '', 'warning');
      }
      finally {

      }
    }
  };

  return (
    <div className="tabs-wraper">
      <div className="tabs-panel hover-card">
        <div className="row ">
          <div className="row ">
            <h4 className="third-heading">{props.title}</h4>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <InputWidget
                type={'cnic'}
                inputType={'text'}
                label={'CNIC (شناختی کارڈ نمبر)'}
                id={'cnic'}
                icon={'icon-visitor-card'}
                onlyNumbers={true}
                readO
                defaultValue={props?.formPayload?.personalInfo?.cnic || ''}
                clearAll={clearAll}
                setValue={(value) => {
                  checkCNIC(value);
                  const payload = {
                    ...props.formPayload,
                  };
                  payload['personalInfo']['cnic'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                inputType={'text'}
                label={'Full Name (پورا نام)'}
                id={'full-name'}
                onlyLetters={true}
                require={false}
                icon={'icon-operator'}
                defaultValue={props?.formPayload?.personalInfo?.fullName ?? ''}
                readOnly={props.foundVisitor ? true : ""}
                setValue={(value) => {
                  const payload = {
                    ...props.formPayload,
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
                  props.relationshipTypes || []
                }
                defaultValue={
                  transfromStringArray(
                    props.relationshipTypes,
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
                  payload['personalInfo'][
                    'relationshipType'
                  ] = value.label;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                inputType={'text'}
                label={'Relationship Name'}
                id={'father-name'}
                onlyLetters={true}
                require={false}
                icon={'icon-operator'}
                defaultValue={props?.formPayload?.personalInfo?.relationshipName ?? ''}
                readOnly={props.foundVisitor ? true : ""}
                setValue={(value) => {
                  const payload = {
                    ...props.formPayload,
                  };
                  payload['personalInfo']['relationshipName'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            <div className="col-lg-6">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                id={'name'}
                label={'Relationship (قیدی سے تولق)'}
                multiple={false}
                icon={'icon-planer'}
                options={props.relationships || []}
                defaultValue={props?.formPayload?.relationshipId ? props.relationships.filter(item => item.value === props?.formPayload?.relationshipId) : ''}
                selectType={'relation'}
                setValue={(value) => {
                  const payload = {
                    ...props.formPayload,
                  };
                  payload['relationshipId'] = value.value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorInfo;
