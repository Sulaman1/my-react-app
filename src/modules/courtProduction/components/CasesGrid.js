import React, { useState } from 'react';
import { Grid, _ } from "gridjs-react";
import { transformDataForTableGrid, validateDate } from '../../../common/Helpers';
import { Modal } from 'react-bootstrap';
import InputWidget from '../../../droppables/InputWidget';
import { baseImageUrl } from '../../../services/request';
import ProfilePic from '../../../assets/images/users/1.jpg';

const CasesGrid = ({ cases, setExtraPayload, extraPayload, prisonerId, fileUploads, setFileUploads, setExtraFields, extraFields, hearingGrid, setModalPayload, modalPayload, selectedPrisoner, prisonerIdTwo }) => {
  const [visibleReasonModal, setVisibleReasonModal] = useState(false)
  const [currentObj, setCurrentObj] = useState({})
  const generateGridCols = () => {
    const gridCols = {
      [hearingGrid ? 'Select' : 'Warrant only']: '',
      'Fir No': '',
      'Fir Date': '',
      'Fir Year': '',
      // 'Case Status': '',
      'Police Station': '',
      'Under Sections': '',
      'Next Hearing Date': ''
    };
    if (!hearingGrid){
    gridCols['Action'] = '';
    }
    return Object.keys(gridCols);
  };


  const selectHearingPrisonerHandler = (entry) => {
    setModalPayload((prevPayload) => {
      const existingPayloadIndex = prevPayload.findIndex((payload) => {
        return payload.prisonerBasicInfoId === selectedPrisoner.id;
      });

      if (existingPayloadIndex >= 0) {
        const existingPayload = prevPayload[existingPayloadIndex];
        if (existingPayload.hearingId) {
          const newPayload = {
            id: prisonerIdTwo,
            prisonerBasicInfoId: selectedPrisoner.id,
            hearingId: entry.hearingId,
          };
          return [...prevPayload, newPayload];
        } else {
          const updatedPayload = {
            ...existingPayload,
            hearingId: entry.hearingId,
          };
          const updatedPayloads = [...prevPayload];
          updatedPayloads[existingPayloadIndex] = updatedPayload;
          return updatedPayloads;
        }
      } else {
        const newPayload = {
          id: prisonerIdTwo,
          prisonerBasicInfoId: selectedPrisoner.id,
          hearingId: entry.hearingId,
        };
        return [...prevPayload, newPayload];
      }
    });
  };

  
  const unSelectHearingPrisonerHandler = (entry) => {
    setModalPayload((prevPayload) =>
      prevPayload.filter(
        (payload) =>
          !(payload.prisonerBasicInfoId === selectedPrisoner.id && payload.hearingId === entry.hearingId)
      )
    );
  };


  const gridDataMap = (e,index) => {
    let selectStatus = (e.warrantOnly || e.reason) || "";
    const isSelected = !!selectStatus;
    const mapObj = {
      selected: _(
        <input
          className="form-check-input"
          type="checkbox"
          style={{ width: '1.7rem', height: '1.7rem', marginLeft: '11px' }}
          checked={isSelected || e.selected}
          defaultValue={e.selected}
          onChange={(event) => {
            const checked = event.target.checked;
            e.selected = checked

            if (hearingGrid){
              if (checked) {
                selectHearingPrisonerHandler(e);
              } else {
                unSelectHearingPrisonerHandler(e);
              }
            }
            else {
            const payload = {
              ...extraPayload,
            };
            payload['warrantOnly'] = checked;
            e['warrantOnly'] = checked;
            cases[index]['warrantOnly'] = payload['warrantOnly'];
            payload['prisonerId']= e.id;
            setExtraPayload(payload)
          }
          }}
        />
      ),
      firNo: e.firNo,
      firDate: validateDate(e.firDate),
      firYear: e.firYear,
      // status: e.status,
      policeStation: e.policeStation,
      underSections: e.underSections,
      nextHearingDate: validateDate(e.nextHearingDate)
        ? new Date(e.nextHearingDate).toDateString()
        : ''
    };

    mapObj['Actions'] = _(
      <div className='action-btns'>
        {(isSelected) && ( 
        <button
          id={'view-more=details-btn'}
          type='button'
          className='tooltip btn btn-prim waves-effect waves-light mx-1'
          onClick={() => {
            handleReasonModal(e, index)
            setVisibleReasonModal(true)
          }
          }
        >
          <i className='icon-show-password'></i>
          <span>View More</span>
        </button>
        )}
      </div>
    );

    return mapObj;
  };

  const handleReasonModal = (obj, index) => {
    obj['index'] = index
    setCurrentObj(obj)
  }

  const selectPrisonerHandler = (entry) => {
    console.log(entry);

  };

  const handleFrontUpload = async (value, court) => {
    if(!value) return;
    const fls = value.map((item) => item?.result?.filePath || '');
    if (fls.length) {
      let files = [...fileUploads];
      files = [...files, ...fls];
      const pd = {
        ...currentObj,
      };
      setFileUploads(files);
      pd['hearingDocuments'] = files.toString();
      setCurrentObj(pd);
    }
  };

  const handleSaveCase = () => {
    let fields = [...extraFields];
    console.log(cases)
    fields[currentObj['index']] = currentObj;
    cases[currentObj['index']] = currentObj;
    setExtraFields(fields)

  };
  return (
    <>
      <div className='table-main'>
        <div className=''>
          <h4 className='third-heading db-heading mb-2'>Case Information</h4>
          <div id='pagination-list'>
            <Grid
              data={transformDataForTableGrid(
                cases?.map((e, index) =>
                  gridDataMap(e, index)
                )
              )}
              columns={generateGridCols()}
              sort={true}
              pagination={{
                enabled: true,
                limit: 10
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <Modal show={visibleReasonModal}>
          <Modal.Header>

          </Modal.Header>
          <Modal.Body>
            <form>
          <div>
          <InputWidget
            type={'input'}
            label={'Reason'}
            id={'rason'}
            require={true}
            icon={'icon-operator'}
            defaultValue={currentObj?.reason}
            setValue={(value) => {
              console.log('Reason', value);
              const payload = {
                ...currentObj,
              };
              payload['reason'] = value;
              setCurrentObj(payload);
            }}
          />
          </div>

              <div className="col-lg-12">
                <h4 className="sub-heading text-left just-left mb-3">
                  Supporting Documents (underdevelopment)
                </h4>
                <InputWidget
                  id={'drag'}
                  type={'drag'}
                  inputType={'file'}
                  icon={'icon-operator'}
                  require={false}
                  fileParams={{
                    prisonerId,
                  }}
                  Photo={
                    extraPayload?.hearingDocuments
                      ? baseImageUrl + extraPayload?.hearingDocuments
                      : ProfilePic
                  }
                  allowedFileFormat={['image/png', 'image/jpeg', 'image/jpg']}
                  setValue={(value) => {
                    handleFrontUpload(value);
                  }}
                />
                <aside>
                  <h4>Files</h4>
                  <ul>
                    {fileUploads?.length &&
                      fileUploads?.map((item) => (
                        <li key={new Date().toString() + Math.random().toString()}>
                          <button
                            id={'close-btn'}
                            type="button" className="closs-btn">
                            <i class="icon-cross-sign"></i>
                          </button>
                          <i className="icon-pdf-file"></i>
                          <span>{item.split('-')[1]}</span>
                        </li>
                      ))}
                  </ul>
                </aside>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
              id={'cancel-btn'}
              className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
              onClick={() => {setVisibleReasonModal(false); setCurrentObj([])}}
            >
              Cancel
            </button>
            <button
              id={'save-btn'}
              className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
              onClick={() => {handleSaveCase(); setVisibleReasonModal(false)}}
            >
              Save
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CasesGrid;
