import moment from 'moment-mini';
import { useEffect } from 'react';
import { useState } from 'react';
import swal from 'sweetalert';
import PrisonerInfoCard from '../../components/prisoners/Components/release-prisoner/PrisonerInfoCard';
import { getData, postData } from '../../services/request';
import Checkups from './components/Checkups';
import HospitalInfo from './components/HospitalInfo';
import PriscriptionGrid from './components/PriscriptionGrid';
import { validateHospitalFields} from "../../common/FormValidator";

const AddAdmission = ({ setActiveTab, redirectTab }) => {

  const [formPayload, setFormPayload] = useState({
    checkups: {
      priscriptions: [],
    },
  });
  const [prisonerData, setPrisonerData] = useState({});
  useEffect(() => {
    getPrisonerData();
  }, []);

  const getPrisonerData = async () => {
    const entry = JSON.parse(sessionStorage.getItem('prisonerAdmissionEntry'));
    try {
      
      const res = await getData(
        `/services/app/AddPrisonerAppServices/GetOnePrisonerProfile?Prisonerid=${entry.id}`,
        '',
        true
      );
      if (res.success && res.result?.isSuccessful) {
        const data = res.result.prisonerProfile;
        const prisonerInfo = {
          ...data.personalInfo,
          admissionDate: data.prisonerAdmission?.admissionDate,
          prisonerNumber: data.prisonerNumber?.prsNumber,
          category: data.prisonerNumber?.category,
          prisonName: data.prisonerNumber?.prison,
          frontPic: data.biometricInfo?.frontPic,
          leftPic: data.biometricInfo?.leftPic,
          rightPic: data.biometricInfo?.rightPic,
        };
        setPrisonerData(prisonerInfo);
      } else {
        swal(
          res.error?.message || 'An error occured',
          res.error?.details || '',
          'warning'
        );
      }
    } catch (error) {
      console.log(error, 'getting error while fetching API {GetOnePrisonerProfile} & fileName is {AddAdmission.js}')
      swal('Something went wrong!', error, 'warning');
    }
    finally{
      
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if(!validateHospitalFields(formPayload)){
      return false;
    }
    const prisoner = JSON.parse(
      sessionStorage.getItem('prisonerAdmissionEntry')
    );
    const transformedPriscriptions = formPayload.checkups.priscriptions.map(
      (p) => ({
        medicineId: p.medicineId,
        quantityRequired: p.quantityRequired,
        prescriptionTimming: p.prescriptionTimming
      })
    );
    const payload = {
      prisonerBasicInfoId: prisoner.id,
      ...formPayload,
      checkups: {
        ...formPayload.checkups,
        priscriptions: transformedPriscriptions,
      },
    };
    if (!payload['admissionDate']) {
      payload['admissionDate'] = moment(new Date()).format('YYYY-MM-DD');
    }
    if (!payload['checkups']['checkUpDate']) {
      payload['checkups']['checkUpDate'] = moment(new Date()).format(
        'YYYY-MM-DD'
      );
    }
    let res;
    try {
      
      res = await postData(
        '/services/app/PrisonerMedicalInfo/CreatePrisonerHospitalAdmission?CheckUpOnly=false&discharge=false',
        payload
      );
      if (res.result.isSuccessful) {
        swal('Successfully Created!', '', 'success');
        setActiveTab(redirectTab);
        sessionStorage.removeItem('prisonerAdmissionEntry');
      } else {
        swal('Something went wrong!', '', 'warning');
      }
    } catch (err) {
      swal(res.error.message, res.error.details ?? '', 'warning'); 
      console.log(err, 'getting error while fetching API {CreatePrisonerHospitalAdmission} & fileName is {AddAdmission.js}')
    }
    finally{
      
    }
  };

  return (
    <div className="row p-4 bg-white">
      <PrisonerInfoCard prisoner={prisonerData} />
      <form className="col-lg-12 pt-0 justify-content-center">
        <HospitalInfo
          title="Treatment Information"
          formPayload={formPayload}
          setFormPayload={setFormPayload}
        />
        <Checkups
          title="Checkups"
          formPayload={formPayload}
          setFormPayload={setFormPayload}
        />
        <PriscriptionGrid
          data={formPayload.checkups.priscriptions}
          setFormPayload={setFormPayload}
        />
        <div className="mt-4 mb-4 d-flex justify-content-center gap-2">
          <button
            id={'add-treatment-submit-btn'}
            type="submit"
            className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
            onClick={submitHandler}
          >
            <i className="icon-add ml-2"></i> Add Treatment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmission;
