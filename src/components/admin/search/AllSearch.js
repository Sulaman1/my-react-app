import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { cleanThePayload, formatDate, getFormattedDate, transformData } from "../../../common/Helpers";
import InputWidget from "../../../droppables/InputWidget";
import { getData, postData } from "../../../services/request";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FingerScanner from "../../../common/FingerScanner";
//import { generateYears } from "../../../common/Common";

const AllSearch = forwardRef((props, ref) => {

  const [prisonerData, setPrisonerData] = useState({});
  const [formPayload, setFormPayload] = useState({});
  const [fingerIndex, setFingerIndex] = useState("");
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [searchVisibility, setSearchVisibility] = useState(false);
  //const [years, setYears] = useState(generateYears());
  const userMeta = useSelector((state) => state.user);
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const dispatch = useDispatch();

  // Expose loadData function to parent components
  useImperativeHandle(ref, () => ({
    loadData: (maxCount) => loadData(maxCount)
  }));

  useEffect(() => {
    if (
      props.type === "released" ||
      props.type === "visitor" ||
      props.type === "hospital"
    ) {
      const pd = {
        ...formPayload,
        checkedIn: true,
      };
      setFormPayload(pd);
    }
  }, []);
  const currentPath = window.location.pathname;
  const useApiCall = currentPath.includes('prisoner-search');

  useEffect(() => {
    // default call
    if (props.searchType !== "Global" && useApiCall ) {
      loadData(10);
    }
    fetchPrisonserData(); // loading lookups
  }, []);

  const handleCloseModal = () => {
    setModalIsVisible(false);
  };

  const fetchPrisonserData = async () => {
    try {
      const prisonersData = {};
      const policeStationObj = transformData(newLookups?.policeStation);
      prisonersData["policeStations"] = policeStationObj;

      const prisonerCategoryObj = transformData(newLookups?.prisonerCategory);
      prisonersData["prisonerCategory"] = prisonerCategoryObj;
    
      const gendersObj = transformData(newLookups?.gender);
      prisonersData["genders"] = gendersObj;

      const prisonsObj = transformData(newLookups?.prison);
      prisonersData["prisons"] = prisonsObj;

      const relationshipTypesObj = transformData(newLookups?.relationshipTypes)
			prisonersData['relationshipTypes'] = relationshipTypesObj;
      
      setPrisonerData(prisonersData);
    } catch (error) {
      console.error(error);
      console.log(error,"getting error while fetching mulitple API function {fetchPrisonserData} & fileName is {AllSearch.js}")
      alert("something went wrong in lookups api");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // check if the formPayload is empty
    if (Object.keys(formPayload).length === 0 && props.searchType !== "Global") {
      swal("Please fill out at least one field to search the prisoners", "", "warning");
      return;
    }
    loadData(10); // 500 is the max count of records to be fetched
  };

  const loadData = (maxCount) => {
    const userId =
      props.searchType === "Global"
        ? 0
        : JSON.parse(sessionStorage.getItem("user")).userId;
    const payload = {
      userId,
      searchTypeId: 0,
      ...formPayload,
    };
    if(maxCount){
      payload.maxResults = maxCount;
    }

    
    const cleanedPayload = cleanThePayload(payload);

    const searchEndpoint = props.searchURL || "SearchPrisonerList";
    const currentPath = window.location.pathname;
    const useLoader = currentPath.includes('prisoner-search');
  
    postData(`/services/app/PrisonerSearch/${searchEndpoint}`, cleanedPayload, useLoader)
      .then((result) => {
        if (result && result.result?.isSuccessful) {
          if (props.onAddSearchData) {
            props.onAddSearchData(result.result);
          }
        } else {
          swal(
            result.error?.message || "An error occured",
            result.error?.details || "",
            "warning"
          ).then(() => {

          });
        }
      })
      .catch((err) => {
        console.error(err);
        console.log(err, `getting error while fetching API {${searchEndpoint}} & fileName is {AllSearch.js}`)
          swal("Something went wrong!", err, "warning").then(() => {
        });
      });
  };

  const passFormPayload = (e) => {
    e.preventDefault();
    formPayload.maxResults = 500;
    props.handleSubmit(formPayload);
  };

  const handleSearchVisibility = () => {
    setSearchVisibility((prevVisibility) => !prevVisibility);
  };

    function getTomorrow() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

  return (
    <>
      <button className="btn btn-prim search-btn-prim" onClick={handleSearchVisibility}>
        {searchVisibility ? "Hide Advanced Search" : "Show Advanced Search"}
      </button>
      {!searchVisibility && !props.hideNote &&
      <>
      <h5 className="text-danger my-3">Note: The list is set to show only 10 latest prisoners, if you cannot find the desired prisoner in the list below, please use the Advanced Search above.</h5>
      </>
}
      {props.release && <h5 className="text-danger my-3">Note: The release can be initiated case wise, The release from prison will only be performed if the prisoner being released form the case is his/her last. Also, please note that only those prisoners will be visible in the list below which are eligible for the release.</h5>}
      {searchVisibility && (
        <div className="col-12 px-0">
          <div className="row">
            <h4 className="third-heading">ALL PRISONER (تمام قیدی)</h4>
          </div>
          <form onSubmit={props.handleSubmit ? passFormPayload : handleSubmit}>
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  {userMeta?.role === "Super Admin" && (
                    <div className="col-lg-4">
                      <InputWidget
                        type={"multiSelect"}
                        inputType={"name"}
                        isClearable={true}
                        label={"Prisoner Category (قیدی کی درجہ بندی)"}
                        options={prisonerData.prisonerCategory || []}
                        multiple={false}
                        icon={"icon-prisoner"}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["category"] = value ? value.value : null;
                          setFormPayload(payload);
                        }}
                      />
                    </div>
                  )}
                  <div className="col-lg-4">
                    <InputWidget
                      type={"input"}
                      inputType={"name"}
                      label={"Prisoner Name (قیدی کا نا)"}
                      icon={"icon-prisoner"}
                      setValue={(value) => {
                        const payload = {
                          ...formPayload,
                        };
                        payload["name"] = value;
                        setFormPayload(payload);
                      }}
                    />
                  </div>
                  {props.searchType != "Global" && (
                    <div className="col-lg-4">
                      <InputWidget
                        type={"input"}
                        inputType={"name"}
                        onlyNumbers
                        label={"Prisoner Number (قیدی نمبر)"}
                        icon={"icon-number"}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["prsNumber"] = +value;
                          setFormPayload(payload);
                        }}
                      />
                    </div>
                  )}
                  {/* <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      isClearable={true}
                      inputType={"name"}
                      label={"Relationship Type"}
                      icon={"icon-operator"}
                      multiple={false}
                      options={prisonerData.relationshipTypes || []}
                      setValue={(value) => {
                        const payload = {
                          ...formPayload,
                        };
                        payload["relationshipTypeId"] = value ? value.value : null;
                        setFormPayload(payload);
                      }}
                    />
                  </div> */}
                  <div className="col-lg-4">
                    <InputWidget
                      type={"input"}
                      inputType={"name"}
                      label={"Relationship Name"}
                      icon={"icon-operator"}
                      setValue={(value) => {
                        const payload = {
                          ...formPayload,
                        };
                        payload["relationshipName"] = value;
                        setFormPayload(payload);
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
                        formPayload.year
                          ? {
                            label: formPayload.year,
                            value: formPayload.year,
                          }
                          : ''
                      }
                      require={false}
                      icon={"icon-event"}
                      options={years}
                      setValue={(value) => {
                        const payload = {
                          ...formPayload,
                        };
                        payload["year"] = value ? value.value : null;
                        setFormPayload(payload);
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
                      options={prisonerData.policeStations || []}
                      setValue={(value) => {
                        const payload = {
                          ...formPayload,
                        };
                        payload["policeStationId"] = value ? value.value : null;
                        setFormPayload(payload);
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
                        const payload = {
                          ...formPayload,
                        };
                        payload["firNo"] = value;
                        setFormPayload(payload);
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
                        formPayload.firYear
                          ? {
                            label: formPayload.firYear,
                            value: formPayload.firYear,
                          }
                          : ''
                      }
                      require={false}
                      icon={"icon-event"}
                      options={years}
                      setValue={(value) => {
                        const payload = {
                          ...formPayload,
                        };
                        payload["firYear"] = value ? value.value : null;
                        setFormPayload(payload);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <InputWidget
                      type={"multiSelect"}
                      inputType={"name"}
                      label={"Gender (جنس)"}
                      isClearable={true}
                      options={prisonerData.genders || []}
                      multiple={false}
                      icon={"icon-gender"}
                      setValue={(value) => {
                        const payload = {
                          ...formPayload,
                        };
                        payload["genderId"] = value ? value.value : null;
                        setFormPayload(payload);
                      }}
                    />
                  </div>

                  {!props.handleSubmit && (
                    <div className="col-lg-4">
                      <InputWidget
                        type={"multiSelect"}
                        inputType={"name"}
                        label={"Prisoner Status (قیدی کی حیثیت) "}
                        multiple={false}
                        isClearable={true}
                        options={prisonerData.prisonerStatus || []}
                        icon={"icon-operator"}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["prisonerStatusId"] = value ? value.value : null;
                          setFormPayload(payload);
                        }}
                      />
                    </div>
                  )}
                  {props.searchType && props.searchType == 'Global' && (
                    <div className="col-lg-4">
                      <InputWidget
                        type={"multiSelect"}
                        inputType={"name"}
                        label={"Prison (جیل)"}
                        multiple={false}
                        isClearable={true}
                        options={prisonerData.prisons || []}
                        icon={"icon-prison"}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["prisonId"] = value ? value.value : null;
                          setFormPayload(payload);
                        }}
                      />
                    </div>
                  )}
                  {!props.handleSubmit && (
                    <div className="col-lg-4">
                      <InputWidget
                        type={"cnic"}
                        inputType={"text"}
                        label={"CNIC (شناختی کارڈ نمبر)"}
                        require={false}
                        icon={"icon-visitor-card"}
                        onlyNumbers={true}
                        defaultValue={props?.formPayload?.cnic}
                        setValue={(value, event) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["cnic"] = value;
                          setFormPayload(payload);
                        }}
                      />
                    </div>
                  )}
                  {props.type === "released" ||
                    props.type === "visitor" ||
                    (props.type === "hospital" && (
                      <div className="col-lg-4">
                        <InputWidget
                          type={"switch"}
                          inputType={"checkbox"}
                          label={"Checked In (داخل ہوا)"}
                          require={true}
                          defaultValue={formPayload?.checkedIn}
                          setValue={(checked) => {
                            const payload = {
                              ...formPayload,
                            };
                            payload["checkedIn"] = checked;
                            setFormPayload(payload);
                          }}
                        />
                      </div>
                    ))}

                  {props.datePicker && (
                    <div className="col-lg-6">
                      <div className="inputs force-active">
                        <label>Date (تاریخ)</label>
                        <DatePicker
                          selected={getFormattedDate(
                            formPayload?.datePicked
                              ? formPayload?.datePicked
                              : props.tomorrowDt
                          )}
                          onChange={(datePicked) => {
                            const payload = {
                              ...formPayload,
                            };
                            payload["datePicked"] = datePicked;
                            setFormPayload(payload);
                          }}
                          dateFormat="dd/MM/yyyy"
                          icon={"icon-operator"}
                          minDate={props?.tab === 1 ? new Date() : ""}
                          maxDate={getTomorrow()}
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={5000}
                          showMonthDropdown
                        />
                      </div>
                    </div>
                  )}
                  {props.dateType && props.dateType == 'hospitalAdmission' && props.tabPosition != 1 && (
                    <div className="col-lg-4">
                      <div className="inputs force-active">
                        <label>Hospital Admission Date (داخلہ کی تاریخ)</label>
                        <DatePicker
                          selected={getFormattedDate(
                            formPayload?.datePicked
                          )}
                          onChange={(datePicked) => {
                            const payload = {
                              ...formPayload,
                            };
                            payload["datePicked"] = datePicked;
                            setFormPayload(payload);
                          }}
                          dateFormat="dd/MM/yyyy"
                          icon={"icon-operator"}
                          maxDate={new Date()}
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={5000}
                          showMonthDropdown
                        />
                      </div>
                    </div>

                  )}
                </div>
                {!props.componentType && 
                <div className="row d-flex just-space">
                  <>
                    <div className="col-lg-2">
                      <h4 className="sub-heading heading-height mb-3">
                        Right Thumb (دائیں انگوٹھے)
                      </h4>
                      <InputWidget
                        id={"user"}
                        type={"fingerPrint"}
                        require={false}
                        setValue={(value) => { }}
                        triggerFingerModal={() => {
                          setModalIsVisible(true);
                          setFingerIndex("right thumb");
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <h4 className="sub-heading heading-height mb-3">
                        Left Thumb (بائیں انگوٹھے)
                      </h4>
                      <InputWidget
                        id={"user"}
                        type={"fingerPrint"}
                        require={false}
                        setValue={(value) => { }}
                        triggerFingerModal={() => {
                          setModalIsVisible(true);
                          setFingerIndex("left thumb");
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <h4 className="sub-heading heading-height mb-3">
                        Right Index Finger (دائیں شہادت کی انگلی)
                      </h4>
                      <InputWidget
                        id={"user"}
                        type={"fingerPrint"}
                        require={false}
                        setValue={(value) => { }}
                        triggerFingerModal={async () => {
                          setModalIsVisible(true)
                          setFingerIndex('right index')
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <h4 className="sub-heading heading-height mb-3">
                        Left Index Finger (بائیں شہادت کی انگلی)
                      </h4>
                      <InputWidget
                        id={"user"}
                        type={"fingerPrint"}
                        require={false}
                        setValue={(value) => { }}
                        triggerFingerModal={async () => {
                          setModalIsVisible(true)
                          setFingerIndex('left index')
                        }}
                      />
                    </div>
                  </>
                </div>
                }
              </div>
            </div>
            <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
              <button
                type="submit"
                className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
              >
                <i className="icon-search ml-2"></i> Search
              </button>
            </div>
          </form>
          <FingerScanner
            visible={modalIsVisible}
            title="Finger Print Scanner"
            onClose={handleCloseModal}
            fingerIndex={fingerIndex}
            scanType={"search"}
            globalSearch={props.searchType === 'Global' ? true : false}
          />
        </div>

      )}
    </>
  );
});

export default AllSearch;