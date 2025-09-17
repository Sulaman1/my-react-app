import DatePicker from 'react-datepicker';
import { getFormattedDate } from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import PriscriptionGrid from './PriscriptionGrid';
import letter from '../../../assets/images/users/1.png';
import { useState } from 'react';
import { baseImageUrl, postData } from '../../../services/request';

const Checkups = (props) => {
  const [loading, setloading] = useState(false);

  const handleFrontUpload = (value) => {
    if(!value) return;
		const data = {
			image: value.split(',')[1],
			prisoner: false,
			imageName: 'doc'
		};
    setloading(true);
		postData('/services/app/BasicInfo/uploadBase64', data)
			.then(res => {
				if (res.success == true) {
					const pd = {
						...props?.formPayload
					};
						pd['checkups']['clinicalTest'] = res.result.imagePath;
            props?.setFormPayload(pd);
            setloading(false);
				}
			})
			.catch(err => {
				console.log(err,'getting error while uploading');
        setloading(false);
			});
	};

  return (
    <div className="row p-2">
      <div className="row">
        <h4 className="third-heading">{props.title}</h4>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Presently Complaining (فی الحال شکایت)'}
            id={'presently-complaining'}
            require={false}
            icon={'icon-file'}
            defaultValue={props?.formPayload?.checkups.presentlyComplaining}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['presentlyComplaining'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Special Diet (خصوصی خوراک)'}
            id={'special-diet'}
            require={false}
            icon={'icon-toolkit'}
            defaultValue={props?.formPayload?.checkups.specialDiet}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['specialDiet'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Investigations (تحقیقات)'}
            id={'investigations'}
            require={false}
            icon={'icon-file'}
            defaultValue={props?.formPayload?.checkups.investigations}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['investigations'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Treatment (علاج)'}
            id={'treatment'}
            require={false}
            icon={'icon-hospital'}
            defaultValue={props?.formPayload?.checkups.treatment}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['treatment'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Pulse (نبض)'}
            id={'pulse'}
            require={false}
            icon={'icon-hospital'}
            defaultValue={props?.formPayload?.checkups.pulse}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['pulse'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Blood Pressure (بلڈ پریشر)'}
            id={'blood-pressure'}
            require={false}
            icon={'icon-hospital'}
            defaultValue={props?.formPayload?.checkups.bloodPressure}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['bloodPressure'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Temperature (درجہ حرارت)'}
            id={'temperature'}
            require={false}
            icon={'icon-hospital'}
            defaultValue={props?.formPayload?.checkups.temperature}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['temperature'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Gcs (جی سی ایس)'}
            id={'gcs'}
            require={false}
            icon={'icon-hospital'}
            defaultValue={props?.formPayload?.checkups.gcs}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['gcs'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-4">
          <InputWidget
            type={'input'}
            label={'Fbs Rbs (ایف بی ایس آر بی ایس)'}
            id={'fbs-rbs'}
            require={false}
            icon={'icon-hospital'}
            defaultValue={props?.formPayload?.checkups.fbsRbs}
            setValue={(value) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['fbsRbs'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-4">
          <div className='inputs force-active'>
            <label>Checkup Date (چیک اپ کی تاریخ)</label>
          <DatePicker
            selected={getFormattedDate(
              props?.formPayload?.checkups?.checkUpDate
            )}
            onChange={(date) => {
              const payload = {
                ...props.formPayload,
              };
              payload['checkups']['checkUpDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
              props.setFormPayload(payload);
            }}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            icon={'icon-operator'}
            isClearable
            showYearDropdown
            id={'checkup-date'}
            scrollableYearDropdown
            yearDropdownItemNumber={120}
            showMonthDropdown
          />
          </div>
        </div>
        <div className="col-lg-4">

							<InputWidget
								type={'switch'}
								inputType={'checkbox'}
								label={'Improved Health '}
								id={'high-profile'}
								require={false}
								defaultValue={props?.formPayload?.healthImproved}
								setValue={checked => {
									const payload = {
										...props.formPayload
									};
									payload['checkups']['healthImproved'] = checked;
									props.setFormPayload(payload);
								}}
							/>
              </div>
              </div> 
              <div className='row mb-3'>

              <h3 className='sub-heading text-center just-center mb-3'>
              Investigations
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
                    props?.formPayload?.checkups?.clinicalTest
                      ? baseImageUrl +
                      props?.formPayload?.checkups?.clinicalTest
                      : letter
                  }
                  setValue={value => {
                    handleFrontUpload(value);
                  }}
                />
              </div>
              {props?.isCheckup &&
                <div className='mt-2 mb-2'>
                    
                  
                <PriscriptionGrid
                    data={props?.formPayload?.checkups?.priscriptions}
                    setFormPayload={props?.setFormPayload}
                    />
                    </div>
                    }
               </div>
  );
};

export default Checkups;
