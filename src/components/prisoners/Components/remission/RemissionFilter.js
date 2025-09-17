import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputWidget from "../../../../droppables/InputWidget";
import { getFormattedDate, transformData } from "../../../../common/Helpers";
import { FaPercentage } from 'react-icons/fa';
//import { generateYears } from "../../../../common/Common";
const RemissionFilter = ({ onApplyFilters }) => {
  const [filterPayload, setFilterPayload] = useState({});
  const [filterVisibility, setFilterVisibility] = useState(false);
  const show = useSelector((state) => state.language.urdu);
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [diseaseList, setdiseaseList] = useState([]);
  const [sectionsList, setsectionsList] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  //const [years, setYears] = useState(generateYears());
  const [policeStationList, setPoliceStationList] = useState([]);

  useEffect(() => {
    if (newLookups?.disease) {
      setdiseaseList(transformData(newLookups.disease));
    }

    if (newLookups?.sections) {
      setsectionsList(transformData(newLookups.sections));
    }

    if (newLookups?.gender) {
      setGenderOptions(transformData(newLookups.gender));
    }
    if (newLookups?.policeStation) {
      setPoliceStationList(transformData(newLookups.policeStation));

    }
    onApplyFilters(cleanPayload);
  }, [newLookups]);

  const handleFilterVisibility = () => {
    setFilterVisibility((prevVisibility) => !prevVisibility);
  };

  const cleanPayload = (payload) => {
    const cleanedPayload = {};

    Object.keys(payload).forEach(key => {
      if (payload[key] !== null &&
        payload[key] !== undefined &&
        payload[key] !== '' &&
        !(Array.isArray(payload[key]) && payload[key].length === 0)) {
        cleanedPayload[key] = payload[key];
      }
    });

    return cleanedPayload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanedPayload = cleanPayload(filterPayload);
    onApplyFilters(cleanedPayload);
  };

  const handleReset = () => {
    setFilterPayload({});
    onApplyFilters({});

    setTimeout(() => {
      setFilterVisibility(prev => {
        const temp = !prev;
        setTimeout(() => setFilterVisibility(prev), 1);
        return temp;
      });
    }, 10);
  };

  const yesNoOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ];

  return (
    <>
      <button className="btn btn-prim search-btn-prim" onClick={handleFilterVisibility}>
        {filterVisibility ? "Hide Remission Filters" : "Show Remission Filters"}
      </button>

      {filterVisibility && (
        <div className="col-12 px-0">
          <div className="row">
            <h4 className="third-heading">REMISSION FILTERS {show ? '(ریمیشن فلٹرز)' : ''}</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4">
                    <InputWidget
                      type={"input"}
                      inputType={"name"}
                      label={"Prisoner Name (قیدی کا نا)"}
                      icon={"icon-prisoner"}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          name: value,
                        }));
                      }}
                    />
                  </div>

                  <div className="col-lg-4">
                    <InputWidget
                      type={"input"}
                      inputType={"name"}
                      onlyNumbers
                      label={"Prisoner Number (قیدی نمبر)"}
                      icon={"icon-number"}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          prsNumber: +value,
                        }));
                      }}

                    />
                  </div>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"input"}
                      inputType={"name"}
                      label={"Relationship Name"}
                      icon={"icon-operator"}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          relationshipName: value,
                        }));
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      isMulti={false}
                      isClearable={true}
                      inputType={"select"}
                      label={"Prisoner Year (قیدی سال)"}
                      defaultValue={
                        filterPayload.year
                          ? {
                            label: filterPayload.year,
                            value: filterPayload.year,
                          }
                          : ''
                      }
                      require={false}
                      icon={"icon-event"}
                      options={years}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          year: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      isClearable={true}
                      inputType={"name"}
                      label={"Police Station (تھانہ)"}
                      multiple={false}
                      icon={"icon-office"}
                      options={policeStationList || []}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          policeStationId: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"input"}
                      inputType={"number"}
                      label={"FIR No (ایف آئی آر نمبر)"}
                      icon={"icon-file"}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          firNo: value,
                        }));
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      isMulti={false}
                      isClearable={true}
                      inputType={"select"}
                      label={"Fir Year (ایف آئی آر کا سال)"}
                      defaultValue={
                        filterPayload.firYear
                          ? {
                            label: filterPayload.firYear,
                            value: filterPayload.firYear,
                          }
                          : ''
                      }
                      require={false}
                      icon={"icon-event"}
                      options={years}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          firYear: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>

                  {/* Admission Date Range */}
                  <div className="col-lg-4">
                    <div className="inputs force-active">
                      <label>Admission Date Range {show ? '(داخلہ تاریخ)' : ''}</label>
                      <DatePicker
                        icon={"icon-calendar"}
                        dateFormat="dd/MM/yyyy"
                        selectsRange={true}
                        startDate={getFormattedDate(filterPayload?.admissionDate?.start)}
                        endDate={getFormattedDate(filterPayload?.admissionDate?.end)}
                        onChange={(date) => {
                          const payload = { ...filterPayload };
                          payload.admissionDate = {
                            start: date?.[0]
                              ? `${date[0].getFullYear()}-${date[0].getMonth() + 1}-${date[0].getDate()}`
                              : "",
                            end: date?.[1]
                              ? `${date[1].getFullYear()}-${date[1].getMonth() + 1}-${date[1].getDate()}`
                              : "",
                          };
                          setFilterPayload(payload);
                        }}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        isClearable={true}
                      />
                    </div>
                  </div>

                  {/* Lifetime Imprisonment */}
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Lifetime Imprisonment ${show ? '(عمر قید)' : ''}`}
                      multiple={false}
                      isClearable={true}
                      icon={"icon-operator"}
                      options={yesNoOptions}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          lifetimeImprisonment: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>

                  {/* Condemned */}
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Condemned ${show ? '(سزائے موت)' : ''}`}
                      multiple={false}
                      isClearable={true}
                      icon={"icon-operator"}
                      options={yesNoOptions}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          condemned: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>
                                    {/* Exclude disease */}
                                    <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Exclude disease ${show ? '(بیماریاں خارج کریں)' : ''}`}
                      isMulti={true}
                      isClearable={true}
                      icon={'icon-hospital'}
                      options={diseaseList}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          diseasesExcluded: value ? value.map(v => v.value) : []
                        }));
                      }}
                    />
                  </div>

                  {/* Include disease */}
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Include disease ${show ? '(بیماریاں شامل کریں)' : ''}`}
                      isMulti={true}
                      isClearable={true}
                      icon={'icon-hospital'}
                      options={diseaseList}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          diseasesIncluded: value ? value.map(v => v.value) : []
                        }));
                      }}
                    />
                  </div>


                  {/* Total Sentence */}

                  <div className="col-lg-6">
                    <div className='mb-3'>Start Sentence</div>
                    <div className="row">
                      <div className="col-lg-4">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Years ${show ? '(سال)' : ''}`}
                          icon={"icon-event"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              sentenceRange: {
                                ...prev.sentenceRange,
                                start: {
                                  ...(prev.sentenceRange?.start || {}),
                                  year: value ? parseInt(value) : null,
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="col-lg-4">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Months ${show ? '(مہینے)' : ''}`}
                          icon={"icon-event"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              sentenceRange: {
                                ...prev.sentenceRange,
                                start: {
                                  ...(prev.sentenceRange?.start || {}),
                                  month: value ? parseInt(value) : null,
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="col-lg-4">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Days ${show ? '(دن)' : ''}`}
                          icon={"icon-event"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              sentenceRange: {
                                ...prev.sentenceRange,
                                start: {
                                  ...(prev.sentenceRange?.start || {}),
                                  day: value ? parseInt(value) : null,
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className='mb-3'>End Sentence</div>
                    <div className="row">
                      <div className="col-lg-4">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Years ${show ? '(سال)' : ''}`}
                          icon={"icon-event"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              sentenceRange: {
                                ...prev.sentenceRange,
                                end: {
                                  ...(prev.sentenceRange?.end || {}),
                                  year: value ? parseInt(value) : null,
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="col-lg-4">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Months ${show ? '(مہینے)' : ''}`}
                          icon={"icon-event"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              sentenceRange: {
                                ...prev.sentenceRange,
                                end: {
                                  ...(prev.sentenceRange?.end || {}),
                                  month: value ? parseInt(value) : null,
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="col-lg-4">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Days ${show ? '(دن)' : ''}`}
                          icon={"icon-event"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              sentenceRange: {
                                ...prev.sentenceRange,
                                end: {
                                  ...(prev.sentenceRange?.end || {}),
                                  day: value ? parseInt(value) : null,
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>


                  {/* Exclude Prisoners with disease */}


                  {/* Exclude Under Sections */}
                  <div className="col-lg-6">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Exclude Under Sections ${show ? '(دفعات خارج کریں)' : ''}`}
                      isMulti={true}
                      isClearable={true}
                      icon={'icon-prisoner'}
                      options={sectionsList}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          underSectionsExcluded: value ? value.map(v => v.value) : []
                        }));
                      }}
                    />
                  </div>

                  {/* Include Under Sections */}
                  <div className="col-lg-6">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Include Under Sections ${show ? '(دفعات شامل کریں)' : ''}`}
                      isMulti={true}
                      isClearable={true}
                      icon={'icon-prisoner'}
                      options={sectionsList}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          underSectionsIncluded: value ? value.map(v => v.value) : []
                        }));
                      }}
                    />
                  </div>


                  {/* Gender */}
                  <div className="col-lg-3">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Gender Included ${show ? '(جنس)' : ''}`}
                      isMulti={true}
                      isClearable={true}
                      icon={"icon-gender"}
                      options={genderOptions}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          genderIncluded: value ? value.map((v) => v.value) : [],
                        }));
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Gender Excluded ${show ? '(جنس)' : ''}`}
                      isMulti={true}
                      isClearable={true}
                      icon={"icon-gender"}
                      options={genderOptions}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          genderExcluded: value ? value.map((v) => v.value) : [],
                        }));
                      }}
                    />
                  </div>


                  {/* Age Range */}
                  <div className="col-lg-3">
                    <div className="row">
                      <div className="col-lg-6">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Age From ${show ? '(عمر سے)' : ''}`}
                          icon={"icon-user"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              ageRange: {
                                ...prev.ageRange,
                                start: value ? parseInt(value) : null,
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="col-lg-6">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Age To ${show ? '(عمر تک)' : ''}`}
                          icon={"icon-user"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              ageRange: {
                                ...prev.ageRange,
                                end: value ? parseInt(value) : null,
                              },
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="row">
                      <div className="col-lg-6">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Substansive Sentence From ${show ? '(سزا کا فیصد سے)' : ''}`}
                          icon={"icon-user"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              substansiveSentence: {
                                ...prev.substansiveSentence,
                                start: value ? parseInt(value) : null,
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="col-lg-6">
                        <InputWidget
                          type={"input"}
                          inputType={"number"}
                          label={`Substansive Sentence To ${show ? '(سزا کا فیصد تک)' : ''}`}
                          icon={"icon-user"}
                          setValue={(value) => {
                            setFilterPayload((prev) => ({
                              ...prev,
                              substansiveSentence: {
                                ...prev.substansiveSentence,
                                end: value ? parseInt(value) : null,
                              },
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Substantive Sentence Percentage */}
                  {/* <div className="col-lg-3">
                    <InputWidget
                      type={"input"}
                      inputType={"number"}
                      label={`Sentence Percentage ${show ? '(سزا کا فیصد)' : ''}`}
                      icon={"icon-number"}
                      setValue={(value) => {
                        setFilterPayload({
                          ...filterPayload,
                          sentencePercentage: value ? parseInt(value) : null
                        });
                      }}
                    />
                  </div> */}
                  {/* Juvenile */}
                  <div className="col-lg-3">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Juvenile ${show ? '(نابالغ)' : ''}`}
                      multiple={false}
                      isClearable={true}
                      icon={"icon-user"}
                      options={yesNoOptions}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          juvinile: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>


                  {/* Dependents */}
                  {/* Dependents */}
                  <div className="col-lg-3">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Dependents ${show ? '(زیر کفالت)' : ''}`}
                      multiple={false}
                      isClearable={true}
                      icon={"icon-operator"}
                      options={yesNoOptions}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          dependents: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>

                  {/* Individual Remission */}
                  <div className="col-lg-3">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Individual Remission ${show ? '(انفرادی ریمیشن)' : ''}`}
                      multiple={false}
                      isClearable={true}
                      icon={"icon-operator"}
                      options={yesNoOptions}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          individualRemission: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>

                  {/* Remission Granted Ever */}
                  <div className="col-lg-3">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"select"}
                      label={`Remission Granted Ever ${show ? '(کبھی ریمیشن دی گئی)' : ''}`}
                      multiple={false}
                      isClearable={true}
                      icon={"icon-operator"}
                      options={yesNoOptions}
                      setValue={(value) => {
                        setFilterPayload((prev) => ({
                          ...prev,
                          remissionGrantedEver: value ? value.value : null,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 mb-4 d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn rounded-pill w-lg btn-danger waves-effect waves-light"
                onClick={handleReset}
              >
                <i className="icon-reset ml-2"></i> Reset Filters
              </button>
              <button
                type="submit"
                className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
              >
                <i className="icon-filter ml-2"></i> Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default RemissionFilter;