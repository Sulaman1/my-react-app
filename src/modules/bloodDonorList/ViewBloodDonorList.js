import React, { useEffect, useRef, useState } from "react";
import { baseImageUrl, getData, postData } from "../../services/request";
import { transformDataForTableGrid, validateDate } from "../../common/Helpers";
import ProfilePic from "../../assets/images/users/1.jpg";
import { Grid, _ } from "gridjs-react";
import {  useSelector } from "react-redux";
import AllSearch from "../../components/admin/search/AllSearch";
import swal from 'sweetalert';
import DescriptionModal from "../../common/DescriptionModal";
import ShowNoOfRecords from "../../common/ShowNoOfRecords";

const ViewBloodDonorList = ({ isBloodDonorOnly, hideSp }) => {
  console.log("isBloodDonorOnly", isBloodDonorOnly);
  const [entries, setEntries] = useState([]);
  const userMeta = useSelector((state) => state.user);
  const isAdmin = userMeta?.role === "Super Admin";
  const gridRef = useRef();
  const show = useSelector((state) => state.language.urdu);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

  useEffect(() => {
    loadData();
  }, [pageLimit]);

  const generateGridCols = () => {
    const gridCols = {
      [`profile pic${show ? ' (تصویر)' : ''}`]: "",
      [`Prisoner Number${show ? ' (قیدی نمبر)' : ''}`]: "",
      [`Year${show ? ' (سال)' : ''}`]: "",
      [`Full Name${show ? ' (نام)' : ''}`]: "",
      [`Father Name${show ? ' (والد کا نام)' : ''}`]: "Abdullah",
      [`Barrack${show ? ' (بیرک)' : ''}`]: "",
      [`CNIC${show ? ' (شناختی کارڈ نمبر)' : ''}`]: "17301-5838517-9",
      [`Admission Date${show ? ' (داخلہ کی تاریخ)' : ''}`]: "2022-04-14T00:00:00+05:00",
      [`Fir No${show ? ' (ایف آئی آر نمبر)' : ''}`]: "",
      [`Under Section${show ? ' (دفعات)' : ''}`]: "",
      [`Last Modified By${show ? ' (آخری ترمیم کرنے والا)' : ''}`]: "",
    };
    if (isAdmin) {
      gridCols[`Prison Name${show ? ' (جیل کا نام)' : ''}`] = "";
    }
    if (!hideSp) {
      gridCols[`Action${show ? ' (عمل)' : ''}`] = "";
    }
    return gridCols;
  };

  const loadData = (payload) => {
    const rawData = sessionStorage.getItem("user");
    const parsedId = JSON.parse(rawData).userId;
    const requestData = {
      maxResults: payload?.maxResults || pageLimit,
      skipCount: 0,
      userId: parsedId,
      name: payload?.name || '',
      category: payload?.category || 0,
      year: payload?.year || 0,
      prsNumber: payload?.prsNumber || 0,
      relationshipName: payload?.relationshipName || '',
      relationshipTypeId: payload?.relationshipTypeId || '',
      cnic: payload?.cnic || '',
      genderId: payload?.genderId || 0,
      policeStationId: payload?.policeStationId || 0,
      firYear: payload?.firYear || 0,
    };
    postData(
      `/services/app/PrisonerSearch/SearchBloodDonorList${isBloodDonorOnly ? '?isBloodDonor=true' : '?isBloodDonor=false'}`,
      requestData
    )
      .then((result) => {
        try {
          if (result && result.success) {
            const data = result.result.data;
            setTotalNoOfRecords(result.result?.totalPrisoners)
            if (data && data.length > 0) {
              setEntries(data);
              const gridjsInstance = gridRef.current.getInstance();
              gridjsInstance.on("rowClick", (...args) => {
                console.log("row: ", args);
              });
            } else {
              setEntries([]);
            }
          } else {
            console.error("Something went wrong");
          }
        } catch (error) {
          console.error(
            "Error while processing API response SearchPrisonerUpcomingRelease:",
            error
          );
        }
      })
      .catch((error) => {
        
        console.log("API Error:", error);
      });
  };

  const handleAdd = async (prisonerBasicInfoId, isDonor) => {
    const action = isDonor ? 'add' : 'remov';
    const willProceed = await swal({
      title: 'Are you sure?',
      text: `Do you want to ${action} this prisoner as a blood donor?`,
      icon: 'info',
      buttons: {
        cancel: 'No',
        confirm: {
          text: 'Yes',
          value: true,
        },
      },
      dangerMode: false,
    });

    if (willProceed) {
      try {
        
        const response = await postData(`/services/app/PrisonerMedicalInfo/BloodDonor?prisonerBasicInfoId=${prisonerBasicInfoId}&isDonor=${isDonor}`);
        if (response && response.success) {
          swal('Success!', `Prisoner has been ${action}ed as a blood donor.`, 'success');
          loadData();
        } else {
          swal('Error', 'Failed to update blood donor status', 'error');
        }
      } catch (error) {
        console.error("Error updating blood donor status:", error);
        swal('Error', 'An error occurred while updating blood donor status', 'error');
      } finally {
        
      }
    }
  };

  const handleShowMore = (title, description) => {
    setModalContent({ title, description });
    setShowModal(true);
  };

  const truncateText = (text, limit = 50) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  const gridMapData = (entries) => {
    const filterdData = entries.map((e) => {
      const obj = {};
      obj["profile"] = _(
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
      );
      obj["prisonerNumber"] = e.prisonerNumber;
      obj["year"] = e.year === 0 ? "not admitted yet" : e.year;
      obj["fullName"] = e.fullName;
      obj["relationshipName"] = e.relationshipName;
      obj["barrack"] = e.barrack || "not allocated yet";
      obj["cnic"] = e.cnic;
      obj["admissionDate"] = validateDate(e.admissionDate);
      obj["firNo"] = e.firNo;
      obj["underSection"] = _(
        <div>
          {truncateText(e.underSection)}
          {e.underSection?.length > 50 && (
            <button 
              className="btn btn-link p-0 ms-2"
              onClick={() => handleShowMore('Under Section', e.underSection)}
            >
              Show More
            </button>
          )}
        </div>
      );
      obj["lastModifiedBy"] = e.lastModifiedByUser;
      obj["prisonName"] = e.prisonName;
      obj["action"] = _(
        <button
          className={`btn  ${e.isBloodDonor ? 'btn-danger' : 'btn-success'}`}
          onClick={() => handleAdd(e.id, !e.isBloodDonor)}
        >
          {e.isBloodDonor ? 'Remove Blood Donor' : 'Make Blood Donor'}
        </button>
      );

      if (!isAdmin) {
        delete obj.prisonName;
      }
      return obj;
    });
    const data = transformDataForTableGrid(filterdData);
    return data;
  };

  return (
    <>
      <AllSearch handleSubmit={loadData} />
      <h3 className="third-heading">
        <span style={{ fontWeight: "bold" }}>
          {!isBloodDonorOnly ? "Non Blood Donors" : "Blood Donors"}
        </span>
      </h3>
      <div className="row">
          <div className="col">
            <div className="float-end">
              <ShowNoOfRecords setPageLimit={setPageLimit} totalNoOfRecords={totalNoOfRecords} />
            </div>
        <Grid
          ref={gridRef}
          data={gridMapData(entries)}
          columns={Object.keys(generateGridCols())}
          search={true}
          sort={true}
          pagination={{
            enabled: true,
            limit: pageLimit,
          }}
        />
        </div>
      </div>
      <DescriptionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        description={modalContent.description}
        title={modalContent.title}
      />
    </>
  );
};

export default ViewBloodDonorList;
