import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../../../services/request';
import { transformData, getFormattedDate } from '../../../../common/Helpers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputWidget from '../../../../droppables/InputWidget';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';

const ViewRemissionPrisonerDetails = ({ show, handleClose, submitRemission, remissionFields, setRemissionFields, isDeduct }) => {
  const newLookups = useSelector((state) => state?.dropdownLookups);

  const [fetchedData, setData] = useState({});

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const data = {
        remissions: transformData(newLookups?.remission, true),
        authorities: transformData(newLookups?.authorityTypes),
      };
      setData(data);
    } catch (err) {
      alert('An error occurred');
    }
  };

  const handleDateChange = (date, field) => {
    const pd = {
      ...remissionFields,
    };
    pd[field] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
    setRemissionFields(pd);
  };

  const handleInputChange = (value, field) => {
    const pd = {
      ...remissionFields,
    };
    pd[field] = value;
  
    setRemissionFields(pd);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="custom-xl">
        <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
          <h3 className="modal-title" id="exampleModalgridLabel">
            {isDeduct ? 'Deduct Remission' : "Create Remission"}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 px-0 mt-1">
            <div className="row">
              <form>
                {isDeduct ? (
                  <>
                    <div className="col-lg-12">
                      <InputWidget
                        type={'multiSelect'}
                        inputType={'name'}
                        label={`Remission Deduction Type `}
                        id={'remission-type'}
                        require={false}
                        options={fetchedData['remissions'] || []}
                        icon={'icon-operator'}
                        multiple={false}
                        setValue={(value) => handleInputChange(value.value, 'remissionId')}
                      />
                    </div>
                    <div className="col-lg-12">
                      <div className='inputs force-active'>
                        <label>Remission Deduction Date</label>
                        <DatePicker
                          selected={getFormattedDate(remissionFields.deductionDate)}
                          onChange={date => handleDateChange(date, 'deductionDate')}
                          dateFormat='dd/MM/yyyy'
                          icon={'icon-operator'}
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={120}
                          showMonthDropdown
                          placeholderText={''}
                          id={'remission-date'}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <InputWidget
                        type={'input'}
                        inputType={'text'}
                        label={'Deduction Reason'}
                        id={'reason'}
                        require={false}
                        icon={'icon-glamping'}
                        defaultValue={remissionFields.deductionReason}
                        setValue={(value) => handleInputChange(value, 'deductionReason')}
                      />
                    </div>
                    <div className="col-lg-12">
                      <InputWidget
                        type={'input'}
                        inputType={'number'}
                        label={'Deduction Days Earned'}
                        id={'deduction-days-earned'}
                        require={false}
                        icon={'icon-number'}
                        defaultValue={remissionFields.remissionDaysEarned}
                        setValue={(value) => handleInputChange(+value, 'remissionDaysEarned')}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-lg-12">
                      <InputWidget
                        type={'multiSelect'}
                        inputType={'name'}
                        label={`Remission Type `}
                        id={'remission-type'}
                        require={false}
                        options={fetchedData['remissions'] || []}
                        icon={'icon-operator'}
                        multiple={false}
                        setValue={(value) => handleInputChange(value.value, 'remissionId')}
                      />
                    </div>
                    <div className="col-lg-12">
                      <div className='inputs force-active'>
                        <label>Remission Date</label>
                        <DatePicker
                          selected={getFormattedDate(remissionFields.remissionDate)}
                          onChange={date => handleDateChange(date, 'remissionDate')}
                          dateFormat='dd/MM/yyyy'
                          icon={'icon-operator'}
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={120}
                          showMonthDropdown
                          placeholderText={''}
                          id={'remission-date'}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <InputWidget
                        type={'input'}
                        inputType={'number'}
                        label={'Remission Days Earned'}
                        id={'remission-days-earned'}
                        require={false}
                        icon={'icon-number'}
                        defaultValue={remissionFields.remissionDaysEarned}
                        setValue={(value) => handleInputChange(+value, 'remissionDaysEarned')}
                      />
                    </div>
                    <div className="col-lg-12">
                      <div className='inputs force-active'>
                        <label>Next Due Date</label>
                        <DatePicker
                          selected={getFormattedDate(remissionFields.nextDueDate)}
                          onChange={date => handleDateChange(date, 'nextDueDate')}
                          dateFormat='dd/MM/yyyy'
                          icon={'icon-operator'}
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={120}
                          showMonthDropdown
                          placeholderText={''}
                          id={'next-remission-date'}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="col-lg-12">
                  <InputWidget
                    type={'multiSelect'}
                    inputType={'name'}
                    label={'Authorities'}
                    id={'authorities'}
                    require={false}
                    options={fetchedData['authorities'] || []}
                    icon={'icon-operator'}
                    multiple={false}
                    setValue={(value) => handleInputChange(value.value, 'authorityTypeId')}
                  />
                </div>
                <div className="col-lg-12">
                  <InputWidget
                    type={'input'}
                    inputType={'text'}
                    label={'Remarks'}
                    id={'remarks'}
                    require={false}
                    icon={'icon-glamping'}
                    defaultValue={remissionFields.remarks}
                    setValue={(value) => handleInputChange(value, 'remarks')}
                  />
                </div>
                <div className='col-lg-12'>
                  <InputWidget
                    type={"switch"}
                    inputType={"checkbox"}
                    label={"Is Individual Remission? "}
                    id={"individual"}
                    require={false}
                    defaultValue={remissionFields?.isIndividualRemission || false}
                    setValue={(value) => handleInputChange(value, 'isIndividualRemission')}
                  />
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button id={'cancel-btn'} className="btn btn-light" onClick={handleClose}>
            Cancel
          </button>
          <button id={'create-btn'} className="btn btn-primary" onClick={submitRemission}>
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewRemissionPrisonerDetails;
