import React, { useState, useEffect } from 'react'
import InputWidget from '../../../droppables/InputWidget'
import { transfromStringArray, transformData, getIds } from '../../../common/Helpers'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useSelector } from 'react-redux'
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from 'react-icons/io'
import { Collapse } from 'react-bootstrap'
import { booleanOptions } from '../../../common/ReportHelpers'

const PrisonerOfensesForm = ({ type, formPayload, setFormPayload }) => {
  const [offences, setOffences] = useState([])
  console.log(offences, "offences")
  const [open, setOpen] = useState(true)
  
  // Update to use date range instead of single date
  const [offenseDateRange, setOffenseDateRange] = useState(() => {
    const startDate = formPayload?.offenses?.dateRange?.start
      ? new Date(formPayload.offenses.dateRange.start)
      : null;
    const endDate = formPayload?.offenses?.dateRange?.end
      ? new Date(formPayload.offenses.dateRange.end)
      : null;
    return [startDate, endDate];
  });
  
  // Destructure for easier access
  const [startOffenseDate, endOffenseDate] = offenseDateRange;
  
  const newLookups = useSelector((state) => state?.dropdownLookups)
  const [lookup, setLookup] = useState();
  
  // Selected offense type ID (only for filtering, not saved to payload)
  const [selectedOffenseTypeId, setSelectedOffenseTypeId] = useState(null);

  useEffect(() => {
    // Initialize offenses structure if it doesn't exist
    // if (!formPayload.offenses) {
    //   const payload = { ...formPayload }
    //   payload.offenses = {
    //     offenseTypeId: null,
    //     offenseId: null,
    //     dateRange: null,
    //     hasInprisonOffences: false
    //   }
    //   setFormPayload(payload)
    // }
        try {
          let lookup = {};
          const offenceTypeObj = transformData(newLookups?.offenceType);
          lookup["offenceType"] = offenceTypeObj;
          setLookup(lookup);

          // Get offenses from the lookup data
          console.log("All lookups data:", newLookups);
        } catch (error) {
          console.error(error);
          alert("Something went wrong in lookups api");
        }
  }, [])

  const handleOffenceTypeChange = value => {
    try {
      // Extract the offense type ID from the selected value
      const offenseTypeId = value?.value || null;
      console.log("Selected offense type ID:", offenseTypeId);
      setSelectedOffenseTypeId(offenseTypeId);
      
      if (offenseTypeId) {
        // Print available lookup keys
        console.log("Available lookup keys:", Object.keys(newLookups || {}));
        
        // We see inPrisonOffences in the lookup keys from console log
        if (newLookups?.inPrisonOffences) {
          console.log("Found inPrisonOffences data:", newLookups.inPrisonOffences);
          
          // Check the structure of the first item to understand how to filter
          if (newLookups.inPrisonOffences.length > 0) {
            console.log("Sample inPrisonOffence:", newLookups.inPrisonOffences[0]);
          }
          
          // Try to match by offenseTypeId or offenceTypeId
          const filteredOffenses = newLookups.inPrisonOffences.filter(
            offense => {
              // Check for all possible property names that might link to offense type
              return offense.offenceTypeId === offenseTypeId || 
                     offense.offenseTypeId === offenseTypeId || 
                     offense.typeId === offenseTypeId || 
                     offense.type === offenseTypeId;
            }
          );
          
          console.log("Filtered inPrisonOffences:", filteredOffenses);
          
          if (filteredOffenses.length > 0) {
            setOffences(transformData(filteredOffenses));
          } else {
            // If no direct matches, try to use all offenses of this type
            // In some implementations, the type might be encoded in the name
            const filteredByName = newLookups.inPrisonOffences.filter(
              offense => offense.name && offense.name.includes(value.label)
            );
            
            console.log("Filtered inPrisonOffences by name:", filteredByName);
            
            if (filteredByName.length > 0) {
              setOffences(transformData(filteredByName));
            } else {
              // Last resort - use all prison offenses if we can't filter
              console.log("Using all inPrisonOffences as no filtering worked");
              setOffences(transformData(newLookups.inPrisonOffences));
            }
          }
        } else {
          // If no inPrisonOffences, try other approaches (keeping the existing code)
          // Try to find if the offense type has nested offenses
          const selectedType = newLookups?.offenceType?.find(type => type.id === offenseTypeId);
          console.log("Selected offense type object:", selectedType);
          
          // Check possible property names for offenses within the type
          if (selectedType?.offenses) {
            console.log("Offenses from selected type (offenses):", selectedType.offenses);
            setOffences(transformData(selectedType.offenses));
          } 
          else if (selectedType?.offences) {
            console.log("Offenses from selected type (offences):", selectedType.offences);
            setOffences(transformData(selectedType.offences));
          }
          else if (selectedType?.items) {
            console.log("Offenses from selected type (items):", selectedType.items);
            setOffences(transformData(selectedType.items));
          }
          // Last resort - check if we can find offenses directly in the offenceType array
          else {
            console.log("Looking for offenses directly in offenceType array");
            const matchingOffenses = newLookups?.offenceType?.filter(
              item => item.offenceTypeId === offenseTypeId || item.parentId === offenseTypeId
            );
            console.log("Matching offenses by parent/type relation:", matchingOffenses);
            
            if (matchingOffenses && matchingOffenses.length > 0) {
              setOffences(transformData(matchingOffenses));
            } else {
              console.log("No offenses found for the selected type");
              setOffences([]);
            }
          }
        }
      } else {
        // Clear offenses if no type is selected
        setOffences([]);
      }
    } catch (error) {
      console.error("Error filtering offences:", error);
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
        aria-controls="prisoner-offenses-collapse"
        aria-expanded={open}
        className="master-report-headings"
      >
        <span className="d-flex justify-content-between w-100">
          Prisoner Offenses {" "}
          {open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
        </span>
      </h3>
      
      <Collapse in={open}>
        <div id="prisoner-offenses-collapse" className="row">
          <div className="col-lg-3">
            <InputWidget
              type={'multiSelect'}
              ismulti={false}
              inputType={'select'}
              label={'Offence Type (جرم کی قسم)'}
              id={'offenceType'}
              require={false}
              icon={'icon-like'}
              options={lookup?.offenceType || []}
              defaultValue={
                selectedOffenseTypeId
                  ? { 
                      label: lookup?.offenceType?.find(t => t.value === selectedOffenseTypeId)?.label || '',
                      value: selectedOffenseTypeId
                    }
                  : null
              }
              setValue={value => {
                // Only use for filtering, don't add to payload
                handleOffenceTypeChange(value);
              }}
            />
          </div>
          <div className="col-lg-3">
            <InputWidget
              type={'multiSelect'}
              isMulti={true}
              inputType={'select'}
              label={'Offence (جرم)'}
              id={'offence'}
              require={false}
              icon={'icon-like'}
              options={offences || []}
              defaultValue={
                transfromStringArray(
                  offences,
                  formPayload?.offenses?.offenseId
                ) || []
              }
              setValue={value => {
                const payload = {
                  ...formPayload
                };
                if (!payload.offenses) {
                  payload.offenses = {};
                }
                payload.offenses.offenseId = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>
          <div className="col-lg-3">
            <div className='inputs force-active'>
              <label>Offence Date Range</label>
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
                startDate={startOffenseDate}
                endDate={endOffenseDate}
                placeholderText={''}
                id={'offense-date-range'}
                onChange={dates => {
                  setOffenseDateRange(dates);
                  const payload = {
                    ...formPayload
                  };
                  if (!payload.offenses) {
                    payload.offenses = {};
                  }
                  
                  // Use dateRange property as per expected payload structure
                  payload.offenses.dateRange = {
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
              label={"Has Inprison Offences"}
              isMulti={false}
              id={"hasInprisonOffences"}
              icon={"icon-prisoner"}
              isClearable={true}
              options={booleanOptions}
              defaultValue={
                formPayload?.offenses?.hasInprisonOffences !== undefined
                  ? booleanOptions.find(
                      option => option.value === formPayload.offenses.hasInprisonOffences
                    )
                  : null
              }
              setValue={value => {
                const payload = {
                  ...formPayload
                };
                if (!payload.offenses) {
                  payload.offenses = {};
                }
                payload.offenses.hasInprisonOffences = value?.value;
                setFormPayload(payload);
              }}
            />
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default PrisonerOfensesForm