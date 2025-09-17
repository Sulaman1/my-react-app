/* eslint-disable no-tabs */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { Grid, _ } from "gridjs-react";
import {
  formatDate,
  getFormattedDate,
  transformDataForTableGrid,
  validateDate,
} from "../../../../../common/Helpers";
import {
  baseImageUrl,
  getData,
  postData,
} from "../../../../../services/request";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";
import ProfileCard from "../profile/ProfileCard";
import ProfilePic from "../../../../../../src/assets/images/users/1.jpg";
import { useDispatch, useSelector } from "react-redux";
import FingerScanner from "../../../../../common/FingerScanner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InfoModal from "../../../../../modules/courtProduction/components/InfoModal";
import { Button } from "react-bootstrap";
import PoliceOfficerDetailsModal from "./PoliceOfficerDetailsModal";
import DescriptionModal from "../../../../../common/DescriptionModal";
export const getTodayDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const ViewHearingCheckInOut = ({
  text,
  modalHeader,
  getURL,
  apiEndpoint,
  swalText,
  tabPos,
  btnText,
  subTitle,
  tabTitle,
  isCheckBoxShow,
  noAction,
  Notify,
  policeOfficer,
  checkBoxForCheckIn,
  btnTitle,
  isShowHearingStats,
  showEscaped,
  headerTitle
}) => {
  const gridRef = useRef();
  const [upadtedGridData, setUpadtedGridData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fetchedPrisoner, setFetchedPrisoner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formPayload, setFormPayload] = useState({});
  const [datePayload, setDatePayload] = useState();
  const [modalPayload, setModalPayload] = useState([]);
  const userMeta = useSelector((state) => state.user);
  const [isAdmin] = useState(userMeta?.role === "Super Admin");
  const [isCo] = useState(userMeta?.role === "Prison Circle Office");
  const [isDarban] = useState(userMeta?.role === "Darban");
  const [fingerIndex, setFingerIndex] = useState("");
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [searchVisibility, setSearchVisibility] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [getSelectedPrisoners, setGetSelectedPrisoners] = useState([]);
  const [policeOfficerData, setPoliceOfficerData] = useState([]);
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const today = new Date();
  const todayDate = formatDate(getTodayDate(today));
  const [VehicleNumber, setVehicleNumber] = useState("");
  const [showDescModal, setShowDescModal] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [modalTitle, setModalTitle] = useState("");
  const [biomatricSelection, setBiomatricSelection] = useState('');

  const handleShowDescModal = (description, title) => {
    const descriptionArray = description.split(',').map(item => item.trim());
    const formattedDescription = descriptionArray.map((item, index) => (
      <span key={index} style={{padding: "0.5rem"}}>
        ({index + 1}). {item}
        <br />
      </span>
    ));
    setModalContent(formattedDescription);
    setModalTitle("Under Sections");
    setShowDescModal(description?.length > 30 ?  true : false);
  };

  const handleSearchButtonClick = (event) => {
    event.preventDefault();
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!showModal) {
      setIsDisabled(false);
    }
  }, [showModal]);

  useEffect(() => {
    if(biomatricSelection) {
      setTimeout(()=> {
        const inputElement = document.getElementById('checkouts-'+ biomatricSelection.id);
        if (inputElement) {
          inputElement.checked = false;
          inputElement.click();
        }
      }, 1000)
    }
  },[biomatricSelection])

  //  GRID 1
  const loadData = () => {
    
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
      genderId: 0,
      policeStationId: 0,
      firYear: 0,
      underSection: 0,
      barrack: 0,
      checkOutReason: 0,
      prisonerStatusId: 0,
      searchTypeId: 0,
    };
    let param = '' ;
    const datePickerDate = formatDate(datePayload?.datePicked || todayDate)
    if(datePayload?.datePicked){
      param = `?date=${datePickerDate}`
    }
    getData(`/services/app/CourtProduction/${getURL+param}`)
      .then((result) => {
        if (result && result.success) {
          const data = result.result.maraslas;
          const gridNewData = result?.result.maraslas
          if (data && data.length > 0) {
            setUpadtedGridData(gridNewData);
            const gridjsInstance = gridRef.current.getInstance();
            gridjsInstance.on("rowClick", (...args) => {
            });
          } else {
            setUpadtedGridData([])
          }
        } else {
          console.error("something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const generateGridCols = () => {
    const gridCols = {
      "profile pic": "",
      "Prisoner Number": "",
      Year: "",
      "Full Name": "",
      "Relationship Type": "",
      "Relationship Name": "Abdullah",
      Barrack: "",
      CNIC: "17301-5838517-9",
      "Admission Date": "2022-04-14T00:00:00+05:00",
      "Fir No": "",
      "Under Section": "",
    };

    if (isAdmin) {
      gridCols['Prison Name'] = '';
    }
    gridCols['Warrant Only'] = "";

    gridCols['Action'] = '';
    if (noAction) {
      delete gridCols['Action']
    }
    if (policeOfficer) {
      gridCols['Police Officer Details'] = "";
    }
    const cols = isCheckBoxShow || checkBoxForCheckIn ? { select: "", ...gridCols } : gridCols;
    return cols;
  };


  const selectPrisonerHandler = (entry, underSection) => {
    const prison_id = entry.prisoner.id
    getData(
      `/services/app/PrisonerCheckInOut/GetLastCheckInOut?PrisonerId=${prison_id}`,
      "",
      true
    )
      .then((response) => {
        const prisoner = response.result.data;
        prisoner.hearingId = entry?.hearingId;
        prisoner.prisonerData.underSection = underSection;
        const payload = { 
          prisonerBasicInfoId: prison_id,
          warrantOnly: entry?.warrantOnly,
          hearingId: entry?.hearingId,
          checkPoliceOfficers: [],
          checkVehicleNumber: "",
          otherDetails: ""
        };
        if(prisoner.id != 0 && entry?.warrantOnly == false){
          payload['id'] = prisoner.id
        }
        // If you want to return the updated array, you can do so like this:
        const updatedPayloadArray = [...modalPayload, payload];
        setModalPayload(updatedPayloadArray);
        const selectedPrisoners = [...getSelectedPrisoners, prisoner];
        setGetSelectedPrisoners(selectedPrisoners);
      })
      .catch((err) => {
        console.log(err);
      });

  };


  const unselectPrisonerHandler = (entry) => {
    setModalPayload((prevPayload) => prevPayload.filter((payload) => payload.hearingId !== entry?.hearingId));
    setGetSelectedPrisoners((prevPayload) => prevPayload.filter((payload) => payload.hearingId !== entry?.hearingId));
  }


  const gridMapData = (e) => {

    const shortDescription =
    e?.caseData.underSections?.length > 50
      ? `${e?.caseData.underSections.substring(0, 50)}...`
      : e?.caseData.underSections;

    const obj = {}
    if ((userMeta?.role === "Super Admin" && isCheckBoxShow) || (userMeta?.role != "Super Admin" && isCheckBoxShow) || (userMeta?.role === "Super Admin" && checkBoxForCheckIn) || (userMeta?.role != "Super Admin" && checkBoxForCheckIn)) {
      obj['selected'] = _(
        <input
          className="form-check-input"
          type="checkbox"
          id={`checkouts-${e.prisoner?.id}`}
          style={{ width: '1.7rem', height: '1.7rem', marginLeft: '11px' }}
          checked={e.selected}
          onChange={(event) => {
            const checked = event.target.checked;
            e.selected = checked
            if (checked) {
              selectPrisonerHandler(e, e?.caseData?.underSections);
            } else {
              unselectPrisonerHandler(e);
            }
          }}
        />
      )
    }
    obj['profile'] = _(
      <div className="profile-td profile-td-hover" id={e.warrantOnly && "warrantOnlyCss"}>
        <div className="pic-view">
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${e.prisoner?.frontPic ? baseImageUrl + e.prisoner.frontPic : ProfilePic
              }`}
            width="50"
          />
        </div>
        <img
          onError={(ev) => {
            ev.target.src = ProfilePic;
          }}
          className="avatar-xs rounded-circle "
          src={`${e?.prisoner?.frontPic ? baseImageUrl + e.prisoner.frontPic : ProfilePic
            }`}
          width="50"
        />
      </div>
    );
    obj['prisonerNumber'] = e?.prisoner?.prisonerNumber;
    obj['year'] = e?.prisoner?.year === 0 ? "not admitted yet" : e?.prisoner?.year;
    obj['fullName'] = e?.prisoner?.fullName;
    obj['relationshipType'] = e?.prisoner?.relationshipType;
    obj['relationshipName'] = e?.prisoner?.relationshipName;
    obj['barrack'] = e?.prisoner?.barrack || "not allocated yet";
    obj['cnic'] = e?.prisoner?.cnic;
    obj['admissionDate'] = validateDate(e?.prisoner?.admissionDate) || "";
    obj['firNo'] = e?.caseData?.firNo;
    obj['underSection'] = _(
				<div className="cursor-pointer"
				  onClick={() =>
					handleShowDescModal(e?.caseData.underSections, e?.caseData?.underSections)
				  }
				>
				  {shortDescription ||  "not added yet"}
				</div>
			  ),
    obj['prisonName'] = e?.prisoner?.prisonName
    obj['warrantOnly'] = e.warrantOnly ? "Yes" : "No",
    obj['Actions'] = _(
      <div className="action-btns">
        {e.appealInProgress == true && (
          <button
            id={"view-more-btn"}
            type="button"
            className="tooltip btn btn-danger waves-effect waves-light mx-1 "
          >
            <i className="icon-glamping"></i>
            <span>Appeal In process</span>
          </button>
        )}
        {(!e?.warrantOnly && showEscaped) && (

          <button
          id={"add-btn-add"}
          type="button"
          onClick={() => {
            handleEscaped(e.prisoner)
          }}
          className="tooltip btn btn-success waves-effect waves-light mx-1"
        >Escaped
        </button>
          )}           
        {e.selected || !checkBoxForCheckIn ||  !isCheckBoxShow &&
        <>
        {!showEscaped && 
        <button
            id={"approve-btn"}
            type="button"
            onClick={() => {
              handleSelectedPrisoner(e.prisoner)
              // setSelectedPrisoner(e)
            }}
            className="btn btn-success waves-effect waves-light mx-1 tooltip"
          >
            <i className="icon-show-password"></i> <span>View Details</span>

          </button>
        }
        </>
          
        }
        {!(isCheckBoxShow || policeOfficer || checkBoxForCheckIn) &&
          <button
            id={"approve-btn"}
            type="button"
            onClick={() => handleSelectedPrisoner(e.prisoner)}
            className="btn btn-success waves-effect waves-light mx-1 tooltip"
          >
            <i className="icon-active"></i>
            <span>{btnText || "Approve"}</span>
          </button>}
        {policeOfficer &&
          <button
            id={"approve-btn"}
            type="button"
            onClick={() => handleSelectedOfficer(e)}
            className="btn btn-info waves-effect waves-light mx-1 tooltip"
          >
            <i className="icon-show-password"></i>
            <span>{"View Details"}</span>
          </button>}
      </div>
    )
    if ((userMeta?.role != "Super Admin" && !isCheckBoxShow) || (userMeta?.role != "Super Admin" && isCheckBoxShow) || (userMeta?.role != "Super Admin" && !checkBoxForCheckIn) || (userMeta?.role != "Super Admin" && checkBoxForCheckIn)) {
      delete obj.prisonName
    }
    return obj;
  }

  const openModal = () => {
    setShowSelectModal(true)
  }

  const handleSelectedOfficer = (e) => {
    const officer = subTitle === "Hearing Checked-in" ? e?.checkInPoliceOfficers : e?.checkOutPoliceOfficers
    const Vehicle = subTitle === "Hearing Checked-in" ? e?.checkInVehicleNumber : e?.checkOutVehicleNumber
    setVehicleNumber(Vehicle)
    setPoliceOfficerData(officer)
    setShowOfficerModal(true)
  }

  const hideModal = () => {
    
    setShowModal(false);
    setShowOfficerModal(false)
  };

  const handleCloseModal = () => {
    setModalIsVisible(false);
  };

  const handleCheckout = async (e, isMulti) => {
    setIsDisabled(true);
    
    if (isMulti) {
      let url = `/services/app/PrisonerCheckInOut/${apiEndpoint}`;
      const payload = {
        data: modalPayload
      }
      const res = await postData(url, payload);
      if (res.success && res.result?.isSuccessful) {

        setModalPayload([])
        setFormPayload({});
        setGetSelectedPrisoners([])
        setShowSelectModal(false)

       
        swal("Successfully Sent!", "", "success");
        loadData();

      } else {
        swal(
          !res.error.details ? "" : res.error.message,
          res.error.details ? res.error.details : res.error.message,
          "warning"
        );
      }
    } else {
      const rawData = sessionStorage.getItem("prisoner");
      const parsedData = JSON.parse(rawData);
      const parsedId = parsedData?.id;
      const payload = {
        data: {
          id: fetchedPrisoner.id,
          prisonerBasicInfoId: parsedId,
        },
      };
      if (tabPos === 1) {
        payload.data = { ...payload.data, ...formPayload };
      } else if (tabPos === 2) {
        payload.data = {
          ...payload.data,
          checkReasonId: fetchedPrisoner.checkReasonId,
          checkOutRequestDateTime: fetchedPrisoner.checkOutRequestDateTime,
        };
      } else if (tabPos === 3) {
        payload.data = {
          ...payload.data,
          checkReasonId: fetchedPrisoner.checkReasonId,
          checkOutRequestDateTime: fetchedPrisoner.checkOutRequestDateTime,
          checkOutDateTime: e.checkOutDateTime,
        };
      } else if (tabPos === 4) {
        payload.data = {
          ...payload.data,
          checkReasonId: fetchedPrisoner.checkReasonId,
          checkOutRequestDateTime: fetchedPrisoner.checkOutRequestDateTime,
          checkOutDateTime: e.checkOutDateTime,
          checkOutDarbanDateTime: e.checkOutDarbanDateTime,
        };
      } else if (tabPos === 5) {
        payload.data = {
          ...payload.data,
          checkReasonId: fetchedPrisoner.checkReasonId,
          checkOutRequestDateTime: fetchedPrisoner.checkOutRequestDateTime,
          checkOutDateTime: e.checkOutDateTime,
          checkOutDarbanDateTime: e.checkOutDarbanDateTime,
          checkInDarbanDateTime: e.checkInDarbanDateTime,
        };
      }

      console.log(payload);
      // 13
      postData(`/services/app/PrisonerCheckInOut/${apiEndpoint}`, payload)
        .then((res) => {
          if (res.success && res.result.isSuccessful) {

            setShowModal(false);
            swal(swalText, "", "success");
            if (Object.keys(formPayload).length > 0) {
              setFormPayload({});
            }
            sessionStorage.removeItem("prisoner");
            // refetch
            // GRID 1
            loadData();
            // GRID 2
            // loadEntries();
          } else {
            swal(res.error.message, res.error.details, "warning");
          }
        })
        .catch((err) => {
          swal("Something went wrong!", "", "warning");

        });
    }

  };
  const fetchLastPrisonerCheckinCheckout = (p) => {
    return new Promise(async (resolve, reject) => {
      try {
        setShowModal(true);
        setLoading(true);
        getData(
          `/services/app/PrisonerCheckInOut/GetLastCheckInOut?PrisonerId=${p.id}`,
          "",
          true
        )
          .then((response) => {
            setFetchedPrisoner(response.result.data);
            setLoading(false);
            resolve(response.result.data)
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            reject(false)
          });
        sessionStorage.setItem("prisoner", JSON.stringify(p));
      } catch (error) {
        console.log('fetch last prisoner checkin checkout', error)
      }
    })
  }
  const handleCheckoutPrisoner = async (prisonerData) => {
    setBiomatricSelection(prisonerData)
    // await fetchLastPrisonerCheckinCheckout(prisonerData)
  }

  const handleSearchVisibility = () => {
    setSearchVisibility((prevVisibility) => !prevVisibility);
  };

  const handleSendNotification = () => {
    try {
      postData(
        `/services/app/PrisonerCheckInOut/SendCourtProductionNotification?checkout=${false}`,
        "",
        true
      )
        .then((response) => {
          if (response?.result?.isSuccessful) {
            swal("Notification Sent", "", "success")
          }

        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log('SendCourtProductionNotification', error)
    }

  }


  const handleSelectedPrisoner = (p) => {
    setShowModal(true);
    setLoading(true); 
    getData(
      `/services/app/PrisonerCheckInOut/GetLastCheckInOut?PrisonerId=${p.id}`,
      "",
      true
    )
      .then((response) => {
        console.log("FETCHED PRISONER", response);
        setFetchedPrisoner(response.result.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    sessionStorage.setItem("prisoner", JSON.stringify(p));
  };



  if (isAdmin) {
    var file =
      tabPos == 1
        ? "Check Out By Circle Office List"
        : tabPos == 2
          ? "Check Out By Darban"
          : tabPos == 3
            ? " check-in"
            : tabPos == 4
              ? "Check In By Circle Office "
              : "";

  }
  if (isCo) {
    var file =
      tabPos == 1
        ? "Check Out By Circle Office List"
        : tabPos == 2
          ? "Check In By Circle Office List"
          : "";

  }
  if (isDarban) {
    var file =
      tabPos == 1
        ? "Checkout By Darban List"
        : tabPos == 2
          ? " check-in List"
          : "";
  }

  const handleEscaped = (prionser) => {
    swal({
			title: 'Are you sure?',
			text: 'You want to Escape: ' + prionser.fullName,
			icon: 'warning',
			buttons: true,
			dangerMode: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Escape it!',
      cancelButtonText: 'No, cancel!',
		}).then(async willDelete => {
			
			if (willDelete) {
        const escaped = await postData(`/services/app/AddPrisonerAppServices/EscapedPrisoner?prisonerBasicInfoId=${prionser.id}&escaped=true`)
        if (escaped.success) {
					swal("Prisoner has been marked as escaped", "", "success");
					loadGridData_1();
				} else {
					swal("Error", escaped?.error?.message || "Something went wrong", "error");
				}	
			}
		});
    
  }


  return (
    <>

      <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />

      <button className="btn btn-prim search-btn-prim" onClick={handleSearchVisibility}>
        Search By Date
      </button>
      {searchVisibility && (<>
        <div className="col-12 px-0">
          <form onSubmit={handleSearchButtonClick}>
            <div className="col-lg-4">
              <div className="inputs force-active">
                <label>Marasla Date (تاریخ)</label>
                <DatePicker
                  selected={getFormattedDate(
                    datePayload?.datePicked
                  )}
                  onChange={(datePicked) => {
                    const payload = {
                      ...datePayload,
                    };
                    payload["datePicked"] = datePicked;
                    setDatePayload(payload);
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
            <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
              <button
                type="submit"
                className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
              >
                <i className="icon-search ml-2"></i> Search
              </button>
            </div>
          </form>
        </div>
      </>)}
      {/* <Print data={newData} filename={file} /> */}
      <div className="card custom-card animation-fade-grids custom-card-scroll" >
        {isDarban && (
          <>
            {(subTitle === 'Hearing Checkout Requests' || subTitle === 'Hearing Checkin Requests') && (
             <div className="d-flex justify-content-end">
             <button
                onClick={() => {
                  setModalIsVisible(true);
                  setFingerIndex("right thumb");
                }}
                type="button"
                className="btn btn-success btn-label"
                style={{
                  position: "absolute",
                  top: "83px",
                  zIndex: "9",
                }}
              >
                <i className="icon-search label-icon align-middle fs-16 me-2"></i>{" "}
                Biometric {subTitle.includes('Checkout') ? 'Checkout' : 'Check-in'}
              </button>
              </div>
              )} 
          </>)}


        <InfoModal
          onClose={() => setShowSelectModal(false)}
          visible={showSelectModal}
          setFormPayload={setModalPayload}
          formPayload={modalPayload}
          onSubmit={() => { handleCheckout("", true) }}
          hearingCheckInOutModal={true}
          selectedPrisoners={getSelectedPrisoners}
          isShowHearingStats={isShowHearingStats}
          headerTitle={headerTitle}
          // warrantOnly={true}
        />

        <h3 class="third-heading">
          <span style={{ fontWeight: "bold" }}>{subTitle}</span>
        </h3>

        {upadtedGridData?.map((e) => {
          return (
            <div className="row">
              <Grid
                ref={gridRef}
                data={transformDataForTableGrid(e?.prisoners.map((ele) =>
                  gridMapData(ele, true))
                )}
                columns={Object.keys(generateGridCols())}
                search={true}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
              {Notify && (
                <div className="btns col-3 just-center" style={{ width: "100%" }}>
                  <Button onClick={() => handleSendNotification()}>
                    {isDarban ?
                      "Send Notification To Circle Office" : "Send Notification To Court Production"}
                  </Button>
                </div>
              )}
            </div>
          )
        })}

        {upadtedGridData?.length == 0 && (
          <>
            <h2>
              {" "}
              <b className="text-center mx-5">No Records Found</b>
            </h2>
          </>
        )}

        <div className="btns just-center mb-5">
          {modalPayload.length > 0 ?
            <button
              id={"submit-btn"}
              className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1 mt-2"
              onClick={() => openModal()}
            >
              
              {btnTitle || "checkout"}

            </button>
            :""}
        </div>
      </div>
      <PoliceOfficerDetailsModal
        show={showOfficerModal}
        onHide={() => setShowOfficerModal(false)}
        policeOfficerData={policeOfficerData}
        vehicleNumber={VehicleNumber}
        subTitle={subTitle}
      />
      <Modal
        show={showModal}
        onHide={hideModal}
        size="custom-xl "
        class="modal-custom-xl"
      >
        <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
          <h5 className="modal-title" id="exampleModalgridLabel">
            {modalHeader || "Approve Request"}
          </h5>
        </Modal.Header>
        <Modal.Body>
          <form>
            <>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <ProfileCard
                    data={fetchedPrisoner?.prisonerData}
                    tabTitle={tabTitle}
                    tabPos={tabPos}
                    extra={fetchedPrisoner}
                  />
                </>
              )}
            </>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            id={"cancel-btn"}
            className="btn btn-light"
            onClick={hideModal}
          >
            Cancel
          </button>
          <button
            disabled={isDisabled}
            id={"confirm-btn"}
            className="btn btn-primary"
            onClick={isCheckBoxShow ? hideModal : handleCheckout}
          >
            {text || "Confirm"}
          </button>
        </Modal.Footer>
      </Modal>

      <FingerScanner
        visible={modalIsVisible}
        title="Finger Print Scanner"
        onClose={handleCloseModal}
        fingerIndex={fingerIndex}
        scanType={"search"}
        globalSearch={false}
        isCheckout={true}
        handleCheckoutPrisoner={handleCheckoutPrisoner}
      />
    </>
  );
};

export default ViewHearingCheckInOut;
