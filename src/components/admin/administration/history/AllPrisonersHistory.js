import React, { useEffect, useState } from "react";
import { Grid, _ } from "gridjs-react";
import {
  transformDataForTableGrid,
  validateDate,
} from "../../../../common/Helpers";
import { baseImageUrl } from "../../../../services/request";
import ProfilePic from "../../../../assets/images/users/1.jpg";
import Print from "../../search/Print";
import HistoryDetailModal from "./HistoryDetailModal";
const AllPrisonersHistory = ({ searchData, searchType}) => {
  const [selectedPrisonerId, setSelectedPrisonerId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const getGridCols = () => {
    const cols = {
      "Profile Pic (تصویر)": "",
      "Prisoner Number(قیدی نمبر)": "",
      "Year (سال)": "",
      "Full Name (نام)": "",
      "Relationship Type":"",
      "Relationship Name": "",
      "Barrack (بیرک)": "",
      "Admission Date (داخلہ تاریخ)": "",
      "CNIC (شناختی کارڈ)": "",
      "Fir No (ایف آئی آر نمبر)": "",
      "Under Sections (دفعات)": "",
	  "Prison Name (جیل)": "",
	  "Actions (عملدرامد)": ""
    };
    return Object.keys(cols);
  };


  const gridDataMap = (e) => {
    const mapObj = {
      profile: _(
        <div className="profile-td profile-td-hover">
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
      ),
      prisonerNumber: e.prisonerNumber,
      year: e.year,
      fullName: e.fullName,
      relationshipType: e?.relationshipType,
      relationshipName: e.relationshipName,
      barrack: e.barrack || "not allocated yet",
      admissionDate: validateDate(e.admissionDate),
      cnic: e.cnic,
      firNo: e.firNo,
      underSection: e.underSection || "not added yet",
	  prisonName: e.prisonName,
	  Actions: _(
	  	<button 
	  		id="view-more-btn" 
	  		class="tooltip btn btn-prim waves-effect waves-light mx-1" 
	  		type="button"
        onClick={()=> { handleModal(e.id)}}
        >
			<i class="icon-show-password"></i>
			<span>View History</span>
		</button>
	  )
    };
    return mapObj;
  };

  useEffect(()=>{
  },[searchData])

  const handleModal = (id) => {
    setSelectedPrisonerId(id)
    setOpenModal(!openModal)
  }

const onClose = () => {
  setOpenModal(false)
}


  return (
    <>
    <HistoryDetailModal
      showModal={openModal}
      prisonerId= {selectedPrisonerId}
      onClose={onClose}
      userType = "prisoner"
    />
  
      <div className="row gridjs">
        <div className="card custom-card animation-fade-grids custom-card-scroll">
          <div className="row ">
            <div className="col">
              <Grid
                data={transformDataForTableGrid(
                  searchData?.data?.map((e) => gridDataMap(e)) || []
                )}
                columns={getGridCols()}
                search={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPrisonersHistory;
