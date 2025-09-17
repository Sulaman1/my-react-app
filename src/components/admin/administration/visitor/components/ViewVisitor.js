import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AllSearch from '../../../search/AllSearch';
import { Grid, _ } from 'gridjs-react';
import {
  transformDataForTableGrid,
  validateDate,
} from '../../../../../common/Helpers';
import { baseImageUrl, getData, postData } from '../../../../../services/request';
import swal from 'sweetalert';
import ProfilePic from '../../../../../assets/images/users/1.jpg';
import VisitorModal from './VisitorModal';
import Print from '../../../search/Print';
import DescriptionModal from "../../../../../common/DescriptionModal";

const generateGridCols = (show) => {
  const entries = {
    [`Profile pic${show ? ' (تصویر)' : ''}`]: 21,
    [`Prisoner No${show ? ' (قیدی نمبر)' : ''}`]: "",
    [`Full Name${show ? ' (نام)' : ''}`]: "",
    "Relationship Type": "",
    "Relationship Name": "",
    [`Year${show ? ' (سال)' : ''}`]: "",
    [`barrack${show ? ' (بیرک)' : ''}`]: "",
    [`CNIC${show ? ' (شناختی کارڈ)' : ''}`]: "",
    [`Fir No${show ? ' (ایف آئی آر نمبر)' : ''}`]: '',
    [`Under Sections${show ? ' (دفعات)' : ''}`]: '',
    [`Check-Out Status${show ? ' (چیک آوٹ سٹیٹس)' : ''}`]: '',
    [`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`]: "",
    [`Actions${show ? ' (عملدرامد)' : ''}`]: "",
  };
  return Object.keys(entries);
};

const ViewVisitor = ({ type, getURL }) => {
  const [entries, setEntries] = useState([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [prisonerData, setPrisonerData] = useState({});
  const gridRef = useRef(null);
  const [newUserData, setNewUserData] = useState([]);
  const show = useSelector((state) => state.language.urdu);
  const [showDescModal, setShowDescModal] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [modalTitle, setModalTitle] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [showQueue, setShowQueue] = useState(true)

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


  useEffect(() => {
    loadGridData();
  }, []);

  const loadGridData = async () => {
    const rawData = sessionStorage.getItem('user');
    const parsedId = JSON.parse(rawData).userId;
    const obj = {
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
      prisonerStatusId: 0,
      searchTypeId: 0,
    };

    try {
      const extraPath = type === 'visitor' ? '?checkedIn=false' : '';
      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}${extraPath}`,
        obj
      );
      if (result && result.success) {
        const data = result.result.data;
        if (data.length > 0) {
          setEntries(data);
          setNewUserData(data);
        } else {
          setEntries([]);
        }
      } else {
        console.error('something went wrong');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenModal = async (prisonerEntry) => {
    setShowQueue(false)
    if (prisonerEntry?.checkOutSting == "Checked out by darban")
    {
      swal(`This prisoner is checked out of the prison for ${prisonerEntry?.checkOutReason}`, `${show? "یہ قیدی جیل سے عارضی طور پر باہر ہے" : ""}`, "warning");
      return false
    }
    try {
      const res = await postData(
        '/services/app/Visitors/CheckPrisonerVisitStatus?PrisonerId=' +
        prisonerEntry.id
      );
      console.log(res);
      if (res.success && res.result.isSuccessful) {
        sessionStorage.setItem('prisonerEntry', JSON.stringify(prisonerEntry));
        setModalIsVisible(true);
        setPrisonerData(prisonerEntry);
      } else {
        swal(
          !res.error.details ? '' : res.error.message,
          res.error.details ? res.error.details : res.error.message,
          'warning'
        );
      }
    } catch (error) {
      swal('Something went wrong!', '', 'warning');
    }
  };

  const handleCloseModal = () => {
    setModalIsVisible(false);
  };

  const gridDataMap = (entry) => {
    const shortDescription =
    entry?.underSection?.length > 50
      ? `${entry.underSection.substring(0, 50)}...`
      : entry.underSection;


    const mapObj = {
      profile: _(
        <div className="profile-td profile-td-hover">
          <div className="pic-view">
            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              className="avatar-xs rounded-circle "
              src={`${entry.frontPic ? baseImageUrl + entry.frontPic : ProfilePic
                }`}
            />
          </div>
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${entry.frontPic ? baseImageUrl + entry.frontPic : ProfilePic
              }`}
            width="50"
          />
        </div>
      ),
      prisonerNumber: entry.prisonerNumber,
      fullName: entry.fullName,
      relationshipType: entry?.relationshipType,
      relationshipName: entry.relationshipName,
      year:entry.year,
      barrack: entry.barrack || 'not allocated yet',
      cnic: entry.cnic,
      firNo: entry.firNo || 'no fir added yet',
      underSection: _(
        <div className="cursor-pointer"
          onClick={() =>
          handleShowDescModal(entry.underSection, entry.underSection)
          }
        >
          {shortDescription ||  "not added yet"}
        </div>
        ),
      checkOutSting: entry.checkOutSting != "" ? entry.checkOutSting : "",
      lastModifiedBy: entry.lastModifiedByUser || "",
      Actions: _(
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
          <button
            id={'add-visitor-btn'}
            type="button"
            className="btn p-2  btn-prim align-center tooltip"
            onClick={handleOpenModal.bind(this, entry)}
          >
            <i className="icon-add"></i> <span>Add visitor</span>
          </button>
        </div>
      ),
    };

    return mapObj;
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
      maxResults: payload?.maxResults || 10
    };
    try {
      const extraPath =
        type === 'visitor' ? `?checkedIn=${payload.checkedIn}` : '';

      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}${extraPath}`,
        reqPayload
      );
      if (result && result.result.isSuccessful) {
        const data = result.result.data;
        
        setTotalCount(result?.result?.totalPrisoners || 0);
        setEntries(data);
      } else {
        swal(result.error.message, result.error.details, 'warning');
      }
    } catch (err) {
      swal('Something went wrong!', '', 'warning');
    }
  };

  const newData = newUserData.map(x => {
    return {
      'Prisoner Number': x.prisonerNumber,
      'Full Name': x.fullName,
      'Relationship Type': x?.relationshipType,
      'Relationship Name': x.relationshipName,
      'Barrack': x.barrack || 'not allocated yet',
      'CNIC': x.cnic,
      'Fir No': x.firNo,
      'Under Section': x.underSection,
      'check-Out Status': x.checkOutSting != "" ? x.checkOutSting : "",
      'Last Modified By': x.lastModifiedByUser || "",
      
    }
  })
  return (
    <>
       <DescriptionModal
        show={showDescModal}
        handleClose={() => setShowDescModal(false)}
        description={modalContent}
        title={modalTitle}
      />

      <VisitorModal
        visible={modalIsVisible}
        onClose={handleCloseModal}
        refetch={loadGridData}
        prisonerData={prisonerData}
        showQueue={showQueue}
        setShowQueue={setShowQueue}
      />
      <AllSearch type={type} handleSubmit={handleSubmit} />
      <Print data={newData} filename={'Add Visitor List'} />
      {totalCount !== 0 && (
        <label style={{"position":"absolute","zIndex": 1,"right": "25px"}}>Total Prisoners: {totalCount}</label>
      )}
      <div className="card custom-card animation-fade-grids custom-card-scroll">
        <div className="row">
          <Grid
            ref={gridRef}
            data={transformDataForTableGrid(
              entries.map((entry) => gridDataMap(entry))
            )}
            columns={generateGridCols(show)}
            search={true}
            sort={true}
            pagination={{
              enabled: true,
              limit: 20,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ViewVisitor;