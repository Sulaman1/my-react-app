import { useState, useEffect } from "react";
import { transformData, getIds } from "../../../common/Helpers";
import { mapIdsToLabels } from "../../../common/ReportHelpers";
import InputWidget from "../../../droppables/InputWidget";
import { useSelector } from "react-redux";
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { Collapse } from "react-bootstrap";

const PrisonerVisitorAddressParams = ({ type, formPayload, setFormPayload }) => {
	const hasVisitor = useSelector((state) => state.language.hasVisitor);
	const newLookups = useSelector((state) => state?.dropdownLookups);
	const [open, setOpen] = useState(true);
	const [lookup, setLookup] = useState();

	useEffect(() => {
		fetchLookUps();
	}, []);

	const fetchLookUps = async () => {
		try {
			let lookup = {};

			const countryObj = transformData(newLookups?.country);
			lookup["country"] = countryObj;

			const provinceObj = transformData(newLookups?.province);
			lookup["province"] = provinceObj;

			const districtObj = transformData(newLookups?.district);
			lookup["district"] = districtObj;

			const cityObj = transformData(newLookups?.city);
			lookup["city"] = cityObj;

			setLookup(lookup);
		} catch (error) {
			console.error(error);
			alert("Something went wrong in lookups api");
		}
	};

	// Only render if hasVisitor is true
	if (!hasVisitor) return null;

	return (
		<div className="row">
			<h3
				onClick={() => setOpen(!open)}
				aria-controls="example-collapse-text"
				aria-expanded={open}
				className="master-report-headings"
			>
				<span className="d-flex justify-content-between w-100">
					Address {" "}
					{open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
				</span>
			</h3>
			<Collapse in={open}>
				<div id="example-collapse-text" className="row">
					<div className="col-lg-3">
						<InputWidget
							type={"multiSelect"}
							label={"Country"}
							require={false}
							isMulti={true}
							icon={"icon-web"}
							id={"country"}
							options={lookup?.country || []}
							defaultValue={mapIdsToLabels(
								formPayload?.prisonerVisitors?.address?.countryId,
								lookup?.country || []
							)}
							setValue={(value) => {
								const payload = {
									...formPayload,
									prisonerVisitors: {
										...formPayload.prisonerVisitors,
										address: {
											...((formPayload.prisonerVisitors && formPayload.prisonerVisitors.address) || {}),
											countryId: getIds(value)
										}
									}
								};
								setFormPayload(payload);
							}}
						/>
					</div>
					<div className="col-lg-3">
						<InputWidget
							type={"multiSelect"}
							label={"Province"}
							require={false}
							isMulti={true}
							id={"province"}
							icon={"icon-building"}
							options={lookup?.province || []}
							defaultValue={mapIdsToLabels(
								formPayload?.prisonerVisitors?.address?.provinceId,
								lookup?.province || []
							)}
							setValue={(value) => {
								const payload = {
									...formPayload,
									prisonerVisitors: {
										...formPayload.prisonerVisitors,
										address: {
											...((formPayload.prisonerVisitors && formPayload.prisonerVisitors.address) || {}),
											provinceId: getIds(value)
										}
									}
								};
								setFormPayload(payload);
							}}
						/>
					</div>
					<div className="col-lg-3">
						<InputWidget
							type={"multiSelect"}
							label={"District"}
							isMulti={true}
							require={false}
							id={"district"}
							icon={"icon-building"}
							options={lookup?.district || []}
							defaultValue={mapIdsToLabels(
								formPayload?.prisonerVisitors?.address?.districtId,
								lookup?.district || []
							)}
							setValue={(value) => {
								const payload = {
									...formPayload,
									prisonerVisitors: {
										...formPayload.prisonerVisitors,
										address: {
											...((formPayload.prisonerVisitors && formPayload.prisonerVisitors.address) || {}),
											districtId: getIds(value)
										}
									}
								};
								setFormPayload(payload);
							}}
						/>
					</div>
					<div className="col-lg-3">
						<InputWidget
							type={"multiSelect"}
							label={"City"}
							isMulti={true}
							require={false}
							id={"city"}
							icon={"icon-building"}
							options={lookup?.city || []}
							defaultValue={mapIdsToLabels(
								formPayload?.prisonerVisitors?.address?.cityId,
								lookup?.city || []
							)}
							setValue={(value) => {
								const payload = {
									...formPayload,
									prisonerVisitors: {
										...formPayload.prisonerVisitors,
										address: {
											...((formPayload.prisonerVisitors && formPayload.prisonerVisitors.address) || {}),
											cityId: getIds(value)
										}
									}
								};
								setFormPayload(payload);
							}}
						/>
					</div>
				</div>
			</Collapse>
		</div>
	);
};
export default PrisonerVisitorAddressParams;






