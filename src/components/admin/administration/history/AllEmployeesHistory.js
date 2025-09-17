import React, { useEffect, useState } from "react";
import { Grid, _ } from "gridjs-react";
import {
  transformDataForTableGrid,
} from "../../../../common/Helpers";
import {
  baseImageUrl,
  getData
} from "../../../../services/request";
import { useDispatch } from "react-redux";
import { setLoaderOn, setLoaderOff } from "../../../../store/loader";
import HistoryDetailModal from "./HistoryDetailModal";

const mockUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy2swEhaovbs0u5Aic_i1XaO20WfwutWsqbGVKpuNXYZVJEoWGgbj0zoMNoVzFmnsEoRo&usqp=CAU";
const AllEmployeesHistory = (props) => {
  const [userData, setUserData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const rawData = sessionStorage.getItem("user");
  const parsedId = JSON.parse(rawData).userId;
  

  const getGridCols = () => {
    const cols = {
      "Profile Pic (تصویر)": "",
      "Employee Number (سٹاف نمبر)": "atariq",
      "Full Name (نام)": "Abdullah",
      "Username (صارف کا نام)": "Abdullah Tariq",
      "Role (کردار)": "Abdullah Tariq",
      "Designation (عہدہ)": true,
      "Department (شعبہ)": "Tariq",
      "BPS (بی پی ایس)": "Abdullah Tariq",
      "Actions (عملدرامد)": "",
    };
    return Object.keys(cols);
  };

  const gridDataMap = (e) => {
    const mapObj = {
        imgURL: _(
            <div className="profile-td profile-td-hover">
              <div className="pic-view">
                <img
                  onError={(ev) => {
                    ev.target.src = mockUrl;
                  }}
                  className="avatar-xs rounded-circle "
                  src={`${
                    e.imgUrl ? baseImageUrl + e.imgUrl : mockUrl
                  }`}
                />
              </div>
              <img
                onError={(ev) => {
                  ev.target.src = mockUrl;
                }}
                className="avatar-xs rounded-circle "
                src={`${e.imgUrl ? baseImageUrl + e.imgUrl : mockUrl}`}
                width="50"
              />
            </div>
          ),
          employeeNumber: e.employeeNumber,
          fullName: e.fullName,
          userName: e.userName,
          role: e.role,
          designation: e.designation,
          department: e.department,
          bps: e.bps,
          Action: _(
            <button 
	  		id="view-more-btn" 
	  		class="tooltip btn btn-prim waves-effect waves-light mx-1" 
	  		type="button"
        onClick={()=> { handleModal(e.userId)}}
        >
			<i class="icon-show-password"></i>
			<span>View History</span>
		</button>
          ),
    };
    return mapObj;
  };

  
  const handleModal = (id) => {
    setSelectedUserId(id)
    setOpenModal(!openModal)
  }

const onClose = () => {
    setOpenModal(false)
  }
  const loadData = () => {
      const employeeApi = "/services/app/EmployeeAppServices/GetAllEmployee?IsUser=true";
      getData(
        `${employeeApi}`,
        "",
        true,
        
      )
        .then((result) => {
          if (result && result.success) {
            const data = result.result.data;
            if (data.length > 0) {
              setUserData(data);
            } else {
              setUserData([]);
            }
          } else {
            console.error("something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
    <div className="row gridjs">
    <HistoryDetailModal
      showModal={openModal}
      userId= {selectedUserId}
      onClose={onClose}
      userType = "employee"
    />
        <div className="col-xl-12 p-0">
          <div className="card custom-card animation-fade-grids custom-card-scroll">
            <div className="row ">
              <div className="col">
                 <Grid
                    data={transformDataForTableGrid(
                        userData?.map((e) => {
                        return gridDataMap(e);
                    })
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
      </div>
    </>
  );
};

export default AllEmployeesHistory;
