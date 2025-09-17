import React, { useRef, useEffect, useState } from "react";
//import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Grid, _ } from "gridjs-react";
import swal from "sweetalert";
import ProfilePic from "../../../assets/images/users/1.jpg";
import {
  formatDate,
  transformData,
  transformDataForTableGrid,
  validateDate,
  cleanedThePayload,
  cleanThePayload,
} from "../../../common/Helpers";
import AllSearch from "../../../components/admin/search/AllSearch";
import { postData, baseImageUrl } from "../../../services/request";
import InfoModal from "./InfoModal";
import HearingModal from "./HearingModal";
import Print from "../../../components/admin/search/Print";
import { useSelector } from "react-redux";
import ManageHearing from "./ManageHearing";
import { Modal } from "react-bootstrap";

export const getTomorrowDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
};
export const getTodayDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const removeDuplicates = (arr1, arr2) => {
  if (!arr1 || !arr2) {
    return null;
  }
  return arr2.filter((item) => !arr1.includes(item));
};



const ViewCPListing = ({
  getURL1,
  picker,
  tab,
  submitButton,
  returnList,
  btnTitle
}) => {
  //const history = useHistory();
  const navigate = useNavigate();


  const [entries, setEntries] = useState([]); // 1
  const [csvEntries, setCsvEntries] = useState([]); // 1
  const [csvEntriesTwo, setCsvEntriesTwo] = useState([]); // 2
  const [selectedPrisoner, setSelectedPrisoner] = useState([]);
  const gridRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const userMeta = useSelector((state) => state.user);
  const [isAdmin] = useState(userMeta?.role === "Super Admin");
  const [formPayload, setFormPayload] = useState({
    data: [],
    hearingIds: [],
    files: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [ids, setIds] = useState({
    oldHearingId: null,
    caseId: null,
    prisonerId: null,
  });
  const show = useSelector((state) => state.language.urdu);
  const [hearingModalIsVisible, setHearingModalIsVisible] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [tomorrowDt, setTomorrowDt] = useState(null);
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const [fetchedData, setData] = useState({
    judges: [
      {
        label: "Suprement Court Judge",
        value: 3,
      },
      {
        label: "High Court Judge",
        value: 5,
      },
    ],
  });


const generateGridCols = (tab, noAction, isAdmin) => {
  const gridCols = {
    [`Profile pic${show ? ' (تصویر)' : ''}`]: "",
    [`Prisoner Number${show ? ' (قیدی نمبر)' : ''}`]: "",
    [`Year${show ? ' (سال)' : ''}`]: "",
    [`Full Name${show ? ' (نام)' : ''}`]: "",
    "Relationship Type": "",
    "Relationship Name": "",
    [`Barrack${show ? ' (بیرک)' : ''}`]: "",
    [`CNIC${show ? ' (شناختی کارڈ)' : ''}`]: "",
    [`Under Sections${show ? ' (دفعات)' : ''}`]: "",
    [`Fir No${show ? ' (ایف آئی آر نمبر)' : ''}`]: "",
    [`Fir Year${show ? ' (ایف آئی آر سال)' : ''}`]: "",
    [`Check-Out Status${show ? ' (چیک آوٹ سٹیٹس)' : ''}`]: "",
  };

  if (isAdmin) {
    gridCols[`Prison Name${show ? ' (جیل)' : ''}`] = "";
  }

  if (tab === 3) {
    gridCols[`Hearing Date${show ? ' (اگلی پیشی کی تاریخ)' : ''}`] = "";
    gridCols[`Escaped${show ? ' (فرار)' : ''}`] = "";
  }
  if (tab === 1) {
    gridCols[`Special Guard${show ? ' (خصوصی گارڈ)' : ''}`] = "";
  }
  if (tab === 4) {
    gridCols[`Special Guard${show ? ' (خصوصی گارڈ)' : ''}`] = "";
    gridCols[`Warrant Reason${show ? ' (وارنٹ کی وجہ)' : ''}`] = "";
  }

  if (tab < 4) {
    gridCols[`Action${show ? ' (عملدرامد)' : ''}`] = "";
  }

  const cols = tab <= 2 && !noAction ? { [`select${show ? ' (منتخب کریں)' : ''}`]: "", ...gridCols } : gridCols;
  return Object.keys(cols);
};


  useEffect(() => {
    if(tab !== 4){
      loadGridData_1();
    }
  }, []);


  useEffect(() => {

    if (tab === 3) {
      fetchApiData();
    }
  }, []);

  const fetchApiData = async () => {
    try {
      const data = {};
      const courtObj = transformData(newLookups?.court);
        data["courts"] = courtObj;
        data["remandingCourts"] = courtObj;

        const policestationObj = transformData(newLookups?.policeStation);
        data["policeStations"] = policestationObj;

        const judgeObj = transformData(newLookups?.judge);
        data["judges"] = judgeObj;
      
        const sectionObj = transformData(newLookups?.sections);
        data["sections"] = sectionObj;
      setData(data);
    } catch (err) {
      alert("An error occured");
    }
  };

  // GRID 1
  const loadGridData_1 = async () => {
    const today = new Date();
    const tomorrowDate = formatDate(getTomorrowDate(today));
    const todayDate = formatDate(getTodayDate(today));
    setTomorrowDt(tomorrowDate);

    const rawData = sessionStorage.getItem("user");
    const parsedId = JSON.parse(rawData).userId;
    const obj = {
      userId: parsedId,
      name: "",
      category: 0,
      prisonId: 0,
      year: 0,
      prsNumber: 0,
      relationshipName: "",
      relationshipTypeId: '',
      genderId: 0,
      policeStationId: 0,
      firYear: 0,
      prisonerStatusId: 0,
      searchTypeId: 0,
    };
    const queryParam = tab === 1 ? `?date=${tomorrowDate}` : "";
    try {
      
      let param = returnList && tab === 3 ? 'CourtProduction' : 'PrisonerSearch'
      if(param === 'PrisonerSearch') {
        obj.maxResults = 500;
      }
      const result = await postData(
        `/services/app/${param}/${getURL1}${queryParam}`,
        obj
      );
      console.log("LOADED ENTRIES >>>", result);
      if (result && result.success) {
        const data = returnList ? result.result.maraslas : result.result.data;
        if (data.length > 0) {
            setEntries(data);
            setCsvEntries(data);
        } else {
          setEntries([]);
        }
      } else {
        swal(
          result.error?.message || "An error occured",
          result.error?.details || "",
          "warning"
        );
      }
    } catch (err) {
      if(tab !== 4){ 
        swal("Something went wrong!", "", "warning");
      }
    }
  };


  const selectPrisonerHandler = (entry) => {
    console.log(entry);
    if (tab === 1) {
      const length = entry.cases && entry.cases?.length;
      const hearingId = entry.cases && entry.cases[length - 1]?.hearingId;
      const obj = {
        prisonerId: entry.id,
        hearingId,
        specialGuard: false,
        hearingDocuments: "",
      };
      setFormPayload((curPayload) => ({
        ...curPayload,
        data: [...curPayload.data, obj],
      }));

    } else {
      const length = entry.cases?.length;
      const ids = entry.cases[length - 1]?.hearings?.map((item) => item.hearingId);
      console.log("TAB 2", ids);
      if (ids?.length === 0) {
        return;
      }
      setFormPayload((curPayload) => ({
        ...curPayload,
        hearingIds: [...curPayload.hearingIds, ...ids],
      }));
    }
  };

  const unselectPrisonerHandler = (entry) => {
    if (tab === 1) {
      setFormPayload((curPayload) => ({
        ...curPayload,
        data: curPayload.data.filter((p) => p.prisonerId !== entry.id),
      }));

    } else {
      const length = entry.cases?.length;
      const ids = entry.cases[length - 1]?.hearings?.map((item) => item.hearingId);
      if (ids?.length === 0) {
        return;
      }
      console.log("TAB 2", ids);
      console.log("IDS", formPayload.hearingIds);
      const updatedHearingIds = removeDuplicates(ids, formPayload.hearingIds);
      setFormPayload((curPayload) => ({
        ...curPayload,
        hearingIds: updatedHearingIds,
      }));

    }
  };

  
  // generating data for grid
  const gridDataMap = (entry, noAction) => {
  
    console.log('entry: ', entry);
    let selectStatus;

    if (tab === 1) {
      selectStatus = formPayload.data.find((p) => p.prisonerId === entry.id);
    } else {
      const length = entry.cases?.length;
      const ids = entry.cases[length - 1]?.hearingId;
      selectStatus = ids ;
    }

    const isSelected = !!selectStatus;
    const length = entry?.cases?.length;

    const mapObj = {
      profile: _(
        <div className="profile-td profile-td-hover">
          <div className="pic-view">
            <img
              src={entry.frontPic ? baseImageUrl + entry.frontPic : ProfilePic}
              className="avatar-xs rounded-circle"
              alt=""
            />
          </div>
          <img
            src={entry.frontPic ? baseImageUrl + entry.frontPic : ProfilePic}
            className="avatar-xs rounded-circle"
            alt=""
          />
        </div>
      ),

      prisonerNumber: entry.prisonerNumber,
      year: entry.year,
      fullName: entry.fullName,
      relationshipType: entry?.relationshipType,
      relationshipName: entry?.relationshipName,
      Barrack: entry.barrack || "not allocated yet",
      cnic: entry.cnic,
      underSection:  entry.cases && entry.cases[length - 1]?.underSections || "not added yet",
      no:  entry.cases && entry.cases[length - 1]?.firNo || 'no fir added yet',
      firYear: entry.cases &&  entry.cases[length - 1]?.firYear,
      checkOutSting: entry.checkOutSting|| entry?.checkOutReason,
    };

    if (isAdmin) {
      mapObj["Prison Name"] = entry.prisonName;
    }
    if (tab === 4) {
      mapObj["special guard"] = entry?.cases[length -1]?.speacialGuard ? "Yes" : "No";
      mapObj["reason"] = entry?.cases[length -1]?.warrantReason;
    }
    if (tab === 3) {
      mapObj["Hearing Date"] = validateDate(
        entry.cases[length - 1]?.nextHearingDate
      )
        || "";
      mapObj["Ecasped"] = entry.isEscaped ? "Yes" : "No";
    }

    if (tab === 1) {
      mapObj["specialGuard"] = selectStatus?.specialGuard ? "Yes" : "No";
    }
    if (tab === 1 && noAction) {
      mapObj["specialGuard"] = entry?.speacialGuard === "True" ? "Yes" : "No";
    }

    if (tab !== 2 && !noAction) {
      mapObj["Action"] = _(
        <div className="action-btns">
          {entry.appealInProgress == true && (
            <button
              id={"view-more-btn"}
              type="button"
              className="tooltip btn btn-danger waves-effect waves-light mx-1 "
            >
              <i className="icon-glamping"></i>
              <span>Appeal In process</span>
            </button>
          )}
          {(isSelected || tab === 3) && (
            <button
              id={"add-btn-add"}
              type="button"
              onClick={() => {
                handleOpenModal(entry);
                setSelectedPrisoner(entry);
              }}
              className="tooltip btn btn-success waves-effect waves-light mx-1"
            >
              <i className="icon-add"></i> <span>Add More Details</span>
            </button>
          )}
          {/* {tab === 3 && !entry.isEscaped && (
            <>
            <button
              id={"add-btn-add"}
              type="button"
              onClick={() => {
                handleEscaped(entry)
              }}
              className="tooltip btn btn-success waves-effect waves-light mx-1"
            >Escaped
            </button>
            </>
          )} */}
        </div>
      );
    }

    const mappedItem =
      tab <= 2 && !noAction
        ? {
          selected: _(
            <input
              className="form-check-input"
              type="checkbox"
              style={{ width: '1.7rem', height: '1.7rem', marginLeft: '11px' }}
              checked={isSelected}
              onChange={(event) => {
                const checked = event.target.checked;
                console.log("selected", checked);

                if (checked) {
                  selectPrisonerHandler(entry);
                } else {
                  unselectPrisonerHandler(entry);
                }
              }}
            />
          ),
          ...mapObj,
        }
        : mapObj;

    return mappedItem;
  };

  const handleSubmit = async (payload) => {
    
    const { userId } = JSON.parse(sessionStorage.getItem("user"));
    const reqPayload = {
      relationshipName: payload.relationshipName,
      relationshipTypeId: payload.relationshipTypeId,
      firNo: payload.firNo,
      firYear: payload.firYear,
      genderId: payload.genderId,
      name: payload.name,
      policeStationId: payload.policeStationId,
      prsNumber: payload.prsNumber,
      userId,
      year: payload.year,
    };
    const date = formatDate(payload.datePicked || checkTab(tab));
    const queryParam = tab === 1 || tab === 3 || tab === 4 ? `?date=${date}` : "";
    console.log("SEARCH PAYLOAD >>>", reqPayload);

    const cleanedPayload = cleanThePayload(reqPayload);

    try {
      let param = returnList && tab === 3  ? 'CourtProduction' : 'PrisonerSearch'
      const result = await postData(
        `/services/app/${param}/${getURL1}${queryParam}`,
        cleanedPayload
      );
      if (result && result?.result?.isSuccessful) {
        const data = returnList ? result?.result.maraslas :result?.result?.data;
        console.log("SEARCH RESULTS", data);
        if (data.length) {
          setEntries(data);
          setCsvEntries(data);
        } else {
          // setCsvEntries([]);
          setEntries([]);
        }
      } else {
        swal(result?.error?.message, result?.error?.details, "warning");
      }
    } catch (err) {
      swal("Something went wrong!", "", "warning");
    }
  };


  function checkTab(tab) {

    const today = new Date();
    return tab === 3 ? getTodayDate(today) : getTomorrowDate(today);
  }
  const handleClick = async (prisonerEntry) => {
    let entry = "prisonerHearingEntry";
    sessionStorage.setItem(entry, JSON.stringify(prisonerEntry));
  };

  const handleOpenModal = (entry) => {
    if (tab === 3) {
      handleClick(entry);
      showHearingModal();
      // setHearingModalIsVisible(true);
    }
    if (tab <= 2) {
      
      const item = formPayload?.data.find((p) => p.prisonerId === entry.id);
      const fileObj = formPayload?.files.find((p) => p.id === entry.id);
      console.log(item, fileObj);
      setDefaultValues({ item: item, file: fileObj });
      setShowModal(true);
    }
    if (entry) {
      const length = entry.cases?.length;
      const hearingId = entry.cases[length - 1]?.hearingId;
      const caseId = entry.cases[length - 1]?.caseId;
      setIds({
        oldHearingId: hearingId,
        caseId: caseId,
        prisonerId: entry.id,
      });
    }
  };
  
  const submitHandler = async () => {

    
    let payload;
    if (tab === 1) {
      payload = {
        data: [...formPayload.data],
      };
      for (const item of payload.data) {
        if (item.warrantOnly && !item.reason) {
          swal("Reason is required for warrantOnly prisoners.", "", "warning");
          console.log('Checking')
          
          return;
        }
      }
    } else {
      payload = {
        hearingIds: [...formPayload.hearingIds],
        policeOfficerName: formPayload.policeOfficerName,
        vehicleNumber: formPayload.vehicleNumber,
        otherDetails: formPayload.otherDetails,
      };
    }
    let url =
      tab === 1
        ? "/services/app/CourtProduction/FinalizeTommorowMarasla"
        : "/services/app/CourtProduction/CreateCourtProductionList";

    try {
      const res = await postData(url, payload);
      if (res.success && res.result?.isSuccessful) {
        swal("Successfully Sent!", "", "success");
        // refetch
        if(tab != 4){
          loadGridData_1();
        }
        setShowModal(false);
        setFormPayload({
          data: [],
          hearingIds: [],
          files: [],
        });
        setIds((curIds) => ({
          ...curIds,
          caseId: null,
          oldHearingId: null,
        }));
      } else {
        swal(
          !res.error.details ? "" : res.error.message,
          res.error.details ? res.error.details : res.error.message,
          "warning"
        );
      }
    } catch (error) {
      swal("Something went wrong!", "", "warning");
    }
  };

  const newCsv = csvEntries && csvEntries?.map((entry) => {
    
    if(tab === 4 || tab === 3){
    const prisoners = entry?.prisoners;
    const mappedPrisoners = prisoners && prisoners?.map((prisoner) => {
        const csv = {
            "Prisoner Number": prisoner.id,
            "Full Name": prisoner.fullName,
            "Relationship Type": prisoner?.relationshipType,
            "Relationship Name": prisoner?.relationshipName,
            "Barrack": prisoner.barrack || "not allocated yet",
            "CNIC": prisoner.cnic,
            "Under Sections": prisoner.underSection,
            "Fir No": prisoner?.firNo,
            "Fir Year": prisoner?.firYear,
            "checkOutSting": prisoner.checkOutSting,
        };
        if (isAdmin) {
          csv["Prison Name"] = prisoner.prisonName;
        }

        return csv;
    });
    return mappedPrisoners;
  }
  else{

    const csv = {
      "Prisoner Number": entry.id,
      "Full Name": entry.fullName,
      "Relationship Type": entry?.relationshipType,
      "Relationship Name": entry?.relationshipName,
      "Barrack": entry.barrack || "not allocated yet",
      "CNIC": entry.cnic,
      "Under Sections": entry.underSection,
      "Fir No": entry?.firNo,
      "Fir Year": entry?.firYear,
      "checkOutSting": entry.checkOutSting,
  };
  if (isAdmin) {
    csv["Prison Name"] = entry.prisonName;
  }

  return csv;
  }

});
    const flattenedCsv = newCsv?.flat() || "";


  let fileName =
    tab === 1
      ? "Create Marasla List"
      : tab === 2
        ? "Finalize List"
        : tab === 3
          ? "Return List"
          : "";
  let fileNameTwo =
    tab === 1 ? "Created Marasla List" : tab === 2 ? "Finalized List" : "";

  const showHearingModal = () => {
    setIsOpen(true);
  };
  const hideModal = () => {
    setIsOpen(false);
  };

  const PrintMarasla = async (e) => { 
    e.ignoreRedirect = true;
    navigate('/admin/print-marasla',{
			state: {
				stateParam: { e } 
			},
		});
  }
  return (
    <>
      <InfoModal
        cases={selectedPrisoner?.cases}
        onClose={() => setShowModal(false)}
        visible={showModal}
        setFormPayload={setFormPayload}
        formPayload={formPayload}
        prisonerId={ids.prisonerId}
        tab={tab}
        onSubmit={submitHandler}
        defaultValues={defaultValues}
      />
      

      <HearingModal
        visible={hearingModalIsVisible}
        onClose={setHearingModalIsVisible.bind(this, false)}
        lookups={fetchedData}
        refetch={loadGridData_1}
        oldHearingId={ids.oldHearingId}
        prisonerCaseId={ids.caseId}
      />

      <AllSearch
        handleSubmit={handleSubmit}
        datePicker={picker}
        tomorrowDt={tomorrowDt}
        tab={tab}
        hideNote={true}
      />
        <>
      {entries?.length > 0 ?(
      <>
      
        <Print data={flattenedCsv} filename={fileName} />
        </>
        ): ''
        }

      <br />
      <div className="row">
        {tab === 1 && <h3>Create Marasla</h3>}
        {console.log("entriessss", entries)}
        <div className="card custom-card animation-fade-grids custom-card-scroll ">

          {tab === 1 && (

            <Grid
            ref={gridRef}
            data={transformDataForTableGrid(
              entries.map((entry) => gridDataMap(entry, false))
            )}
            columns={generateGridCols(tab, false, isAdmin)}
            search={true}
            sort={true}
            pagination={{
              enabled: true,
              limit: 5,
            }}
          />
          )}

          {(tab === 3 || tab === 4) && 
            entries?.map((ele) => (
              <React.Fragment key={ele.id}>
                {btnTitle === 'Finalized' && (
                  <button type="button" className="btn btn-info" style={{ width: "fit-content" }} onClick={() => { PrintMarasla(ele) }}>
                    <i className="icon-file label-icon align-middle fs-16 me-2"></i> print
                  </button>
                )}
                <div className="card custom-card animation-fade-grids custom-card-scroll">
                  <Grid
                    ref={gridRef}
                    data={transformDataForTableGrid(
                      ele?.prisoners.map((entry) => gridDataMap(entry, false))
                    )}
                    columns={generateGridCols(tab, false, isAdmin)}
                    search={true}
                    sort={true}
                    pagination={{
                      enabled: true,
                      limit: 5,
                    }}
                  />
                </div>
              </React.Fragment>
            ))
          }
          {isOpen && (
            <Modal show={isOpen} onHide={hideModal} size="xl">
              <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
                <h5 className="modal-title" id="exampleModalgridLabel">
                  Case Hearing
                </h5>
              </Modal.Header>
              <Modal.Body>
                <div className="card ">
                  <div className="row">
                    <ManageHearing oldHearingId={ids.oldHearingId} data={entries} hideModal={hideModal} loadGridData_1={loadGridData_1} returnList={true} courtProduction={true}/>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  id={"close-btn"}
                  className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
                  onClick={hideModal}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
          )}
          </div>
        

        <div className="btns just-center">
          {tab <= 2 &&
            (formPayload.data.length > 0 ||
              formPayload.hearingIds.length > 0) && (
              <button
                id={"submit-btn"}
                className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1 mt-2"
                onClick={
                  tab === 1 ? submitHandler : handleOpenModal.bind(this, null)
                }
              >
                {submitButton}
              </button>
            )}
        </div>
      </div>
      </>
    </>
  );
};

export default ViewCPListing;
