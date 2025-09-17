import React, { useEffect, useState } from 'react';
import InputWidget from '../../droppables/InputWidget';
import { postData } from '../../services/request';
import swal from 'sweetalert';

const ChangePassword = (props) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [match, setMatch] = useState('');

    console.log(
        'LoggedInEmployee',
        JSON.parse(sessionStorage.getItem('LoggedInEmployeeInfo'))
    );
    useEffect(() => {

        if (props.employee) {
            const idNew = JSON.parse(sessionStorage.getItem('selectedEmp'))
            const getId = idNew.userId
            setUserId(getId)
        }

    },
    );

    const changePasswordHandler = event => {
        event.preventDefault();

        if (confirmPassword !== newPassword) {
            return alert('Passwords do not match');
        }

        postData('/services/app/User/ChangePassword', {
            currentPassword: oldPassword,
            newPassword
        })
            .then(result => {
                if (result.success) {
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

    const resetPasswordHandler = event => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            return alert('Passwords do not match');
        }

        postData('/services/app/User/ResetPassword',
            {
                userId,
                newPassword
            })
            .then(result => {
                if (result.success) {
                    swal('Password changed', '', 'success').then(() => {

                        console.log('CHANGED PASSWORD ->', result)
                        props.hide();
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

            {/* <div className='row'> */}
            {/* <div className='col-xxl-3'> */}

            <div className='card'>
                {!props.employee && (
                    <div className='card-header'>
                        <h5 className='text-left'>Change Password</h5>
                    </div>
                )}
                <div className='card-body p-4'>
                    {!props.employee && (<li >update password form</li>)}
                    <form onSubmit={props.employee ? resetPasswordHandler : changePasswordHandler}>
                        <div className='row'>
                            {!props.employee && (
                                <div className='col-lg-12'>
                                    <InputWidget
                                        type={'input'}
                                        inputType={'password'}
                                        label={'Old Password'}
                                        require={false}
                                        icon={'icon-password'}
                                        setValue={value => {
                                            setOldPassword(value);
                                        }}
                                    />
                                </div>
                            )}
                            <div className='col-lg-12'>
                                <InputWidget
                                    type={'input'}
                                    inputType={'password'}
                                    label={'New Password'}
                                    require={false}
                                    icon={'icon-password'}
                                    setValue={value => {
                                        setNewPassword(value);
                                    }}
                                />
                            </div>
                            <div className='col-lg-12'>
                                <InputWidget
                                    type={'input'}
                                    inputType={'password'}
                                    label={'Confirm Password'}
                                    require={false}
                                    icon={'icon-password'}
                                    setValue={value => {
                                        if (
                                            !!match &&
                                            value === newPassword
                                        ) {
                                            setMatch('');
                                        }
                                        if (
                                            !match &&
                                            value !== newPassword
                                        ) {
                                            setMatch(
                                                'Passwords do not match'
                                            );
                                        }
                                        setConfirmPassword(value);
                                    }}
                                />
                            </div>
                            {!!match && (
                                <p
                                    style={{
                                        color: 'red',
                                        margin: '10px'
                                    }}
                                >
                                    {match}
                                </p>
                            )}
                        </div>
                        <div class='col-lg-12'>
                            <div class='text-center'>
                                <button
                                    type='submit'
                                    class='btn btn-prim'
                                >
                                    {props.employee ? (<text>Reset Password</text>) : (<text>Change Password</text>)}
                                </button>
                            </div>
                        </div>
                    </form>
                    {/* end */}
                </div>
            </div>

        </>
    );
};

export default ChangePassword;
