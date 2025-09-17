import React, { useEffect, useRef, useState } from 'react';
import { Grid } from 'gridjs-react';
import { transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import { useSelector } from 'react-redux';

const gridCols = [
    {
        'Enclosure (انڭلویر)': '',
        'Barrack Type (بیرک کی قسم)': '',
        'Barrack (بیرک)': '',
        'Allocation Date (مختصگی کی تاریخ)': '',
        'ReAllaoction Reason (دوبارہ مختصگی کی وجہ)': '',
        'Prison (جیل)': '',
    },
];

const BarrackHistory = (props) => {
    const [modifiedGridCols, setModifiedGridCols] = useState(gridCols);
    const show = useSelector((state) => state.language.urdu)
    const gridRef = useRef();
    const [entries, setEntries] = useState([]);

    const urduClassNames = ['urdu-font']; //tried applying the urdu font but didnt worked

    // with fromEntries, code for hiding the urdu with a switch in the grid
    const modifyData = (gridCols, show) =>
        gridCols.map((col) =>
            Object.fromEntries(
                Object.entries(col).map(([key, value]) => [
                    show ? key : key.split(" (")[0],
                    value,
                ])
            )
        );

    //can use this if have more grids using it in useeffect is not necessary
    // const modifiedData = modifyData(gridCols,gridcolstwo, show);
    // const modifiedDataForGridCols = modifiedData[0];
    // const modifiedDataForGridColsTwo = modifiedData[1];
    // then call these two variables in the grids .
    // pc = dont remove the comments its for future if i forgot the code

    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        setModifiedGridCols(modifyData(gridCols, show));
    }, [gridCols, show]);


    const loadData = () => {
        try {
            const gridData = props.cases.prisonerAccommodation;
            if (gridData?.length > 0) {
                const filterdData = gridData.map((e) => ({
                    Circle: e.circleName,
                    BarrackType: e.barrackType,
                    Barrack: e.barrackName,
                    'Allocation Date': validateDate(e.allocationDate),
                    BarrackReallocation: e.barrackReallocation || "First Allocation",
                    prisonName: e.prison,
                }));
                setEntries(transformDataForTableGrid(filterdData));
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
      <>
        <div className=" custom-card">
          <h3 className="third-heading">
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
                columns={Object.keys(modifiedGridCols[0])}
                search
                sort
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

export default BarrackHistory;
