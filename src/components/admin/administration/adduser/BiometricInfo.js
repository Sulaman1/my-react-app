import React, { useState,useRef } from 'react';
import InputWidget from '../../../../droppables/InputWidget';
import { postData, baseImageUrl, postFingerData } from '../../../../services/request';
import ProfilePic from '../../../../../src/assets/images/users/1.jpg';
import { TabButton } from '../../../../common/TabButton';
import FingerScanner from '../../../../common/FingerScanner';
import { SVGS } from '../../../../services/CustomIcons';
import PrisonerGallery from '../../../prisoners/Components/PrisonerGallery';

const BiometricInfo = props => {
	console.log(props.isEdit, 'isEdit at biometric')
	const fingerScannerRef = useRef(null);
	const [fingerIndex, setFingerIndex] = useState('');
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [historyImages, setHistoryImages] = useState([]);
	const [showModal, setShowModal] = useState(false);

	const handleFingerPrintScan = async (fingerScan, fingerIndex) => {
		let fingerImg = '';
		let fingerTemp = '';
		const data = {
			image: fingerScan.ImageBytes,
			prisoner: false
		};
		switch (fingerIndex) {
			case 'right thumb':
				data['imageName'] = 'rightThumb';
				fingerImg = 'rightThumbImg';
				fingerTemp = 'rightThumbTemp'
				break;
			case 'left thumb':
				data['imageName'] = 'leftThumb';
				fingerImg = 'leftThumbImg';
				fingerTemp = 'leftThumbTemp';
				break;
			case 'left index':
				data['imageName'] = 'leftIndex';
				fingerImg = 'leftIndexImg';
				fingerTemp = 'leftIndexTemp';
				break;
			case 'right index':
				data['imageName'] = 'rightIndex';
				fingerImg = 'rightIndexImg';
				fingerTemp = 'rightIndexTemp';
				break;

			default:
				break;
		}

		const resoponse = await apiCallForSavingBase64String(data);
		
		if (resoponse.result) {
			clearFingerData()
		}
		const payload = {
			...props.formPayload
		};
		if (payload.biometricInfo) {
			payload['biometricInfo'][fingerImg] = resoponse.result.imagePath;
			payload['biometricInfo'][fingerTemp] = fingerScan.DataResult
		}
		props.setFormPayload(payload);
		setModalIsVisible(false);
	}

	const clearFingerData = async () => {
		const clear = await postFingerData('/clearFingerPrint', {});
		console.log(clear);
	}

	const apiCallForSavingBase64String = data => {
		return new Promise((resolve, reject) => {
			postData('/services/app/BasicInfo/uploadBase64', data)
				.then(res => {
					if (res.success == true) {
						resolve(res);
					}
				})
				.catch(err => {
					console.log(err, 'getting error while uploading in API {uploadBase64} & fileName is {BiometricInfo.js}')
					reject(false)
				});
		})

	}

	const handleFrontUpload = async value => {
		if(!value) return;
		const data = {
			image: value.substring(23),
			prisoner: false,
			imageName: 'frontPic'
		};
		const resoponse = await apiCallForSavingBase64String(data);
		const payload = {
			...props.formPayload
		};
		
		if(props.formPayload.biometricInfo && props.formPayload.biometricInfo.frontPic && (props.isEdit || props.formPayload.hasCases)) {
			payload['biometricInfo'].prisonerGallery.push(baseImageUrl + props.formPayload.biometricInfo.frontPic)
		}
		
		payload['biometricInfo']['frontPic'] = resoponse.result.imagePath;
		props.setFormPayload(payload);
	};
	
	const handleRightUpload = value => {
		if(!value) return;
		const data = {
			image: value.substring(23),
			prisoner: false,
			imageName: 'rightPic'
		};
		postData('/services/app/BasicInfo/uploadBase64', data)
			.then(res => {
				if (res.success == true) {
					const payload = {
						...props.formPayload
					};
					if(props.formPayload.biometricInfo && props.formPayload.biometricInfo.rightPic && (props.isEdit || props.formPayload.hasCases)) {
						payload['biometricInfo'].prisonerGallery.push(baseImageUrl + props.formPayload.biometricInfo.rightPic)
					}
					payload['biometricInfo']['rightPic'] = res.result.imagePath;
					props.setFormPayload(payload);
				}
			})
			.catch(err => {
				console.log(err, 'getting error while uploading in API {uploadBase64} & fileName is {BiometricInfo.js}')
			});
	};

	const handleleftUpload = value => {
		if(!value) return;
		const data = {
			image: value.substring(23),
			prisoner: false,
			imageName: 'leftPic'
		};
		postData('/services/app/BasicInfo/uploadBase64', data)
			.then(res => {
				if (res.success == true) {
					const payload = {
						...props.formPayload
					};
					if(props.formPayload.biometricInfo && props.formPayload.biometricInfo.leftPic && (props.isEdit || props.formPayload.hasCases)) {
						payload['biometricInfo'].prisonerGallery.push(props.formPayload.biometricInfo.rightPic)
					}
					payload['biometricInfo']['leftPic'] = res.result.imagePath;
					props.setFormPayload(payload);
				}
			})
			.catch(err => {
				console.log(err, 'getting error while uploading in API {uploadBase64} & fileName is {BiometricInfo.js}')
			});
	};
	const handleCloseModal = async () => {
		setModalIsVisible(false);
	};

	return (
		<>
			{props?.formPayload?.['biometricInfo']?.prisonerGallery?.length && (
			<PrisonerGallery showModal={showModal} setShowModal={setShowModal}  viewDoc={props?.formPayload?.['biometricInfo']?.prisonerGallery}/>
			)} 
			<div className='tabs-wraper'>
				{!props.isVisitor && (
					<ul className='custom-nav tabs-style'>
						{/* if prison only */}
						{!props.isDarban && !props.isEmployee && (
							<TabButton step={1} progress={'14.2'} title={'Prisoner Info'} props={props} />
						)}
						<TabButton step={props.isEmployee ? 1 : 2} progress={props.isEmployee ? '20' : '28.4'} title={'Basic Information'} props={props} />
						{/* employee only */}
						{props.isEmployee && (
							<TabButton step={2} progress={'40'} title={'User Information'} props={props} />
						)}
						{/* employee or prisoner */}
						{!props.isDarban && (
							<>
								{!props.isEmployee && (
									<TabButton step={3} progress={'42.6'} title={'Professional Information'} props={props} />
								)}
								<TabButton active={'active'} step={props.isEmployee ? 3 : 4} progress={props.isEmployee ? '60' : '58.6'} title={'Bio Metric Information'} props={props} />
								<TabButton step={props.isEmployee ? 4 : 5} progress={props.isEmployee ? '80' : '71'} title={'Contact Information'} props={props} />
								{!props.isEmployee && (
									<>
										<TabButton step={6} progress={'85.2'} title={'Prisoner Info'} props={props} />
									</>
								)}
								{props.isEmployee && (
									<TabButton step={5} progress={'100'} title={'Employee Information'} props={props} />
								)}

							</>
						)}
					</ul>
				)}
				<div className='tabs-panel'>
					<div className='row bio-heading-panel' style={{"justifyContent": "space-between"}}>
						<h4 className='third-heading bio-title' style={{display: "inline-block",width: "auto"}}>{props.title}</h4>
						<a className="bio-view-gallery" style={{textAlign: "right",width: "auto",padding: "20px", fontSize: "15px", cursor: "pointer"}} onClick={()=>{setShowModal(!showModal)}}>View Gallery</a>
					</div>
					{props.isPrisoner && (
						<div className='row d-flex  just-space'>
							<div className='col-lg-3 grid just-center'>
								<h4 className='sub-heading mb-3 heading-height'>
									Right Thumb (دائیں انگوٹھے)
								</h4>
								{props?.formPayload?.biometricInfo?.rightThumbImg ?
									(<>
										<div className='finger-print-thumb'>
											<img src={`${baseImageUrl}${props?.formPayload?.biometricInfo?.rightThumbImg}`} />
											<button

												type='button'
												class='btn btn-prim waves-effect waves-light finger-icon'
												onClick={() => {
													setModalIsVisible(true)
													setFingerIndex('right thumb')
												}}
											>
												<i
													dangerouslySetInnerHTML={{
														__html: SVGS.fingerprint
													}}
												></i>
												<span>Recapture</span>
											</button>
										</div>
									</>)
									:
									(<>
										<InputWidget
											id={'right-thumb'}
											type={'fingerPrint'}
											inputType={'file'}
											require={false}
											Photo={ProfilePic}
											setValue={value => { }}
											triggerFingerModal={async () => {
												setModalIsVisible(true)
												setFingerIndex('right thumb')
											}}
										/>
									</>)}
							</div>
							<div className='col-lg-3 grid just-center'>
								<h4 className='sub-heading heading-height mb-3'>
									Left Thumb (بائیں انگوٹھے)
								</h4>
								{props?.formPayload?.biometricInfo?.leftThumbImg ?
									(<>
									<div className='finger-print-thumb'>
										<img  src={`${baseImageUrl}${props?.formPayload?.biometricInfo?.leftThumbImg}`} />
										<button
											
											type='button'
											class='btn btn-prim waves-effect waves-light finger-icon'
											onClick={() => {
												setModalIsVisible(true)
												setFingerIndex('left thumb')
											}}
										>
											<i
												dangerouslySetInnerHTML={{
													__html: SVGS.fingerprint
												}}
											></i>
											<span>Recapture</span>
										</button>
										</div>
									</>)
									:
									(<>
										<InputWidget
											id={'left-thumb'}
											type={'fingerPrint'}
											inputType={'file'}
											require={false}
											Photo={ProfilePic}
											setValue={value => { }}
											triggerFingerModal={async () => {
												setModalIsVisible(true)
												setFingerIndex('left thumb')
											}}
										/>
									</>)}

							</div>
							<div className='col-lg-3 grid just-center'>
								<h4 className='sub-heading heading-height mb-3'>
									Right Index Finger (دائیں شہادت کی انگلی)
								</h4>
								{props?.formPayload?.biometricInfo?.rightIndexImg ?
									(<>
									<div className='finger-print-thumb'>
										<img  src={`${baseImageUrl}${props?.formPayload?.biometricInfo?.rightIndexImg}`} />
										<button
											
											type='button'
											class='btn btn-prim waves-effect waves-light finger-icon'
											onClick={() => {
												setModalIsVisible(true)
												setFingerIndex('right index')
											}}
										>
											<i
												dangerouslySetInnerHTML={{
													__html: SVGS.fingerprint
												}}
											></i>
											<span>Recapture</span>
										</button>
										</div>
									</>)
									:
									(<>
										<InputWidget
											id={'right-index'}
											type={'fingerPrint'}
											inputType={'file'}
											require={false}
											Photo={ProfilePic}
											setValue={value => { }}
											triggerFingerModal={async () => {
												setModalIsVisible(true)
												setFingerIndex('right index')
											}}
										/>
									</>)}
							</div>
							<div className='col-lg-3 grid just-center'>
								<h4 className='sub-heading heading-height mb-3'>
									Left Index Finger (بائیں شہادت کی انگلی)
								</h4>
								{props?.formPayload?.biometricInfo?.leftIndexImg ?
									(<>
									<div className='finger-print-thumb'>
										<img  src={`${baseImageUrl}${props?.formPayload?.biometricInfo?.leftIndexImg}`} />
										<button
											
											type='button'
											class='btn btn-prim waves-effect waves-light finger-icon'
											onClick={() => {
												setModalIsVisible(true)
												setFingerIndex('left index')
											}}
										>
											<i
												dangerouslySetInnerHTML={{
													__html: SVGS.fingerprint
												}}
											></i>
											<span>Recapture</span>
										</button>
										</div>
									</>)
									:
									(<>
										<InputWidget
											id={'left-index'}
											type={'fingerPrint'}
											inputType={'file'}
											require={false}
											Photo={ProfilePic}
											setValue={value => { }}
											triggerFingerModal={async () => {
												setModalIsVisible(true)
												setFingerIndex('left index')
											}}
										/>
									</>)}

							</div>
						</div>
					)}
					<div className='row mt-4'>
						<div className='row d-flex just-center'>
							<div className='d-flex flex-column justify-content-center align-items-center'>
							<div className='col-lg-3'>
								<h4 className='sub-heading heading-height text-center just-center mb-3'>
									Front Picture سامنے کی تصویر
								</h4>
								<InputWidget
									id={'front-pic'}
									type={'editImage'}
									inputType={'file'}
									upload={'icon-upload'}
									take={'icon-photographer'}
									allowCompression={true}
									require={false}
									Photo={
										props.formPayload.biometricInfo &&
											props.formPayload.biometricInfo.frontPic
											? baseImageUrl + props.formPayload.biometricInfo
												.frontPic
											: ProfilePic
									}
									setValue={value => {
										handleFrontUpload(value);
									}}
								/>
							</div>
							{props.isEmployee && (
								<span className="text-danger fw-bold mt-2">Note: This is the file photo and should be the one with single background color. Please do not upload any fancy photos.</span>
							)}
							</div>
							{props.isPrisoner && (
								<>
									<div className='col-lg-3'>
										<h4 className='sub-heading text-center just-center mb-3'>
											Right Picture دائیں طرف کی تصویر
										</h4>
										<InputWidget
											id={'right-pic'}
											type={'editImage'}
											upload={'icon-upload'}
											take={'icon-photographer'}
											allowCompression={true}
											inputType={'file'}
											label={'FrontPic'}
											require={false}
											Photo={
												props.formPayload.biometricInfo &&
													props.formPayload.biometricInfo
														.leftPic
													? baseImageUrl + props.formPayload
														.biometricInfo.leftPic
													: ProfilePic
											}
											setValue={value => {
												handleleftUpload(value);

											}}
										/>
									</div>
									<div className='col-lg-3'>
										<h4 className='sub-heading text-center just-center mb-3'>
											Left Picture بائیں طرف کی تصویر
										</h4>
										<InputWidget
											id={'left-pic'}
											type={'editImage'}
											upload={'icon-upload'}
											take={'icon-photographer'}
											allowCompression={true}
											inputType={'file'}
											label={'RightPic'}
											require={false}
											Photo={
												props.formPayload.biometricInfo &&
													props.formPayload.biometricInfo
														.rightPic
													? baseImageUrl + props.formPayload
														.biometricInfo.rightPic
													: ProfilePic
											}
											setValue={value => {
												handleRightUpload(value);

											}}
										/>
									</div>
								</>
							)}
						</div>
					</div>
					<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
						<button
							onClick={() => {
								props.previousStep();
								props.setProgress(props.isEmployee ? '40' : '42.6');
							}}
							type='button'
							className='btn rounded-pill w-lg btn-prim-off waves-effect waves-light'
						>
							<i className='icon-leftangle ml-2'></i> Back
						</button>
						{!props.isDarban && (
							<button
								id="next-btn"
								onClick={() => {
									props.nextStep();
									props.setProgress(props.isEmployee ? '80' : '71');
								}}
								type='button'
								className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
							>
								Next <i className='icon-rightangle ml-2'></i>
							</button>
						)}
						{props.isDarban && (
							<button
								id="add-darban-btn"
								onClick={props?.handleSubmit}
								className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
							>
								<i className='icon-add ml-2'></i> Add Darban
							</button>
						)}
					</div>
				</div>
			</div>
			{modalIsVisible && (
				<FingerScanner
					visible={modalIsVisible}
					title="Finger Print Scanner"
					onClose={handleCloseModal}
					fingerIndex={fingerIndex}
					scanType={'admission'}
					callBack={handleFingerPrintScan}
					ref={fingerScannerRef}
				/>
			)}
		</>
	);
};

export default BiometricInfo;
