import React, { useRef, useState } from 'react';
import swal from 'sweetalert';

const FileUpload = props => {
	const inputFileRef = useRef();
	const onBtnClick = () => {
		inputFileRef.current.click();
	};
	const uploadFile = ev => {
		props?.setSetDisabled(true);
		_handleImageUpload(ev).then(path => {
			props?.setContent(path);
			props?.setSetDisabled(false);
		});
	};

	const _handleImageUpload = async ev => {
		const reader = new FileReader();
		let file = ev.target.files[0];
		if (file && file.size / 1024 / 1024 > 5) {
			swal({
				button: true,
				icon: 'error',
				text: 'File size exceeds 5 MB',
				timer: 1500
			});
		} else {
			reader?.readAsDataURL(file);
		}
		try {
			const fileResult = await (file, '/data-entry/upload-gallery');
			return fileResult.image;
		} catch (e) {
			swal({
				button: true,
				icon: 'error',
				text: 'file upload error',
				timer: 1500
			});
		}
	};

	return (
		<>
			{props.custom ? (
				<button
					type='button'
					data-title='Register'
					className='abs edit-btn no-bg r-30 b-10 tooltip'
					onClick={onBtnClick}
				>
					<i></i>
					<span className='toptip-right'>upload cover</span>
					<input
						className='hide'
						type='file'
						ref={inputFileRef}
						onChangeCapture={uploadFile}
					/>
				</button>
			) : (
				<div className='inputs'>
					<i></i>
					<input
						required={props.required || false}
						type='file'
						className=''
						id='dtsDocument'
						spellCheck='false'
						onChange={uploadFile}
					/>
				</div>
			)}
		</>
	);
};

export default FileUpload;
