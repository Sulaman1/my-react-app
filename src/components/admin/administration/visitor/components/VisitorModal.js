/* eslint-disable no-tabs */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import { useEffect, useState } from 'react';

import { Modal } from 'react-bootstrap';
import { deepClone, transformData } from '../../../../../common/Helpers';
import {
  baseImageUrl,
  getData,
  postData,
} from '../../../../../services/request';
import ContactInfo from '../../adduser/ContactInfo';
import VisitorInfo from './VisitorInfo';
import swal from 'sweetalert';
import ProfilePic from '../../../../../assets/images/users/1.jpg';
import InputWidget from '../../../../../droppables/InputWidget';
import VisitorDetail from './VisitorDetail';
import GroupVisitorGrid from './GroupVisitorGrid';
import PrisonerInfoCard from '../../../../prisoners/Components/release-prisoner/PrisonerInfoCard';
import PermanentAddress from '../../../../prisoners/Components/PermanentAddress';
import PrintQueue from './PrintQueue';
import ReactDOMServer from 'react-dom/server';
import { useSelector } from 'react-redux';
import moment from 'moment-mini';

const VisitorModal = ({ visible, onClose, refetch, prisonerData, showQueue, setShowQueue, printQueueObjFromParent }) => {
  const date = new Date();
  const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const [formPayload, setFormPayload] = useState({
    personalInfo: {},
    contactInfo: {},
    permanentAddress: {},
    biometricInfo: {},
    visitDate: currentDate
  });
  const [visitorsInGrid, setVisitorsInGrid] = useState([]);
  const [foundVisitor, setFoundVisitor] = useState(false);
  const [lookups, setLookups] = useState({});
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [clearAll, setClearAll] = useState(false);
  const [logo, setLogo] = useState('');
  const [printQueueObj, setPrintQueueObj] = useState({})
  


  const Logo = () => {

    import(`../../../../${process.env.REACT_APP_LOGO}`).then((module) => {
      setLogo(module.default);
    });

    return (
      <img src={logo} alt="" height="70" style={{ "borderRadius": "10px", "marginBottom": "4px" }} />
    );
  };

  useEffect(() => {
    fetchLookUps();
  }, []);

  useEffect(() => {
    callDefaultCountryProvince();
  }, [visible]);
  useEffect(() => {
    console.log('showQueue updated:', showQueue);
  }, [showQueue]);

  const addVisitorToGrid = () => {
    if (
      formPayload.personalInfo &&
      formPayload.personalInfo.cnic &&
      formPayload.personalInfo.fullName &&
      formPayload.relationshipId
    ) {
      const mappedPayload = mappedTransformPayload(JSON.parse(JSON.stringify(formPayload)));
      mappedPayload.visitDate = mappedPayload?.visitDate || `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (mappedPayload.id === 'default') {
        delete mappedPayload.id;
      }
      const payload = {
        'person': mappedPayload,
        'relationshipId': formPayload.relationshipId,
        'purpose': formPayload.purpose,
        'luggageDetail': formPayload?.luggageDetail,
        'description': formPayload?.description,
        'visitDate': mappedPayload?.visitDate || `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      };

      if (formPayload.id === 'default') {
        delete formPayload.id;
      }

      if (formPayload.id) {
        payload['id'] = formPayload.id;
        delete formPayload.id;
      }

      const clonedPayload = deepClone(payload);

      setVisitorsInGrid([...visitorsInGrid, clonedPayload]);
      // trigger reset form

      setFormPayload({
        personalInfo: {},
        contactInfo: {},
        permanentAddress: {
          cityId: formPayload?.permanentAddress?.cityId || formPayload?.permanentAddress?.districtId,
          countryId: formPayload?.permanentAddress?.countryId,
          districtId: formPayload?.permanentAddress?.districtId,
          provinceId: formPayload?.permanentAddress?.provinceId,
        },
        biometricInfo: {
          frontPic: '',
        },
      });
      setClearAll(true);
      setFoundVisitor(false)
      setTimeout(() => {
        setClearAll(false);
      }, 300);
    } else {
      swal('Missing Required Fields', 'Please fill in all required fields', 'error');
    }
  };

  const mappedTransformPayload = (formPayload) => {
    const pd = { ...formPayload };
    formPayload.permanentAddress = {
      ...formPayload.permanentAddress,
      provinceId: formPayload.permanentAddress.provinceId,
      cityId: pd?.permanentAddress?.cityId || pd?.permanentAddress?.districtId,
      countryId: pd?.permanentAddress?.countryId
    };
    return formPayload;
  };

  const resetForm = () => {
    setFormPayload({
      personalInfo: {},
      contactInfo: {},
      permanentAddress: {},
      biometricInfo: {},
    });
    setFoundVisitor(false);
    setVisitorsInGrid([]);
    setShowQueue(false)
    onClose();
  };

  const loadFoundVisitorData = (visitorData) => {
    const foundPayload = {
      personalInfo: {
        ...visitorData?.person?.personalInfo,
      },
      permanentAddress: {
        ...visitorData?.person?.permanentAddress,
      },
      contactInfo: {
        ...visitorData?.person?.contactInfo,
      },
      biometricInfo: {
        ...visitorData?.person?.biometricInfo
      },
      id: visitorData?.person?.id,
      purpose: visitorData?.purpose,
      relationshipId: visitorData?.relationshipId,
      visitorId: visitorData?.visitorId,
      visitDate: visitorData?.visitDate,
      description: visitorData?.description,
      luggageDetail: visitorData?.luggageDetail,
    };
    setFormPayload(foundPayload);
  };

  const fetchLookUps = async () => {
    try {

      const lookup = {};

      const countryObj = transformData(newLookups?.country);
      lookup['country'] = countryObj;

      const provinceObj = transformData(newLookups?.province);
      lookup['provinces'] = provinceObj;

      const cityObj = transformData(newLookups?.city);
      lookup['cities'] = cityObj;

      lookup['allDistricts'] = newLookups?.district;

      const relationshipsObj = transformData(newLookups?.Relationships);
      lookup['relationships'] = relationshipsObj;

      const relationshipTypesObj = transformData(newLookups?.relationshipTypes);
      lookup['relationshipTypes'] = relationshipTypesObj;
      setLookups(lookup);
    } catch (error) {
      console.error(error);
      alert('Something went wrong in lookups api');
    }
  };

  const callDefaultCountryProvince = async () => {
    const defaultCountry = await getData('/services/app/AddPrisonerAppServices/GetDefaultCountry',
      "", true, false)
    const defaultProvince = await getData('/services/app/AddPrisonerAppServices/GetDefaultProvince',
      "", true, false)

    const payload = {
      ...formPayload,
    };
    payload['permanentAddress']['countryId'] = defaultCountry?.result;
    payload['permanentAddress']['provinceId'] = defaultProvince?.result;
    payload['id'] = "default";
    setFormPayload(payload)
  }

  const handleImageUpload = async (value, imageType) => {
    if (!value) return;

    const data = {
      image: value.substring(23),
      prisoner: false,
      imageName: imageType === 'frontPic' ? 'frontPic' : imageType == 'cnicFrontPic' ? 'cnicFrontPic' : 'cnicBackPic',
    };

    try {
      const res = await postData('/services/app/BasicInfo/uploadBase64', data);
      if (res.success) {
        const payload = {
          ...formPayload,
        };
        if (imageType === 'cnicFrontPic') {
          if (payload.personalInfo) {
            payload['personalInfo']['cnicFrontPic'] = res.result.imagePath;
          }
        }

        if (imageType === 'cnicBackPic') {
          if (payload.personalInfo) {
            payload['personalInfo']['cnicBackPic'] = res.result.imagePath;
          }
        }
        if (payload.biometricInfo && imageType === 'frontPic') {
          payload['biometricInfo']['frontPic'] = res.result.imagePath;
        } else if (imageType === 'frontPic') {
          payload['biometricInfo'] = {
            'frontPic': res.result.imagePath,
          };
        }
        setFormPayload(payload);
      } else {
        swal('Getting error while uploading', '', 'warning');
      }
    } catch (err) {
      console.log(err, ' errerrerr');
      swal('Getting error while uploading', '', 'warning');
    }
  };

  const handleSubmit = async () => {

    const payload = {
      visitors: visitorsInGrid,
      visitDate: visitorsInGrid?.[0]?.person?.visitDate,
      prisonerId: JSON.parse(sessionStorage.getItem('prisonerEntry')).id,
    };
    let isValid = true;
    const invalidErrors = [];

    if (payload['visitors'].length === 0) {
      isValid = false;
      invalidErrors.push('Visitor missing\n');
    }

    if (!payload['visitDate']) {
      isValid = false;
      invalidErrors.push('Visit date missing\n');
    }

    if (payload.visitors.filter((item) => !item.relationshipId).length > 0) {
      isValid = false;
      invalidErrors.push('Relationship missing\n');
    }
    payload.visitors.forEach((visitor) => {
      if (visitor.person.permanentAddress) {
        handleAddressPayload(visitor.person.permanentAddress);
      }
    });

    if (!isValid) {
      swal({
        button: true,
        icon: 'error',
        title: 'Missing Required fields',
        text: invalidErrors.toString(),
      });
    } else {
      let res;
      try {
        res = await postData(
          '/services/app/Visitors/CreateUpdateVisitorVisit',
          payload,
        );
        if (res.result.isSuccessful) {
          // swal('Successfully Created!', '', 'success');
          swal('Successfully submitted for approval!', '', 'success')
            .then((value) => {
              if (value) {
                setPrintQueueObj({
                  queueNo: res.result.data,
                  currentDate: moment(currentDate).format("DD-MM-YYYY"),
                  visitorsInfo: visitorsInGrid,
                  prisonerInfo: prisonerData
                })
                setShowQueue(true)
              }
            });
          
          
          setFormPayload({
            personalInfo: {},
            contactInfo: {},
            permanentAddress: {},
            biometricInfo: {
              frontPic: '',
            },
          });
          sessionStorage.removeItem('prisonerEntry');
        } else {
          swal('Something went wrong!', '', 'warning');
        }
      } catch (err) {
        swal(res.error.message, res.error.details, 'warning');
      } finally {

      }
    }
  };
  const handleAddressPayload = (per_address) => {
    const cleanAddress = (address) => {
      if (address?.countryId && !address?.cityId) {
        address?.id == 0 && delete address?.id
        address.cityId = null;
        address.countryId = null
      } else {
        if (address?.isPakistan || address.countryId === 167 || address.countryId === 0) {
          delete address?.countryId;
        } else {
          delete address?.cityId;
        }
      }
      delete address?.provinceId;
      delete address?.districtId;
    };
    cleanAddress(per_address);
  };

  const addVisitorInfo = () => {
    return (
      <>
        <PrisonerInfoCard prisoner={prisonerData} />
        <form>
          <VisitorInfo
            title="Basic Information"
            formPayload={formPayload}
            setFormPayload={setFormPayload}
            relationships={lookups['relationships']}
            relationshipTypes={lookups['relationshipTypes']}
            checkCNICURL="/services/app/Visitors/SearchVisitorByCNIC"
            onFoundData={loadFoundVisitorData}
            setFoundVisitor={setFoundVisitor}
            foundVisitor={foundVisitor}
            clearAll={clearAll}
          />

          <VisitorDetail
            title="Visitor Detail"
            formPayload={formPayload}
            setFormPayload={setFormPayload}
          />
          <div className="tabs-wraper">
            <div className="tabs-panel hover-card">
              <div className="row ">
                <h4 className="third-heading">Address Details</h4>
              </div>
              <PermanentAddress
                payload={formPayload}
                setPayload={setFormPayload}
                lookUps={lookups}
                clearAll={clearAll}
              />
            </div>
          </div>

          <ContactInfo
            title={'Contact Information'}
            formPayload={formPayload}
            setFormPayload={setFormPayload}
            isVisitor
            foundVisitor={foundVisitor}
          />
          <div className="row mt-4">
            <div className="row d-flex just-center">
              <div className="col-lg-3">
                <h4 className="sub-heading text-center just-center mb-3">
                  Front Picture
                </h4>
                <InputWidget
                  id={'front-pic'}
                  type={'editImage'}
                  inputType={'file'}
                  take={'icon-photographer'}
                  allowCompression={true}
                  require={false}
                  Photo={
                    formPayload?.biometricInfo &&
                      formPayload?.biometricInfo?.frontPic ?
                      baseImageUrl + formPayload?.biometricInfo?.frontPic :
                      ProfilePic
                  }
                  setValue={(value) => {
                    handleImageUpload(value, 'frontPic');
                  }}
                />
              </div>
              <div className="col-lg-3">
                <h4 className="sub-heading text-center just-center mb-3">
                  Cnic Front Picture
                </h4>
                <InputWidget
                  id={'front-pic'}
                  type={'editImage'}
                  inputType={'file'}
                  upload={'icon-upload'}
                  take={'icon-photographer'}
                  allowCompression={true}
                  require={false}
                  Photo={
                    formPayload?.personalInfo &&
                      formPayload?.personalInfo?.cnicFrontPic ?
                      baseImageUrl + formPayload?.personalInfo?.cnicFrontPic :
                      ProfilePic
                  }
                  setValue={(value) => {
                    handleImageUpload(value, 'cnicFrontPic');
                  }}
                />
              </div>
              <div className="col-lg-3">
                <h4 className="sub-heading text-center just-center mb-3">
                  Cnic Back Picture
                </h4>
                <InputWidget
                  id={'front-pic'}
                  type={'editImage'}
                  inputType={'file'}
                  upload={'icon-upload'}
                  take={'icon-photographer'}
                  allowCompression={true}
                  require={false}
                  Photo={
                    formPayload?.personalInfo &&
                      formPayload?.personalInfo?.cnicBackPic ?
                      baseImageUrl + formPayload?.personalInfo?.cnicBackPic :
                      ProfilePic
                  }
                  setValue={(value) => {
                    handleImageUpload(value, 'cnicBackPic');
                  }}
                />
              </div>
            </div>
          </div>

          <GroupVisitorGrid visitors={visitorsInGrid} submit={addVisitorToGrid} setVisitorsInGrid={setVisitorsInGrid} lookUps={lookups} />
        </form>
      </>
    );
  }

  const printHandler = () => {
    return (
      <PrintQueue printQueueObj={printQueueObjFromParent?.currentDate ? printQueueObjFromParent : printQueueObj} Logo={Logo} lookups={lookups}/>
    )
  }

  const printQueueInfo = () => {
    const printWindow = window.open('', '', 'height=1000,width=1000');
    if (printWindow) {
      const htmlContent = ReactDOMServer.renderToStaticMarkup(
        <div className="print-marasla" >
          {printHandler()}
        </div>
      );
      printWindow.document.write(`<html><head><title> Info </title>`);
      printWindow.document.write('</head><body>');
      printWindow.document.write(htmlContent);
      printWindow.document.write('</body></html>');

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      console.error("Unable to open print window.");
    }
  };

  return (
    <Modal show={visible} onHide={resetForm} size="xl" backdrop="static">
      <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
        <h5 className="modal-title" id="exampleModalgridLabel">
          Visitor Information
        </h5>
      </Modal.Header>
      <Modal.Body>
        {showQueue ?
          <PrintQueue printQueueObj={printQueueObjFromParent?.currentDate ? printQueueObjFromParent : printQueueObj} Logo={Logo} lookups={lookups}/>
          : addVisitorInfo()}
      </Modal.Body>
      <Modal.Footer>
        {!showQueue &&

          <button
            id={'cancel-btn'}
            className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
            onClick={resetForm}
          >
            Cancel
          </button>
        }
        <button
          id={'create-btn'}
          className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-1"
          onClick={showQueue ? () => { printQueueInfo() } : handleSubmit}
          disabled={printQueueObjFromParent?.currentDate ? printQueueObjFromParent?.visitorsInfo === 0 : visitorsInGrid.length === 0} // Fixed typo
        >
          {showQueue ? 'Print' : 'Create'}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default VisitorModal;
