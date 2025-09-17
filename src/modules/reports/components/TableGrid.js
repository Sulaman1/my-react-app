import { useEffect } from "react";
import { baseImageUrl, getDataTest } from "../../../services/request";
const TableGrid = ({ thArr, tdArr, getTDs }) => {
useEffect(()=>{
},[])
  return (
    <>
      {/* Stats */}
      <div className="gridjs gridjs-container ">
        <div className="gridjs-wrapper">
          <table className="gridjs-table">
            <thead className="gridjs-thead sticky-header ">
              <tr className="gridjs-tr">
                {thArr?.map((item) => (
                  <th className="gridjs-th"><div className="gridjs-th-content">{item}</div></th>
                ))}
              </tr>
            </thead>
            <tbody className="gridjs-tbody fixed-table">
              {tdArr?.map((item) => (
                <tr className="gridjs-tr">
                  {
                    getTDs(item)
                  }
                </tr>
              ))}
      
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableGrid;
