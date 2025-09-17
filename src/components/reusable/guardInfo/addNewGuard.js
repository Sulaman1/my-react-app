
import React from 'react';
import { Modal } from 'react-bootstrap';
import InputWidget from '../../../droppables/InputWidget';

const AddNewGuard = ({
	visible,
	onClose,
	formPayload,
	setFormPayload,
	onSubmit
}) => {
	const formContent = (
		<>
			<div className="col-lg-12">
				<InputWidget
					type={"input"}
					label={"Police Officer Name (پولیس افسر کا نا)"}
					id={"police-officer-name"}
					require={true}
					icon={"icon-operator"}
					defaultValue={formPayload?.policeOfficerName}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload["policeOfficerName"] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className="col-lg-12">
				<InputWidget
                    type={'input'}
                    label={'Designation'}
                    require={false}
					icon={'icon-operator'}
					defaultValue={formPayload?.designation}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload["designation"] = value;
						setFormPayload(payload);
					}}
                  />
				  </div>
			<div className="col-lg-12">
				<InputWidget
					type={"input"}
					label={"Belt Number (بیلٹ نمبر)"}
					id={"Belt-Number"}
					require={false}
					icon={"icon-number"}
					defaultValue={formPayload?.beltNo}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload["beltNo"] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
			<div className="col-lg-12">
				<InputWidget
					type={"input"}
					label={"cell No (سیل نمبر)"}
					id={"cell-No"}
					require={true}
					onlyNumbers={true}
					icon={"icon-number"}
					defaultValue={formPayload?.cellNo}
					setValue={(value) => {
						const payload = {
							...formPayload,
						};
						payload["cellNo"] = value;
						setFormPayload(payload);
					}}
				/>
			</div>
		</>
	);

	const handleClose = () => {
		onClose();
	};

	return (
		<Modal show={visible} onHide={handleClose} size="xl">
			<Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
				<h5 class="modal-title" id="exampleModalgridLabel">
					Information
				</h5>
			</Modal.Header>
			<Modal.Body>
				<form>
					<div className="row p-2">
						<div className="row">{formContent}</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button
					id={'cancel-btn'}
					className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
					onClick={handleClose}
				>
					Cancel
				</button>
				<button
					id={'save-btn'}
					className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
					onClick={onSubmit}
				>
					Save
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddNewGuard;
