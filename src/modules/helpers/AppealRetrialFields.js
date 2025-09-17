import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import InputWidget from '../../droppables/InputWidget';
import { getFormattedDate, transformData } from '../../common/Helpers';
import DatePicker from 'react-datepicker';
import { baseImageUrl, postData, getData } from '../../services/request';
import letter from '../../assets/images/users/1.png';
import { Spinner } from 'react-bootstrap';
//import { generateYears } from "../../common/Common";
import Modal from "react-bootstrap/Modal";
import ProfileCard from "../../components/prisoners/Components/circleoffice/profile/ProfileCard";

export const AppealRetrialInnerFields = ({ infoPayload, setInfoPayload, showModal, hideModal, closeModal, prisoner, phrase, title, type }) => {
	const newLookups = useSelector((state) => state?.dropdownLookups)
	const [fetchedData, setData] = useState({});
	const fetchApiData = () => {
		try {
			const data = {};
			const courtObj = transformData(newLookups?.court);
			data["courts"] = courtObj;
			setData(data);
		} catch (err) {
			alert("An error occured");
		}
	};
	useEffect(() => {
		fetchApiData();
	}, []);
	const handleFrontUpload = (value) => {
		if (!value) return;
		const data = {
			image: value.split(',')[1],
			prisoner: false,
			imageName: 'doc'
		};
		postData('/services/app/BasicInfo/uploadBase64', data)
			.then(res => {
				if (res.success == true) {
					const pd = {
						...infoPayload
					};

					pd['documents'] = res.result.imagePath;
					setInfoPayload(pd);
				}
			})
			.catch(err => {
				console.log(err, 'getting error while uploading');
			});
	};
	return (
		<>
			<Modal
				show={showModal}
				onHide={hideModal}
				size="xl"
				class="modal-custom-xl"
			>
				<Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
					<h5 class="modal-title" id="exampleModalgridLabel">
						{title}
					</h5>
				</Modal.Header>
				<Modal.Body>
					<form>
						<ProfileCard
							data={prisoner}
							caseInfo={JSON.parse(sessionStorage.getItem("AppealFirstTabPrisoner")) || null}
							type={"appeal"}
							phrase={phrase}
						/>
						<div className="col-12 px-0 mt-5">
							<div className="row">
								<div className="col-lg-6">
									<InputWidget
										type={"multiSelect"}
										inputType={"name"}
										label={"Court"}
										id={"decision-authority"}
										require={true}
										icon={"icon-court"}
										options={fetchedData.courts || []}
										multiple={false}
										setValue={(value) => {
											console.log("decisionAuthority", value);
											const pd = {
												...infoPayload,
											};
											pd["courtId"] = value.value;
											setInfoPayload(pd);
										}}
									/>
								</div>
								<div className="col-lg-6">
									<InputWidget
										type={"input"}
										inputType={"name"}
										id={"remakrs"}
										label={"Remarks"}
										require={false}
										icon={"fa-solid fa-comment"}
										setValue={(value) => {
											console.log("remarks", value);
											const pd = {
												...infoPayload,
											};
											pd["remarks"] = value;
											setInfoPayload(pd);
										}}
									/>
								</div>
								{type === 'Appeal' && (
							<>
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'name'}
										onlyNumbers={true}
										label={'Appeal No'}
										id={'appealNumber'}
										require={false}
										icon={'icon-operator'}
										defaultValue={
											infoPayload?.appealNumber
										}
										setValue={value => {
											const pd = {
												...infoPayload,
											};
											pd["appealNumber"] = value;
											setInfoPayload(pd);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'name'}
										label={'Preference'}
										id={'preference'}
										onlyLetters={true}
										require={false}
										icon={'icon-web'}
										defaultValue={
											infoPayload?.preference
										}
										setValue={value => {
											const pd = {
												...infoPayload,
											};
											pd["preference"] = value;
											setInfoPayload(pd);
										}}
									/>
								</div>
								<div className='col-lg-6'>
									<InputWidget
										type={'input'}
										inputType={'name'}
										label={'Type e.g: (Mercy Petition)'}
										id={'type'}
										onlyLetters={true}
										require={false}
										icon={'icon-like'}
										defaultValue={
											infoPayload?.type
										}
										setValue={value => {
											const pd = {
												...infoPayload,
											};
											pd["type"] = value;
											setInfoPayload(pd);
										}}
									/>
								</div>
							</>
						)}
								<div className='col-lg-9 d-flex justify-content-center flex-column mx-auto mt-2'>
									<h3 className='sub-heading text-center just-center mb-3'>
										Documents Upload
									</h3>
									<InputWidget
										id={'user'}
										type={'editImage'}
										inputType={'file'}
										upload={'icon-upload'}
										noCropping={true}
										onlyUploadFile={false}
										take={'icon-photographers'}
										require={false}
										Photo={
											infoPayload?.documents
												? baseImageUrl +
												infoPayload?.documents
												: letter
										}
										setValue={value => {
											handleFrontUpload(value);
										}}
									/>
								</div>
							</div>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<button
						id={"save-btn-last"}
						className="btn btn-prim waves-effect waves-light"
						onClick={closeModal}
					>
						Save
					</button>
				</Modal.Footer>
			</Modal>

		</>
	);
};

export const AppealRetrialFields = ({ formPayload, setFormPayload, sendData, type, infoPayload, setInfoPayload }) => {
	return (
		<>
			<div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
				<>
					<form className="mt-4 grid col-7 just-center">
						<div className="">
							<div className="inputs force-active">
								<label>
									{type} Date <span>(سزا کی تاریخ)</span>
								</label>
								<DatePicker
									selected={getFormattedDate(formPayload.date)}
									onChange={(date) => {
										const payload = {
											...formPayload,
										};
										payload["date"] = date
											? `${date.getFullYear()}-${date.getMonth() + 1
											}-${date.getDate()}`
											: "";
										setFormPayload(payload);
									}}
									dateFormat="dd/MM/yyyy"
									//minDate={new Date()}
									maxDate={new Date()}
									icon={"icon-operator"}
									isClearable
									showYearDropdown
									scrollableYearDropdown
									yearDropdownItemNumber={120}
									showMonthDropdown
									id={"appeal-date"}
									placeholderText={""}
								/>
							</div>
						</div>
						<div className="flex just-center">
							<button
								id={"save-btn"}
								className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
								onClick={sendData}
								type="button"
							>
								Save
							</button>
						</div>
					</form>
				</>
			</div>
		</>
	);
}