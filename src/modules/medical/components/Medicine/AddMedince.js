import { useEffect } from 'react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import {
  getFormattedDate,
  getValueFromList,
  transformData,
} from '../../../../common/Helpers';
import { lookupName } from '../../../../components/admin/system-settings/lookupNames';
import InputWidget from '../../../../droppables/InputWidget';
import { getData, baseImageUrl, postData } from '../../../../services/request';
import letter from '../../../../assets/images/users/1.png';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';

const AddMedicine = (props) => {
  const [lookups, setLookups] = useState({});
  const [medicines, setMedicines] = useState([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showSelfInput, setShowSelfInput] = useState(false);
  const [showDonor, setShowDonor] = useState(false);
  const [loading, setloading] = useState(false);
  const newLookups = useSelector((state) => state?.dropdownLookups)
  const [abbre,setAbbre] = useState('');
  useEffect(() => {
    fetchApiData();
  }, []);
  const fetchApiData = async () => {
    const user = JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));

    const allottedPrisons = user.prisons.map(({ prisonId, prisonName }) => ({
      id: prisonId,
      name: prisonName,
    }));
    try {
      const data = {};
      let medicineProvidedObj = transformData(newLookups?.getAllMedicineProvidedByeList);
        data['medicineProvidedByList'] = medicineProvidedObj;
        
        let medicineTypeObj = transformData(newLookups?.medicineType);
        data['medicineTypes'] = medicineTypeObj;

        let medicineObj = transformData(newLookups?.medicine);
        data['medicines'] = medicineObj;
    
        let donorsObj = transformData(newLookups.donors);
        data['donors'] = donorsObj;
      
        let typesObj = newLookups?.quantityTypes.map(({ name, id }) => ({
          value: id,
          label: name,
        }));
        data['quantityTypes'] = typesObj;

      const prisonsObj = allottedPrisons.length
        ? transformData(allottedPrisons)
        : transformData(newLookups?.prison);

      data['prisons'] = prisonsObj;

      console.log(data);

      setLookups(data);
    } catch (err) {
      alert('An error occured');
    }
  };

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
						...props.formPayload
					};
          pd['UploadedDocuments'] = res.result.imagePath;
          
          props.setFormPayload(pd);
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
        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Medicine Type (دوا کی قسم)'}
            id={'medicine-type'}
            require={true}
            multiple={false}
            icon={'icon-medical'}
            options={lookups['medicineTypes'] || []}
            defaultValue={lookups['medicineTypes']?.find(item => item.label === props.formPayload.medicineType)}
            setValue={(value) => {
              setAbbre('')
              const payload = {
                ...props.formPayload,
              };
              const medicines = transformData(newLookups.medicine.filter(item => item.medicineTypeId === value.value))
              setMedicines(medicines)
              payload['medicineTypeId'] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>
              
        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Medicine (دوا)'}
            id={'medicine'}
            multiple={false}
            icon={'icon-medical'}
            options={medicines}
            defaultValue={getValueFromList(
              lookups['medicines'],
              props.formPayload.medicineId
            )}
            setValue={(value) => {
              console.log('medicineId', value);
              const payload = {
                ...props.formPayload,
              };
              console.log(newLookups)
              const abbrev = newLookups.medicine.filter(item => item.id === value.value)[0]
              setAbbre(abbrev?.abbreviation)  
              payload['medicineId'] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        
        <div className="col-lg-6">
        <InputWidget
            type={'input'}
            label={'Generic Name'}
            id={'generic-name'}
            require={false}
            readOnly={true}
            icon={'icon-medical'}
            defaultValue={props?.formPayload?.medicineId ? newLookups.medicine.find(item => item.id === props.formPayload.medicineId).abbreviation : abbre}
          />
        </div>
        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            label={'Batch Number (بیچ نمبر)'}
            id={'batch-number'}
            require={false}
            icon={'icon-number'}
            defaultValue={props?.formPayload?.batchNumber}
            setValue={(value) => {
              console.log('batchNumber', value);
              const payload = {
                ...props.formPayload,
              };
              payload['batchNumber'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Prison (جیل)'}
            id={'prison'}
            multiple={false}
            icon={'icon-prison'}
            options={lookups['prisons'] || []}
            isDisabled={props.formPayload?.isEdit}
            defaultValue={getValueFromList(
              lookups['prisons'],
              props.formPayload.prisonId
            )}
            setValue={(value) => {
              console.log('prisonId', value);
              const payload = {
                ...props.formPayload,
              };
              payload['prisonId'] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <div className='inputs force-active'>
            <label>Recieve date</label>
            <DatePicker
              selected={getFormattedDate(props.formPayload.recieveDate)}
              onChange={(date) => {
                const payload = {
                  ...props.formPayload,
                };
                payload['recieveDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                props.setFormPayload(payload);
              }}
              dateFormat="dd/MM/yyyy"
              icon={'icon-operator'}
              isClearable
              id={'recieve-date (تاریخ موصولی)'}
              maxDate={new Date()}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
            />
          </div>

        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            inputType={'number'}
            label={'Per Pack Count (فی پیک شمار)'}
            id={'per-pack-count'}
            require={false}
            min={0}
            readOnly={props.formPayload?.isEdit}
            icon={'icon-number'}
            defaultValue={props?.formPayload?.perPackCount}
            setValue={(value) => {
              console.log('perPackCount', value);
              const payload = {
                ...props.formPayload,
              };
              payload['perPackCount'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Quantity Type (توداد قسم)'}
            id={'quantity-type'}
            multiple={false}
            icon={'icon-medical'}
            isDisabled={props.formPayload?.isEdit}
            options={lookups['quantityTypes'] || []}
            defaultValue={getValueFromList(
              lookups['quantityTypes'],
              props.formPayload.quantityType
            )}
            setValue={(value) => {
              console.log('quantityType', value);
              const payload = {
                ...props.formPayload,
              };
              payload['quantityType'] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            inputType={'number'}
            label={'Quantity (تعداد)'}
            id={'quantity'}
            min={0}
            readOnly= {props.formPayload?.isEdit}
            require={false}
            icon={'icon-number'}
            defaultValue={props?.formPayload?.quantity?.toString()?.split(' ')[0] || ''}
            setValue={(value) => {
              console.log('quantity', value);
              const payload = {
                ...props.formPayload,
              };
              payload['quantity'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>
       
        <div className="col-lg-6">
          <div className='inputs force-active'>
            <label>Manufacturing Date (تاریخ تیاری)</label>
            <DatePicker
              selected={getFormattedDate(props.formPayload.manufacturingDate)}
              onChange={(date) => {
                const payload = {
                  ...props.formPayload,
                };
                payload['manufacturingDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                props.setFormPayload(payload);
              }}
              dateFormat="dd/MM/yyyy"
              icon={'icon-operator'}
              isClearable
              maxDate={new Date()}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              id={'manufacturing-date'}
            />
          </div>
        </div>
        <div className="col-lg-6">
          <div className='inputs force-active'>
            <label>Expiry Date (ایکسپائری تاریخ)</label>
            <DatePicker
              selected={getFormattedDate(props.formPayload.expiryDate)}
              onChange={(date) => {
                const payload = {
                  ...props.formPayload,
                };
                payload['expiryDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                props.setFormPayload(payload);
              }}
              dateFormat="dd/MM/yyyy"
              icon={'icon-event'}
              isClearable
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={120}
              showMonthDropdown
              id={'expiry-date'}
            />
          </div>
        </div>

       

        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            label={'Description (تفصیل)'}
            id={'description'}
            require={false}
            icon={'icon-chat'}
            defaultValue={props?.formPayload?.discription}
            setValue={(value) => {
              console.log('discription', value);
              const payload = {
                ...props.formPayload,
              };
              payload['discription'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            label={'Serial No (سیریل نمبر)'}
            id={'serial-no'}
            require={false}
            icon={'icon-number'}
            defaultValue={props?.formPayload?.serialNo}
            setValue={(value) => {
              console.log('serialNo', value);
              const payload = {
                ...props.formPayload,
              };
              payload['serialNo'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            label={'Page Number (صفحہ نمبر)'}
            id={'page-number'}
            inputType={"number"}
            min={0}
            require={false}
            icon={'icon-number'}
            defaultValue={props?.formPayload?.pageNumber}
            setValue={(value) => {
              console.log('pageNumber', value);
              const payload = {
                ...props.formPayload,
              };
              payload['pageNumber'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            label={'Manufacturer (کمپنی)'}
            id={'manufacturer'}
            require={false}
            icon={'icon-building'}
            defaultValue={props?.formPayload?.manufacturer}
            setValue={(value) => {
              console.log('manufacturer', value);
              const payload = {
                ...props.formPayload,
              };
              payload['manufacturer'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Medicine provided By (دوائی فراہم کی۔)'}
            id={'quantity-type'}
            multiple={false}
            icon={'icon-medical'}
            options={lookups['medicineProvidedByList'] || []}
            defaultValue={lookups['medicineProvidedByList']?.find(item => item.value === props.formPayload.providedBy)}
            setValue={(value) => {

              console.log('providedBy', value.label);
              const payload = {
                ...props.formPayload,
              };
              payload['providedBy'] = value.value;
              setShowOtherInput(value.label === 'Other');
              setShowSelfInput(value.label === 'Self');
              setShowDonor(value.label === 'donor');
              props.setFormPayload(payload);
            }}
          />
        </div>
        {(showOtherInput || props.formPayload.providedBy === 3 ) && (
         <div className="col-lg-6">
            <InputWidget
              type={'input'}
              label={'Other (دیگر)'}
              id={'Other'}
              require={false}
              icon={'icon-chat'}
              defaultValue={props?.formPayload?.providedByOther}
              setValue={(value) => {
                console.log('providedByOther', value);
                const payload = {
                  ...props.formPayload,
                };
                payload['providedByOther'] = value;
                props.setFormPayload(payload);
              }}
            />
          </div>
          )}
        {(showSelfInput || props.formPayload.providedBy === 2) && (
         <div className="col-lg-6">
            <InputWidget
              type={'input'}
              label={'Invoice Number (انوائس تعداد)'}
              id={'invoice'}
              require={false}
              icon={'icon-number'}
              defaultValue={props?.formPayload?.providedByOther}
              setValue={(value) => {
                console.log('providedByOther', value);
                const payload = {
                  ...props.formPayload,
                };
                payload['providedByOther'] = value;
                props.setFormPayload(payload);
              }}
            />
          </div>
          )}
        {(showDonor || props.formPayload.providedBy === 0) && (
         <div className="col-lg-6">
            <InputWidget
              type={'multiSelect'}
              label={'Donors (انوائس تعداد)'}
              id={'invoice'}
              require={false}
              icon={'icon-medical'}
              options={lookups?.donors}
              defaultValue={lookups['donors']?.find(item => item.value === props.formPayload.providedByOther)}
              setValue={(value) => {
                console.log('providedByOther', value);
                const payload = {
                  ...props.formPayload,
                };
                payload['providedByOther'] = value.value;
                props.setFormPayload(payload);
              }}
            />
          </div>
          )}
          <div className="col-lg-12">
        <h3 className='sub-heading text-center just-center mb-3'>
              Batch Image
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
                  props?.formPayload?.hearings?.hearingDocuments
                    ? baseImageUrl +
                  props?.formPayload?.hearings?.hearingDocuments
                    : letter
                }
                setValue={value => {
                  handleFrontUpload(value);
                }}
              />
              {loading && (
            <div className=" mt-4 mb-4 d-flex  justify-content-center gap-2 align-items-center">
              <b>Please wait...</b> <br /><Spinner animation="border" variant="primary" />
            </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default AddMedicine;
