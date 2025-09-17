import { useEffect, useRef } from 'react';
import { useState } from 'react';
import {  useSelector } from 'react-redux';
import DetailsGrid from '../Components/DetailsGrid';
import { Grid } from 'gridjs-react';
import {  transformData, transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import { getData } from '../../../services/request';
import CaseModal from '../Components/CaseModal';


const PrisonerCases = ({ cases, isPrint, lookups, modalPrint }) => {
  const isUTP = cases?.prisonerNumber?.category === "UTP";
  const gridRef = useRef();
  const [entries, setEntries] = useState([]);
  const [casesData, setCasesData] = useState([]);
  const [appealData, setAppealData] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [caseInfo, setCaseInfo] = useState({});
  const [sections, setSections] = useState([]);
  const [courts, setCourts] = useState([]);
  const [remandingCourts, setRemandingCourts] = useState([]);
  const [loadedRemissionEntries, setLoadedRemissionEntries] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const [judges, setJudges] = useState([
    {
      label: "Suprement Court Judge",
      value: 3,
    },
    {
      label: "High Court Judge",
      value: 5,
    },
  ]);
  useEffect(() => {
    loadLookups();
    loadData();
    loadCasesData();
  }, []);

  const newGridCols = [
    {
      "Court (عدالت)": "",
      "Remanding Court (ریمانڈ عدالت)": "",
      "Judge (جج)": "",
      "Last Hearing Date": "",
      "Next Hearing Date": "",
    },
  ];

  const generateGridCols = () => {
    const gridCols = {
      "Fir No": "",
      "Fir Date": "",
      "Fir Year": "",
      "Case Status": "",
      "Police Station": "",
      "Under Sections": "",
      "Release Document ": "",
    };

    if (!isUTP) {
      gridCols["Decision Authority"] = "";
      gridCols["Sentence Date"] = "";
    }

    if (isUTP) {
      gridCols["Hearing Date"] = "";
    }
    if (!isPrint) {
      gridCols["Hearings"] = "";
    }

    return gridCols;
  };
  const handleClose = () => {
    setShowModal(false);
  };

  const loadLookups = () =>{
    const courtObj = transformData(newLookups?.court);
    setCourts(courtObj);
    setRemandingCourts(courtObj);

    const policestationObj = transformData(newLookups?.policeStation);
    setPoliceStations(policestationObj);

    const judgeObj = transformData(newLookups?.judge);
    setJudges(judgeObj);

     const sectionObj = transformData(newLookups?.sections);
    setSections(sectionObj);
  }

  const handleViewBtn = async (item) => {
    setAppealData(item)
    let prisonerId = window.location.pathname.split("/")[4];
    try {
      
      const res = await getData(
        "/services/app/PrisonerDetailInformation/GetOnePrisonerCase?id=" +
          item.id
      );
      if (res.success && res.result?.isSuccessful) {
        const fetchedCase = {
          ...res.result.data,
          hearings: { ...res.result.data.hearings[0] },
          Allhearings: [...res.result.data.hearings],
        };
        console.log("Case", fetchedCase);
        setShowModal(true);

        const infoPayload = {
          ...fetchedCase,
          policeStationId: policeStations.find(
            (p) => p.value === fetchedCase.policeStationId
          )?.label,
          hearings: {
            ...fetchedCase.hearings,
            courtId: courts.find(
              (court) => court.value === fetchedCase.hearings?.courtId
            )?.label || null,
            remandingCourtId: remandingCourts.find(
              (court) => court.value === fetchedCase.hearings?.courtId
            )?.label || null,
            judgeId: fetchedCase.hearings?.judge
          },
          decisionAuthorityId: courts.find(
            (court) => court.value === fetchedCase.decisionAuthorityId
          )?.label || null,
          sections: fetchedCase.sections?.map((sec) => {
            const label = sections.find((s) => s.value === sec.actId)?.label;
            return label || null;
          }),
        };
        console.log("CASE INFO", infoPayload);
        setCaseInfo({ ...infoPayload });
      }
    } catch (err) {
      console.log(err);
    }

    try {
      getData(
        `/services/app/PrisonerRemission/GetRemissionsByPrisoner?prisonerId=${prisonerId}`,
        "",
        true
      )
        .then((res) => {
          const data = res.result?.data;
          console.log("DATA", data);
          if (data && data?.length > 0) {
            const filteredData = data.map((e) => {
              return {
                name: e.name,
                remissionDate: validateDate(e.remissionDate),
                days: e.remissionDaysEarned,
              };
            });
            setLoadedRemissionEntries(transformDataForTableGrid(filteredData));
          } else {
            setLoadedRemissionEntries([]);
          }
        })
        .catch((err) => {
          swal("Something went wrong!", "", "warning");
        })
        .finally(() => {
            
        });
    } catch (err) {
      console.log(err);
    }
  };

  const length = cases?.prisonerCase?.length;
  const loadData = () => {
    try {
      const gridData = cases?.prisonerCase[length - 1]?.hearings;
      if (gridData?.length > 0) {
        const filterdData = gridData.map((e) => ({
          court: e?.court,
          remandingCourt: e?.remandingCourt,
          judge: e.judge,
          "Last Hearing Date": validateDate(e.lastHearingDate),
          "Next Hearing Date": validateDate(e.nextHearingDate),
        }));
        setEntries(transformDataForTableGrid(filterdData));
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadCasesData = () => {
    try {
      const gridData = cases?.prisonerCase;
      if (gridData?.length > 0) {
        const filterdData = gridData.map((e) => ({
          firNo: e?.firNo,
          "Fir Date": validateDate(e.firDate),
          firYear: e?.firYear,
          caseStatus: e?.status,
          policestation: e?.policeStation,
          underSection: e?.underSections,
          decisionAuthority: e?.decisionAuthority,
          "decisionDate": validateDate(e.decisionDate),
          "sentenceDate": validateDate(e.sentenceDate),
        }));
        setCasesData(transformDataForTableGrid(filterdData));
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="table-main">
        <div className="card-body">
          {!(isPrint || modalPrint) && (
            <h4 className="third-heading heading">Prisoner Cases</h4>
          )}
          <div className="">
            <div className="">
              {!(isPrint || modalPrint) && (
                <h4 className="third-heading heading">Cases details</h4>
              )}

              <div className='d-flex justify-content-between '>
									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Total Cases </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">
                            {cases?.prisonerCase?.length || 'N/A'}
                            </p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Prisoner Type  </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value"> {cases?.advancedInfo?.prisonerType || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										

									</ul>
									<ul class="list col-xl-6 list-group list-group-flush personal-b-heading  mb-0">
									
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Prisoner Sub-Type </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{cases?.advancedInfo?.prisonerSubType || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										<li class="list-group-item">
											<div class="d-flex align-items-center pagi-list">
												<div class="flex-grow-1 overflow-hidden">
													<h5 class="fs-13 mb-1 dynamic-key">Checkin-Outs </h5>
												</div>
												<div class="flex-shrink-0 ms-2">
													<div>
														<p class="dynamic-value">{cases?.checkInOuts?.length || 'N/A'}</p>
													</div>
												</div>
											</div>
										</li>
										
									</ul>
									</div>
                  
            </div>
          </div>

          <CaseModal
            utp={isUTP}
            visible={showModal}
            onClose={handleClose}
            caseDetails={caseInfo}
            data={appealData}
            remission={loadedRemissionEntries}
          />
          {!isPrint &&(
          <DetailsGrid
            utp={isUTP}
            columnData={generateGridCols()}
            data={cases?.prisonerCase}
            status={"Profile"}
            handleDetailsBtn={handleViewBtn}
          />
          )}
          
          {isPrint && (
            <>
              {!isPrint && (
              <h3 className="third-heading mt-5">
                Cases Details:
                <span style={{ fontWeight: "bold" }}></span>
              </h3>
              )} 
              <div className="row">
                <Grid
                  ref={gridRef}
                  data={casesData}
                  columns={Object.keys(generateGridCols())}
                  search
                  sort
                  pagination={{
                    enabled: true,
                    limit: 10,
                  }}
                />
              </div>
              {isPrint ? (
								<h4 className='section-heading-main'>Prisoner Hearing Details</h4>
              ) : (
                <h3 className="third-heading mt-5">
                Hearing Details:
                <span style={{ fontWeight: "bold" }}></span>
              </h3>
              )}
              <div className="row">
                <Grid
                  ref={gridRef}
                  data={entries}
                  columns={Object.keys(newGridCols[0])}
                  search
                  sort
                  pagination={{
                    enabled: true,
                    limit: 10,
                  }}
                />
              </div>
            </>
          )} 
        </div>
      </div>
    </>
  );
};
export default PrisonerCases;