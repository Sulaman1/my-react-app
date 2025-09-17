import React, { useEffect, useMemo, useState } from 'react';

import InputWidget from '../../../droppables/InputWidget';

import Photo from '../../../assets/images/users/1.jpg';


const AddAccount = props => {


  return (
    <>
    <div className="row p-2">
        <form className='col-lg-12  justify-content-center'>
          <div className='col-lg-12 '>
            <h5 className='third-heading'>Employee Information <label className='urdu-font'>(ملازم کی معلومات)</label></h5>
              <div className='row'>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'input'}
                    inputType={'name'}
                    label={'Employee Name'}
                    require={false}
                    icon={'icon-operator'}
                    setValue={value => {

                    }}

                  />
                </div>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'multiSelect'}
                    ismulti={false}
                    inputType={'select'}
                    label={'Designation'}
                    require={false}
                    icon={'icon-carporate'}
                    setValue={value => {

                    }}

                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'multiSelect'}
                    ismulti={false}
                    inputType={'select'}
                    label={'Deparment'}
                    require={false}
                    icon={'icon-building'}
                    setValue={value => {

                    }}

                  />
                </div>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'input'}
                    inputType={'email'}
                    label={'Office Eamil'}
                    require={false}
                    icon={'icon-email'}
                    setValue={value => {

                    }}

                  />
                </div>
              </div>

            </div>
            <div className='col-lg-12 '>
            <h5 className='third-heading'>Login Information <label className='urdu-font'>(لاگ ان معلومات)</label></h5>
              <div className='row'>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'input'}
                    inputType={'name'}
                    label={'User Name'}
                    require={false}
                    icon={'icon-operator'}
                    setValue={value => {

                    }}

                  />
                </div>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'multiSelect'}
                    ismulti={false}
                    inputType={'select'}
                    label={'Status'}
                    require={false}
                    icon={'icon-user'}
                    setValue={value => {

                    }}

                  />
                </div>

              </div>
              <div className='row'>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'input'}
                    inputType={'password'}
                    label={'Password'}
                    require={false}
                    icon={'icon-password'}
                    setValue={value => {

                    }}

                  />
                </div>

                <div className='col-lg-6'>
                  <InputWidget
                    type={'input'}
                    inputType={'password'}
                    label={'Confirm Password'}
                    require={false}
                    icon={'icon-password'}
                    setValue={value => {

                    }}

                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-6'>
                  <InputWidget
                    type={'multiSelect'}
                    ismulti={false}
                    inputType={'select'}
                    label={'Role'}
                    require={false}
                    icon={'icon-carporate'}
                    setValue={value => {

                    }}

                  />
                </div>



              </div>
              <div className='col-lg-12'>
                <InputWidget
                  id={'user'}

                  type={'textarea'}
                  inputType={'text'}
                  label={'Remarks '}

                  require={false}


                  setValue={value => {

                  }}
                  icon={'icon-chat'}
                />
              </div>
            </div>
            <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
            <button type="button" class="btn rounded-pill w-lg btn-warning waves-effect waves-light">Clear</button>
            <button type="button" class="btn rounded-pill w-lg btn-info waves-effect waves-light">Save</button>
          </div>
           </form>
           </div>
    </>
  );
};

export default AddAccount;
