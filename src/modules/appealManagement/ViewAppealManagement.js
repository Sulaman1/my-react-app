import { Grid, _ } from "gridjs-react";
import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import { getData, postData } from "../../services/request";
import PrisonerInfoCard from "../../components/prisoners/Components/release-prisoner/PrisonerInfoCard";
import { transformDataForTableGrid, validateDate } from "../../common/Helpers";
import CaseModal from "../../components/prisoners/Components/CaseModal";
import { ICONS } from "../../services/icons";
import { AppealRetrialFields, AppealRetrialInnerFields } from "../helpers/AppealRetrialFields";

const ViewRetrial = ({ setActiveTab }) => {
  const gridRef = useRef(null);
  const [prisoner, setPrisoner] = useState({});
  const [gridCases, setGridCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [infoPayload, setInfoPayload] = useState({});
  const [caseInfo, setCaseInfo] = useState({});
  const [caseModalIsVisible, setCaseModalIsVisible] = useState(false);
  const prisonerObj = JSON.parse(sessionStorage.getItem("AppealFirstTabPrisoner") || null);
  const IsUTP = prisonerObj?.prisonerCategory === "UTP";
  const [formPayload, setFormPayload] = useState({
    prisonerId: prisonerObj?.id,
    data: [],
  });

  const hideModal = () => {
    setShowModal(false);
  };

  const closeModal = () => {
    if (Object.keys(infoPayload).length > 0) {
      const caseItem = JSON.parse(sessionStorage.getItem("case"));
      const obj = {
        caseId: +caseItem.id,
        courtId: caseItem.court,
        ...infoPayload,
      };
      const pd = {
        ...formPayload,
        data: [...formPayload.data, obj],
      };
      setFormPayload(pd);
      setInfoPayload({});
    }
    setShowModal(false);
    sessionStorage.removeItem("case");
  };

  useEffect(() => {
    if (sessionStorage.getItem("AppealFirstTabPrisoner")) {
      loadData();
    }
  }, []);

  const sendData = async (event) => {
    event.preventDefault();
    if (!formPayload["prsNumber"]) {
      formPayload["prsNumber"] = 0
      formPayload["year"] = 0
    }
    postData(`/services/app/PrisonerRelease/AddAppealPrisonerCases`, formPayload)
      .then((result) => {
        if (result && result.result != null) {
          
          swal("Successfully Applied for Appeal", "", "success");
          sessionStorage.removeItem("AppealFirstTabPrisoner");
          setActiveTab(0);
        } else {
          
          console.log("HERE");
          swal(result.error.message, "", "warning");
        }
      })
      .catch((error) => {
        
        console.log(error);
      });
  };

  const openModal = (c) => {
    sessionStorage.setItem("case", JSON.stringify(c));
    setShowModal(true);
  };

  const loadData = () => {
    
    const prisonerId = JSON.parse(
      sessionStorage.getItem("AppealFirstTabPrisoner")
    ).id;
    getData(
      `/services/app/PrisonerRelease/GetPrisonerCases?PrisonerId=${prisonerId}`,
      "",
      true
    )
      .then((res) => {
        const data = res.result.data;
        console.log("CONVICTED PRISONER", data);
        if (data) {
          const isAnyUTP = data?.cases.filter(
            (e) => e.status == "Under trail case"
          );
          if (isAnyUTP.length > 0 && data?.cases.length > 1) {
          }
          setPrisoner(data.prisonerData);
          setGridCases(data.cases || []);
        }
        
      })
      .catch((error) => {
        swal("Something went wrong", "", "warning");
      });
  };

  const undoCaseHandler = (c) => {
    const updatedCases = formPayload.data.filter(
      (item) => item.caseId !== c.id
    );

    setFormPayload({
      ...formPayload,
      data: updatedCases,
    });
  };

  const handleDetailsBtn = async (item) => {
    try {
      const res = await getData(
        "/services/app/PrisonerDetailInformation/GetOnePrisonerCase?id=" +
        item.id
      );

      if (res.success && res.result?.isSuccessful) {
        const fetchedCase = {
          ...res.result.data,
          hearings: { ...res.result.data.hearings[0] },
          Allhearings: res.result.data.hearings,
        };
        console.log("Case", fetchedCase);
        setCaseModalIsVisible(true);
        setCaseInfo({ ...fetchedCase });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCaseModalClose = () => {
    setCaseModalIsVisible(false);
  };

  const gridDataMap = (e, existingCase) => {
    const mapObj = {
      firNo: e.firNo,
      firDate: validateDate(e.firDate)
        ? new Date(e.firDate).toDateString()
        : "",
      firYear: e.firYear,
      policeStation: e.policeStation,
      sections: e.underSections,
      caseStatus: e.status,
    };
    if (!IsUTP) {
      mapObj["decisionAuthority"] = e.decisionAuthority;
      mapObj["decisionDate"] = validateDate(e.decisionDate);
      mapObj["sentenceDate"] = validateDate(e.sentenceDate);
    }
    if (IsUTP) {
      mapObj["hearingDate"] = validateDate(e.hearings[0]?.lastHearingDate);
    }
    mapObj["Action"] = _(
      <div className="action-btns">
        {e.appealInProgress == true &&
          <button
            id={"view-more-btn"}
            type="button"
            className="tooltip btn btn-danger waves-effect waves-light mx-1 "
          >
            <i className="icon-glamping"></i>
            <span>Appeal In process</span>
          </button>}
        {(!e.appealInProgress && e.status === "Convicted case") && (
          <button
            id={"convict-btn"}
            onClick={() => (existingCase ? undoCaseHandler(e) : openModal(e))}
            className={`btn btn-${existingCase ? "danger" : "success"
              } waves-effect waves-light mx-1`}
          >
            {existingCase ? "Undo" : "Appeal"}
          </button>
        )}
        <button
          id={"view-more-btn"}
          type="button"
          onClick={() => handleDetailsBtn(e)}
          className="tooltip btn btn-prim waves-effect waves-light mx-1"
        >
          <i className="icon-show-password"></i>
          <span>View More</span>
        </button>
      </div>
    );

    return mapObj;
  };

  const generateGridCols = () => {
    const gridCols = {
      "Fir No (ایف آئی آر نمبر)": "",
      "Fir Date  (ایف آئی آر کی تاریخ)": "",
      "Fir Year (ایف آئی آر کا سال)": "",
      "Police Station (تھانہ)": "",
      "Under Sections (دفعات)": "",
      "Case Status (دفعات)": "",
    };

    if (!IsUTP) {
      gridCols["Decision Authority"] = "";
      gridCols["Decision Date (فیصلے کی تاریخ)"] = "";
      gridCols["Sentence Date (سزا کی تاریخ)"] = "";
    }

    if (IsUTP) {
      gridCols["Next Hearing Date (اگلی پیشی کی تاریخ)"] = "";
    }

    gridCols["Action (عملدرامد)"] = "";
    return Object.keys(gridCols);
  };


  return (
    <>
      <CaseModal
        utp={IsUTP}
        visible={caseModalIsVisible}
        onClose={handleCaseModalClose}
        caseDetails={caseInfo}
      />
      <PrisonerInfoCard prisoner={prisoner} />
      <div className="card custom-card animation-fade-grids custom-card-scroll mt-5">
        <div className="row">
          <Grid
            ref={gridRef}
            data={transformDataForTableGrid(
              gridCases.map((e) => {
                const existingCase = formPayload.data.find(
                  (item) => item.caseId === e.id
                );
                return gridDataMap(e, existingCase);
              })
            )}
            columns={generateGridCols()}
            search={true}
            sort={true}
            pagination={{
              enabled: true,
              limit: 10,
            }}
          />
        </div>
      </div>
      {formPayload?.data?.length > 0 && (
        <>
          <AppealRetrialFields gridCases={gridCases} setFormPayload={setFormPayload} formPayload={formPayload} sendData={sendData} type={"Appeal"}/>
        </>
      )}
      <AppealRetrialInnerFields infoPayload={infoPayload} setInfoPayload={setInfoPayload} closeModal={closeModal} showModal={showModal} hideModal={hideModal} prisoner={prisoner} phrase={"Court in which appeal is being raised"} title={"Appeal Information"} type={"Appeal"}  />
    </>
  );
};

export default ViewRetrial;
