import { useState } from 'react';
import PrisonerInfoCard from '../../components/prisoners/Components/release-prisoner/PrisonerInfoCard';
import Medical from '../../components/prisoners/Components/Medical';

const AddAdmission = ({ setActiveTab, redirectTab }) => {

  const [prisonerData, setPrisonerData] = useState({});

  return (
    <div className="row p-4 bg-white">
      <PrisonerInfoCard prisoner={prisonerData} />
      <form className="col-lg-12 pt-0 justify-content-center">
        <Medical
          setActiveTab={setActiveTab}
          setPrisonerData={setPrisonerData}
          redirectTab={redirectTab}
          title="Add Medical Information" />
        <div className="mt-4 mb-4 d-flex justify-content-center gap-2"></div>
      </form>
    </div>
  );
};

export default AddAdmission;
