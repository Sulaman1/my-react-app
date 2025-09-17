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
import { baseImageUrl, getData, postData } from '../../../../services/request';
import { useSelector } from 'react-redux';
import letter from '../../../../assets/images/users/1.png';

const AddInventory = (props) => {
  const [lookups, setLookups] = useState({});
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showSelfInput, setShowSelfInput] = useState(false);
  const [showDonor, setShowDonor] = useState(false);
  const newLookups = useSelector((state) => state?.dropdownLookups)
  
  const [inventories,setInventories] = useState(null);
  console.log('lookups: ', lookups);

  useEffect(() => {
    fetchApiData();
  }, []);

  const handleFrontUpload = (value) => {
    if(!value) return;
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
						pd['uploadedDocuments'] = res.result.imagePath;
            props?.setFormPayload(pd);
            

				}
			})
			.catch(err => {
				console.log(err,'getting error while uploading');
        

			});
	};

  const fetchApiData = async () => {
    const user = JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'));

    const allottedPrisons = user.prisons.map(({ prisonId, prisonName }) => ({
      id: prisonId,
      name: prisonName,
    }));

    try {
      const data = {};
      let medicineProvidedObj = transformData(
        newLookups?.getAllMedicineProvidedByeList
      );
      data["medicineProvidedByList"] = medicineProvidedObj;

      let donorsObj = transformData(newLookups?.donors);
      data["donors"] = donorsObj;

      const fetchedPrisons = await getData(lookupName.prison, '', true);
      const prisonsObj = allottedPrisons.length
        ? transformData(allottedPrisons)
        : transformData(lookupName?.prison);

      data["prisons"] = prisonsObj;

      const inventoryTypeObj = transformData(newLookups?.inventoryType);
      data["inventoryType"] = inventoryTypeObj;

      const inventoryObj = transformData(newLookups?.inventory);
      data["inventory"] = inventoryObj;
      setInventories(newLookups?.inventory)
      setLookups(data);
      console.log(data);
    } catch (err) {
      alert("An error occured");
    }
  };
  console.log(lookups);

  return (
    <div className="row p-2">
      <div className="row">

        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Inventory Type (انوینٹری کی قسم)'}
            id={'Inventory'}
            multiple={false}
            icon={'icon-medical'}
            options={lookups['inventoryType'] || []}
            defaultValue={getValueFromList(
              lookups['inventoryType'],
              props.formPayload.inventoryTypeId
            )}
            setValue={(value) => {
              console.log('inventoryType', value);
              const payload = {
                ...props.formPayload,
              };
              payload['inventoryType'] = value.value;
              payload['inventoryId'] = 0;
              props.setFormPayload(payload);
              lookups['inventory'] = transformData(inventories.filter(item => item.inventoryTypeId === value.value)) 
              setLookups(lookups)
            }}
          />
        </div>
        <div className="col-lg-6">
          <InputWidget
            type={'multiSelect'}
            inputType={'name'}
            label={'Inventory (انوینٹری)'}
            id={'Inventory'}
            multiple={false}
            icon={'icon-medical'}
            options={ lookups['inventory'] || []}
            defaultValue={props?.formPayload?.inventoryId ? getValueFromList(
              lookups['inventory'],
              props.formPayload.inventoryId
            ) : {}}
            setValue={(value) => {
              console.log('medicineId', value);
              const payload = {
                ...props.formPayload,
              };
              payload['inventoryId'] = value.value;
              props.setFormPayload(payload);
            }}
          />
        </div>

        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            label={'total Recived (کل موصول)'}
            id={'batch-number'}
            require={false}
            inputType={'number'}
            min={0}
            icon={'icon-number'}
            defaultValue={props?.formPayload?.totalRecived}
            setValue={(value) => {
              console.log('batchNumber', value);
              const payload = {
                ...props.formPayload,
              };
              payload['totalRecived'] = value;
              props.setFormPayload(payload);
            }}
          />
        </div>
        <div className="col-lg-6">
          <InputWidget
            type={'input'}
            label={'Batch Number (بیچ نمبر)'}
            id={'batch-number'}
            inputType={'number'}
            min={0}
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
            min={0}
            label={'quantity (تعداد)'}
            id={'quantity'}
              require={false}
            icon={'icon-number'}
            defaultValue={props?.formPayload?.quantity || ''}
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
            label={'Item provided By (انوینٹری فراہم کی)'}
            id={'item-provied'}
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
              defaultValue={lookups['donors']?.find(item => item.value === props.formPayload.donor)}
              setValue={(value) => {
                console.log('providedByOther', value);
                const payload = {
                  ...props.formPayload,
                };
                payload['donorId'] = value.value;
                props.setFormPayload(payload);
              }}
            />
          </div>
          )}

                <div className='col-lg-12'>

              <h3 className='sub-heading text-center just-center mb-3'>
              Documents 
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
                    props?.formPayload?.uploadedDocuments
                      ? baseImageUrl +
                      props?.formPayload?.uploadedDocuments
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

export default AddInventory;
