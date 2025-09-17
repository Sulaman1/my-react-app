/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Grid, _ } from "gridjs-react";
import swal from "sweetalert";
import {
  transformData,
  transformDataForTableGrid,
  validateDate
} from "../../../../common/Helpers";
import { getData, postData } from "../../../../services/request";
import { setLoaderOff, setLoaderOn } from "../../../../store/loader";
import { useDispatch, useSelector } from "react-redux";
import PrisonerInfoCard from "../../../prisoners/Components/release-prisoner/PrisonerInfoCard";
import OffenceModal from "./OffenceModal";


const ViewOffences = (props) => {

  const dispatch = useDispatch()
  const gridRef = useRef();
  const userMeta = useSelector((state) => state.user);

  const [prisoner, setPrisoner] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loadedOffences, setLoadedOffences] = useState([]);
  const [lookups, setLookups] = useState({});
  const prisonerObj = JSON.parse(
    sessionStorage.getItem("prisonerHearingEntry")
  );
  const newLookups = useSelector((state) => state?.dropdownLookups)
  const isDig = userMeta?.role === "DIG Prisons";
	const isIG = userMeta?.role === "Inspector General Prisons";
	const isSp = userMeta?.role === "Prison Superintendent";
  useEffect(() => {
    if (sessionStorage.getItem("prisonerHearingEntry") && !props.data) {
      loadData();
    }
    if (sessionStorage.getItem("prisonerHearingEntry")) {
      const parsed = sessionStorage.getItem("prisonerHearingEntry")
      setPrisoner(JSON.parse(parsed))
    }
  }, []);

  useEffect(() => {
    fetchApiData();
  }, []);





  const generateGridCols = () => {
    const gridCols = {
      "Offense Name (جرم کا نام)": "",
      "Offense Type (جرم کی قسم)": "",
      "Offense Date (جرم کی تاریخ)": "",
      "Remarks (تبصرے)": ""
    };
    return gridCols;
  };



  const fetchApiData = async () => {
    try {
      const data = {};
      let inPrisonOffencesObj = transformData(newLookups?.inPrisonOffences);
      data["Offences"] = inPrisonOffencesObj;
      let rawOffences = newLookups?.inPrisonOffences;
      data['RawOffences'] = rawOffences;
      let offenceTypesObj = transformData(newLookups?.offenceType);
      data["OffenceTypes"] = offenceTypesObj;
      setLookups(data);
    } catch (err) {

      alert("An error occured");
    }
  };


  const loadData = async () => {
    const prisoner = JSON.parse(sessionStorage.getItem("prisonerHearingEntry"));
    try {
      
      const res = await getData(
        `/services/app/PrisonerOffenses/GetOnePrisonerOffenses?prisonerBasicInfoId=${prisoner.id}`,
        "",
        true
      );
      if (res.success && res.result?.isSuccessful) {

        const data = res.result;
        const { prisonerData, prisonerOffense } = data;
        setPrisoner(prisonerData);
        setLoadedOffences(data.prisonerOffense);
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

  const handleSubmit = async (data, setFormPayload) => {
    try {
      data['prisonerBasicInfoId'] = prisonerObj.id
      
      const res = await postData(
        "/services/app/PrisonerOffenses/CreatePrisonerOffense",
        data,
        true
      );
      if (res.success && res.result?.isSuccessful) {
        swal("Offense Added", "", "success");
        setFormPayload({})
        setShowModal(false);
        loadData();
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
  }

  const gridDataMap = (e) => {
    const mapObj = {
      offenceName: e?.offense?.name,
      offenseType: e?.offense?.offenseType,
      offenseDate: validateDate(e?.offenseDate),
      remarks: e?.remarks
    };
    return mapObj;
  };



  return (
    <>
      <OffenceModal showModal={showModal} lookups={lookups} onClose={() => { setShowModal(false) }} handleSubmit={handleSubmit} />
      <PrisonerInfoCard prisoner={prisoner} />
      <div className="row">

      {!(isDig || isIG || isSp) && (
        <div className="btns just-right">
          <button
            id={"add-offence-btn"}
            className="btn btn-success waves-effect waves-light mx-1 px-3 py-2 float-end"
            onClick={() => { setShowModal(true) }}
          >
            Add New
          </button>
        </div>
      )}
      </div>
      <div className="row"> 
      <Grid
       ref={gridRef}
        data={transformDataForTableGrid(
          loadedOffences?.map((e) =>  gridDataMap(e))
        )}
        // data={[]}
        columns={Object.keys(generateGridCols())}
        search={true}
        pagination={{
          enabled: true,
          limit: 10,
        }}
      />
    </div>
  </>
  );
};

export default ViewOffences;
