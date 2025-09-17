import { useRef, useEffect, useState } from 'react';

import { Grid, _ } from 'gridjs-react';
import swal from 'sweetalert';
import ProfilePic from '../../../assets/images/users/1.jpg';
import { transformDataForTableGrid } from '../../../common/Helpers';
import AllSearch from '../../../components/admin/search/AllSearch';
import { postData, baseImageUrl } from '../../../services/request';
import MedicalModal from './MedicalModal';
import Print from '../../../components/admin/search/Print';
import ShowNoOfRecords from '../../../common/ShowNoOfRecords';

const generateGridCols = (pos, prescribe = false) => {
  const entries = {
    "Profile pic (تصویر)": '',
			"Prisoner Number(قیدی نمبر)": "",
			"Full Name (نام)": "",
      "Relationship Type": "",
			"Relationship Name": "",
      "Year (سال)": "",
			"Barrack (بیرک)": "",
      "CNIC (شناختی کارڈ)": "",
			'Prison Name (جیل کا نام)': '',
      'Fir No (ایف آئی آر نمبر)': '',
			'Under Sections (دفعات)': '',
			'Check-Out Status (چیک آوٹ سٹیٹس)': '',
      'Last Modified By (آخری ترمیم کرنے والا)': '',
  };

  if (prescribe) {
    entries['Disease (بیماریاں)'] = '';
  }

  if (pos === 2) {
    entries['Actions (عملدرامد)'] = '';
  }

  return Object.keys(entries);
};

const ViewListing = ({
  getURL,
  btnTitle,
  navItem,
  setActiveTab,
  prescribe,
}) => {
  const [entries, setEntries] = useState([]);
  const gridRef = useRef(null);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [newUserData, setNewUserData] = useState([]);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);
  useEffect(() => {
    loadGridData();
  }, [pageLimit]);

  const loadGridData = async () => {
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
      prisonerStatusId: 0,
      searchTypeId: 0,
    };

    try {
      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}`,
        obj
      );
      console.log('ENTRIES >>>', result);
      if (result && result.success) {
        const data = result.result.data;
        setTotalNoOfRecords(result.result?.totalPrisoners)
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

  const handleClick = async (prisonerEntry) => {
    console.log('PRISONER', prisonerEntry);
    sessionStorage.setItem(
      'prisonerMedicalEntry',
      JSON.stringify(prisonerEntry)
    );
    if (!prescribe) {
      handleOpenModal();
    } else {
      setActiveTab(1);
    }
  };

  const handleOpenModal = () => {
    setModalIsVisible(true);
  };

  const handleCloseModal = () => {
    sessionStorage.removeItem('prisonerMedicalEntry');
    setModalIsVisible(false);
  };

  const gridDataMap = (entry) => {
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
      fullName: entry.fullName,
      relationshipType: entry.relationshipType,
      relationshipName: entry.relationshipName,
      year: entry.year,
      barrack: entry.barrack || 'not allocated yet',
      cnic: entry.cnic,
      prisonName: entry.prisonName,
      firNo: entry.firNo,
      underSection: entry.underSection || 'not added yet',
      checkOutSting: entry?.checkOutSting || entry?.checkOutReason,
      lastModifiedBy: entry?.lastModifiedByUser,
    };

    if (prescribe) {
      mapObj['disease'] = entry.hospitalCheckup?.[0]?.disease;
    }

    if (navItem === 2) {
      mapObj['Actions'] = _(
        <div className="action-btns">
          <button
            id={'prescribe-btn'}
            type="button"
            onClick={() => handleClick(entry)}
            className={`btn ${prescribe ? 'btn-success' : 'btn-prim'
              } p-2 tooltip`}
          >
            {prescribe ? (
              btnTitle
            ) : (
              <>
                <i className="icon-add "></i>
                <span>{btnTitle}</span>
              </>
            )}
          </button>
        </div>
      );
    }

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
      maxResults: payload?.maxResults || pageLimit
    };

    console.log('SEARCH PAYLOAD >>>', reqPayload);
    try {
      const result = await postData(
        `/services/app/PrisonerSearch/${getURL}`,
        reqPayload
      );
      if (result && result.result.isSuccessful) {
        const data = result.result.data;
        setTotalNoOfRecords(result.result?.totalPrisoners)
        console.log('SEARCH RESULTS', data);
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
      "Relationship Type": x?.relationshipType,
      'Relationship Name': x.relationshipName,
      'year' : x.year,
      'Barrack': x.barrack,
      'CNIC': x.cnic,
      'prison Name': x.prisonName,
      'Fir No': x.firNo,
      'Under Section': x.underSection,
      'Check Out Status': x.checkOutSting,
      'disease': x.hospitalCheckup?.[0]?.disease,
    }

  })



  return (
    <>
      <MedicalModal
        visible={modalIsVisible}
        title="Medical Information"
        onClose={handleCloseModal}
        setActiveTab={setActiveTab}
      />
      <AllSearch handleSubmit={handleSubmit} />
      <Print data={newData} filename={'Priscription List'} />

      <div className="card custom-card animation-fade-grids custom-card-scroll">
      <div className="row">
          <div className="col">
            <div className="float-end">
									<ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
						</div>
          <Grid
            ref={gridRef}
            data={transformDataForTableGrid(
              entries.map((entry) => gridDataMap(entry))
            )}
            columns={generateGridCols(navItem, !!prescribe)}
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
    </>
  );
};

export default ViewListing;
