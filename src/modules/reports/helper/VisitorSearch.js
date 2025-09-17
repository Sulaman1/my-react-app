import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIds, transformData } from "../../../common/Helpers";
import InputWidget from "../../../droppables/InputWidget";
import { getData, postData } from "../../../services/request";
import { lookupName } from "../../../components/admin/system-settings/lookupNames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import { generateYears } from "../../../common/Common";

const VisitorSearch = (props) => {
	const [prisonerData, setPrisonerData] = useState({});
	const [visitDateRange, setVisitDateRange] = useState([]);
	const [visitStartDate, visitEndDate] = visitDateRange;
	const userMeta = useSelector((state) => state.user);
	const newLookups = useSelector((state) => state?.dropdownLookups) 

	useEffect(() => {
		fetchPrisonserData(); // loading lookups
	}, []);

	const fetchPrisonserData = async () => {
		try {
			const Data = {};
			const relationshipsObj = transformData(newLookups?.Relationships);
			Data["Relationships"] = relationshipsObj;
			setPrisonerData(Data);
		} catch (error) {
			console.error(error);
			alert("something went wrong in lookups api");
		}
	};

	return (
		<>
			<div className="col-12 my-3 card-body card">
				<div className="row">
				</div>
				<h4 className="third-heading sub-fill-heading">Visitor Wise</h4>
				<form className="card-body card">
					<div className="row">
						<div className="col-lg-12">
							<div className="row">
								<div className="col-lg-3">
									<InputWidget
										type={"cnic"}
										inputType={"name"}
										label={"CNIC"}
										onlyNumbers={true}
										icon={"icon-operator"}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload["cnic"] = value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className="col-lg-3">
									<InputWidget
										type={"input"}
										inputType={"name"}
										label={"Visitor Name"}
										// require={'true'}
										icon={"icon-prisoner"}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload["name"] = value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className="col-lg-3">
									<InputWidget
										type={"input"}
										inputType={"name"}
										label={"Fathers Name"}
										icon={"icon-operator"}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload["relationshipName"] = value;
											props.setFormPayload(payload);
										}}
									/>
								</div>
								<div className="col-lg-3 mb-4">
									<div className='inputs force-active'>
										<label>visit Start-End Date</label>
										<DatePicker
											icon={"icon-calendar"}
											dateFormat="dd/MM/yyyy"
											selectsRange={true}
											startDate={visitStartDate}
											endDate={visitEndDate}
											onChange={(date) => {
												setVisitDateRange(date);
												const payload = {
													...props.formPayload,
												};
												payload["visitDateStart"] =
													date && date[0] != null
														? `${date[0].getFullYear()}-${date[0].getMonth() + 1
														}-${date[0].getDate()}`
														: "";
												payload["visitDateEnd"] =
													date && date[1] != null
														? `${date[1].getFullYear()}-${date[1].getMonth() + 1
														}-${date[1].getDate()}`
														: "";
												props.setFormPayload(payload);
											}}
											isClearable={true}
											showYearDropdown
											scrollableYearDropdown
											yearDropdownItemNumber={120}
											showMonthDropdown
											id={"visit-start-end-date"}
										/>
									</div>
								</div>
								<div className="col-lg-3">
									<InputWidget
										type={"multiSelect"}
										inputType={"name"}
										label={"Relationship"}
										options={prisonerData.Relationships || []}
										isMulti={true}
										icon={"icon-prisoner"}
										setValue={(value) => {
											const payload = {
												...props.formPayload,
											};
											payload["relationship"] = getIds(value);
											props.setFormPayload(payload);
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default VisitorSearch;
