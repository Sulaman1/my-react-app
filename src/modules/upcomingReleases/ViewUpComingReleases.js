import React, { useEffect, useRef, useState } from "react";
import { baseImageUrl, postData } from "../../services/request";
import { transformDataForTableGrid, validateDate } from "../../common/Helpers";
import ProfilePic from "../../assets/images/users/1.jpg";
import { Grid, _ } from "gridjs-react";
import { useSelector } from "react-redux";
import AllSearch from "../../components/admin/search/AllSearch";
import ShowNoOfRecords from "../../common/ShowNoOfRecords";

const ViewUpComingReleases = () => {
  const [entries, setEntries] = useState([]);
  const userMeta = useSelector((state) => state.user);
  const isAdmin = userMeta?.role === "Super Admin";
  const gridRef = useRef();
  const [pageLimit, setPageLimit] = useState(10);
  const [totalNoOfRecords, setTotalNoOfRecords] = useState(0);

  useEffect(() => {
    loadData();
  }, [pageLimit]);

  const generateGridCols = () => {
    const gridCols = {
      "profile pic": "",
      "Prisoner Number": "",
      Year: "",
      "Full Name": "",
      "Father Name": "Abdullah",
      Barrack: "",
      CNIC: "17301-5838517-9",
      "Admission Date": "2022-04-14T00:00:00+05:00",
      "Fir No": "",
      "Under Section": "",
      "Release Date": "",
    };
    if (isAdmin) {
      gridCols["Prison Name"] = "";
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
      "/services/app/PrisonerSearch/SearchPrisonerUpcomingRelease",
       requestData
    )
      .then((result) => {
        console.log("ENTRIES", result);
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
      obj["admissionDate"] = validateDate(e.admissionDate) || "";
      obj["firNo"] = e.firNo;
      obj["underSection"] = e.underSection;
      obj["releaseDate"] = validateDate(e.getReleaseDate) || '' ;
      obj["prisonName"] = e.prisonName;

      if (isAdmin) {
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
      <h3 class="third-heading">
        <span style={{ fontWeight: "bold" }}>UpComing Releases</span>
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
              limit: 10,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ViewUpComingReleases;
