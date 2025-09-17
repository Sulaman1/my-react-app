import React, { useState, useEffect } from 'react'
import InputWidget from '../../../droppables/InputWidget'
import { transfromStringArray, transformData, getIds } from '../../../common/Helpers'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useSelector } from 'react-redux'
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from 'react-icons/io'
import { Collapse } from 'react-bootstrap'
import { booleanOptions } from '../../../common/ReportHelpers'

const PrisonerEducationForm = ({ type, formPayload, setFormPayload }) => {
  const [educations, setEducations] = useState([])
  console.log(educations, "educations")
  const [open, setOpen] = useState(true)
  
  // Update to use date ranges for education start and end
  const [startDateRange, setStartDateRange] = useState(() => {
    const startDate = formPayload?.prisonerEducations?.startDateRange?.start
      ? new Date(formPayload.prisonerEducations.startDateRange.start)
      : null;
    const endDate = formPayload?.prisonerEducations?.startDateRange?.end
      ? new Date(formPayload.prisonerEducations.startDateRange.end)
      : null;
    return [startDate, endDate];
  });
  
  const [endDateRange, setEndDateRange] = useState(() => {
    const startDate = formPayload?.prisonerEducations?.endDateRange?.start
      ? new Date(formPayload.prisonerEducations.endDateRange.start)
      : null;
    const endDate = formPayload?.prisonerEducations?.endDateRange?.end
      ? new Date(formPayload.prisonerEducations.endDateRange.end)
      : null;
    return [startDate, endDate];
  });
  
  // Destructure for easier access
  const [startDateRangeStart, startDateRangeEnd] = startDateRange;
  const [endDateRangeStart, endDateRangeEnd] = endDateRange;
  
  const newLookups = useSelector((state) => state?.dropdownLookups)
  const [lookup, setLookup] = useState();
  const [prisons, setPrisons] = useState([]);
  
  // Selected education type ID (only for filtering, not saved to payload)
  const [selectedEducationTypeId, setSelectedEducationTypeId] = useState(null);

  useEffect(() => {
    try {
      let lookup = {};
      // Transform education type lookup data
      const educationTypeObj = transformData(newLookups?.EducationTypeLkpt);
      lookup["educationType"] = educationTypeObj;
      
      // Transform education lookup data
      const educationObj = transformData(newLookups?.EducationLKPT);
      lookup["education"] = educationObj;
      
      // Get prison data for dropdown
      const prisonObj = transformData(newLookups?.prison);
      lookup["prison"] = prisonObj;
      
      setLookup(lookup);
      setPrisons(lookup.prison || []);

      // Log available data for debugging
      console.log("All lookups data:", newLookups);
      console.log("Education Types:", educationTypeObj);
      console.log("Educations:", educationObj);
      
      // If educations are available, set them to be used
      if (educationObj && educationObj.length > 0) {
        console.log("Setting all available educations");
        setEducations(educationObj);
      }
      
      // Check the structure of the first education to understand its properties
      if (newLookups?.EducationLKPT && newLookups.EducationLKPT.length > 0) {
        console.log("First education object structure:", newLookups.EducationLKPT[0]);
      }
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong in lookups api");
    }
  }, [newLookups])

  const handleEducationTypeChange = value => {
    try {
      // Extract the education type ID from the selected value
      const educationTypeId = value?.value || null;
      console.log("Selected education type ID:", educationTypeId);
      setSelectedEducationTypeId(educationTypeId);
      
      if (educationTypeId && newLookups?.EducationLKPT) {
        // Look at the first education to check available properties
        if (newLookups.EducationLKPT.length > 0) {
          console.log("Sample education object:", newLookups.EducationLKPT[0]);
        }
        
        // Try different possible property names for type ID
        const filteredEducations = newLookups.EducationLKPT.filter(
          education => 
            education.educationTypeLkptId === educationTypeId || 
            education.educationTypeId === educationTypeId ||
            education.typeId === educationTypeId ||
            education.type === educationTypeId
        );
        
        console.log("Filtered educations:", filteredEducations);
        
        if (filteredEducations.length > 0) {
          setEducations(transformData(filteredEducations));
        } else {
          // If no matches found, check if the education type is itself in the education list
          const matchByName = newLookups.EducationLKPT.filter(
            education => education.id === educationTypeId
          );
          
          if (matchByName.length > 0) {
            console.log("Found education matching this type ID:", matchByName);
            setEducations(transformData(matchByName));
          } else {
            // For now, show all educations since filtering doesn't work 
            console.log("No direct connection between education types and educations found");
            console.log("Showing all educations for selection");
            setEducations(lookup.education || []);
          }
        }
      } else {
        // If no type selected, show all educations
        console.log("No education type selected, showing all educations");
        setEducations(lookup.education || []);
      }
    } catch (error) {
      console.error("Error filtering educations:", error);
    }
  }

  // Helper function to format date in ISO format
  const formatDateToISO = (date) => {
    if (!date) return null;
    return date.toISOString();
  };
  
  return (
    <div className="row">
      <h3
        onClick={() => setOpen(!open)}
        aria-controls="prisoner-education-collapse"
        aria-expanded={open}
        className="master-report-headings"
      >
        <span className="d-flex justify-content-between w-100">
          Prisoner Education {" "}
          {open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
        </span>
      </h3>
      
      <Collapse in={open}>
        <div id="prisoner-education-collapse" className="row">
          <div className="col-lg-3">
            <InputWidget
              type={'multiSelect'}
              ismulti={false}
              inputType={'select'}
              label={'Education Type'}
              id={'educationType'}
              require={false}
              icon={'icon-operator'}
              options={lookup?.educationType || []}
              defaultValue={
                selectedEducationTypeId
                  ? { 
                      label: lookup?.educationType?.find(t => t.value === selectedEducationTypeId)?.label || '',
                      value: selectedEducationTypeId
                    }
                  : null
              }
              setValue={value => {
                // Only use for filtering, don't add to payload
                handleEducationTypeChange(value);
              }}
            />
          </div>
          <div className="col-lg-3">
            <InputWidget
              type={'multiSelect'}
              isMulti={true}
              inputType={'select'}
              label={'Education'}
              id={'education'}
              require={false}
              icon={'icon-operator'}
              options={educations || []}
              defaultValue={
                transfromStringArray(
                  educations,
                  formPayload?.prisonerEducations?.educationId
                ) || []
              }
              setValue={value => {
                const payload = {
                  ...formPayload
                };
                if (!payload.prisonerEducations) {
                  payload.prisonerEducations = {};
                }
                payload.prisonerEducations.educationId = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>
          {/* <div className="col-lg-3">
            <InputWidget
              type={'multiSelect'}
              isMulti={true}
              inputType={'select'}
              label={'Prison'}
              id={'prison'}
              require={false}
              icon={'icon-building'}
              options={prisons || []}
              defaultValue={
                transfromStringArray(
                  prisons,
                  formPayload?.prisonerEducations?.prisonId
                ) || []
              }
              setValue={value => {
                const payload = {
                  ...formPayload
                };
                if (!payload.prisonerEducations) {
                  payload.prisonerEducations = {};
                }
                payload.prisonerEducations.prisonId = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div> */}
          <div className="col-lg-3">
            <div className='inputs force-active'>
              <label>Education Start Date Range</label>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                icon={'icon-calendar'}
                isClearable
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={120}
                showMonthDropdown
                selectsRange={true}
                startDate={startDateRangeStart}
                endDate={startDateRangeEnd}
                placeholderText={''}
                id={'education-start-date-range'}
                onChange={dates => {
                  setStartDateRange(dates);
                  const payload = {
                    ...formPayload
                  };
                  if (!payload.prisonerEducations) {
                    payload.prisonerEducations = {};
                  }
                  
                  payload.prisonerEducations.startDateRange = {
                    start: dates[0] ? formatDateToISO(dates[0]) : null,
                    end: dates[1] ? formatDateToISO(dates[1]) : null
                  };
                  
                  setFormPayload(payload);
                }}
              />
            </div>
          </div>
          <div className="col-lg-3">
            <div className='inputs force-active'>
              <label>Education End Date Range</label>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                icon={'icon-calendar'}
                isClearable
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={120}
                showMonthDropdown
                selectsRange={true}
                startDate={endDateRangeStart}
                endDate={endDateRangeEnd}
                placeholderText={''}
                id={'education-end-date-range'}
                onChange={dates => {
                  setEndDateRange(dates);
                  const payload = {
                    ...formPayload
                  };
                  if (!payload.prisonerEducations) {
                    payload.prisonerEducations = {};
                  }
                  
                  payload.prisonerEducations.endDateRange = {
                    start: dates[0] ? formatDateToISO(dates[0]) : null,
                    end: dates[1] ? formatDateToISO(dates[1]) : null
                  };
                  
                  setFormPayload(payload);
                }}
              />
            </div>
          </div>
            <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Has Inprison Education"}
              isMulti={false}
              id={"hasInprisonEducation"}
              icon={"icon-prisoner"}
              isClearable={true}
              options={booleanOptions}
              defaultValue={
                formPayload?.prisonerEducations?.hasInprisonEducation !== undefined
                  ? booleanOptions.find(
                      option => option.value === formPayload.prisonerEducations.hasInprisonEducation
                    )
                  : null
              }
              setValue={value => {
                const payload = {
                  ...formPayload
                };
                if (!payload.prisonerEducations) {
                  payload.prisonerEducations = {};
                }
                payload.prisonerEducations.hasInprisonEducation = value?.value;
                setFormPayload(payload);
              }}
            />
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default PrisonerEducationForm