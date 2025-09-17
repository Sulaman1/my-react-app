import React, { useEffect, useState } from 'react'
import { getIds, transformData } from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { baseImageUrl, getData } from '../../../services/request';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import ProfilePic from '../../../../src/assets/images/users/1.jpg'



const UserActivityReports = ({ type, formPayload, setFormPayload }) => {
    const [usersData, setUsersData] = useState([])

    const [startEndData, setStartEndData] = useState([null, null]);

    const [darbanStartDate, darbanEndDate] = startEndData;

    // =====Load Get User==========
    const fetchGetUsersData = async () => {
        try {
            const getUsers = await getData(
                "/services/app/EmployeeAppServices/GetAllEmployee",
                "",
                true
            );

            const temp = getUsers?.result?.data.map((item) => ({ label: item.userName, value: item.userId, image: item?.imgUrl }))
            setUsersData(temp)
        } catch (error) {
            console.log('ERROR', error)
        }
    }
    useEffect(() => { fetchGetUsersData() }, [])

    const getOptionLabel = option => (
        <div>
            <img src={baseImageUrl + option?.image} alt={option?.label} style={{ marginRight: '5px' }} width="20" height="20" />
            {option?.label}
        </div>
    );

    return (
        <>
        <div className='row'>
            <div className='row col-lg-9  '>
                <div className="col-lg-6">
                    <InputWidget
                        type={"multiSelect"}
                        label={"Search employee *"}
                        require={false}
                        isMulti={false}
                        icon={"icon-operator"}
                        id={"Employee"}
                        options={usersData}
                        getOptionLabel={getOptionLabel}
                        setValue={(value) => {
                            const payload = {
                                ...formPayload,
                            };
                            payload["userId"] = value;
                            setFormPayload(payload);
                        }}
                    />
                </div>
                <div className="col-lg-6">
                <div className="inputs force-active">
                <label>Date of birth Start-End Date</label>
                    <DatePicker
                        icon={"icon-calendar"}
                        dateFormat="dd/MM/yyyy"
                        selectsRange={true}
                        startDate={darbanStartDate}
                        endDate={darbanEndDate}
                        onChange={(date) => {
                            setStartEndData(date);
                            const payload = {
                                ...props.formPayload,
                            };
                            payload["prisonerNumber"]["darbanEntryDateStart"] =
                                date && date[0] != null
                                    ? `${date[0].getFullYear()}-${date[0].getMonth() + 1
                                    }-${date[0].getDate()}`
                                    : "";
                            payload["prisonerNumber"]["darbanEntryDateEnd"] =
                                date && date[1] != null
                                    ? `${date[1].getFullYear()}-${date[1].getMonth() + 1
                                    }-${date[1].getDate()}`
                                    : "";
                            props.setFormPayload(payload);
                        }}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={120}
                        showMonthDropdown
                        isClearable={true}
                        placeholderText={"Start-End Date *"}
                        id={"darban-start-end-date"}
                        />
                    </div>
                </div>

            </div>
            </div>
        </>
    )
}

export default UserActivityReports