import React from 'react';
import { transfromStringArray } from '../../../common/Helpers';
import { TabButton } from '../../../common/TabButton';
import InputWidget from '../../../droppables/InputWidget';

const ProfessionalInfo = props => {
    return (
        <>
            <div className='tabs-wraper '>
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
                                    <TabButton active={'active'} step={3} progress={'42.6'} title={'Professional Information'} props={props} />
                                )}
                                <TabButton step={props.isEmployee ? 3 : 4} progress={props.isEmployee ? '60' : '58.6'} title={'Bio Metric Information'} props={props} />
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
                    <div className='row'>
                        <h4 className='third-heading'>{props.title}</h4>
                    </div>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <InputWidget
                                type={'multiSelect'}
                                isMulti={false}
                                inputType={'select'}
                                label={'Occupation (پیشہ)'}
                                id={'occupation'}
                                require={false}
                                icon={'icon-remission'}
                                options={props?.lookUps?.occupation || []}
                                defaultValue={
                                    transfromStringArray(
                                        props?.lookUps?.occupation,
                                        props?.formPayload?.professionalInfo
                                            ?.occupationId
                                    ) || []
                                }
                                setValue={value => {
                                    const payload = {
                                        ...props.formPayload,
                                    };
                                    payload['professionalInfo']['occupationId'] = value.value;
                                    props.setFormPayload(payload);
                                }}
                            />
                        </div>
                        <div className='col-lg-6'>
                            <InputWidget
                                type={'multiSelect'}
                                isMulti={false}
                                inputType={'select'}
                                label={'Formal Education (ریگولر تعلیم)'}
                                id={'formal-education'}
                                require={false}
                                icon={'icon-remission'}
                                options={props?.lookUps?.formal || []}
                                defaultValue={
                                    transfromStringArray(
                                        props?.lookUps?.formal,
                                        props?.formPayload?.professionalInfo
                                            ?.formalEducationId
                                    ) || []
                                }
                                setValue={value => {
                                    const payload = {
                                        ...props.formPayload,
                                    };
                                    payload['professionalInfo']['formalEducationId'] = value.value;
                                    props.setFormPayload(payload);
                                }}
                            />
                        </div>
                        <div className='col-lg-6'>
                            <InputWidget
                                type={'multiSelect'}
                                isMulti={false}
                                inputType={'select'}
                                label={'Religious Education (مذہبی تعلیم)'}
                                id={'religious-education'}
                                require={false}
                                icon={'icon-remission'}
                                options={props?.lookUps?.religious || []}
                                defaultValue={
                                    transfromStringArray(
                                        props?.lookUps?.religious,
                                        props?.formPayload?.professionalInfo
                                            ?.religiousEducationId
                                    ) || []
                                }
                                setValue={value => {
                                    const payload = {
                                        ...props.formPayload,
                                    };
                                    payload['professionalInfo']['religiousEducationId'] = value.value;
                                    props.setFormPayload(payload);
                                }}
                            />
                        </div>
                        <div className='col-lg-6'>
                            <InputWidget
                                type={'multiSelect'}
                                isMulti={false}
                                inputType={'select'}
                                label={'Techanical Education (تکنیکی تعلیم)'}
                                id={'techanical-education'}
                                require={false}
                                icon={'icon-remission'}
                                options={props?.lookUps?.techanical || []}
                                defaultValue={
                                    transfromStringArray(
                                        props?.lookUps?.techanical,
                                        props?.formPayload?.professionalInfo
                                            ?.technicalEducationId
                                    ) || []
                                }
                                setValue={value => {
                                    const payload = {
                                        ...props.formPayload,
                                    };
                                    payload['professionalInfo']['technicalEducationId'] = value.value;
                                    props.setFormPayload(payload);
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-4 mb-4 d-flex  justify-content-center gap-2">
                        <button
                            id="back-btn"
                            onClick={() => { props.previousStep(); props.setProgress("28.4") }} type="button" className='btn rounded-pill w-lg btn-prim-off waves-effect waves-light' >
                            <i className='icon-leftangle ml-2'></i> Back
                        </button>
                        <button
                            id="next-btn"
                            onClick={() => { props.nextStep(); props.setProgress("56.8") }} type='button' className='btn rounded-pill w-lg btn-prim waves-effect waves-light' >
                            Next  <i className='icon-rightangle ml-2'></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ProfessionalInfo;
