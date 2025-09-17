/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Grid, _ } from "gridjs-react";

import swal from "sweetalert";
import DetailsGrid from "../../../components/prisoners/Components/DetailsGrid";
import CaseModal from "../../../components/prisoners/Components/CaseModal";
import PrisonerInfoCard from "../../../components/prisoners/Components/release-prisoner/PrisonerInfoCard";
import {
  getItemFromList,
  transformData,
  transformDataForTableGrid,
  validateDate,
  formatDate
} from "../../../common/Helpers";
import { baseImageUrl, getData } from "../../../services/request";
import HearingModal from "./HearingModal";
import { useDispatch, useSelector } from "react-redux";
import CancelModal from "./CancelModal";
import ProfilePic from '../../../assets/images/users/1.png';

import ShowDocImage from "../../../common/ShowDocImage";

const HearingEntries = {
  "Court (عدالت)": "",
  "Remanding Court (ریمانڈ عدالت)": "",
  "Judge (جج)": "",
  "Last Hearing Date (آخری پیشی کی تاریخ)": "",
  "Next Hearing Date (اگلی پیشی کی تاریخ)": "",
  "Warrant (وارنٹ)": "",
  'Cancel Reason': "",
  'Actions': ''
};

const ManageHearing = (props) => {


  const dispatch = useDispatch()
  const [prisoner, setPrisoner] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loadedCases, setLoadedCases] = useState([]);
  const [loadedHearings, setLoadedHearings] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [checkCaseReleaseStatus, setCheckCaseReleaseStatus] = useState(true);
  const [selectedHearing, setSelectedHearing] = useState(null);
  const [todayDate, setTodayDate] = useState(formatDate(new Date()))
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelHearingId, setCancelHearingId] = useState(null);
  const [refetchHearing, setRefetchingHearing] = useState([]);
  const [belowHearingGrid, setBelowHearingGrid] = useState([]);
  const [showDocImage, setShowDocImage] = useState(false)
  const [viewDoc, setViewDoc] = useState("")
  const prisonerObj = JSON.parse(
    sessionStorage.getItem("prisonerHearingEntry")
  );
  const newLookups = useSelector((state) => state?.dropdownLookups)

  const [isUTP] = useState(prisonerObj?.prisonerCategory === "UTP");

  const [caseInfo, setCaseInfo] = useState({});

  const [caseModalIsvisible, setCaseModalIsVisible] = useState(false);
  // const [defaultValues, setDefaultValues] = useState({});
  const [caseId, setCaseId] = useState();
  const [latestHearing, setLatestHearing] = useState({});

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

  useEffect(() => {
    if (sessionStorage.getItem("prisonerHearingEntry") && !props.data) {
      loadData();
    }
    if (sessionStorage.getItem("prisonerHearingEntry")) {
      const parsed = JSON.parse(sessionStorage.getItem("prisonerHearingEntry"))
      setPrisoner(parsed)
    }
  }, []);

  useEffect(() => {
    fetchApiData();
  }, []);


  useEffect(() => {
    console.log(prisoner, "PRISONER");  
    
    if (props.data && sessionStorage.getItem("prisonerHearingEntry")) {
      const selectedPrisoner = JSON.parse(sessionStorage.getItem("prisonerHearingEntry"))

      // const prisonersArray1 = props.data.map(item => item.prisoners);
      // const prisonersArray = prisonersArray1.flat();
      const { data } = props;
      // const cases = prisonersArray?.[0]?.cases
      // const cases = prisonersArray.filter((item) => item?.cases[0]?.hearingId === props.oldHearingId);
      const mapCases = selectedPrisoner.cases?.map((item) => {
        return {
          ...item,
          'prisonName': data[0].prison,
          'prisonerId': selectedPrisoner.id,
        };
      });
      // mapCases[0]['prisonName'] =
      setLoadedCases(mapCases || []);
    }


  }, [])

  const openModal = () => { 
    setSelectedHearing(latestHearing);
    setShowModal(true);
  };

  const generateGridCols = () => {
    const gridCols = {
      "Prison name (جیل کا نام)": "",
      "Fir No (ایف آئی آر نمبر)": "",
      "Fir Date (ایف آئی آر تاریخ)": "",
      "Fir Year (ایف آئی آر سال) ": "",
      "case info (کیس کی معلومات)": "",
      "Police Station (تھانہ)": "",
      "Under Sections (دفعات) ": "",
    };

    if (!isUTP) {
      gridCols["Decision Authority"] = "";
      gridCols["Sentence Date (سزا کی تاریخ)"] = "";
    }

    if (isUTP) {
      gridCols["Next Hearing Date (اگلی پیشی کی تاریخ)"] = "";
    }

    gridCols["Action (عملدرامد)"] = "";
    return gridCols;
  };

  const gridHeaingsDataMap = (e) => {
    const nextHearing = validateDate(e.nextHearingDate) ? formatDate(e.nextHearingDate) : todayDate;
    const mapObj = {
      court: e.court,
      remandingCourt: e.remandingCourt,
      judge: e.judge,
      lastHearingDate: validateDate(e.lastHearingDate),
      nextHearingDate: validateDate(e.nextHearingDate),
      hearingDocuments: _(

        <div className="profile-td profile-td-hover form-check-label" onClick={() => { handleDoc(e) }}>
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${e.hearingDocuments ? baseImageUrl + e.hearingDocuments : ProfilePic
              }`}
            width="50"
          />
        </div>
      ),

      cancelledReason: e.cancelledReason,
      Action: _(
        (nextHearing > todayDate && !e.cancelled && !props?.returnList) && (
          <div className='action-btns'>
            <button
              type='button'
              onClick={() => {
                handleModal(e);
              }}
              className='tooltip btn btn-danger waves-effect waves-light mx-1'
            >
              <i className='icon-delete'></i>
              <span>Cancel Hearing</span>
            </button>
          </div>
        )
      ),
    };
    return mapObj;
  };

  const handleDoc = (e) => {
    if (e.hearingDocuments) {
      setShowDocImage(true)
      setViewDoc(e.hearingDocuments ? baseImageUrl + e.hearingDocuments : ProfilePic)
    }
  }

  // load hearings
  const loadHearingsData = async (hearings, flag) => {
    if (hearings && hearings.length > 0) {
      setLoadedHearings(hearings);
    } else {
      setLoadedHearings([]);
    }
    console.log('CHCEKINGGG SHOWGRID', showGrid)
    if (!showGrid && flag) {
      setShowGrid(true);
    }
  };

  const handleClick = async (e, flag = false, onlyRefetch) => {
    let case_Id = ''
    if(onlyRefetch){
      case_Id = e
    }else if (props.AddHearing) {
      case_Id = e.id
      loadHearingsData(e?.hearings, flag);
      setLatestHearing(e)
    } else {
      case_Id =  props.returnList ? e?.caseId : e?.cases?.[0].caseId;
      loadHearingsData(e, flag);
      setLatestHearing(e)
    }
    try {
      const res = await getData(
        `/services/app/PrisonerDetailInformation/GetAllPrisonerHearingsByCase?CaseId=${case_Id}`,
        "",
        true, false
      );
      if (res.success) {
        setBelowHearingGrid(res?.result)
      } else {

      }
    } catch (error) {

    }
    setCaseId(case_Id);
    if (e.status == "Under trail case" || e.appealInProgress || e.status == "Witness In case") {
      setCheckCaseReleaseStatus(true);
    } else {
      setCheckCaseReleaseStatus(false);
    }
    console.log("Hearings", e);
  };


  const handleModal = (e) => {
    setShowCancelModal(!showCancelModal)
    setCancelHearingId(e.id)
  }

  const fetchApiData = async () => {
    try {
      const data = {};
      let courtObj = transformData(newLookups?.court);
      data["courts"] = courtObj;

      data["remandingCourts"] = courtObj;
      const policeStationsObj = transformData(newLookups?.policeStation);

      data["policeStations"] = policeStationsObj;
      let judgeObj = transformData(newLookups?.judge);

      data["judges"] = judgeObj;
      let sectionObj = transformData(newLookups?.sections);
      data["sections"] = sectionObj;
      setData(data);
    } catch (err) {
      alert("An error occured");
    }
  };

  const handleViewBtn = async (item) => {
    try {
      const id = props.returnList ? item?.caseId : item?.id
      const res = await getData(
        "/services/app/PrisonerDetailInformation/GetOnePrisonerCase?id=" +
        id
      );

      if (res.success && res.result?.isSuccessful) {
        const fetchedCase = {
          ...res.result.data,
          hearings: { ...res.result.data.hearings[0] },
          Allhearings: [...res.result.data.hearings],
        };
        console.log("Case", fetchedCase);
        setCaseModalIsVisible(true);

        const infoPayload = {
          ...fetchedCase,
          policeStationId: fetchedData["policeStations"]?.find(
            (p) => p.value === fetchedCase.policeStationId
          )?.label,
          hearings: {
            ...fetchedCase.hearings,
            courtId: fetchedData["courts"]?.find(
              (court) => court.value === fetchedCase.hearings?.courtId
            )?.label,
            remandingCourtId: fetchedData["remandingCourts"]?.find(
              (court) => court.value === fetchedCase.hearings?.courtId
            )?.label,
            judgeId: fetchedData["judges"]?.find(
              (court) => court.value === fetchedCase.hearings?.judgeId
            )?.label,
          },
          decisionAuthorityId: fetchedData["courts"]?.find(
            (court) => court.value === fetchedCase.decisionAuthorityId
          )?.label,
          sections: fetchedCase.sections?.map((sec) => {
            const label = fetchedData["sections"]?.find(
              (s) => s.value === sec.actId
            )?.label;
            return label;
          }),
        };
        console.log("CASE INFO", infoPayload);
        setCaseInfo({ ...infoPayload });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadData = async () => {
    const prisoner = JSON.parse(sessionStorage.getItem("prisonerHearingEntry"));
    try {
      
      
      const res = await getData(
        `/services/app/PrisonerRelease/GetPrisonerCases?PrisonerId=${prisoner.id}`,
        "",
        true
      );
      if (res.success && res.result?.isSuccessful) {
        const data = res.result.data;
        console.log("DATA", data);
        const { prisonerData } = data;
        setPrisoner(data.prisonerData);
        const { cases } = data;
        const mapCases = cases.map((item) => {
          return {
            ...item,
            prisonName: prisonerData.prisonName,
            prisonerId: prisoner.id,

          };
        });
        setLoadedCases(mapCases || []);
      } else {
        swal(
          res.error?.message || "An error occured",
          res.error?.details || "",
          "warning"
        );
      }
    } catch (error) {
      swal("Something went wrong!", "", "warning");
    }
    finally {
      
    }
  };

  const handleClose = () => {
    setCaseModalIsVisible(false);
    setShowCancelModal(false);
  };

  const FetchHearingInRealTime = async () => {
    try {
      const res = await getData(
        `/services/app/PrisonerDetailInformation/GetAllPrisonerHearingsByCase?CaseId=${caseId}`,
        "",
        true
      );
      if (res.success) {
        setRefetchingHearing(res?.result)
      } else {

      }
    } catch (error) {

    }
  }

  const loadRealtimeCases = async () => {
		const prisoner = JSON.parse(sessionStorage.getItem("prisonerHearingEntry"));
		try {
		  
		  const res = await getData(
			`/services/app/CourtProduction/GetAllPrisonerCasesWithHearing?prisonerId=${prisoner.id}`,
			"",
			true
		  );
		  if (res.success && res.result?.isSuccessful) {
			const data = res.result.data;
			const mapCases = data.map((item) => {
			  return {
				...item,
				prisonName: prisoner.prisonName,
				prisonerId: prisoner.id,
	
			  };
			});
			setLoadedCases(mapCases || []);
		  } else {
			swal(
			  res.error?.message || "An error occured",
			  res.error?.details || "",
			  "warning"
			);
		  }
		} catch (error) {
      
		  swal("Something went wrong!", "", "warning");
		}
		finally {
		  
		}
	  };

  return (
    <>
      <CancelModal
        showCancelModal={showCancelModal}
        cancelHearingId={cancelHearingId}
        onClose={handleClose}
        loadHearingsData={loadHearingsData}
        FetchHearingInRealTime={FetchHearingInRealTime}
        loadRealtimeHearings={handleClick}
        prisonerCaseId={caseId}
      />
      <CaseModal
        utp={isUTP}
        visible={caseModalIsvisible}
        onClose={handleClose}
        caseDetails={caseInfo}
      />

      <HearingModal
        visible={showModal}
        onClose={setShowModal.bind(this, false)}
        hideModal={props?.hideModal}
        loadGridData_1={props?.loadGridData_1}
        lookups={fetchedData}
        refetch={refetchHearing.length ? refetchHearing : loadHearingsData.bind(this, caseId)}
        prisonerCaseId={caseId}
        oldHearingId={selectedHearing?.hearingId || 0}
        defaultValues={selectedHearing}
        prisonerId={prisoner}
        loadRealtimeHearings={handleClick}
      />

      <PrisonerInfoCard prisoner={prisoner} />
      <DetailsGrid
        utp={isUTP}
        columnData={generateGridCols()}
        data={loadedCases}
        handleDetailsBtn={handleViewBtn}
        prisoner={prisoner}
        onClick={handleClick}
        status="Hearing"
        btnTitle="Hearing List"
        casesOnly={true}
        courtProduction={props.courtProduction}
        returnList={props.returnList}
        loadRealtimeCases={loadRealtimeCases}
      />

      {showGrid && (
        <>
          <div className="row">
            <div className="card custom-card animation-fade-grids custom-card-scroll mt-2">
              <div className="btns just-right">
                {checkCaseReleaseStatus && (  
                  <button
                    id={"add-hearing-btn"}
                    className="btn btn-success waves-effect waves-light mx-1 px-3 py-2 float-end"
                    onClick={openModal}
                  >
                    Add
                  </button>
                )}
              </div>
              <Grid
                data={transformDataForTableGrid(
                  belowHearingGrid?.map((entry) => gridHeaingsDataMap(entry))
                )}
                columns={Object.keys(HearingEntries)}
                search={true}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          </div>
        </>
      )}
     <ShowDocImage showDocImage={showDocImage} viewDoc={viewDoc} setShowDocImage={setShowDocImage} />
    </>
  );
};

export default ManageHearing;
