import React, { useEffect, useState } from 'react'
import VaccinationModal from './VaccinationModal'
import { getFormattedDate, getItemFromList, transformDataForTableGrid, transfromStringArray, validateDate } from '../../../common/Helpers';
import { getData } from '../../../services/request';
import InputWidget from '../../../droppables/InputWidget';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns';
import { Grid, _ } from 'gridjs-react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';

const AddVaccinationModal = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [vaccinationPayload, setVaccinationPayload] = useState({});
  const [vaccinationData, setVaccinationData] = useState([])
	const newLookups = useSelector((state) => state?.dropdownLookups)
	const show = useSelector((state) => state.language.urdu);

  const getVaccinationData = async () => {
    try {
      const tempdata = newLookups?.vaccinations?.map((item) => {
        return {
          label: item.name,
          value: item.id
        }
      })
      setVaccinationData(tempdata)
    } catch (error) {
      console.log(error, 'getting error while fetching API {GetAllVaccinationsLkpt} and fileName is {AddVaccinationModal.js}')
    }
  }

  useEffect(() => {
    getVaccinationData()
  }, [])

  const handlerSubmit = () => {
    const vaccinations = {
      id: uuidv4(),
      vaccinationLkptId: vaccinationPayload.vaccinationLkptId,
      vaccinationDate: vaccinationPayload.vaccinationDate,
      vaccinationDate2: vaccinationPayload.vaccinationDate2,
      vaccinationDate3: vaccinationPayload.vaccinationDate3,
    };
    props.setVaccinationArray([...props.vaccinationArray, vaccinations])
    setShowModal(false)
    setVaccinationPayload({})

  }

  const gridDataMap = (e) => {
    return {
      vaccination: getItemFromList(vaccinationData, e.vaccinationLkptId),
      vaccinationDate: validateDate(e.vaccinationDate),
      vaccinationDate2: validateDate(e.vaccinationDate2),
      vaccinationDate3: validateDate(e.vaccinationDate3),
      Action: props.isHospital && _(
        <div className="action-btns">
          <button
            id={'cross-btn'}
            type="button"
            onClick={() => deleteMedicineHandler(e.vaccinationLkptId)}
            className="btn btn-danger waves-effect waves-light mx-1"
          >
            <i className="icon-cross-sign-sign"></i>
          </button>
        </div>
      ),
    };
  };

  const deleteMedicineHandler = (id) => {
    const filterData = props?.vaccinationArray?.filter((item) => item.vaccinationLkptId != id);
    props.setVaccinationArray(filterData)
  }

  const getColumns = () => {
    if (!props.isHospital) {
      return [
        `Vaccine${show ? ' (ویکسین)' : ''}`,
        `First Vaccine Date${show ? ' ( پہلا ویکسین کی تاریخ)' : ''}`,
        `Second Vaccine Date${show ? ' (  دوسرا ویکسین کی تاریخ)' : ''}`,
        `Booster Dose Date${show ? ' (  بوسٹر ویکسین کی تاریخ)' : ''}`
      ];
    } else {
      return [
        `Vaccine${show ? ' (ویکسین)' : ''}`,
        `First Vaccine Date${show ? ' ( پہلا ویکسین کی تاریخ)' : ''}`,
        `Second Vaccine Date${show ? ' (  دوسرا ویکسین کی تاریخ)' : ''}`,
        `Booster Dose Date${show ? ' (  بوسٹر ویکسین کی تاریخ)' : ''}`,
        `Action${show ? ' (عملدرامد)' : ''}`
      ];
    }
  };

  return (
    <>
      <VaccinationModal
        visible={showModal}
        title={`Add Vaccine${show ? ' (ویکسین شامل کریں)' : ''}`}
        onClose={() => setShowModal(false)}
        submitHandler={handlerSubmit}
      >
        <form>
          <div className='row'>
            <div className='col-lg-6'>
              <InputWidget
                type={'multiSelect'}
                label={`Vaccination${show ? ' ( ویکسینیشن)' : ''}`}
                require={false}
                icon={'icon-medical'}
                options={vaccinationData || []}
                defaultValue={transfromStringArray(
                  vaccinationData,
                  vaccinationPayload?.vaccinationLkptId
                ) || []}
                setValue={(value) => {
                  const payload = {
                    ...vaccinationPayload,
                  };
                  payload['vaccinationLkptId'] = value.value;
                  setVaccinationPayload(payload);
                }}
              />
            </div>

            <div className='col-lg-6'>
              <div className='inputs force-active'>
                <label>First Covid Vaccine Date ( پہلا ویکسین کی تاریخ)</label>
                <DatePicker
                  icon={'icon-calendar'}

                  selected={getFormattedDate(vaccinationPayload?.vaccinationDate)}
                  onChange={(date) => {
                    const payload = {
                      ...vaccinationPayload,
                    };
                    payload['vaccinationDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                    setVaccinationPayload(payload);
                  }}
                  dateFormat='dd/MM/yyyy'
                  maxDate={addDays(new Date(), 0)}
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={120}
                  showMonthDropdown
                  placeholderText={''}
                  id={'first-covid-vaccine-date'}
                />
              </div>
            </div>
          
            <div className='col-lg-6'>
              <div className='inputs force-active'>
                <label>Second Vaccine Date (  دوسرا ویکسین کی تاریخ)</label>
                <DatePicker
                  icon={'icon-calendar'}
                  selected={getFormattedDate(vaccinationPayload?.vaccinationDate2)}
                  onChange={(date) => {
                    const payload = {
                      ...vaccinationPayload,
                    };
                    payload['vaccinationDate2'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                    setVaccinationPayload(payload);
                  }}
                  dateFormat='dd/MM/yyyy'
                  maxDate={addDays(new Date(), 0)}
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={120}
                  showMonthDropdown
                  placeholderText={''}
                  id={'second-vaccine-date'}
                />
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='inputs force-active'>
                <label>Booster Dose Date (  بوسٹر ویکسین کی تاریخ)</label>
                <DatePicker
                  icon={'icon-calendar'}
                  selected={getFormattedDate(vaccinationPayload?.vaccinationDate3)}
                  onChange={(date) => {
                    const payload = {
                      ...vaccinationPayload,
                    };
                    payload['vaccinationDate3'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                    setVaccinationPayload(payload);
                  }}
                  dateFormat='dd/MM/yyyy'
                  maxDate={addDays(new Date(), 0)}
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={120}
                  showMonthDropdown
                  placeholderText={''}
                  id={'booster-vaccine-date'}
                />
              </div>
            </div>
          </div>
        </form>
      </VaccinationModal> 
        <div className={`${!props.isHospital ? "mb-5" : "mb-0"} btns just-center mt-5`}>
          {props.isHospital && <button
            id={'add-medicine-btn'}
            className="btn btn-success waves-effect waves-light mx-1 px-3 py-2 float-end"
            onClick={() => setShowModal(true)}
            type="button"
          >
            Add Vaccine
          </button>}
        </div>
      <div className="card custom-card animation-fade-grids custom-card-scroll  mb-5 mt-5">
        <Grid
          data={transformDataForTableGrid(
            props.vaccinationArray?.map((item) => gridDataMap(item))
          )}
          columns={getColumns()}
          search={false}
          sort={true}
          pagination={{
            enabled: true,
            limit: 10,
          }}
        />
        </div>
    </>
  )
}

export default AddVaccinationModal