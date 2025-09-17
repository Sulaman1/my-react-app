import React, { useCallback, useRef, useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../common/CanvasUtils';
import Select from 'react-select';
import { SVGS } from '../services/CustomIcons';
import swal from 'sweetalert';
import Photo from '../assets/images/users/1.jpg';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	useRouteMatch,
	Link
} from 'react-router-dom';
import AsyncSelect from 'react-select/async';

import FileUpload from '../common/FileUpload';
import { allLetter, validateNumber } from '../common/Helpers';
import { useDropzone } from 'react-dropzone';
import DragDrop from '../common/DragDrop';
import CaptureImageWidget from './widget-helpers/CaptureImage';
import { postData, uploadFileService } from '../services/request';
import Compressor from 'compressorjs';

// Image capture settings

const InputWidget = props => {

	const {clearAll, selectType} = props;
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		// Note how this callback is never invoked if drop occurs on the inner dropzone
		onDrop: files => props.handleFileUpload(files)
	});

	if (!props.defaultValue) {
	}
	const files = acceptedFiles.map(file => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));
	const [content, setContent] = useState(props?.content);
	var jiraEditor = null;

	const onJiraEditor_Loaded = editor => {
		jiraEditor = editor;
	};

	const onJIRAEditor_Change = editorContents => {
		setContent(editorContents.text);
		props.setContent(editorContents.html);
	};


	// image cropping
	const [imageSrc, setImageSrc] = useState(null);
	const [showWebCam, setShowWebCam] = useState(false);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [rotation, setRotation] = useState(0);
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	const [croppedImage, setCroppedImage] = useState(null);
	const [file, setFile] = useState('');
	const [cnic, setCnic] = useState(props?.defaultValue || '');
	const inputFileRef = useRef();
	const selectInputRef = useRef();

	const [passwordType, setPasswordType] = useState('password');
	const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);
	const [selectedMultiOption, setSelectedMultiOption] = useState('');
	const [isUpload, setIsUpload] = useState(false);

	useEffect(() => {
		if (clearAll) {
			resetAllFields()
		}
	},[clearAll])

	const resetAllFields = () => {
		setCnic('');
		
		setImageSrc(null);
		setCroppedImage('');
		
	}

	const onFileChangeCapture = async e => {
		console.log(e.target.files);
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const fileSize = Math.round((file.size / 1024));
			if (fileSize > 1048 ) {
				swal({
					title: "File size too large",
					text: "Please upload a file less than 1 MB",
					icon: "warning"
				})
				setImageSrc(null);
				return false;
			}
 			// compression needs to be done here 
			// compression if true flag is available
			if (props.allowCompression) {
				new Compressor(file, {
					quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
					success: async (compressedResult) => {
						// compressedResult has the compressed file.
						// Use the compressed file to upload the images to your server.   

						// setCompressedFile(compressedResult)
						let imageDataUrl = await readFile(compressedResult);
						setImageSrc(imageDataUrl);
					},
				});
			} else if (props.noCropping) {
				let imageDataUrl = await readFile(file);
				setCroppedImage(imageDataUrl)
				props.setValue(imageDataUrl);
			} else {
				let imageDataUrl = await readFile(file);
				setImageSrc(imageDataUrl);
			}

		}
	};

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const readFile = file => {
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.addEventListener(
				'load',
				() => resolve(reader.result),
				false
			);
			reader.readAsDataURL(file);
		});
	};

	const showCroppedImage = useCallback(async () => {
		try {
			const croppedImage = await getCroppedImg(
				imageSrc,
				croppedAreaPixels,
				rotation
			);
			console.log('donee', { croppedImage });
			setImageSrc('');
			setCroppedImage(croppedImage);
			props.setValue(croppedImage);
		} catch (e) {
			console.error(e);
		}
	}, [imageSrc, croppedAreaPixels, rotation]);

	const onBtnClick = () => {
		/*Collecting node-element and performing click*/
		inputFileRef.current.click();

	};

	const handleChangeValue = (e, value) => {
		let inputVal = value ? value : e.target.value;
		const englishNumbersAndSpecialRegex = /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/;

		if (props.onlyLetters) {
			// Filter out non-letter characters
			inputVal = inputVal.replace(/[^a-zA-Z\s]/g, '');
		} else if (props.onlyNumbers) {
			// Filter out non-number characters
			inputVal = inputVal.replace(/[^0-9]/g, '');
		}

		if (props.setValue) {
			if (props.setCapitalise) {
				inputVal = capitaliseText(inputVal);
			}
			if (!englishNumbersAndSpecialRegex.test(inputVal)) {
				inputVal = inputVal.replace(/[^a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
			}
			let val = props.inputType === 'number' ? parseInt(inputVal) : inputVal;
			props.setValue(val, e);
		}
	};
	const capitaliseText = inputVal => {
		const capitalise = inputVal.split(' ').map(word => {
			word = word.toLowerCase();
			return word.charAt(0).toUpperCase() + word.slice(1);
		});

		return capitalise.join(' ');
	};
	const handleFileUpload = async selectedFiles => {
		const images = [];
		if (selectedFiles.length > 0 && selectedFiles.length < 6) {
			const extraParams = props?.fileParams || null;
			setIsUpload(true);
			for (let index = 0; index < selectedFiles.length; index++) {
				let file = selectedFiles[index];
				// file.type provides the format type of file which needs to be checked via the props
				if (props.allowedFileFormat.indexOf(file.type) > -1) {
					extraParams['name'] = file.name;
					const fileResult = await uploadFileService(
						file,
						'/services/app/BasicInfo/UploadFile',
						extraParams
					);
					if (!fileResult) {
						alert('Please upload a valid file');
						setIsUpload(false);
						return false;
					}
					images.push(fileResult);
				} else {
					alert('supported files are ' + props.allowedFileFormat.toString())
				}

			}
			setIsUpload(false);
			if (props.setValue) {
				props.setValue(images);
			}
			//setImageSrcs(images);
			//const tour = { ...tourPreview };
			//tour['image'] = images[0];
			//setTourPreview(tour);
		} else {
			setIsUpload(false);
			// alert('max files selection is 5');
			swal({
				button: true,
				icon: 'error',
				text: 'max files selection is 5',
				timer: 2500
			});
		}
	};

	const handleCnic = event => {
		// Only allow numbers
		let value = event.target.value.replace(/[^\d-]/g, '');
		
		// Remove existing dashes
		let numbers = value.replace(/-/g, '');
		
		// Limit to 13 digits
		if (numbers.length <= 13) {
			// Format with dashes
			let formattedValue = numbers;
			if (numbers.length > 5) {
				formattedValue = numbers.slice(0, 5) + '-' + numbers.slice(5);
			}
			if (numbers.length > 12) {
				formattedValue = formattedValue.slice(0, 13) + '-' + formattedValue.slice(13);
			}
			
			setCnic(formattedValue);
			if (props.setValue) {
				props.setValue(formattedValue);
			}
		}
	};

	const handleBlurValue = e => {
		if (props.enableBlur && props.apiURL) {
			props.blurCallBack(e.target.value)
		} else if (props.enableBlur) {
			if (!e.target.value) return;
			postData(
				'/services/app/EmployeeAppServices/CheckUserNameOrEmail?userNameOrEmail=' +
				e.target.value,
				{}
			)
				.then(res => {
					if (res.error && res.error.message) {
						swal(
							'Email or Username already exists!',
							'',
							'warning'
						);
					}
				})
				.catch(err => {
					console.log(err)
				});
		} else {
			return true;
		}
	};

	return (
		<>
			{props.type === 'textarea' && (
				<div className={`inputs  ${props.readOnly ? 'read-only' : ''}`}>
					{props.icon && <i className={props.icon}></i>}
					<textarea
						required={props.require}
						type={props.inputType || 'text'}
						className={`${props.id} `}
						id={props.id}
						value={props.defaultValue}
						spellCheck='false'
						onChange={handleChangeValue}
						readOnly={props.readOnly}
						name={props.name}
					></textarea>
					<label htmlFor='name'>
						{props.label}{' '}
						{props.require && <em className='text-red-400'>*</em>}
					</label>
				</div>
			)}

			{props.type === 'drag' && (
				<>
					<DragDrop handleFileUpload={handleFileUpload} />
					{isUpload && (
						<div>
							Uploading files.Please wait till this message
							disappear
						</div>
					)}
				</>
			)}

			{props.type === 'password' && (
				<div
					className={`inputs ${props.readOnly ? 'read-only' : ''

						}`

					}
				>
					{props.icon && <i className={props.icon}></i>}

					<input
						ref={inputElement => {
							// constructs a new function on each render
							if (inputElement && props.autoFocus) {
								//inputElement.focus();
								props.autoFocus(inputElement)
							}
						}}
						required={props.require}
						type={passwordType}
						className={`${props.id} `}
						id={props.id}
						value={props.defaultValue}
						spellCheck='false'
						onChange={handleChangeValue}
						readOnly={props.readOnly}
						onBlur={handleBlurValue}
						name={props.name}
					/>
					<label htmlFor='name'>
						{props.label}{' '}
						{props.require && <em className='text-red-400'>*</em>}
					</label>
					<i
						className='show-password align-center gap-10'
						onClick={() => {
							passwordType === 'password'
								? setPasswordType('text')
								: setPasswordType('password');
						}}
					>
						<label class='switch s-0' style={{ display: 'block' }}>
							<input
								id='tools'
								type='checkbox'
								name='fulfil_documents'
								onclick='switchOne()'
								value='1'
							/>
							<span
								class={
									passwordType === 'password'
										? 'icon-show-password'
										: 'icon-hide-password'
								}
							></span>
						</label>
					</i>
				</div>
			)}
			{props.type === 'input' && (
				<div
					className={`inputs   ${props.forceActive ? 'force-active' : ''
						} ${props.readOnly ? 'read-only' : ''} `}
				>
					{props.icon && <i className={props.icon}></i>}

					<input
						ref={inputElement => {
							// constructs a new function on each render
							if (inputElement && props.autoFocus) {
								props.autoFocus(inputElement)
							}
						}}
						required={props.require}
						type={props.inputType || 'text'}
						className={`${props.id} `}
						id={props.id}
						value={props.defaultValue}
						maxlength={props.maxlength}
						pattern={props.pattern}
						min={props?.inputType == "number" ? 0 : props?.min}
						spellCheck='false'
						onChange={handleChangeValue}
						readOnly={props.readOnly}
						onBlur={handleBlurValue}
						name={props.name}
						placeholder={props.placeholder}
					/>
					<label htmlFor='name'>
						{props.label}{' '}
						{props.require && <em className='text-red-400'>*</em>}
					</label>
				</div>
			)}
			
			{props.type === 'cnic' && (
				<div className={`inputs ${props.readOnly ? 'read-only' : ''}`}>
					{props.icon && <i className={props.icon}></i>}
					<input
						required={props.require}
						type={'text'}
						className={`${props.id} `}
						id={props.id}
						value={props?.defaultValue || cnic}
						spellCheck='false'
						maxlength='15'
						onChange={handleCnic}
						readOnly={props.readOnly}
						name={props.name}
					/>
					<label htmlFor='name'>
						{props.label}{' '}
						{props.require && <em className='text-red-400'>*</em>}
					</label>
				</div>
			)}

			{props.type === 'date' && (
				<div className={`inputs ${props.readOnly ? 'read-only' : ''}`}>
					<i></i>
					<input
						required={props.require}
						type={'date'}
						className={`${props.id} `}
						id={props.id}
						value={props.defaultValue}
						onChange={handleChangeValue}
						readOnly={props.readOnly}
						name={props.name}
					/>
					<label htmlFor='name'>
						{props.label}{' '}
						{props.require && <em className='text-red-400'>*</em>}
					</label>
				</div>
			)}

			{props.type === 'simpleFile' && (
				<FileUpload
					required={props.require}
					setContent={props.setValue}
					setSetDisabled={props.setSetDisabled}
				/>
			)}

			{props.type === 'croppedImage' && (
				<>
					<div className='edit-profile  '>
						<div
							className='profile d-flex just-center '
							exact
							to='/admin/dashboard/'
							activeClassName='active'
						>
							<div className='pic rel'>
								<button
									type='button'
									data-title='Register'
									onClick={onBtnClick}
									className='abs edit-btn edit-btn-fin r-0 b-0 tooltip'
								>
									<i></i>
									<span className='toptip-right'>
										upload Photo
									</span>
									<input
										className='hide'
										type='file'
										ref={inputFileRef}
										onChangeCapture={onFileChangeCapture}
									/>
								</button>
								<img
									src={
										croppedImage
											? croppedImage
											: props.Photo
									}
									alt='photo'
								/>
							</div>
						</div>
					</div>
				</>
			)}

			{props.type === 'editImage' && (
				<>
					<div className='edit-profile  '>
						<div
							className='profile d-flex just-center '
							exact
							to='/admin/dashboard/'
							activeClassName='active'
						>
							<div>
								<div className='pic rel'>
									<img
										src={
											croppedImage
												? croppedImage
												: props.Photo
										}
										alt='photo'
									/>
								</div>

								<div class='btns'>
									{(props.take && !props.onlyUploadFile) && (
										<button
											id={'capture-btn-one'}
											type='button'
											class='btn  btn-prim waves-effect waves-light'
											onClick={() => {
												setShowWebCam(true);
											}}
										>
											<i className={props.take}></i>
											<span>Capture</span>
										</button>
									)}
									{props.upload && (
										<button
											id={'upload-btn-one'}
											onClick={onBtnClick}
											type='button'
											class='btn  btn-prim waves-effect waves-light'
										>
											<i className={props.upload}></i>{' '}
											<span>Upload</span>
											<input
												className='hide'
												type='file'
												ref={inputFileRef}
												onChangeCapture={
													onFileChangeCapture
												}
											/>
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
			{props.type === 'fingerPrint' && (
				<>
					<div className='finger-print' onClick={() => { props.triggerFingerModal() }}>
						<div
							className='profile '
							exact
							to='/admin/dashboard/'
							activeClassName='active'
						>

							<button
								type='button'
								data-title='Register'
								className='abs edit-btn edit-btn-fin r-0 b-0 tooltip'
								style={{ "zindex": "-1" }}
							>
								<i></i>
								{/* <span className='toptip-right'>
										upload Photo
									</span> */}
								{/* <input
										className='hide'
										type='file'
										ref={inputFileRef}
										onChangeCapture={onFileChangeCapture}
									/> */}
							</button>
							<i
								dangerouslySetInnerHTML={{
									__html: SVGS.fingerprint
								}}
							></i>

						</div>
					</div>
				</>
			)}

			{props.type === 'asyncSelect' && (
				<div
					className={`select ${(props.defaultValue &&
							props.defaultValue.length !== 0) ||
							isMultiSelectOpen ||
							selectedMultiOption
							? 'select-open'
							: 'select-close'
						}`}
				>
					{props.icon && <i className={props.icon}></i>}
					<AsyncSelect
						isMulti={true}
						isClearable={false}
						getOptionLabel={props?.getOptionLabel}
						id={props.id}
						isDisabled={props.isDisabled || false}
						name={props.name}
						classNamePrefix={'my-custom-react-select'}
						placeholder=''
						value={props?.defaultValue ?? selectedMultiOption}
						onChange={selectedMultiOption => {
							setSelectedMultiOption(selectedMultiOption);
							props.setValue(selectedMultiOption);
						}}
						defaultOptions={props.options}
						options={props.options}
						loadOptions={props.loadOptions}
						required
						spellCheck='false'
						onMenuOpen={() => {
							setIsMultiSelectOpen(true);
						}}
						onMenuClose={() => {
							setIsMultiSelectOpen(false);
						}}
					/>
					<label htmlFor='name'>
						{props.label}{' '}
						{props.require && <em className='text-red-400'>*</em>}
					</label>
				</div>
			)}

{props.type === 'multiSelect' && (
				<div
					className={`select ${(props.defaultValue &&
							props.defaultValue.length !== 0) ||
							isMultiSelectOpen ||
							selectedMultiOption
							? 'select-open'
							: 'select-close'
						}`}
				>
					{props.icon && <i className={props.icon}></i>}
					{props.imgIcon && <i style={{top: "10px"}} ><img src={props.imgIcon} alt="icon" width="20px" height="20px" /></i>}
					<Select
						// ref={selectType === 'relation' ? selectInputRef : null }
						isMulti={props.isMulti}
						isClearable={props?.isClearable}
						getOptionLabel={props?.getOptionLabel}
						id={props.id}
						isDisabled={props.isDisabled || false}
						name={props.name}
						classNamePrefix={'my-custom-react-select'}
						placeholder=''
						value={props.defaultValue ?? selectedMultiOption}
						onChange={selectedMultiOption => {
							setSelectedMultiOption(selectedMultiOption);
							props.setValue(selectedMultiOption);
						}}
						options={props.options}
						spellCheck='false'
						onMenuOpen={() => {
							setIsMultiSelectOpen(true);
						}}
						onMenuClose={() => {
							setIsMultiSelectOpen(false);
						}}
					/>
					<label htmlFor='name'>
						{props.label}{' '}
						{props.require && <em className='text-red-400'>*</em>}
					</label>
				</div>
			)}

			{props.type === 'switch' && (
				<div className='switch-btn align-center gap-10'>
					<label class='switch s-0'>
						<input
							id={props.id}
							name={props.name}
							type='checkbox'
							disabled={props.disabled}
							checked={props.defaultValue}
							onChange={e => {
								props.setValue(e.target.checked);
							}}
						/>
						<span class='slider'></span>
					</label>
					<p className='text-left pera'>{props.label}</p>
				</div>
			)}
			{props.type === 'checkbox' && (
				<div className='switch-btn align-center gap-10'>
					<label class='switch s-0'>
						<input
							id={props.id}
							name={props.name}
							type='checkbox'
							checked={props.defaultValue}
							onChange={e => {
								props.setValue(e.target.checked);
							}}
						/>
						<span class='checkmark'></span>
					</label>
					<p className='text-left pera'>{props.label}</p>
				</div>
			)}
			{/* connected to drag and drop component */}
			{imageSrc && (
				<div className='overlay'>
					<div className='popup'>
						<div className='modal-header'>
							<h3 className='third-heading bold text-center'>
								Crop Image
							</h3>

							<button
								type='button'
								onClick={() => setImageSrc('')}
								class='btn  btn-soft-info waves-effect waves-light btn-close'
							>
								
							</button>
						</div>
						<div
							style={{ position: 'relative', minHeight: '360px' }}
						>
							<Cropper
								image={imageSrc}
								crop={crop}
								rotation={rotation}
								zoom={zoom}
								aspect={4 / 4}
								onCropChange={setCrop}
								onRotationChange={setRotation}
								onCropComplete={onCropComplete}
								onZoomChange={setZoom}
							/>
						</div>
						<div className='mt-4 mb-4 d-flex  justify-content-center gap-2'>
							<button
								type='button'
								onClick={showCroppedImage}
								className='btn rounded-pill w-lg btn-prim waves-effect waves-light'
							>
								<i className='icon-file ml-2'></i> Save Image
							</button>
						</div>
					</div>
				</div>
			)}

			{showWebCam && (
				<CaptureImageWidget
					setValue={props.setValue}
					setCroppedImage={setCroppedImage}
					setShowModal={() => {
						setShowWebCam(false);
					}}
				/>
			)}
		</>
	);
};

export default InputWidget;
