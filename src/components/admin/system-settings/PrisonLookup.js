import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import nodataImage from "../../../assets/images/1.jpg";
import {
    transformDataForTableGrid,
    transformData,
    validateDate
} from '../../../common/Helpers';
import {
    deleteLookupData,
    onLoadData,
    postAdd,
    onLoadDropData
} from '../../../store/lookups';
import Modal from 'react-bootstrap/Modal';
import InputWidget from '../../../droppables/InputWidget';
import { deleteLookupName, lookupName, saveLookupName } from './lookupNames';
import swal from 'sweetalert';
import { getData } from '../../../services/request';
import Print from '../search/Print';
import AddressLookup from './addressLookup';
import ShowNoOfRecords from '../../../common/ShowNoOfRecords';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
/*
- api call and dynamics of the call for lookup data
- 
*/
const PrisonLookup = props => {
    const { search, pathname } = useLocation();
    const tp = pathname.split('/');
    const type = tp[tp.length - 1];
    const lookupData = new URLSearchParams(search).get('filter');
    const lookupId = new URLSearchParams(search).get('id');
    const lookupDataTwo = new URLSearchParams(search).get('filterTwo');
    const lookupIdTwo = new URLSearchParams(search).get('idTwo');
    const lookupDataThree = new URLSearchParams(search).get('filterThree');
    const lookupIdThree = new URLSearchParams(search).get('idThree');
    const lookupDataFour = new URLSearchParams(search).get('filterFour');
    const lookupIdFour = new URLSearchParams(search).get('idFour');
    const lookupDataFive = new URLSearchParams(search).get('filterFive');
    const lookupIdFive = new URLSearchParams(search).get('idFive');
    const [pageLimit, setPageLimit] = useState(10);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleEditBtn = async (item, event) => {
        let firsDropDown = "";
        let secondDropDown = "";
        let thirdDropDown = "";
        let fourthDropDown = "";
        let fifthDropDown = "";

        const { result } = await getData(
            '/services/app/PrisonLkpt/GetOnePrison?input=' +
            item.id
        );
        const { data } = result
        const pl = {
            ...item
        };
        pl['addressObj'] = data?.address;
        if (lookupId) {
            firsDropDown = dropDownData.filter(ele => ele['id'] === data[lookupId])[0]
            pl['lookup'] = { value: firsDropDown?.id, label: firsDropDown?.name }
        }
        if (lookupIdTwo) {
            secondDropDown = dropDownDataTwo.filter(ele => ele.id === data?.address[lookupIdTwo])[0]
            pl['lookupTwo'] = { value: secondDropDown?.id, label: secondDropDown?.name }
        }

        if (lookupIdThree) {
            thirdDropDown = dropDownDataThree.filter(ele => ele.id === data.address[lookupIdThree])[0]
            pl['lookupThree'] = { value: thirdDropDown?.id, label: thirdDropDown?.name }
        }
        if (lookupIdFour) {
            fourthDropDown = dropDownDataFour.filter(ele => ele.id === data.address[lookupIdFour])[0]
            pl['lookupFour'] = { value: fourthDropDown?.id, label: fourthDropDown?.name }
        }
        if (lookupIdFive) {
            fifthDropDown = dropDownDataFive.filter(ele => ele.id === data.address[lookupIdFive])[0]
            pl['lookupFive'] = { value: fifthDropDown?.id, label: fifthDropDown?.name }
        }
        pl['prisonTypeId'] = data?.prisonTypeId;
        pl['capacity'] = data?.capacity;
        pl['establishedDate'] = data?.establishedDate;
        setPayload(pl);
        showModal();
    };
    const handleDelBtn = (item, event) => {
        swal({
            title: 'Are you sure?',
            text: 'You want to delete: ' + item.name,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async willDelete => {
            if (willDelete) {
                dispatch(deleteLookupData(deleteLookupName[type], item.id));
                swal('Deleted!', '', 'success').then(result => {
                    dispatch(onLoadData(lookupName[type]));
                });
            }
        });
    };
    const countryData = useSelector(state => {
        const filterdData = state?.lookups?.countries.map(e => {
            return {
                name: e.name,
                address: e.addressString,
                'Type of Prsion': e.prisonType,
                description: e.description,
                capacity: e?.capacity,
                "Established on": validateDate(e?.establishedDate),
                Action: _(
                    <div className='action-btns just-center'>
                        <button
                            type='button'
                            onClick={() => {
                                handleEditBtn(e);
                            }}
                            class='btn btn-warning waves-effect waves-light mx-1'
                        >
                            <i class='icon-edit'></i>
                        </button>
                    </div>
                )
            };
        });
        return filterdData;
    });
    const dropDownData = useSelector(state => {
        return state?.lookups?.lookupData[lookupData]
    });
    const dropDownDataTwo = useSelector(state => {
        return state?.lookups?.lookupData[lookupDataTwo]
    });
    const dropDownDataThree = useSelector(state => {
        return state?.lookups?.lookupData[lookupDataThree]
    });
    const dropDownDataFour = useSelector(state => {
        return state?.lookups?.lookupData[lookupDataFour]
    });
    const dropDownDataFive = useSelector(state => {
        return state?.lookups?.lookupData[lookupDataFive]
    });

    const [payload, setPayload] = useState({});
    const [isOpen, setIsOpen] = React.useState(false);
    // const params = useParams();


    const gridRef = useRef();
    const dispatch = useDispatch();
    const filterType = [
        { value: 5, label: 5 },
        { value: 10, label: 10 },
        { value: 20, label: 20 },
        { value: 50, label: 50 }
    ];

    console.log('LOOKUP TYPE =', type);

    useEffect(() => {
        dispatch(onLoadData(lookupName[type]));
        if (lookupData) {
            dispatch(onLoadDropData(lookupName[lookupData], lookupData));
        }
        if (lookupDataTwo) {
            dispatch(onLoadDropData(lookupName[lookupDataTwo], lookupDataTwo));
        }

        if (lookupDataThree) {
            dispatch(onLoadDropData(lookupName[lookupDataThree], lookupDataThree));
        }
        if (lookupDataFour) {
            dispatch(onLoadDropData(lookupName[lookupDataFour], lookupDataFour));
        }
        if (lookupDataFive) {
            dispatch(onLoadDropData(lookupName[lookupDataFive], lookupDataFive));
        }

        // const addressType = [
        //     {name: "country", id: "countryId"}, 
        //     { name: "district", id: "districtId"}, 
        //     {name: "province", id: "provinceId"}, 
        //     {name: "city", id: "cityId"}, 
        // ];


    }, [dispatch]);

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const handleSave = event => {
        event.preventDefault();
        const stPayload = {
            "name": payload.name,
            "description": payload.description,
            "address": {
                "countryId": payload.countryId,
                "cityId": payload.cityId,
                "streetAddress": payload.street
            },
            "prisonTypeId": payload.prisonTypeId,
        }
        
        if(validatePayload(stPayload)) {
           
            if (!stPayload?.address?.cityId && payload?.addressObj?.cityId) {
                stPayload['address']['cityId'] = payload.addressObj.cityId;
            }
            if (!stPayload?.address?.streetAddress && payload?.addressObj?.streetAddress) {
                stPayload['address']['streetAddress'] = payload.addressObj.streetAddress;
            }
            if (payload.id) {
                stPayload['id'] = payload.id;
                stPayload['address']['id'] = payload.addressObj.id;
            }
            stPayload['prisonTypeId'] = payload.prisonTypeId;
            stPayload['capacity'] = payload.capacity;
            stPayload['establishedDate'] = payload.establishedDate;

            if (payload.lookup) {
                delete payload.lookup
            }
            if (payload.lookupTwo) {
                delete payload.lookupTwo
            }

            if (payload.lookupThree) {
                delete payload.lookupThree
            }
            if (payload.lookupFour) {
                delete payload.lookupFour
            }
            if (payload.lookupFive) {
                delete payload.lookupFive
            }
            if (payload.isPakistan) {
                delete stPayload.address.countryId
            } else {
                delete stPayload.address.cityId
            }

            dispatch(postAdd(saveLookupName[type], { data: stPayload }, hideModal));
            // hideModal();
            setTimeout(() => {
                dispatch(onLoadData(lookupName[type]));
                if (lookupData) {
                    dispatch(onLoadDropData(lookupName[lookupData]));
                }
            }, 2000);
        } else  {
            swal('please add all required fields', '', 'warning');
        } 
    };

    const validatePayload = (stPayload) => {
        let isValid = true;
        if(!stPayload.address.cityId || !stPayload.address.countryId) {
            isValid = false;
        } 
        if (payload?.addressObj?.cityId && payload?.addressObj?.countryId) {
            isValid = true;
        }
        return isValid;
    }

    const csvData = countryData.map(e => {
		const { Action, ...rest } = e;
		return rest;
	});
    const modifiedHeaders = ['Name', 'Address', 'Type of Prison', 'Description']

    return (
        <>
            <div className='row gridjs'>
                <div className='col-xl-12 p-0'>
                    <div className='card custom-card  custom-card-scroll p-3'>
                        <div className='row mt-2 '>
										<h2><b> Prisons</b></h2>
                          
							<div className='col' >
									<div className='row justify-content-between' style={{marginBottom: "-2rem"}}>
											<div className='d-flex justify-content-between'>
										<Print 
											data={transformDataForTableGrid(csvData)}
											headers={modifiedHeaders}
											filename={"system setting"}
										/>
										<button
											type='button'
											onClick={() => showModal()}
											class='btn btn-primary float-end'
											style={{height: "3rem", width: "4rem"}}
										>
											Add
										</button>
										</div>
									</div>

                                {countryData.length && (
                                    <>
                                    <div className='animation-fade-grids'>
									<div className="float-end">
                                    <ShowNoOfRecords setPageLimit={setPageLimit} />
                                    </div>
                                    <Grid
                                        ref={gridRef}
                                        data={transformDataForTableGrid(
                                            countryData
                                        )}
                                        columns={Object.keys(countryData[0])}
                                        search={true}
                                        sort={true}
                                        pagination={{
                                            enabled: true,
                                            limit: pageLimit,
                                        }}
                                    />
                                    </div>
                                    </>
                                )}

                                {!countryData.length && <div className='no-data'>
                                <img src={nodataImage} alt="" />
											<span>No data found</span>
										</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isOpen} onHide={hideModal} size="lg">
                <Modal.Header
                    closeButton
                    style={{ padding: '1.25rem 1.25rem' }}
                >
                    <h5 class='modal-title' id='exampleModalgridLabel'>
                        Prison Record
                    </h5>
                </Modal.Header>
                <Modal.Body>
                    <form className='col-lg-12  justify-content-center'>
                        <div class='row g-3'>
                            <div class='col-xxl-12'>
                                <div>
                                    <InputWidget
                                        type={'input'}
                                        inputType={'name'}
                                        label={'Name'}
                                        require={false}
                                        icon={'icon-prison'}
                                        onlyLetters={true}
                                        setValue={value => {
                                            const pd = { ...payload };
                                            pd['name'] = value;
                                            setPayload(pd);
                                        }}
                                        defaultValue={payload?.name || ''}
                                    />
                                </div>
                            </div>

                            {lookupData && (
                                <div class='col-xxl-12'>
                                    <div>
                                        <InputWidget
                                            type={'multiSelect'}
                                            ismulti={false}
                                            inputType={'select'}
                                            label={lookupData}
                                            require={false}
                                            icon={'icon-prison'}
                                            options={transformData(
                                                dropDownData
                                            )}
                                            defaultValue={payload?.lookup || []}
                                            setValue={value => {
                                                const pd = { ...payload };
                                                pd[lookupId] = value.value;
                                                pd['lookup'] = value;
                                                setPayload(pd);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* {lookupDataTwo && (
                                <div class='col-xxl-12'>
                                    <div>
                                        <InputWidget
                                            type={'multiSelect'}
                                            ismulti={false}
                                            inputType={'select'}
                                            label={lookupDataTwo}
                                            require={false}
                                            icon={'icon-web'}
                                            options={transformData(
                                                dropDownDataTwo
                                            )}
                                            defaultValue={payload?.lookupTwo || []}
                                            setValue={value => {
                                                const pd = { ...payload };
                                                pd[lookupIdTwo] = value.value;
                                                pd['lookupTwo'] = value;
                                                setPayload(pd);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {lookupDataThree && (
                                <div class='col-xxl-12'>
                                    <div>
                                        <InputWidget
                                            type={'multiSelect'}
                                            ismulti={false}
                                            inputType={'select'}
                                            label={lookupDataThree}
                                            require={false}
                                            icon={'icon-building'}
                                            options={transformData(
                                                dropDownDataThree
                                            )}
                                            defaultValue={payload?.lookupThree || []}
                                            setValue={value => {
                                                const pd = { ...payload };
                                                pd[lookupIdThree] = value.value;
                                                pd['lookupThree'] = value;
                                                setPayload(pd);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            {lookupDataFour && (
                                <div class='col-xxl-12'>
                                    <div>
                                        <InputWidget
                                            type={'multiSelect'}
                                            ismulti={false}
                                            inputType={'select'}
                                            label={lookupDataFour}
                                            require={false}
                                            icon={'icon-building'}
                                            options={transformData(
                                                dropDownDataFour
                                            )}
                                            defaultValue={payload?.lookupFour || []}
                                            setValue={value => {
                                                const pd = { ...payload };
                                                pd[lookupIdFour] = value.value;
                                                pd['lookupFour'] = value;
                                                setPayload(pd);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            {lookupDataFive && (
                                <div class='col-xxl-12'>
                                    <div>
                                        <InputWidget
                                            type={'multiSelect'}
                                            ismulti={false}
                                            inputType={'select'}
                                            label={lookupDataFive}
                                            require={false}
                                            icon={'icon-building'}
                                            options={transformData(
                                                dropDownDataFive
                                            )}
                                            defaultValue={payload?.lookupFive || []}
                                            setValue={value => {
                                                const pd = { ...payload };
                                                pd[lookupIdFive] = value.value;
                                                pd['lookupFive'] = value;
                                                setPayload(pd);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div class='col-xxl-12'>
                                <div>
                                    <InputWidget
                                        type={'input'}
                                        inputType={'name'}
                                        label={'Street'}
                                        require={false}
                                        icon={'icon-number'}
                                        setValue={value => {
                                            const pd = { ...payload };
                                            pd['street'] = value;
                                            pd['address'] = value;
                                            setPayload(pd);
                                        }}
                                        defaultValue={
                                            payload?.address || ''
                                        }
                                    />
                                </div>
                            </div> */}
                            <AddressLookup 
                            payload={payload} 
                            setPayload={setPayload} 
                            countryData={transformData(dropDownDataTwo)} />
                            
                            <div className='col-xxl-12'>
                                <div className='inputs force-active'>
                                <label>Established on</label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => {
                                        setSelectedDate(date);
                                        const pd = {
                                        ...payload,
                                        };
                                        pd["establishedDate"] = date
                                        ? `${date.getFullYear()}-${
                                            date.getMonth() + 1
                                            }-${date.getDate()}`
                                        : "";
                                        setPayload(pd);
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    maxDate={new Date()}
                                    icon={'icon-operator'}
                                    isClearable
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={120}
                                    showMonthDropdown
                                    id={'establishment-date'}
                                />
                                </div>
                            </div>

                                    <div class='col-xxl-12'>
                                            <div>
                                                <InputWidget
                                                    type={'input'}
                                                    inputType={'name'}
                                                    label={'Capacity'}
                                                    require={false}
                                                    icon={'icon-menu-bar'}
                                                    onlyNumbers={true}
                                                    setValue={value => {
                                                        const pd = { ...payload };
                                                        pd['capacity'] = value;
                                                        setPayload(pd);
                                                    }}
                                                    defaultValue={
                                                        payload?.capacity || ''
                                                    }
                                                />
                                            </div>
                                        </div>
                        </div>
                            <div className='col-xxl-12'>
                                <div>
                                    <InputWidget
                                        type={'textarea'}
                                        inputType={'name'}
                                        label={'Description'}
                                        require={false}
                                        icon={'icon-chat'}
                                        onlyLetters={true}
                                        setValue={value => {
                                            const pd = { ...payload };
                                            pd['description'] = value;
                                            setPayload(pd);
                                        }}
                                        defaultValue={
                                            payload?.description || ''
                                        }
                                    />
                                </div>
                            </div>
                            
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-light' onClick={hideModal}>
                        Cancel
                    </button>
                    <button className='btn btn-primary' onClick={handleSave}>
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PrisonLookup;
