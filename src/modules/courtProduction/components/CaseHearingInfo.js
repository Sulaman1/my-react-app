import DatePicker from 'react-datepicker';
import letter from '../../../assets/images/users/1.png';

import { getFormattedDate, getValueFromList, validateDate } from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { baseImageUrl, postData } from '../../../services/request';
import { useDispatch } from 'react-redux';

const CaseHearingInfo = (props) => {
  const handleFrontUpload = (value) => {
    if (!value) return;
    const data = {
      image: value.split(',')[1],
      prisoner: false,
      imageName: 'doc'
    };

    postData('/services/app/BasicInfo/uploadBase64', data)
      .then(res => {
        if (res.success == true) {
          const pd = {
            ...props.formPayload
          };


          pd['hearingDocuments'] = res.result.imagePath;
          props.setFormPayload(pd);

        }
      })
      .catch(err => {
        console.log(err, 'getting error while uploading');
      });
  };
  return (
    <div className="row p-2">
      <div className="row">
        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Trial Court (ٹریل کورٹ)'}
            id={'trial-court'}
            multiple={false}
            icon={'icon-court'}
            options={props.lookups?.['courts'] || []}
            defaultValue={getValueFromList(
              props.lookups?.['courts'],
              props.formPayload.courtId
            )}
            setValue={(value) => {
              console.log('courtId', value);
              const payload = {
                ...props.formPayload,
              };
              payload['courtId'] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Remanding Court (ریمانڈ عدالت)'}
            id={'remanding-court'}
            multiple={false}
            icon={'icon-court'}
            options={props.lookups?.['remandingCourts'] || []}
            defaultValue={getValueFromList(
              props.lookups?.['remandingCourts'],
              props.formPayload.remandingCourtId
            )}
            setValue={(value) => {
              console.log('remandingCourtId', value);
              const payload = {
                ...props.formPayload,
              };
              payload['remandingCourtId'] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            isMulti={false}
            inputType={'name'}
            label={'Judges'}
            id={'judges'}
            require={false}
            icon={'icon-court'}
            defaultValue={props.formPayload?.judge || ''}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['judge'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <div className='inputs force-active'>
            <label>Last Hearing Date (آخری پیشی کی تاریخ)</label>
            <DatePicker
              selected={validateDate(props?.formPayload?.lastHearingDate) ? getFormattedDate(props?.formPayload?.lastHearingDate) : null}
              onChange={(date) => {
                const payload = {
                  ...props.formPayload,
                };
                payload['lastHearingDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                props.setFormPayload(payload);
              }}
              dateFormat="dd/MM/yyyy"
              icon={'icon-operator'}
              id={'last-hearing-date'}
              isClearable
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className='inputs force-active'>
            <label>Next Hearing Date (اگلی پیشی کی تاریخ)</label>
            <DatePicker
              selected={getFormattedDate(props.formPayload.nextHearingDate)}
              onChange={(date) => {
                const payload = {
                  ...props.formPayload,
                };
                payload['nextHearingDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                props.setFormPayload(payload);
              }}
              dateFormat="dd/MM/yyyy"
              icon={'icon-operator'}
              id={'next-hearing-date'}
              minDate={new Date()}
              isClearable
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
            />
          </div>
        </div>
        <div className='col-lg-6'>
          <InputWidget
            type={'switch'}
            inputType={'checkbox'}
            label={'Is Zamima?'}
            id={'same-address'}
            defaultValue={props.formPayload?.Zamima}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['Zamima'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>



        <div className='col-lg-9'>
          <h3 className='sub-heading text-center just-center mb-3'>
            Warrant Upload
          </h3>
          <InputWidget
            id={'user'}
            type={'editImage'}
            inputType={'file'}
            upload={'icon-upload'}
            noCropping={true}
            onlyUploadFile={true}
            take={'icon-photographers'}
            require={false}
            Photo={
              props.formPayload?.hearingDocuments
                ? baseImageUrl +
                props.formPayload?.hearingDocuments
                : letter
            }
            setValue={value => {
              handleFrontUpload(value);
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default CaseHearingInfo;
