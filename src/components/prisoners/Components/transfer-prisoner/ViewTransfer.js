import React, { useEffect, useRef, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import {
  transformData,
  transformDataForTableGrid,
  validateDate,
} from '../../../../common/Helpers';
import Carousel from 'react-bootstrap/Carousel';
import { baseImageUrl, getData, postData } from '../../../../services/request';
import swal from 'sweetalert';
import ProfilePic from '../../../../assets/images/users/1.jpg';
import AllSearch from '../../../admin/search/AllSearch';
import TransferModal from './TransferModal';
import Print from '../../../admin/search/Print';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import DescriptionModal from '../../../../common/DescriptionModal';
import ScrollButtons from '../../../../common/ScrollButtons';
import ShowNoOfRecords from '../../../../common/ShowNoOfRecords';




// eslint-disable-next-line require-jsdoc
function generateGridEntries(tabPos, show) {

  const gridEntries = {
    [`Profile pic${show ? ' (تصویر)' : ''}`]: '',
    [`Prisoner Number${show ? ' (قیدی نمبر)' : ''}`]: "",
    [`Full Name${show ? ' (نام)' : ''}`]: "",
    'Relationship Type': '',
    'Relationship Name': '',
    [`Year${show ? ' (سال)' : ''}`]: "",
    [`Barrack${show ? ' (بیرک)' : ''}`]: "",
    [`CNIC${show ? ' (شناختی کارڈ)' : ''}`]: "",
    [`Fir No${show ? ' (ایف آئی آر نمبر)' : ''}`]: '',
    [`Under Sections${show ? ' (دفعات)' : ''}`]: '',
    [`Check-Out Status${show ? ' (چیک آوٹ سٹیٹس)' : ''}`]: '',
    [`Has Opposition${show ? ' (مخالفت ہے؟)' : ''}`]: "",
    [`condemend${show ? ' (سزائے موت)' : ''}`]: "",
    [`Escaped${show ? ' (فرار)' : ''}`]: "",
    [`High Profile${show ? ' (اہم شخصیت)' : ''}`]: "",
    [`Multiple Case${show ? ' (متعدد مقدمات)' : ''}`]: "",
    [`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`]: "",
  };

  if (tabPos === 2) {
    gridEntries[`Prison From${show ? ' (جیل سے)' : ''}`] = '';
  }

  if (tabPos > 2 && tabPos !== 6) {
    gridEntries[`Prison To${show ? ' (میں جیل)' : ''}`] = "";
  }

  if (tabPos === 6) {
    gridEntries[`Prison From${show ? ' (جیل سے)' : ''}`] = '';
  }
  if (tabPos !== 1) {
    gridEntries[`Transfer Date${show ? ' (منتقلی کی تاریخ)' : ''}`] = '2022-04-14T00:00:00+05:00';
    gridEntries[`Authority${show ? ' (اختیار)' : ''}`] = '';
    gridEntries[`Remarks${show ? ' (تبصرے)' : ''}`] = '';
    gridEntries[`Documents${show ? ' (دستاویزات)' : ''}`] = "";
  }

  if (tabPos === 4) {
    gridEntries[`Cancel Reason${show ? ' (منسوخ کی وجہ)' : ''}`] = '';
  }

  if (tabPos > 4) {
    gridEntries[`Reject Reason${show ? ' (مسترد کی وجہ)' : ''}`] = '';
  }

  if (tabPos !== 7) {
    gridEntries[`Actions${show ? ' (عملدرامد)' : ''}`] = '';
  }

  return Object.keys(gridEntries);
}

const ViewTransferPrisoner = ({
  getURL,
  apiEndpoint,
  tabPos = 1,
  btn,
  btn2,
  reInitiate,
  apiEndPoint3,
  apiEndpoint2,
}) => {
  const gridRef = useRef();
  const [entries, setEntries] = useState([]);
  const [rejected, setRejected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prisonerObj, setPrisonerObj] = useState({});
  const [priosnerList, setPrisonerList] = useState([]);
  const [csvEntries, setCsvEntries] = useState([]);
  const [showDocImage, setShowDocImage] = useState(false)
  const [viewDoc, setViewDoc] = useState("")
  const newLookups = useSelector((state) => state?.dropdownLookups)
  const [showDescModal, setShowDescModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const show = useSelector((state) => state.language.urdu);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
  const scrollContainerRef = useRef(null);
  useEffect(() => {
    loadData();
  }, [pageLimit]);


  const handleShowModal = (description, title) => {
    const descriptionArray = description.split(',').map(item => item.trim());
    const formattedDescription = descriptionArray.map((item, index) => (
      <span key={index} style={{ padding: "0.5rem" }}>
        ({index + 1}). {item}
        <br />
      </span>
    ));
    setModalContent(formattedDescription);
    setModalTitle("Under Sections");
    setShowDescModal(true);
  };

  const loadData = async () => {
    try {
      setPrisonerList(transformData(newLookups?.prison));
      const rawData = sessionStorage.getItem('user');
      const parsedId = JSON.parse(rawData).userId;
      const obj = {
        maxResults: pageLimit,
        userId: parsedId,
        name: '',
        category: 0,
        prisonId: 0,
        year: 0,
        prsNumber: 0,
        relationshipName: '',
        relationshipTypeId: '',
        genderId: 0,
        policeStationId: 0,
        firYear: 0,
        underSection: 0,
        barrack: 0,
        checkOutSting: 0,
        prisonerStatusId: 0,
        searchTypeId: 0,
      };
      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}`,
        obj,
      );
      console.log('ENTRIES', result);
      if (result && result.success) {

        const data = result.result.data;
        setTotalNoOfRecords(result.result?.totalPrisoners)
        if (data.length > 0) {
          setEntries(data);
          setCsvEntries(data);
        } else {
          setEntries([]);
        }
      } else {

        console.error('something went wrong');
      }
    } catch (err) {
    }
  };

  const handleClick = async (e, rejected) => {
    try {
      const hasPendingCase = e?.hasUnderTrailCase;

      setPrisonerObj(e);
      const endpoint = rejected ? apiEndpoint2 : apiEndpoint;
      setRejected(rejected ? true : false);
      if (!rejected && btn.text === "Accept") {

        const willProceed = await swal({
          title: 'Are you sure?',
          text: 'You want to accept this prisoner transfer?',
          icon: 'info',
          buttons: true,
          dangerMode: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
        });
        if (willProceed) {
          swal('Prisoner has been successfully transferred in your prison and prisoner can be located in pending admissions after check in ', '', 'success', {
            icon: 'success',
          });
          const obj = {
            transferId: e.transferId,
          };

          await postData(
            `/services/app/PrisonerTransfer/${endpoint}?reInitiate=${reInitiate}`,
            obj,
          );
          loadData();

        } else {

        }
      } else {

        if (hasPendingCase && btn.text === "Transfer") {
          swal({
            title: 'Are you sure you want to initiate the transfer for this prisoner?',
            text: 'This prisoner has a pending under trial case in this district',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Proceed it!'
          }).then(async willDelete => {
            if (willDelete) {
              setShowModal(true);
            } else {

              setShowModal(false);
            }
          });
        } else {
          setShowModal(true);
        }

      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (payload) => {
    const { userId } = JSON.parse(sessionStorage.getItem('user'));
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
      maxResults: payload?.maxResults || pageLimit
    };

    console.log('PAYLOAD', reqPayload);
    try {

      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}`,
        reqPayload,
      );
      if (result && result.result.isSuccessful) {
        const data = result.result.data;
        setTotalNoOfRecords(result.result?.totalPrisoners)
        console.log('SEARCH RESULTS', data);
        setEntries(data);
        setCsvEntries(data);
      } else {
        swal(result.error.message, result.error.details, 'warning');

      }
    } catch (err) {
      swal('Something went wrong!', '', 'warning');

    }
  };

  const handleRehabiliteClick = async (e) => {
    try {

      const willDelete = await swal({
        title: 'Rehabilitate Prisoner?',
        text: '',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      });
      if (willDelete) {
        const result = await postData(
          `/services/app/PrisonerTransfer/RehabilitatePrisoner?TransferId=${e.transferId}`,
          {},
        );
        if (result && result.error) {
          swal({
            button: true,
            icon: 'error',
            text: result.error.message,
          });
        } else {
          loadData();

        }
      }
    } catch (err) {

      console.log(err);
    }

  };

  const gridDataMap = (entry, tabPosition) => {

    const shortDescription =
      entry?.underSection?.length > 50
        ? `${entry.underSection.substring(0, 50)}...`
        : entry.underSection;

    const mapObj = {
      profile: _(
        <div className='profile-td profile-td-hover'>
          <div className='pic-view'>
            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              className='avatar-xs rounded-circle '
              src={`${entry.frontPic ?
                baseImageUrl + entry.frontPic :
                ProfilePic
                }`}
            />
          </div>
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className='avatar-xs rounded-circle '
            src={`${entry.frontPic ?
              baseImageUrl + entry.frontPic :
              ProfilePic
              }`}
            width='50'
          />
        </div>,
      ),
      prisonerNumber: entry.prisonerNumber,
      fullName: entry.fullName,
      relationshipType: entry?.relationshipType,
      relationshipName: entry.relationshipName,
      year: entry.year,
      barrack: entry.barrack || 'not allocated yet',
      cnic: entry.cnic,
      firNo: entry.firNo || 'no fir added yet',
      underSection: _(
        <div className="cursor-pointer"
          onClick={() => {
            if (entry.underSection?.length > 30) {
              handleShowModal(entry.underSection, entry.underSection)
            }
          }}
        >
          {shortDescription || "not added yet"}
        </div>
      ),
      checkOutSting: entry.checkOutSting || entry?.checkOutReason,
      hasOpposition: entry.hasOpposition ? "Yes" : "No",
      condemend: _(
        <span style={{ color: entry.condemend ? "red" : "inherit" }}>
          {entry.condemend ? "Yes" : "No"}
        </span>
      ),
      isEscaped: entry.isEscaped ? "Yes" : "No",
      highProfile: entry.highProfile ? "Yes" : "No",
      hasManyCases: entry.hasManyCases ? "Yes" : "No",
      lastModifiedBy: entry.lastModifiedByUser || "",
    };

    if (tabPosition === 2 || tabPosition === 3 || tabPosition === 4 || tabPosition === 5) {

    }

    if (tabPosition !== 1) {
      mapObj['prison'] =
        tabPosition === 2 || tabPosition === 6 ? entry.prisonName : entry.prisonTo;
      mapObj['transferDate'] = validateDate(entry.transferDate);
      mapObj['authority'] = entry.authority || "";
      mapObj['remarks'] = entry.remarks || "";
      mapObj['Documents'] = _(

        <Carousel className='inner-slider'>
          <Carousel.Item className="slide-item">
            <div className="profile-td profile-td-hover" onClick={() => { setShowDocImage(true), setViewDoc(entry.courtOrder ? baseImageUrl + entry.courtOrder : ProfilePic) }}>
              <img
                onError={(ev) => {
                  ev.target.src = ProfilePic;
                }}
                className="avatar-xs rounded-circle "
                src={`${entry.courtOrder ? baseImageUrl + entry.courtOrder : ProfilePic
                  }`}
                width="50"
              />
            </div>
          </Carousel.Item>
          <Carousel.Item className="slide-item">
            <div className="profile-td profile-td-hover" onClick={() => { setShowDocImage(true), setViewDoc(entry.transferDocuments ? baseImageUrl + entry.transferDocuments : ProfilePic) }}>
              <img
                onError={(ev) => {
                  ev.target.src = ProfilePic;
                }}
                className="avatar-xs rounded-circle "
                src={`${entry.transferDocuments ? baseImageUrl + entry.transferDocuments : ProfilePic
                  }`}
                width="50"
              />
            </div>
          </Carousel.Item>

        </Carousel>
      );
    }

    if (tabPosition === 4 || tabPosition === 5 || tabPosition === 6) {
      mapObj['reason'] =
        tabPosition === 4 ?
          entry.cancelReason : (tabPosition === 5 || tabPosition === 6) ?
            entry.rejectReason : ''
    }
    if (tabPosition !== 7 && tabPosition !== 6) {
      mapObj['Action'] = _(
        <div className='action-btns'>
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
          <button
            id={btn.id}
            className={btn.className}
            onClick={() => handleClick(entry)}
            type={btn.type}
          >
            <i className={btn.icon}></i>
            <span>{btn.text}</span>
          </button>
          {tabPosition === 2 && (
            <button
              id={btn2.id}
              type={btn2.type}
              className={btn2.className}
              onClick={() => handleClick(entry, "reject")}
            >
              <i className={btn2.icon}></i>
              <span>{btn2.text}</span>
            </button>
          )}
          {(tabPosition === 4 || tabPosition === 5 || tabPosition === 7) && (
            <button
              id={btn2.id}
              type={btn2.type}
              className={btn2.className}
              onClick={() => handleRehabiliteClick(entry)}
            >
              <i className={btn2.icon}></i>
              <span>{btn2.text}</span>
            </button>
          )}
        </div>,
      );
    }
    return mapObj;
  };

  const newCsv = csvEntries.map(x => {
    const cEntries = {
      'Prisoner Number': x.prisonerNumber,
      'Full Name': x.fullName,
      'Father Name': x.relationshipName,
      year: x.year,
      Barrack: x.barrack,
      CNIC: x.cnic,
      'Fir No': x.firNo,
      'Under Section': x.underSection,
      'check-Out Status': x.checkOutSting,
      hasOpposition: x.hasOpposition ? "Yes" : "No",
      condemend: x.condemend ? "Yes" : "No",
      isEscaped: x.isEscaped ? "Yes" : "No",
      highProfile: x.highProfile ? "Yes" : "No",
      hasManyCases: x.hasManyCases ? "Yes" : "No",
      'Last Modified By': x.lastModifiedByUser || "",
    }
    if (tabPos !== 1) {
      tabPos === 2 || tabPos === 6 ?
        cEntries['Prison From'] = x.prisonName : '';


      tabPos === 3 || tabPos === 4 || tabPos === 5
        ? (cEntries["Documents"] = x.transferDocuments)
        : "";

      tabPos === 3 || tabPos === 4 || tabPos === 5
        ? (cEntries["Prison To"] = x.prisonTo)
        : "";
      cEntries["Transfer Date"] = validateDate(x.transferDate);
    }
    if (tabPos === 5 || tabPos === 6) {
      cEntries['Reject Reason'] = x.rejectReason
    }
    else if (tabPos === 4) {
      cEntries['cancel Reason'] = x.cancelReason
    }
    return cEntries;
  })

  let csvFile = tabPos == 1 ? 'Prisoners List'
    : tabPos == 2 ? 'Incoming Transfers List'
      : tabPos == 3 ? 'Outgoing Transfers List'
        : tabPos == 4 ? 'Cancelled Transfers List'
          : tabPos == 5 ? 'Rejected by them list'
            : tabPos == 6 ? 'Rejected by us list'
              : '';
  const closeDocImage = () => {
    setShowDocImage(!showDocImage)
  }

  const download = async () => {

    const nameSplit = viewDoc.split("Admin");
    const duplicateName = nameSplit.pop();
    const link = document.createElement('a');
    link.href = viewDoc;
    const newString = duplicateName.replace(/\\/g, '');
    link.download = newString;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />

      <AllSearch handleSubmit={handleSubmit} />
      <h5 className="text-danger my-3">Note: Only those prisoners will appear in the search below which are eligible for the transfers.</h5>
      <Print data={newCsv} filename={csvFile} />
      <TransferModal
        showModal={showModal}
        setShowModal={setShowModal}
        prisonerObj={prisonerObj}
        apiEndpoint={apiEndpoint}
        loadData={loadData}
        reInitiate={reInitiate}
        apiEndPoint3={apiEndPoint3}
        prisonerList={priosnerList}
        apiEndpoint2={apiEndpoint2}
        rejected={rejected}
      />
      <div className="wrapper">
        <ScrollButtons scrollContainerRef={scrollContainerRef} />
        <div className='card custom-card animation-fade-grids  custom-card-scroll' ref={scrollContainerRef}>
          <div className="row">
            <div className="col">
              <div className="float-end">
                <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
              </div>
              <Grid
                ref={gridRef}
                data={transformDataForTableGrid(
                  entries.map((e) => {
                    return gridDataMap(e, tabPos);
                  }),
                )}
                columns={generateGridEntries(tabPos, show)}
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

      {/*------------------ Show Documents in Modal ---------------*/}
      <Modal show={showDocImage} size='lg'>
        <Modal.Header style={{ padding: '1.25rem 1.25rem' }}>
        </Modal.Header>
        <Modal.Body>
          <div className="profile-td profile-td-hover">

            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              src={`${viewDoc
                }`}
              width="500"
              height="500"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1' onClick={download}>
            Download
          </button>
          {/* <a href={viewDoc} download={true} className='btn btn-prim  lg-btn submit-prim waves-effect waves-light mx-1'>Download</a> */}
          <button
            id={'cancel-btn'}
            className='btn btn-danger lg-btn submit-prim waves-effect waves-light mx-1'
            onClick={closeDocImage}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewTransferPrisoner;
