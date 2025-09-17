import React, { useEffect, useState } from 'react'
import Print from '../../components/admin/search/Print';
import { getData } from '../../services/request';
import UserActivityReports from './components/UserActivityReports';
import moment from 'moment-mini';
import { Link } from 'react-router-dom';
import { Grid } from 'gridjs-react';
import { transformDataForTableGrid, validateDate } from '../../common/Helpers';


const UserActivity = (props) => {
    const [formPayload, setFormPayload] = useState({
        userId: [
        ],
    });
    const generateGridCols = (pos) => {
        const entries = {
            'Date': '',
            'Time': '',
            'Activity': '',
            'Activity Description': ''
        };

        return Object.keys(entries);
    };


    const [activityData, userActivityData] = useState([]);
    const [entries, setEntries] = useState([]);

    const handleGenerateReport = async (e) => {
        e.preventDefault();

        try {
            console.log('fro', formPayload)
            const getUsers = await getData(
                `/services/app/Reports/GetAllAuditLogs?userId=${formPayload?.userId?.value ? formPayload?.userId?.value : ''}&count=1000`,
                "",
                true
            );
            userActivityData(getUsers.result);
            setEntries(getUsers.result);
            // 
        } catch (error) {
            console.log('error')
            alert('Something went wrong in User Activity api')

        }
    }

    const gridDataMap = (e) => {
        const mapObj = {
            date: moment(new Date(e?.creationDate).toDateString()).format('L'),
            time: moment(new Date(e?.creationDate)).format('LT'),
            methodName: e.methodName,
            parameters: e.parameters,
        };

        return mapObj;
    };

    return (
        <>
            <div className="row">
                <h3 className="third-heading db-heading">User Activity Report </h3>
            </div>
            <form onSubmit={handleGenerateReport} className='row'>
                <UserActivityReports type={"userActivity"} formPayload={formPayload} setFormPayload={setFormPayload} />
                <div className="mb-4 d-flex justify-content-center col-lg-3">
                    {formPayload?.userId?.value && <button
                        type="submit"
                        id={"generate-report-button"}
                        className="btn rounded-pill w-lg btn-prim waves-effect waves-light mt-0"
                    >
                        Generate Report <i className="icon-add ml-2"></i>
                    </button>}
                </div>

            </form>
            <div className='mt-4 d-flex'>
                <div>
                    <Print data={activityData} filename={"User Activity Report"} />
                </div>
                {<Link
                    to={{
                        pathname: "/admin/reports/user-activity-print",
                        state: { stateParam: { activityData, formPayload } }
                    }}
                >
                    <button type="button" className="btn btn-info btn-label my-2 ms-2">
                        <i className="icon-file label-icon align-middle fs-16 me-2"></i> print
                    </button>
                </Link>}

            </div>
            <div className="card custom-card animation-fade-grids custom-card-scroll mt-4">
                <Grid
                    data={transformDataForTableGrid(
                        entries.map((entry) => gridDataMap(entry))
                    )}
                    columns={generateGridCols()}
                    search={false}
                    sort={false}
                    pagination={{
                        enabled: true,
                        limit: 20,
                    }}
                />
            </div>
        </>
    )
}

export default UserActivity