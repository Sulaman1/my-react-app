import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, _ } from "gridjs-react";
import {
  generateActionButtons,
  transformData,
  transformDataForTableGrid,
  validateDate,
} from "../../../../common/Helpers";
import { baseImageUrl, getData, postData } from "../../../../services/request";
import swal from "sweetalert";
import moment from "moment-mini";
import ProfilePic from "../../../../../src/assets/images/users/1.jpg";
import InputWidget from "../../../../droppables/InputWidget";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderOn, setLoaderOff } from "../../../../store/loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import PrisonerInfoCard from "../../../prisoners/Components/release-prisoner/PrisonerInfoCard";
import Print from "../../search/Print";
import AllSearch from "../../search/AllSearch";
import DescriptionModal from "../../../../common/DescriptionModal";
import ScrollButtons from "../../../../common/ScrollButtons";
import ShowNoOfRecords from "../../../../common/ShowNoOfRecords";

const ViewAllocation = (props) => {

  const dispatch = useDispatch();
  //const history = useHistory();
  const navigate = useNavigate();

  const gridRef = useRef();
  const [isCapacity, setIsCapacity] = useState(false);
  const [capacityy, setCapacityy] = useState("");
  const [availableCapacity, setAvailableCapacity] = useState(0);
  const [prisonerData, setPrisonerData] = useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = useState("Barrack Allocation");
  const [modalType, setModalType] = useState("allocate");
  const [barracks, setBarracks] = useState([]);
  const [prisoner, setPrisoner] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [barrackType, setBarrackType] = useState({});
  const [barrackName, setBarrackName] = useState({});
  const [newUserData, setNewUserData] = useState([]);
  const [formPayload, setFormPayload] = useState({
    data: {},
  });
  const [allocationData, setAllocationData] = useState([]);
  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [descmodalTitle, setDescModalTitle] = useState("");
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
  const employeeInfoString = sessionStorage?.getItem("LoggedInEmployeeInfo");
  const employeeInfo = employeeInfoString ? JSON.parse(employeeInfoString) : null;
  const prisonId = employeeInfo?.prisons?.find(prison =>
    prison.prisonId)?.prisonId;

  const userMeta = useSelector((state) => state.user);
  const scrollContainerRef = useRef();
  const handleShowDescModal = (description, title) => {
    const descriptionArray = description.split(',').map(item => item.trim());
    const formattedDescription = descriptionArray.map((item, index) => (
      <span key={index} style={{ padding: "0.5rem" }}>
        ({index + 1}). {item}
        <br />
      </span>
    ));
    setModalContent(formattedDescription);
    setDescModalTitle("Under Sections");
    setShowDescModal(description?.length > 30 ? true : false);
  };

  const showModal = () => {
    setIsOpen(true);
    setIsCapacity(false);
  };

  const hideModal = () => {
    setSelectedDate(null);
    setIsOpen(false);
    resetDropDowns("circle");
  };

  const generateGridCols = () => {
    let gridCols = {};
    if (props?.tabPos == 3) {
      gridCols = {
        "Enclosure (انڭلویر)": "",
        "Barrack Type   (بیرک کی قسم)": "",
        "Barrack   (بیرک) ": "",
        "Allocation Date   (مختصگی کی تاریخ)": "",
        "ReAllaoction Reason   (دوبارہ مختصگی کی وجہ)": "",
      };
    } else if (props?.tabPos == 1) {
      gridCols = {
        "Profile pic (تصویر)": 21,
        "Prisoner Number(قیدی نمبر)": "",
        "Full Name (نام)": "",
        "Relationship Type": "",
        "Relationship Name": "",
        "Year (سال)": "",
        "Admission Date (داخلہ تاریخ)": "",
        "CNIC (شناختی کارڈ)": "",
        "Fir No (ایف آئی آر نمبر)": "",
        "Under Sections (دفعات)": "",
        "Has Opposition (مخالفت ہے؟)": "",
        "Condemend (مذمت)": "",
        "Escaped (فرار)": "",
        "Check-Out Status (چیک آوٹ سٹیٹس)": "",
        "Last Modified By (آخری ترمیم کرنے والا)": "",
        "Actions (عملدرامد)": "",
      };
    } else {
      gridCols = {
        "Profile pic (تصویر)": 21,
        "Prisoner Number(قیدی نمبر)": "",
        "Full Name (نام)": "",
        "Relationship Type": "",
        "Relationship Name": "",
        "Year (سال)": "",
        "Barrack (بیرک)": "",
        "Admission Date (داخلہ تاریخ)": "",
        "CNIC (شناختی کارڈ)": "",
        "Fir No (ایف آئی آر نمبر)": "",
        "Under Sections (دفعات)": "",
        "Has Opposition (مخالفت ہے؟)": "",
        "condemend (مذمت)": "",
        "Escaped (فرار)": "",
        "Check-Out Status (چیک آوٹ سٹیٹس)": "",
        "Last Modified By (آخری ترمیم کرنے والا)": "",
        "Actions (عملدرامد)": "",
      };
    }
    return gridCols;
  };


  const loadData = (payload) => {
    dispatch(setLoaderOn());
    const rawData = sessionStorage.getItem("user");
    const userId = JSON.parse(rawData).userId;
    const employeeInfoString = sessionStorage.getItem("LoggedInEmployeeInfo");
    const objParsed = employeeInfoString ? JSON.parse(employeeInfoString) : "";
    if (!objParsed) {
      navigate("/login");
      return false;
    }
    const obj = {
      userId: userId,
      name: payload?.name || "",
      category: payload?.category || 0,
      prisonId: 0,
      year: payload?.year || 0,
      prsNumber: payload?.prsNumber || 0,
      relationshipTypeId: payload?.relationshipTypeId || 0,
      relationshipName: payload?.relationshipName || "",
      genderId: payload?.genderId || 0,
      policeStationId: payload?.policeStationId || 0,
      circleId: 0,
      barrackId: 0,
      barrackType: 0,
      allocationDate: 0,
      firYear: payload?.firYear || 0,
      capacity: 0,
      underSection: 0,
      barrack: 0,
      checkOutSting: 0,
      prisonerStatusId: 0,
      searchTypeId: 0,
      maxResults: payload?.maxResults || pageLimit
    };
    postData(props.url, obj)
      .then((result) => {
        if (result && result.result.isSuccessful) {
          const data = result.result.data;
          setTotalNoOfRecords(result.result?.totalPrisoners)
          if (data.length > 0) {
            setAllocationData(data);
            setNewUserData(data);
          } else {
            setNewUserData([]);
            setAllocationData([]);
          }
        }
      })
      .catch((err) => {
        console.log(
          err,
          `getting error while posting API {${props.url}} & fileName is {ViewAllocation.js}`
        );
      });
  };
  const handleAllocateButton = (e) => {
    setPrisonerData(e);
    setModalTitle("Allocate Barrack");
    setModalType("allocate");
    showModal();
  }
  const handleReAllocateButton = (e) => {
    setPrisonerData(e);
    setModalTitle("Barrack Re-Allocation");
    setModalType("reallocate");
    showModal();
  }

  const handleHistoryButton = (e) => {
    handlehistoryBtn(e);
    showModal();
  }
  const gridMapData = (e) => {
    const obj = {};

    const shortDescription =
      e?.underSection?.length > 50
        ? `${e.underSection.substring(0, 50)}...`
        : e.underSection;


    if (props?.tabPos == 3) {
      obj["circle"] = e.circle;
      obj["barrackType"] = e.barrackType;
      obj["barrack"] = e.barrack;
      obj["allocationDate"] = validateDate(e.allocationDate);
      obj["reaallocationReason"] = e.barrackReallocation || "First Allocation";
    } else {
      obj["profile"] = _(
        <div className="profile-td profile-td-hover ">
          <div className="pic-view">
            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              className="avatar-xs rounded-circle "
              src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic}`}
              width="50"
            />
          </div>
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic}`}
            width="50"
          />
        </div>
      );
      obj["prisonerNumber"] = e.prisonerNumber;
      obj["fullName"] = e.fullName;
      obj["relationshipType"] = e.relationshipType;
      obj["relationshipName"] = e.relationshipName;
      obj["year"] = e.year === 0 ? "not admitted yet" : e.year;
      if (props.tabPos == 2 || props.tabPos == 3) {
        obj["barrack"] = e.barrack || "not allocated yet";
      }
      obj["admissionDate"] = validateDate(e.admissionDate);
      obj["cnic"] = e.cnic;
      obj["firNo"] = e.firNo;
      obj['underSection'] = _(
        <div className="cursor-pointer"
          onClick={() =>
            handleShowDescModal(e?.underSection, e?.underSection)
          }
        >
          {shortDescription || "not added yet"}
        </div>
      ),

        obj["hasOpposition"] = e.hasOpposition ? "Yes" : "No";
      obj["condemend"] = _(
        <span style={{ color: e.condemend ? "red" : "inherit" }}>
          {e.condemend ? "Yes" : "No"}
        </span>
      );
      obj["escaped"] = e.isEscaped ? "Yes" : "No";
      obj["checkOutSting"] = e?.checkOutSting;
      obj["lastModifiedBy"] = e?.lastModifiedByUser;
      obj["Actions"] = _(
        <div className="action-btns">
          {generateActionButtons({ events: { allocate: handleAllocateButton, reallocate: handleReAllocateButton, allocationhistory: handleHistoryButton }, data: e, key: "Barrack Allocation", userMeta, extraProps: props?.tabPos })}
        </div>
      );
    }
    return obj;
  };

  const resetDropDowns = (name) => {
    const payload = {
      ...props.formPayload,
    };
    switch (name) {
      case "circle":
        payload["barrackType"] = "";
        payload["barrackTypeName"] = "";
        payload["prisonCircle"] = "";
        setBarrackType({});
        setBarrackName({});
        break;
      case "barrackType":
        payload["barrackId"] = "";
        setBarrackName({});
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (props.url && props.tabPos !== 3) {
      loadData();
    } else if (props.tabPos === 3 && props.prisonerId) {
      loadHistoryData(props.prisonerId);
    }
  }, [pageLimit]);

  const handlehistoryBtn = (e) => {
    sessionStorage.setItem("selectedPrisoner", JSON.stringify(e));
    if (props.setBarrackPrisonerId) {
      props.setBarrackPrisonerId(e.id);
      props.setActiveTab(2);
    }
  };

  const loadHistoryData = (prisonerId) => {

    getData(
      `/services/app/PrisonerDetailInformation/GetAllBarracks?PrisonerId=${prisonerId}`,
      "",
      true
    )
      .then((res) => {
        const { prisonerData, barracksData } = res.result;
        setPrisoner(prisonerData);
        if (barracksData?.length > 0) {

          setAllocationData(barracksData);
        } else {
          setAllocationData([]);

        }
      })
      .catch((err) => {
        console.log(
          err,
          `getting error while posting API {GetAllBarracks} & fileName is {ViewAllocation.js}`
        );
      });
  };

  const getBarrackId = async (pd) => {
    // add condition for having both types and circle
    if (pd.circleId && pd.barrackType != null) {
      const { barracksData } = props.lookUps;
      const filterBarrack = barracksData.filter(
        (barrack) =>
          barrack.circle === pd.circleName &&
          barrack.prisonBarrackTypes === pd.barrackTypeName
          && prisonId === barrack.prisonId
      );
      const barracks = transformData(filterBarrack);
      setBarracks(barracks);
    }
  };

  const loadBarackCapacity = async (id) => {
    if (id) {
      setIsCapacity(true);
      const payload = {
        ...formPayload,
      };
      //getting capacity
      const populated = await getData(
        `/services/app/PrisonerDetailInformation/GetBarrackPopulation?BarrackId=${id}`,
        "",
        true
      );
      const cap = populated;
      const diffCapacity =
        cap?.result?.totalPopulation - cap?.result?.currentPopulation;
      if (diffCapacity < 1) {
        // Mateen put ur code logic here
        const willProceed = await swal({
          title: "barrack Capacity is full Are you sure you want to proceed?",
          text: props.swalText,
          icon: "warning",
          buttons: ["No", "Yes"],
        }).then((willProceed) => {
          if (willProceed) {
            swal("you can Allocate now ", "", "success", {
              icon: "success",
            });
          } else {
            swal("You Declined The Allocation !", "", "error");
            hideModal();
          }
        });
      }
      setAvailableCapacity(diffCapacity);
      setCapacityy(cap);
    } else {
      setIsCapacity(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const {
      barrackId,
      allocationDate,
      circleId,
      barrackType,
      capacity,
      barrackReallocation,
    } = formPayload;
    const payload = {
      barrackId,
      allocationDate,
      circleId,
      barrackType,
      capacity,
      barrackReallocation,
      prisonerBasicInfoId: prisonerData.id,
    };
    try {

      const result = await postData(
        "/services/app/PrisonerDetailInformation/AllocatePrisonerBarrack?DontCheckBarrackCappacity=true",
        payload
      );
      if (payload?.circleId == null) {
        swal("Please Select The Enclosure!", "", "warning");
      } else if (payload?.barrackType == null) {
        swal("Please Select The Barrack Type!", "", "warning");
      } else if (payload?.barrackId == null) {
        swal("Please Select The Barrack!", "", "warning");
      } else if (payload?.allocationDate == null) {
        swal("Please select the Date!", "", "warning");
      } else if (
        modalType == "reallocate" &&
        payload?.barrackReallocation == null
      ) {
        swal("Please Enter The Barrack Reallocation Reason!", "", "warning");
      } else if (result && result?.result?.isSuccessful) {
        //const data = result.result.data;
        hideModal();
        loadData();
        swal("Successfully Saved!", "", "success");
        setFormPayload(null);
      } else {
        swal({
          button: true,
          icon: "error",
          title: result?.error?.message || "something went wrong",
        });
      }
    } catch (err) {
      console.error(err);
      console.log(
        err,
        `getting error while posting API {AllocatePrisonerBarrack} & fileName is {ViewAllocation.js}`
      );
    } finally {
      loadData();

    }
  };

  const newData = newUserData.map((x) => {
    if (props.tabPos == 1) {
      return {
        "Prisoner Number": x.prisonerNumber,
        "Full Name": x.fullName,
        "Relationship Type": x?.relationshipType,
        "Relationship Name": x.relationshipName,
        "Admission Date": validateDate(x.admissionDate),
        CNIC: x.cnic,
        "Fir No": x.firNo,
        "Under Section": x.underSection,
        "Check-Out-Status": x.checkOutSting,
      };
    } else {
      return {
        "Prisoner Number": x.prisonerNumber,
        "Full Name": x.fullName,
        "Relationship Type": x?.relationshipType,
        "Relationship Name": x.relationshipName,
        Barrack: x.barrack,
        "Admission Date": validateDate(x.admissionDate),
        "Fir No": x.firNo,
        "Under Section": x.underSection,
        "Check-Out-Status": x.checkOutSting,
      };
    }
  });

  let file =
    props.tabPos == 1
      ? "UnAllocated Prisoner"
      : props.tabPos == 2
        ? "Allocated Prisoners"
        : "prisoners";

  return (
    <>
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={descmodalTitle}
      />

      {props.tabPos == 3 && prisoner && !props.isDetails && (
        <PrisonerInfoCard prisoner={prisoner} />
      )}
      {props.tabPos != 3 && (
        <>
          <AllSearch handleSubmit={loadData} />
          <Print data={newData} filename={file} />
        </>
      )}
      <div className="row gridjs">
        <div className="col-xl-12 p-0">
          <div classname="wrapper">
            <div className="card custom-card animation-fade-grids scrollable-container custom-card-scroll" ref={scrollContainerRef}>
              <div className="row ">
                <div className="col">
                  {/* <div ref={wrapperRef} />
                 */}
                  <ScrollButtons scrollContainerRef={scrollContainerRef} />
                  <div className="float-end">
                    <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
                  </div>

                  <Grid
                    ref={gridRef}
                    data={transformDataForTableGrid(
                      allocationData?.map((e) => gridMapData(e))
                    )}
                    columns={Object.keys(generateGridCols())}
                    search={true}
                    sort={true}
                    pagination={{
                      enabled: true,
                      limit: pageLimit,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <Modal show={isOpen} size="lg" onHide={hideModal}>
          <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
            <h5 class="modal-title" id="exampleModalgridLabel">
              {modalTitle}
            </h5>
          </Modal.Header>
          <Modal.Body>
            {modalType !== "history" && (
              <form className="col-lg-12  justify-content-center">
                <div class="row g-3">
                  <div class="col-xxl-12">
                    <div>
                      <InputWidget
                        type={"multiSelect"}
                        inputType={"name"}
                        label={"Enclosure انڭلویر"}
                        id={"circle"}
                        require={false}
                        icon={"icon-culutural"}
                        setCapitalise={false}
                        options={props?.lookUps?.prisonCircle || []}
                        setValue={(value) => {
                          console.log("🚀 ~ value:", value)
                          const payload = {
                            ...formPayload,
                          };
                          payload["circleId"] = value.value;
                          payload["circleName"] = value.label;
                          resetDropDowns("circle");
                          setFormPayload(payload);
                          getBarrackId(payload);
                        }}
                      />
                    </div>
                  </div>
                  <div class="col-xxl-12">
                    <div>
                      <InputWidget
                        type={"multiSelect"}
                        inputType={"name"}
                        label={"Barrack Type بیرک کی قسم"}
                        id={"barrack-type"}
                        require={false}
                        options={props?.lookUps?.barracksTypes || []}
                        icon={"icon-culutural"}
                        setCapitalise={false}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["barrackType"] = value.value;
                          payload["barrackTypeName"] = value.label;
                          setBarrackType(value);
                          resetDropDowns("barrackType");
                          setFormPayload(payload);
                          getBarrackId(payload);
                        }}
                        defaultValue={barrackType || {}}
                      />
                    </div>
                  </div>
                  <div class="col-xxl-12">
                    <div>
                      <InputWidget
                        type={"multiSelect"}
                        inputType={"name"}
                        label={"Barrack بیرک"}
                        id={"barrack"}
                        require={false}
                        options={barracks || []}
                        icon={"icon-culutural"}
                        setCapitalise={false}
                        setValue={(value) => {
                          const payload = {
                            ...formPayload,
                          };
                          payload["barrackId"] = value.value;
                          loadBarackCapacity(value.value);
                          setBarrackName(value);
                          setFormPayload(payload);
                        }}
                        defaultValue={barrackName || {}}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-12">
                    <div className="inputs force-active">
                      <label>Allocation Date</label>
                      <DatePicker
                        defaultPickerValue={moment()}
                        defaultValue={moment()}
                        icon={"icon-calendar"}
                        selected={selectedDate}
                        id={"allocation-date مختصگی کی تاریخ"}
                        onChange={(date) => {
                          setSelectedDate(date);
                          const pd = {
                            ...formPayload,
                          };
                          pd["allocationDate"] = date
                            ? `${date.getFullYear()}-${date.getMonth() + 1
                            }-${date.getDate()}`
                            : "";
                          setFormPayload(pd);
                        }}
                        dateFormat="dd/MM/yyyy"
                        maxDate={addDays(new Date(), 0)}
                        isClearable
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        placeholderText={""}
                      />
                    </div>
                  </div>
                  {modalType == "reallocate" && (
                    <div class="col-xxl-12">
                      <div>
                        <InputWidget
                          type={"input"}
                          inputType={"name"}
                          label={"ReAllocation Reason دوبارہ مختصگی کی وجہ"}
                          require={true}
                          id={"reallocation-reason"}
                          icon={"icon-operator"}
                          setValue={(value) => {
                            const payload = {
                              ...formPayload,
                            };
                            payload["barrackReallocation"] = value;
                            setFormPayload(payload);
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    {isCapacity ? (
                      <div className="col float-start">
                        <h4
                          style={{
                            color: availableCapacity > 0 ? "green" : "red",
                          }}
                        >
                          Capacity: &nbsp;
                          {capacityy?.result?.currentPopulation}
                          {"/"}
                          {capacityy?.result?.totalPopulation}
                        </h4>
                      </div>
                    ) : (
                      <div className="col float-start">
                        <h4 style={{ color: "red" }}>
                          {" "}
                          No barrack capacity allocated
                        </h4>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-danger"
              id={"cancel-allocation"}
              onClick={() => {
                hideModal();
                setFormPayload(null);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary m-1"
              onClick={handleSave}
              id={"save-allocation"}
            >
              Save
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ViewAllocation;
