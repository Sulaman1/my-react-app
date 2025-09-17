import React from "react";
import {
  getItemFromList,
  transformDataForTableGrid,
} from "../../../../../common/Helpers";
import { Grid, _ } from "gridjs-react";
import { baseImageUrl } from "../../../../../services/request";
import ProfilePic from "../../../../../assets/images/users/1.jpg";
import moment from 'moment-mini';


const GroupVisitorGrid = (props) => {
  const removeVisitorFromGrid = (index) => {
    const updatedVisitors = [...props.visitors];
    updatedVisitors.splice(index, 1);
    props.setVisitorsInGrid(updatedVisitors);
  };

  function formatAddress(person, lookUps) {
    const streetAddress = person?.permanentAddress?.streetAddress || "";
    const city = getItemFromList(lookUps?.cities, person?.permanentAddress?.cityId) || "";
    const province = getItemFromList(lookUps?.provinces, person?.permanentAddress?.provinceId) || "";
    const country = getItemFromList(lookUps?.country, person?.permanentAddress?.countryId) || "";
  
    // Filter out empty parts and join with commas
    return [streetAddress, city, province, country].filter(Boolean).join(", ");
  }

  const gridDataMap = (e, index) => {
    return {
      photo: _(
        <div className="profile-td profile-td-hover">
          <div className="pic-view">
            <img
              onError={(ev) => {
                ev.target.src = ProfilePic;
              }}
              className="avatar-xs rounded-circle "
              src={`${
                e?.person?.biometricInfo?.frontPic
                  ? baseImageUrl + e?.person?.biometricInfo?.frontPic
                  : ProfilePic
              }`}
            />
          </div>
          <img
            onError={(ev) => {
              ev.target.src = ProfilePic;
            }}
            className="avatar-xs rounded-circle "
            src={`${
              e?.person?.biometricInfo?.frontPic
                ? baseImageUrl + e?.person?.biometricInfo?.frontPic
                : ProfilePic
            }`}
            width="20"
          />
        </div>
      ),
      fullName: e?.person?.personalInfo?.fullName || "",
      relationshipTypeId: getItemFromList(props?.lookUps?.relationshipTypes, e?.person?.personalInfo?.relationshipTypeId) || "",
      relationshipName: e?.person?.personalInfo?.relationshipName || "",
      cnic: e?.person?.personalInfo?.cnic || "",
      relationship:
        getItemFromList(props?.lookUps?.relationships, e?.relationshipId) || "",
      visitDate: moment(e?.person?.visitDate)
      .format('DD-MMMM-YYYY') || "",
      Purpose: e?.person?.purpose || "",
      description: e?.person?.description || "",
      luggageDetail: e?.person?.luggageDetail || "",
      address: formatAddress(e?.person, props?.lookUps) || "",
      Action: _(
        <div className="action-btns">
          <button
            id={`cross-btn-${index}`}
            type="button"
            onClick={() => removeVisitorFromGrid(index)}
            className="btn btn-danger waves-effect waves-light mx-1"
          >
            <i className="icon-cross-sign-sign"></i>
          </button>
        </div>
      ),
    };
  };

  return (
    <>
      <div className={` "mb-5" btns just-center mt-5`}>
        <button
          id={"add-medicine-btn"}
          className="btn btn-success waves-effect waves-light mx-1 px-3 py-2 float-end"
          onClick={props?.submit}
          type="button"
        >
          Add Visitor
        </button>
      </div>
      {props?.visitors?.length > 0 && (
        <div className="card custom-card animation-fade-grids  mb-5 mt-5 custom-card-scroll">
          <Grid
            data={transformDataForTableGrid(
              props?.visitors?.map((item, index) => gridDataMap(item, index))
            )}
            columns={[
              "Photo",
              "Full Name",
              "Relationship Type",
              "Relationship Name",
              "CNIC",
              "Relationship",
              "Visit Date",
              "Purpose",
              "Description",
              "Luggage Details",
              "Address",
              "Remove",
            ]}
            search={false}
            sort={true}
            pagination={{
              enabled: true,
              limit: 10,
            }}
          />
        </div>
      )}
    </>
  );
};

export default GroupVisitorGrid;
