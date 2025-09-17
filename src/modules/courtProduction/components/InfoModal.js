import { useState, useRef } from 'react';
import { ICONS } from '../../../services/icons';
import { Modal, Table } from 'react-bootstrap';
import InputWidget from '../../../droppables/InputWidget';
import { baseImageUrl, getData } from '../../../services/request';
import ProfilePic from '../../../assets/images/users/1.jpg';
import { useEffect } from 'react';
import CasesGrid from './CasesGrid';
import GuardInfo from '../../../components/reusable/guardInfo/guardInfo';
import { Grid, _ } from "gridjs-react";
import { formatDate, getFormattedDate, transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import swal from "sweetalert";
import ReactDOMServer from 'react-dom/server';
import PrintHearingInfo from './PrintHearingInfo';
import { useSelector } from 'react-redux';

const InfoModal = ({
  visible,
  onClose,
  prisonerId,
  formPayload,
  setFormPayload,
  tab,
  onSubmit,
  defaultValues,
  cases,
  checkInOutModal,
  hearingCheckInOutModal,
  addDarbanModal,
  selectedPrisoners,
  warrantOnly,
  isShowHearingStats,
  headerTitle
}) => {
  const [extraPayload, setExtraPayload] = useState({});
  const [extraFields, setExtraFields] = useState([]);
  const [fileUploads, setFileUploads] = useState([]);
  const gridRef = useRef();
  const [showhearingStatsInfo, setShwoHearingStatsInfo] = useState(false);
  const [statsData, setStatsData] = useState({});
  const [gaurdsInfo, setGaurdsInfo] = useState([])

  useEffect(() => {
     getData(`/services/app/Darban/GetAllPoliceOfficers`)
      .then(res => {
        if (res.success) {
          if (res?.result?.policeOfficers.length) {
            const infoObj = res.result.policeOfficers
            setGaurdsInfo(infoObj)
          } else {
            setGaurdsInfo([])
          }
        }
      })
      .catch(e => {
        console.log(e, 'Error while fetching gaurdInfo and fileName is {infomodal}');
      });
  
  }, [])

  useEffect(() => {
    if (defaultValues) {
      const { item, file } = defaultValues;
      setExtraPayload({
        specialGuard: item?.specialGuard,
        hearingDocuments: item?.hearingDocuments,
      });
      if (file?.files?.length > 0) {
        setFileUploads(file.files);
      }
    }
  }, [defaultValues]);



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
      "Prison": "",
    };
    if (warrantOnly) {
      gridCols['Warrant Only'] = ""
    }
    return gridCols;
  };
  const gridMapData = (em) => {
    const e = em?.prisonerData
    const obj = {}
    obj['profile'] = _(
      <div className="profile-td profile-td-hover">
        <div className="pic-view">
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic
              }`}
            width="50"
          />
        </div>
        <img
          onError={(ev) => {
            ev.target.src = ProfilePic;
          }}
          className="avatar-xs rounded-circle "
          src={`${e.frontPic ? baseImageUrl + e.frontPic : ProfilePic
            }`}
          width="50"
        />
      </div>
    );
    obj['prisonerNumber'] = e.prisonerNumber;
    obj['year'] = e.year === 0 ? "not admitted yet" : e.year;
    obj['fullName'] = e.fullName;
    obj['relationshipType'] = e?.relationshipType;
    obj['relationshipName'] = e.relationshipName;
    obj['barrack'] = e.barrack || "not allocated yet";
    obj['cnic'] = e.cnic;
    obj['admissionDate'] = validateDate(e.admissionDate) ;
    obj['firNo'] = e.firNo;
    obj['underSection'] = e.underSection
    obj['prisonName'] = e.prisonName
    if (warrantOnly) {
      obj['warrantOnly'] = e.warrantOnly
    }
    return obj;
  }


  const toFindDuplicates = arry => {
    const unique = [];
    arry.forEach(item => {
      if (unique.length === 0) {
        return unique.push(item);
      }
      const indexEl = unique.findIndex(elem => elem.hearingId === item.hearingId);
      if (indexEl === -1) {
        unique.push(item);
      } else {
        if (Object.keys(item).length > Object.keys(unique[indexEl]).length) {
          unique[indexEl] = item;
        }
      }
      // new field added for differentiating between existing and change fields objects
      if (item.newField) {
        delete item.newField
      }
    })
    return unique
  }
  const handleConfirm = async () => {
    if (extraPayload?.specialGuard && cases.length > 0 && cases[0].selected === true) {
      // Check if at least one object has selected: false
      const hasSelectedFalse = cases.some(obj => obj.selected === false);
      if (!hasSelectedFalse) {
        swal("Special guard isn't applicable on warrant-only hearings; deselect at least one case to enable special guard.", "", "warning");
        return;
      }
    }
    const itemIndex = formPayload?.data.findIndex(
      (p) => p.prisonerId === prisonerId
    );
    const updatableItem = formPayload?.data[itemIndex];
    const fields = cases.map(item => {
      return {
        prisonerId: prisonerId,
        reason: item?.reason || "",
        specialGuard: !item.warrantOnly ? extraPayload?.specialGuard || false : false,
        hearingId: item?.hearingId || 0,
        warrantOnly: item.warrantOnly || false,
        newField: true,
        hearingDocuments: item.hearingDocuments || ""
      }
    })
    const updatedItem = { ...updatableItem, ...extraPayload };
    const updatedData = [...formPayload?.data];
    const finalisedData = [...updatedData, ...fields]

    const uniqueElements = toFindDuplicates(finalisedData);
    //updatedData[itemIndex] = updatedItem;
    const uploadedFile = {
      id: prisonerId,
      files: fileUploads,
    };

    setFormPayload((curPayload) => ({
      ...curPayload,
      data: uniqueElements,
      files: [...curPayload.files, uploadedFile],
    }));
    setExtraPayload({});
    setFileUploads([]);
    setExtraFields([])
    onClose();
  };

  let formContent = (
    <>
      <div className="col-lg-12 flex align-center gap-1 just-left flex-reverse">
        <InputWidget
          type={'switch'}
          inputType={'checkbox'}
          label={'Special Guard (خصوصی گارڈ)'}
          id={'special-guard'}
          require={true}
          defaultValue={extraPayload.specialGuard}
          setValue={(checked) => {
            console.log('specialGuard', checked);
            const payload = {
              ...extraPayload,
            };

            payload['specialGuard'] = checked;
            setExtraPayload(payload);
          }}
        />
        <i className='custom-icon' dangerouslySetInnerHTML={{ __html: ICONS.guard }}></i>
      </div>


      <CasesGrid
        cases={cases}
        setExtraPayload={setExtraPayload}
        extraPayload={extraPayload}
        prisonerId={prisonerId}
        fileUploads={fileUploads}
        setFileUploads={setFileUploads}
        setExtraFields={setExtraFields}
        extraFields={extraFields}
      />
    </>
  );

  const statsInfo = () => {
    return (
      <>
        {statsData && statsData?.checkoutDate && (
          <div className="row p-2">
          <table className="custom-table">
            <tbody>
              <tr>
                <td><b>Total Prionsers</b></td>
                <td>{statsData?.totalPrionsers}</td>
              </tr>
              <tr>
                <td><b>Total Warrants</b></td>
                <td>{statsData?.totalWarrants}</td>
              </tr>
              <tr>
                <td><b>Guard Names</b></td>
                <td>{statsData?.guardNames}</td>
              </tr>
              <tr>
                <td><b>Vehicle Number</b></td>
                <td>{statsData?.vehicleNumber}</td>
              </tr>
              <tr>
                <td><b>Other Details</b></td>
                <td>{statsData?.otherDetails}</td>
              </tr>
              <tr>
                <td><b>Date</b></td>
                <td>{statsData?.checkoutDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        )}
      </>


    )
  }
 
  const printStatsInfo = () => {
    return (
      <PrintHearingInfo statsData={statsData} />
    )
  }

  if (tab === 2 || checkInOutModal || hearingCheckInOutModal || addDarbanModal) {
    formContent = (
      <>
        <GuardInfo
          setFormPayload={setFormPayload}
          formPayload={formPayload}
        />
        {selectedPrisoners && selectedPrisoners.length > 0 && (
          <div className='row custom-card-scroll'>
            <Grid
              ref={gridRef}
              data={transformDataForTableGrid(selectedPrisoners.map((ele) =>
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
          </div>
        )
        }
      </>
    );
  }

  const handleClose = () => {
    if (defaultValues && defaultValues.file?.files.length > 0) {
      setFileUploads([]);
    }
    onClose();
  };

  const HearingStatsHandler = () => {
    const data = formPayload?.[0]
    if(data?.checkPoliceOfficers.length){
      const guardNames = data?.['checkPoliceOfficers'].map(officer => officer.name).join(', ');
      const physicalPrisoners = formPayload.filter(item => !item.warrantOnly);
      const totalPrisoner = new Set(physicalPrisoners.map(item => item.prisonerBasicInfoId)).size;
      const totalWarrants = formPayload.filter(item => item.checkOutReason !== "Outside hospital").length;
      setStatsData({
        totalPrionsers: totalPrisoner,
        totalWarrants: totalWarrants,
        guardNames: guardNames,
        vehicleNumber: data.checkVehicleNumber,
        otherDetails: data.otherDetails,
        checkoutDate: formatDate(new Date()),
        details: data,
        gaurdsInfo: gaurdsInfo,
      })
      setShwoHearingStatsInfo(!showhearingStatsInfo)
    }else{
      swal("Guard Info is Required", "warning")
    }

  }


  const printHearingInfo = (entries) => {
    const printWindow = window.open('', '', 'height=1000,width=1000');
    
    if (printWindow) {
      const htmlContent = ReactDOMServer.renderToStaticMarkup(
        <div className="print-marasla" >
          {printStatsInfo()}
        </div>
      );
      printWindow.document.write(`<html><head><title> ${headerTitle} </title>`);
      printWindow.document.write('</head><body>');
      printWindow.document.write(htmlContent);
      printWindow.document.write('</body></html>');
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      console.error("Unable to open print window.");
    }
  };
  
  return (
    <Modal show={visible} onHide={handleClose} size="xl" backdrop="static">
      <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
        <h5 class="modal-title" id="exampleModalgridLabel">
              {headerTitle}
        </h5>
      </Modal.Header>
      <Modal.Body>
        {showhearingStatsInfo ? (
          <>
            {statsInfo()}
          </>
        )
          :
          (
            <>
              <form>
                <div className="row p-2">
                  <div className="row">{formContent}</div>
                </div>
              </form>
            </>
          )
        }

      </Modal.Body>
      <Modal.Footer>
        <button
          id={'cancel-btn'}
          className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1 border-2 shadow-lg"
          onClick={showhearingStatsInfo ? HearingStatsHandler : handleClose}
        >
          Cancel
        </button>
        {showhearingStatsInfo ? (<>
          <button type="button" className="btn btn-info  shadow-lg" style={{width: "fit-content"}} 
          onClick={()=>{printHearingInfo(statsData)}}
          >
            <i className="icon-file label-icon align-middle fs-16 me-2"></i> print
          </button>
          <button
            id={'save-btn'}
            className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1  shadow-lg"
            onClick={onSubmit}
          >
            Save
          </button>
        </>) : (<>
          <button
            id={'save-btn'}
            className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
            onClick={tab === 1 ? handleConfirm : isShowHearingStats ? HearingStatsHandler : onSubmit}
          >
            {isShowHearingStats ? "Next" : "Save"}
          </button>
        </>)}
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
