import { Grid, _ } from 'gridjs-react';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { getItemFromList, transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import ProfilePic from "../../../../src/assets/images/users/1.jpg";
import { baseImageUrl } from '../../../services/request';
import { useSelector } from 'react-redux';
import ImageCell from '../../../common/components/ImageCell';

const generateGridCols = (isUTP, isConvict) => {
  const gridCols = {
    'Photo': '',
    'Name': '',
    'Relation': '',
    'Relationship Name': '',
    'Purpose': '',
    'Luggage Detail': '',
    'Description': '',
    'Address': '',
    'Status': '',
    'Visit Date': '',
  };
  if (!(isUTP || isConvict)) {
    gridCols["CNIC Front"] = "";
    gridCols["CNIC Back"] = "";
  } 
  return gridCols;
};

const VisitorHistory = (props) => {
    const gridRef = useRef();
    const [entries, setEntries] = useState([]);
  const userMeta = useSelector((state) => state.user);

    const isUTP = userMeta?.role === "Prison UTP Branch";
    const isConvict = userMeta?.role === "Prison Convict Branch";

    useEffect(() => {
        loadData()
    }, []);

    const loadData = () => {
      try {
        const gridData = props?.visitor?.prisonerVisitors;
    
        if (gridData?.length > 0) {
          const filteredData = gridData?.flatMap((prisonerVisitor) => {
            return prisonerVisitor?.visitorsInformation?.map((visitor) => {
              return {
                profile: _(
                  <div className="profile-td profile-td-hover">
                    <div className="pic-view">
                      <img
                        onError={(ev) => {
                          ev.target.src = ProfilePic;
                        }}
                        className="avatar-xs rounded-circle"
                        src={`${visitor?.frontPic ? baseImageUrl + visitor?.frontPic : ProfilePic}`}
                        width="50"
                      />
                    </div>
                    <img
                      onError={(ev) => {
                        ev.target.src = ProfilePic;
                      }}
                      className="avatar-xs rounded-circle"
                      src={`${visitor?.frontPic ? baseImageUrl + visitor?.frontPic : ProfilePic}`}
                      width="50"
                    />
                  </div>
                ),
                name: visitor?.fullName,
                relation: visitor?.relation || "",
                relationshipName: visitor?.relationshipName || "",
                purpose: visitor?.purpose,
                'luggage Detail': visitor?.luggageDetail,
                'Description': visitor?.description,
                address: visitor?.address,
                status: visitor?.status,
                'Visit Date': validateDate(prisonerVisitor.visitDate) || 'N/A',
                cnicfront: _(
                  <ImageCell value={visitor?.cnicFrontPic} />
                ),
                cnicback: _(
                  <ImageCell value={visitor?.cnicBackPic} />
                ),
              };
            });
          });
    
          setEntries(transformDataForTableGrid(filteredData));
        } else {
          setEntries([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    


    return (
      <>
        <div className=" custom-card">
          <h3 class="third-heading">
            <span style={{ fontWeight: "bold" }}></span>
          </h3>
          {entries?.length < 1 ? (
            <h4>
              {" "}
              <b>No Records Found</b> 
            </h4>
          ) : (
            <div className="row">
              <Grid
                ref={gridRef}
                data={entries}
                columns={Object.keys(generateGridCols(isUTP, isConvict))}
                search
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          )}
        </div>
      </>
    );
};

export default VisitorHistory;


