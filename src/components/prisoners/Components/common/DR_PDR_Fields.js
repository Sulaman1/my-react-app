import React, { useState } from 'react';
import InputWidget from '../../../../droppables/InputWidget';
import { transfromStringArray, getFormattedDate, validateDate } from '../../../../common/Helpers';
import DatePicker from 'react-datepicker';
import { baseImageUrl } from '../../../../services/request';
import letter from '../../../../assets/images/users/1.png';
import { Spinner } from 'react-bootstrap';
export const SystemCalculations = ({ getPDR, calculateDR_PDR }) => {
	return (
		<div className="mainBodyCal">
			<div className='card innerBodyCal'>
				<div className="card-body row mb-2">
					<h3 className="heading card-title mb-2">System Calculations</h3>
				</div>
				<p className="mb-2">
					<b>Probable Date of Release:</b> <span className="text-red-500">{getPDR}</span>
				</p>
				<div className="text-end btn-filled">
					<a onClick={calculateDR_PDR} className="btn btn-primary">Calculate Date of Release</a>
				</div>
			</div>
		</div>
	);
};

export const SentenceRow = ({ formPayload, setFormPayload }) => {
	return (
		<>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Days'}
					id={'days'}
					maxlength={3}
					apiURL={"No of Years"}
					defaultValue={formPayload?.sentence?.day || ''}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							sentence: { ...formPayload.sentence },
						};
						payload['sentence']['day'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Months'}
					id={'month'}
					apiURL={"No of Years"}
					defaultValue={formPayload?.sentence?.month || ''}
					maxlength={3}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							sentence: { ...formPayload.sentence },
						};
						payload['sentence']['month'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Years'}
					id={'year'}
					apiURL={"No of Years"}
					defaultValue={formPayload?.sentence?.year || ''}
					maxlength={3}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							sentence: { ...formPayload.sentence },
						};
						payload['sentence']['year'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
		</>
	);
};

export const SentenceRowIfNotPaid = ({ formPayload, setFormPayload }) => {
	return (
		<>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Days'}
					id={'days'}
					maxlength={3}
					apiURL={"No of Years"}
					defaultValue={formPayload?.ifFineNotPaid?.day || ''}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							ifFineNotPaid: { ...formPayload.ifFineNotPaid },
						};
						payload['ifFineNotPaid']['day'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Months'}
					id={'month'}
					apiURL={"No of Years"}
					defaultValue={formPayload?.ifFineNotPaid?.month || ''}
					maxlength={3}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							ifFineNotPaid: { ...formPayload.ifFineNotPaid },
						};
						payload['ifFineNotPaid']['month'] = value;
						setFormPayload(payload);
					}}

				/>
			</div>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Years'}
					id={'year'}
					apiURL={"No of Years"}
					defaultValue={formPayload?.ifFineNotPaid?.year || ''}
					maxlength={3}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							ifFineNotPaid: { ...formPayload.ifFineNotPaid },
						};
						payload['ifFineNotPaid']['year'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
		</>
	)
}


export const UndertrialPeriod = ({ formPayload, setFormPayload }) => {
	return (
		<>
			<div className="row">
				<h3 className="heading mb-4">Undertrial Period</h3>
			</div>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Days'}
					id={'days-utp'}
					maxlength={3}
					apiURL={"No of Years"}
					defaultValue={formPayload?.utpPeriod?.day || ''}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							utpPeriod: { ...formPayload.utpPeriod },
						};
						payload['utpPeriod']['day'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Months'}
					id={'month-utp'}
					apiURL={"No of Years"}
					defaultValue={formPayload?.utpPeriod?.month || ''}
					maxlength={3}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							utpPeriod: { ...formPayload.utpPeriod },
						};
						payload['utpPeriod']['month'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className='col-lg-2'>
				<InputWidget
					type={'input'}
					inputType={'tel'}
					label={'No of Years'}
					id={'year-utp'}
					apiURL={"No of Years"}
					defaultValue={formPayload?.utpPeriod?.year || ''}
					maxlength={3}
					min={0}
					onlyNumbers={true}
					require={false}
					icon={'icon-number'}
					setValue={(value) => {
						const payload = {
							...formPayload,
							utpPeriod: { ...formPayload.utpPeriod },
						};
						payload['utpPeriod']['year'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
		</>
	)
}
export const PrisonerCategory = ({ props, formPayload, setFormPayload, setIsUTP, hideHearingOnEdit, setIsWitness }) => {
	return (
		<>
			{hideHearingOnEdit && (
				<div className="col-lg-6">
					<InputWidget
						type={'multiSelect'}
						ismulti={false}
						inputType={'select'}
						label={'Category'}
						id={'category'}
						require={false}
						icon={'icon-prisoner'}
						options={props?.lookUps?.caseStatuses || []}
						defaultValue={
							transfromStringArray(
								props?.lookUps?.caseStatuses,
								formPayload?.caseStatus,
								'caseStatus'
							) || []
						}
						setValue={(value) => {
							const payload = {
								...props.formPayload,
							};
							payload['caseStatus'] = value.value;
							// check if the user selected UTP or Convict
							const isUTP = props?.lookUps?.caseStatuses
								?.find((p) => p.value === payload.caseStatus)
								?.label.includes('Under');
							const isWitness = props?.lookUps?.caseStatuses
								?.find((p) => p.value === payload.caseStatus)
								?.label.includes('Witness');
							setIsWitness(isWitness);
							setIsUTP(isUTP);
							setFormPayload(payload);
						}}
					/>
				</div>
			)}
		</>

	)
}

export const FirInfo = ({ formPayload, setFormPayload, sections, policeStations }) => {
	return (
		<>
			<div className="col-lg-6">
				<InputWidget
					type={'multiSelect'}
					inputType={'name'}
					label={'Police Station*'}
					id={'police-station'}
					multiple={false}
					icon={'icon-building'}
					options={policeStations}
					defaultValue={
						policeStations?.find((p) => {
							return p.value === formPayload.policeStationId;
						}) || {}
					}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload['policeStationId'] = value.value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className="col-lg-6">
				<InputWidget
					type={'input'}
					inputType={'name'}
					label={'FIR No'}
					id={'fir-no'}
					require={false}
					icon={'icon-number'}
					defaultValue={formPayload?.firNo || ''}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload['firNo'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className="col-lg-6">
				<div className='inputs force-active'>
					<label>Fir Date</label>
					<DatePicker
						selected={getFormattedDate(formPayload.firDate)}
						onChange={(date) => {
							const payload = {
								...formPayload,
							};
							payload['firDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
							setFormPayload(payload);
						}}
						dateFormat="dd/MM/yyyy"
						maxDate={new Date()}
						icon={'icon-operator'}
						isClearable
						showYearDropdown
						scrollableYearDropdown
						yearDropdownItemNumber={120}
						showMonthDropdown
						id={'fir-date'}
					/>
				</div>
			</div>
			<div className="col-lg-6">
				<InputWidget
					type={'multiSelect'}
					isMulti={true}
					inputType={'select'}
					label={'Under Sections'}
					id={'under-sections'}
					require={false}
					icon={'icon-file'}
					defaultValue={
						formPayload?.sections?.map((sec) => {
							const label = sections.find(
								(s) => s.value === sec.id
							)?.label;
							return {
								value: sec.id,
								label,
							};
						}) || []
					}
					options={sections}
					setValue={(value) => {
						const filteredVal = value.map((e) => {
							return { id: e.value };
						});
						const payload = {
							...formPayload,
						};
						payload['sections'] = filteredVal;
						setFormPayload(payload);
					}}
				/>
			</div>
		</>
	)
}

export const CourtProductionDate = ({ formPayload, setFormPayload }) => {
	return (
		<>
			<div className="col-lg-6">
				<div className='inputs force-active'>
					<label>Production / Warrant  Date</label>
					<DatePicker
						selected={getFormattedDate(formPayload.productionOrderDate)}
						onChange={(date) => {
							const payload = {
								...formPayload,
							};
							payload['productionOrderDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
							setFormPayload(payload);
						}}
						dateFormat="dd/MM/yyyy"
						maxDate={new Date()}
						icon={'icon-operator'}
						isClearable
						showYearDropdown
						scrollableYearDropdown
						yearDropdownItemNumber={120}
						showMonthDropdown
						id={'production-order-date'}
					/>
				</div>
			</div>
			<div className="col-lg-6">
				<InputWidget
					type={'input'}
					inputType={'name'}
					label={'Remarks'}
					id={'remarks'}
					require={false}
					icon={'icon-chat'}
					defaultValue={formPayload?.remarks || ''}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload['remarks'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
		</>

	)
}

export const ConvictionInfo = ({ formPayload, setFormPayload, courts }) => {
	return (
		<>
			<div className="row">
				<h3 className="heading mb-4">Conviction Information</h3>
			</div>
			<div className="col-lg-6">
				<InputWidget
					type={'multiSelect'}
					isMulti={false}
					inputType={'select'}
					label={'Decision Authority'}
					id={'decision-authority'}
					require={false}
					icon={'icon-building'}
					defaultValue={courts?.find(
						(court) => { return court.value === formPayload.decisionAuthorityId; }
					) || []}
					options={courts}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload['decisionAuthorityId'] = value.value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className="col-lg-6">
				<div className='inputs force-active'>
					<label>Sentence Date</label>
					<DatePicker
						selected={getFormattedDate(formPayload.sentenceDate)}
						onChange={(date) => {
							const payload = {
								...formPayload,
							};
							payload['sentenceDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
							setFormPayload(payload);
						}}
						dateFormat="dd/MM/yyyy"
						maxDate={new Date()}
						icon={'icon-operator'}
						isClearable
						showYearDropdown
						scrollableYearDropdown
						yearDropdownItemNumber={120}
						showMonthDropdown
						id={'sentence-date'}
					/>
				</div>
			</div>
		</>
	)
}

export const Checkboxes = ({ formPayload, setFormPayload, getUTPPeriod }) => {
	return (
		<>
			<div className="col-lg-6">
				<InputWidget
					type={"switch"}
					inputType={"checkbox"}
					label={"Condemned "}
					id={"condemned"}
					require={false}
					defaultValue={formPayload?.condemned || false}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload['condemned'] = value;
						if (value === true) {
							payload['probableDateOfRelase'] = null;
							payload['sentence'] = {}
							payload['sentence'] = {
								year: 0,
								month: 0,
								day: 0,
							}
							payload['ifFineNotPaid'] = {}
							payload['ifFineNotPaid'] = {
								year: 0,
								month: 0,
								day: 0,
							}
							payload['utpPeriod'] = {}
							payload['utpPeriod'] = {
								year: 0,
								month: 0,
								day: 0,
							}
							payload['wef'] = false;
							payload['consecutive'] = false
						}
						setFormPayload(payload);
					}}
				/>
				{!formPayload?.condemned && (
					<>
						<InputWidget
							type={"switch"}
							inputType={"checkbox"}
							label={"Is Consecutive? "}
							id={"consecutive"}
							require={false}
							defaultValue={formPayload?.consecutive || false}
							setValue={(value) => {
								const payload = {
									...formPayload,
								};
								payload['consecutive'] = value;
								setFormPayload(payload);
							}}
						/>
						<InputWidget
							type={"switch"}
							inputType={"checkbox"}
							label={"WEF"}
							id={"wef"}
							require={false}
							defaultValue={formPayload?.wef || false}
							setValue={(value) => {
								getUTPPeriod(value)
								const payload = {
									...formPayload,
								};
								payload['wef'] = value;
								setFormPayload(payload);
							}}
						/>
					</>
				)}
			</div>
		</>
	)
}
export const CourtFineAndLabour = ({ formPayload, setFormPayload, isUTP, isWitness }) => {
	return (
		<>
			{formPayload?.condemned && (
				<div className="col-lg-6 mt-4"></div>
			)}
			{(!isUTP && !isWitness) && (
				<>

					<div className="col-lg-6 mt-4">
						<InputWidget
							type={'input'}
							inputType={'name'}
							label={'Court Fine'}
							id={'court-fine'}
							require={false}
							onlyNumbers={true}
							icon={'icon-court'}
							defaultValue={formPayload?.courtFine || ''}
							setValue={(value) => {
								const payload = {
									...formPayload,
								};
								payload['courtFine'] = value;
								setFormPayload(payload);
							}}
						/>
					</div>

					<div className="col-lg-6 mt-4">
						<InputWidget
							type={'input'}
							inputType={'name'}
							label={'Records of rigorous imprisonment'}
							id={'labor'}
							require={false}
							icon={'icon-file'}
							defaultValue={formPayload?.laborInfo || ''}
							setValue={(value) => {
								const payload = {
									...formPayload,
								};
								payload['laborInfo'] = value;
								setFormPayload(payload);
							}}
						/>
					</div>
				</>
			)}
		</>

	)
}

export const DRPDR = ({ formPayload, setFormPayload }) => {
	return (
		<>
			
			<div className="col-lg-6">
				<div className='inputs force-active'>
					<label>Probably Release Date</label>
					<DatePicker
						selected={getFormattedDate(formPayload?.probableDateOfRelase)}
						// selected={getFormattedDate(`${getPDR.split('-')[2]}-${getPDR.split('-')[1]}-${getPDR.split('-')[0]}`)}
						onChange={(date) => {
							const payload = {
								...formPayload,
							};
							payload['probableDateOfRelase'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
							setFormPayload(payload);
						}}
						dateFormat="dd/MM/yyyy"
						minDate={new Date()}
						icon={'icon-operator'}
						isClearable
						showYearDropdown
						scrollableYearDropdown
						yearDropdownItemNumber={120}
						showMonthDropdown
						id={'probably-release-date'}
					/>
				</div>
			</div>
			<div className="col-lg-6">
				
				<InputWidget
					id={'user'}
					type={'textarea'}
					inputType={'text'}
					label={'Other remarks (Sentence Changes/Remarks)'}
					defaultValue={formPayload?.remarks || ""}
					require={false}
					setValue={value => {
						const payload = {
							...formPayload,
						};
						payload['remarks'] = value;
						setFormPayload(payload);
					}}
					icon={'icon-chat'}
					/>
			</div>
		</>
	)
}


export const HearingInfo = ({ formPayload, setFormPayload, remandingCourts, courts, loading, isUTP, handleFrontUpload, handleVakalatnamaUpload, hideFields, vakalatnamaLoading, isWitness }) => {
	return (
		<>
			<div className="row">
				<h3 className="heading mb-4">Case Hearing Information</h3>
			</div>
			<div className="col-lg-6">
				<InputWidget
					type={'multiSelect'}
					isMulti={false}
					inputType={'select'}
					label={'Remanding Court'}
					id={'remanding-court'}
					require={false}
					icon={'icon-court'}
					defaultValue={
						remandingCourts?.find(
							(court) =>
								court.value === formPayload.hearings?.remandingCourtId
						) || {}
					}
					options={remandingCourts}
					setValue={(value) => {
						const payload = {
							...formPayload,
							hearings: { ...formPayload.hearings },
						};
						payload['hearings']['remandingCourtId'] = value.value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className="col-lg-6">
				<InputWidget
					type={'multiSelect'}
					isMulti={false}
					inputType={'select'}
					label={'Trial Court'}
					id={'trial-court'}
					require={false}
					icon={'icon-court'}
					defaultValue={
						courts?.find(
							(court) => court.value === formPayload.hearings?.courtId
						) || {}
					}
					options={courts}
					setValue={(value) => {
						const payload = {
							...formPayload,
							hearings: { ...formPayload.hearings },
						};
						payload['hearings']['courtId'] = value.value;
						setFormPayload(payload);
					}}
				/>
			</div>
		
			<div className="col-lg-6">
				<InputWidget
					type={'input'}
					isMulti={false}
					inputType={'name'}
					label={'Judges'}
					id={'judges'}
					require={false}
					icon={'icon-court'}
					defaultValue={formPayload?.hearings?.judge || ''}
					setValue={(value) => {
						const payload = {
							...formPayload,
							hearings: { ...formPayload.hearings },
						};
						payload['hearings']['judge'] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			{(isUTP || isWitness) && (
				<div className="col-lg-6">
					<div className='inputs force-active'>
						<label>Hearing Date</label>
						<DatePicker
							selected={getFormattedDate(
								formPayload?.hearings?.lastHearingDate
							)}
							onChange={(date) => {
								const payload = {
									...formPayload,
									hearings: { ...formPayload.hearings },
								};
								payload['hearings']['lastHearingDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
								setFormPayload(payload);
							}}
							dateFormat="dd/MM/yyyy"
							maxDate={new Date()}
							icon={'icon-operator'}
							isClearable
							showYearDropdown
							scrollableYearDropdown
							yearDropdownItemNumber={120}
							showMonthDropdown
							placeholderText={''}
							id={'hearing-date'}
						/>
					</div>
				</div>
			)}
			<div className="col-lg-6">
				{(isUTP || isWitness) &&
					<div className='inputs force-active'>
						<label>Next Hearing Date</label>
						<DatePicker
							selected={validateDate(formPayload?.hearings?.nextHearingDate) ?
								getFormattedDate(formPayload?.hearings?.nextHearingDate) : null}
							onChange={(date) => {
								const payload = {
									...formPayload,
									hearings: { ...formPayload.hearings },
								};
								payload['hearings']['nextHearingDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
								setFormPayload(payload);
							}}
							dateFormat="dd/MM/yyyy"
							// maxDate={addMonths(new Date(), 9)}
							icon={'icon-operator'}
							isClearable
							showYearDropdown
							scrollableYearDropdown
							yearDropdownItemNumber={1200}
							showMonthDropdown
							placeholderText={''}
							id={'next-hearing-date'}
						/>
					</div>
				}
			</div>
			<div className="d-flex align-items-center justify-content-center gap-5">
			<div className='row mb-3'>
				<h3 className='sub-heading text-center just-center mb-3'>
					Warrant Upload
				</h3>
				<InputWidget
					id={'user'}
					type={'editImage'}
					inputType={'file'}
					upload={'icon-upload'}
					noCropping={true}
					onlyUploadFile={true}
					take={'icon-photographers'}
					require={false}
					Photo={
						formPayload?.hearings?.hearingDocuments
							? baseImageUrl +
							formPayload?.hearings?.hearingDocuments
							: letter
					}
					setValue={value => {
						handleFrontUpload(value);
					}}
				/>
			</div>
		
			</div>
				{(loading) && (
				<div className="mt-4 mb-4 d-flex justify-content-center gap-2 align-items-center">
					<b>Please wait...</b> <br /><Spinner animation="border" variant="primary" />
				</div>
			)}

		</>
	)
}

export const Vakalatnama = ({ formPayload, handleVakalatnamaUpload, vakalatnamaLoading }) => {
	return (
		<>
			<div className='row mb-3'>
				<h3 className='sub-heading text-center just-center mb-3'>
					Vakalatnama
				</h3>
				<InputWidget
					id='user'
					type='editImage'
					inputType='file'
					upload='icon-upload'
					noCropping={true}
					onlyUploadFile={true}
					take='icon-photographers'
					require={false}
					Photo={
						formPayload?.vakalatnama
							? `${baseImageUrl}${formPayload.vakalatnama}`
							: letter
					}
					setValue={value => {
						handleVakalatnamaUpload(value);
					}}
				/>
			</div>
			{(vakalatnamaLoading) && (
				<div className="mt-4 mb-4 d-flex justify-content-center gap-2 align-items-center">
					<b>Please wait...</b> <br /><Spinner animation="border" variant="primary" />
				</div>)}
		</>
	);
};




