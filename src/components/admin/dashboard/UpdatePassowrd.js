import React, { useEffect } from 'react'
import { useState } from 'react'
import { Modal } from 'react-bootstrap';
import InputWidget from '../../../droppables/InputWidget';
import swal from 'sweetalert';
import { postData } from '../../../services/request';

const UpdatePassowrd = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState()
    const [payload, setPayload] = useState({
        employeeId: '',
        currentPassword: '',
        newPassword: ""
    })
    useEffect(() => {
        const LoggedInEmployeeInfo = JSON.parse(localStorage.getItem('LoggedInEmployeeInfo'))
        setIsNewUser(LoggedInEmployeeInfo)
        if (LoggedInEmployeeInfo?.isNew == true) {
            setIsOpen(true)
        }
    }, [])
    const hideModal = () => {
        setIsOpen(false);
    };
    const changePasswordHandler = event => {
        event.preventDefault();
        if (payload.currentPassword !== payload.newPassword) {
            return alert('Passwords do not match');
        }
        const storePayload = { newPassword: payload.newPassword, userId: isNewUser?.userId }



        postData('/services/app/EmployeeAppServices/ResetPassword', storePayload)
            .then(result => {
                if (result.success) {
                    const sessiondata = { ...isNewUser, isNew: false }
                    localStorage.setItem(
                        'LoggedInEmployeeInfo',
                        JSON.stringify(sessiondata)
                    );
                    setIsOpen(false)
                    swal('Password changed', '', 'success').then(() => {
                        console.log('CHANGED PASSWORD ->', result);
                    });
                    
                } else {
                    swal('', result?.error?.message, 'error').then(() => {
                        console.log('CHANGED PASSWORD ->', result);
                    });
                }

            })
            .catch(console.err);
    };

    return (
        <>
            {isOpen && (
                <Modal show={isOpen} onHide={hideModal} size="lg" backdrop="static" >
                    <Modal.Header closeButton style={{ padding: "1.25rem 1.25rem" }}>
                        <h5 class="modal-title" id="exampleModalgridLabel">
                            Change Password
                        </h5>
                    </Modal.Header>
                    <Modal.Body className='bg-white'>
                        <form>
                            <div>
                                <InputWidget
                                    type={'password'}
                                    name={'password'}
                                    icon={'icon-password'}
                                    label={'New password'}
                                    require={false}
                                    setValue={value => {
                                        setPayload((prve) => {
                                            return { ...prve, currentPassword: value }
                                        })
                                    }}
                                />
                            </div>
                            <div>
                                <InputWidget
                                    type={'password'}
                                    name={'password'}
                                    label={'Re-confirm new password'}
                                    icon={'icon-password'}
                                    setValue={value => {
                                        setPayload((prve) => {
                                            return { ...prve, newPassword: value }
                                        })
                                    }}
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div class='text-center'>
                            <button
                                onClick={changePasswordHandler}
                                type='submit'
                                class='btn btn-prim'
                            >
                                Update Password
                            </button>
                        </div>
                        <button
                            onClick={hideModal}
                            className="btn btn-danger"
                            id={"save-password"}
                        >
                            Cancel
                        </button>
                    </Modal.Footer>
                </Modal>)}
        </>
    )
}

export default UpdatePassowrd