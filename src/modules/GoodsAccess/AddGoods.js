/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, _ } from 'gridjs-react';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import { useSelector } from 'react-redux';
import InputWidget from '../../droppables/InputWidget';
import { transformDataForTableGrid, transformData, validateDate, getFormattedDate, getValueFromList, getItemFromList } from '../../common/Helpers';
import { getData, postData } from '../../services/request';
import { IoMdExit } from "react-icons/io";

import { lookupName } from '../../components/admin/system-settings/lookupNames';
import GoodsSearch from './GoodsSearch';


const AddGoods = ({tab, api}) => {
  const userMeta = useSelector((state) => state.user);
  const isDarban = userMeta?.role === "Darban"
  const headers = [];

const EducationHeaders = 
  {
    'Item Type ': '',
    'Item ': '',
    'Employee Name ': '',
    'Entry Date ': '',
    'Additional Details': '',
  }
  if(tab === 3){
    EducationHeaders["Exit Date "] ='';
  }
  if(!isDarban){
    EducationHeaders["Prison Name"] ='';
  }
  if(tab === 1 && isDarban){
    EducationHeaders["action"] ='';
  }
  headers.push(EducationHeaders)
  
  const [showModal, setShowModal] = useState(false);
  const [loadedEducationEntries, setEducationEntries] = useState([]);
  const [formPayload, setFormPayload] = useState({});
  const [searhFormPayload, setSearhFormPayload] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
	const newLookups = useSelector((state) => state?.dropdownLookups) 
  const [inventorys, setInventory] = useState([]);

  const [fetchedData, setData] = useState({
    judges: [
      {
        label: 'Suprement Court Judge',
        value: 3,
      },
      {
        label: 'High Court Judge',
        value: 5,
      },
    ],
  });
  const gridRef = useRef(null);

  useEffect(() => {
      loadData();
  }, []);

  useEffect(() => {
    fetchApiData();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const handleSearch = (e) => {
    e.preventDefault()
    loadData()

  }

  const fetchApiData = async () => {
    try {
      const data = {};


      const prisonObj = transformData(newLookups?.prison);
      data['prison'] = prisonObj;

      const inventoryObj = transformData(newLookups?.inventory);
      data['inventory'] = inventoryObj;

      const inventoryTypesObj = transformData(newLookups?.inventoryType);
      data['inventoryTypes'] = inventoryTypesObj;

      setData(data);
    } catch (err) {
      alert('An error occured');
    }

  };


  const handleExitGoods = (e) => {
    const currentDateTime = new Date().toISOString(); 
    
    const payload = {
      darbanGoodsId: e?.id,
      exitTime: currentDateTime,
    };
    
  
    swal({
      title: "Are you sure?",
      text: "This action will Exit the Goods. Are you sure you want to proceed?",
      icon: "warning",
      buttons: ["Cancel", "Exit"],
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        
        postData(`/services/app/Darban/DarbanGoodsExit`, payload)
          .then((result) => {
            if (result && result.success) {
        

              swal(
                "Exited",
                "The Goods has been successfully Exited.",
                "success"
              );
              loadData();
            } else {
        

              swal("Error", "Failed to Exit the Goods.", "error");
            }
          })
          .catch(() => {
        

            swal(
              "Error",
              "An error occurred while Exiting the Goods.",
              "error"
            );
          });
      }
      

    });
  };
  const prisonerId = JSON.parse(
    sessionStorage.getItem('LoggedInEmployeeInfo')
  );
  const prisonId = prisonerId?.prisons?.[0]?.prisonId;

  const handleReset = (e) => {
    e.preventDefault();
    setSearhFormPayload({});
    setFormPayload({});
    loadData(true); 
  };
  
  const loadData = (isReset = false) => {
    
    
    let sendApi = tab == 2 ? `/services/app/Darban/${api}` : `/services/app/Darban/${api}?prisonId=${prisonId}`;
    
    // Only include search parameters if not reset
    if (!isReset && tab === 2) {
      const queryParameters = [];
      if (searhFormPayload.inventoryId) queryParameters.push(`InventoryId=${searhFormPayload.inventoryId}`);
      if (searhFormPayload.EntryTimeFrom) queryParameters.push(`EntryTimeFrom=${searhFormPayload.EntryTimeFrom}`);
      if (searhFormPayload.EntryTimeTo) queryParameters.push(`EntryTimeTo=${searhFormPayload.EntryTimeTo}`);
      if (searhFormPayload.ExitTimeFrom) queryParameters.push(`ExitTimeFrom=${searhFormPayload.ExitTimeFrom}`);
      if (searhFormPayload.ExitTimeTo) queryParameters.push(`ExitTimeTo=${searhFormPayload.ExitTimeTo}`);
      if (searhFormPayload.PrisonId) queryParameters.push(`PrisonId=${searhFormPayload.PrisonId}`);
      if (searhFormPayload.IsExit) queryParameters.push(`IsExit=${searhFormPayload.IsExit || null}`);
      sendApi = `/services/app/Darban/${api}?${queryParameters.join('&')}`;
    }
  
    getData(sendApi)
      .then((res) => {
        const data = res.result.data;
        
        if (data?.length > 0) {
          const filteredData = data.map((e) => {
            const obj = {};
            obj["inventoryType"] = e.inventoryType;
            obj["inventoryName"] = e.inventoryName;
            obj["employeeName"] = e.employeeName;
            obj["entryTime"] = validateDate(e.entryTime);
            obj["Additional Details"] = e.otherDetails;
            
            if(tab === 3) {

              obj["exitTime"] = validateDate(e.exitTime);
            }
            if (!isDarban) {
              obj["prisonName"] = e.prisonName;
            }
            if (userMeta?.role === "Darban") {
              obj["Action"] = _(
                <div className="action-btns">
                  <button
                    id={"view-more-btn"}
                    type="button"
                    onClick={() => handleExitGoods(e)}
                    className="tooltip btn btn-warning waves-effect waves-light"
                  >
                    <IoMdExit size={25} />
                    <span>Exit Goods</span>
                  </button>
                </div>
              );
            }
            return obj;
          });
          setEducationEntries(transformDataForTableGrid(filteredData));
        } else {
        

          setEducationEntries([]);
        }
      })
      .catch((err) => {
        

        swal('Something went wrong!', '', 'warning');
      });
  };
  

  const hnaldeAddGoods = () => {
    
    const prisonerId = JSON.parse(
        sessionStorage.getItem('LoggedInEmployeeInfo')
      );
      const payloadprisonId = prisonerId?.prisons?.[0]?.prisonId;
      const employeeId = prisonerId?.id;
      
    const prisonId = payloadprisonId;
    const payload = {
      ...formPayload,
    };
    const pd = {
            prisonId: prisonId,
            employeeId: employeeId,
            ...payload,
    };
    postData(`/services/app/Darban/DarbanGoodsEntry`, pd)
      .then((result) => {
        if (result && result.success) {
          swal('Successfully Added.', '', 'success');
          setShowModal(false);
          loadData();
        
        } else {
        
          swal(result.result.errorMessage, '', 'warning');
        }
        
      })
      .catch((error) => {
        
        console.log(error);
      });
  };

  
  const handleFetchInventory = async (invTypeId) => {
    const url = `${lookupName.inventory}?inventoryTypeId=${invTypeId}&inventoryType=${getItemFromList(fetchedData['inventoryTypes'], invTypeId)}`;
    const fetchedInventory = await getData(url, '', true);
    if (fetchedInventory.result.isSuccessful) {
      let inventoryObj = transformData(fetchedInventory.result.data);
      setInventory(inventoryObj);
      setData((prevLookups) => ({
        ...prevLookups,
        inventory: inventoryObj,
      }));
    }
  };

  return (
    <>
    <div className='mt-3 pt-3 mb-3'>

    {tab === 2 &&(
      <GoodsSearch handleReset={handleReset} handleSearch={handleSearch} formPayload={searhFormPayload} setFormPayload={setSearhFormPayload}/>
    )    }
    </div>
          {isDarban && tab === 1 &&
            <button
              id={'add-btn'}
              className="btn btn-success  waves-effect waves-light mx-1 px-3 py-2 float-end"
              onClick={openModal}
            >
              Add Goods
            </button>
            }
            <div className='animation-fade-grids'>
            <Grid
              ref={gridRef}
              data={loadedEducationEntries}
              columns={Object.keys(headers[0])}
              search={true}
              sort={true}
              pagination={{
                enabled: true,
                limit: 10,
              }}
            />
            </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
          <h3 class="modal-title" id="exampleModalgridLabel">
            Add Goods
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 px-0 mt-1">
            <div className="row">
              <form>
              <div className="col-lg-12">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                label={'Item Type'}
                id={'medicine-type'}
                require={true}
                multiple={false}
                icon={'icon-medical'}
                options={fetchedData['inventoryTypes'] || []}
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };
                  handleFetchInventory(value.value);
                  payload['inventoryTypeId'] = value.value;
                  // setFormPayload(payload);
                }}
              />
            </div>
            <div className="col-lg-12">
              <InputWidget
                type={'multiSelect'}
                inputType={'name'}
                label={'Item '}
                id={'medicine'}
                require={true}
                multiple={false}
                icon={'icon-medical'}
                options={inventorys}
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };
                  payload['inventoryId'] = value.value;
                  setFormPayload(payload);
                }}
              />
            </div>
              
                <div className="col-lg-12">
                  <div className='inputs force-active'>
                    <label>Entry date </label>
                    <DatePicker
                      selected={getFormattedDate(
                        formPayload.entryTime
                      )}
                      onChange={date => {
                        setSelectedDate(date);
                        const pd = {
                          ...formPayload,
                        };
                        pd['entryTime'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                        setFormPayload(pd);
                      }}
                      dateFormat='dd/MM/yyyy'
                      maxDate={new Date()}
                      icon={'icon-operator'}
                      isClearable
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={120}
                      showMonthDropdown
                      placeholderText={''}
                      id={'remission-date'}
                    />
                  </div>
                </div>
                <div className='col-md-12'>
                <div className='inputs force-active'>
                 <InputWidget
                    type={'textarea'}
                    inputType={'name'}
                    label={'Additional Details (تبصرے)'}
                    id={'Additional Details'}
                    require={false}
                    icon={'icon-operator'}
                    setValue={value => {
                      const payload = {
                        ...formPayload
                      };
                      payload['otherDetails'] =
                        value;
                      setFormPayload(payload);
                    }}
                  />
                </div>
              </div>
               
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button id={'cancel-btn'} className="btn btn-light" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button id={'create-btn'} className="btn btn-primary" onClick={hnaldeAddGoods}>
            Add
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddGoods;
