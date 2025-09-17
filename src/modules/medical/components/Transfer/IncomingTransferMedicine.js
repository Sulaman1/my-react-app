import React from 'react'
import { Grid, _ } from 'gridjs-react';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { transformDataForTableGrid, validateDate } from '../../../../common/Helpers';
import { getData, postData } from '../../../../services/request';

const getTransferCols = () => {
  const entries = {
    'To Prison': '',
    'From Prison': '',
    'Medicine': '',
    'Quantity': '',
    'Amount After Addition': '',
    'Amount After Deduction': '',
    'Action': '',
  };

  return Object.keys(entries);
};

const IncomingTransferMedicine = () => {
  const [transfers, setTransfers] = useState([]);
  const [userPrison, setUserPrison] = useState('');
  console.log(userPrison, 'userPrison')
  useEffect(() => {
    fetchTransfers();
    const sessionData = JSON.parse(sessionStorage.getItem('user')) || {};
    const prisonName = sessionData?.employee?.prisons?.[0]?.prisonName || '';
    setUserPrison(prisonName);
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await getData('/services/app/Medicine/GetAllTransferredMedicine?completed=false');
      if (res.success && res.result?.isSuccessful) {
        setTransfers(res.result.data || []);
      } else {
        swal(res.error?.message || 'An error occurred', res.error?.details || '', 'warning');
      }
    } catch (error) {
      swal('Something went wrong!', '', 'warning');
    }
  };

  const handleAcceptTransfer = async (id) => {
    const willAccept = await swal({
      title: "Are you sure?",
      text: "Do you want to accept this medicine transfer?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "btn btn-secondary",
          closeModal: true,
        },
        confirm: {
          text: "Yes, accept it!",
          value: true,
          visible: true,
          className: "btn btn-success",
        }
      },
      dangerMode: false,
    });

    if (willAccept) {
      try {
        const res = await postData(`/services/app/Medicine/AcceptMedicineTransfer?Id=${id}`);
        if (res && res?.result?.isSuccessful) {
          await swal('Successfully accepted transfer!', '', 'success');
          fetchTransfers(); 
        } else {
          swal(res.error?.message || 'An error occurred', res.error?.details || '', 'warning');
        }
      } catch (error) {
        swal('Something went wrong!', '', 'warning');
      }
    }
  };

  const handleRejectTransfer = async (id) => {
    const willReject = await swal({
      title: "Are you sure?",
      text: "Do you want to reject this medicine transfer?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "btn btn-secondary",
          closeModal: true,
        },
        confirm: {
          text: "Yes, reject it!",
          value: true,
          visible: true,
          className: "btn btn-danger",
        }
      },
      dangerMode: true,
    });

    if (willReject) {
      try {
        const res = await postData(`/services/app/Medicine/RejectMedicineTransfer?Id=${id}`);
        if (res && res?.result?.isSuccessful) {
          await swal('Successfully rejected transfer!', '', 'success');
          fetchTransfers(); 
        } else {
          swal(res.error?.message || 'An error occurred', res.error?.details || '', 'warning');
        }
      } catch (error) {
        swal('Something went wrong!', '', 'warning');
      }
    }
  };

  const gridDataMap = (item) => ({
    'To Prison': item.prisonToName,
    'From Prison': item.prisonFromName,
    'Medicine': item.medicineName,
    'Quantity': item.quantity,
    'Amount After Addition': item.amountAfterAddition,
    'Amount After Deduction': item.amountAfterDeduction,
    'Action': _(
      <div className="action-btns">
        {item.prisonFromName !== userPrison ? (
          <>
            <button
              type="button"
              onClick={() => handleAcceptTransfer(item.id)}
              className="btn btn-success p-2 tooltip me-2"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => handleRejectTransfer(item.id)}
              className="btn btn-danger p-2 tooltip"
            >
              Reject
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => handleRejectTransfer(item.id)}
            className="btn btn-danger p-2 tooltip"
          >
            Cancel
          </button>
        )}
      </div>
    ),
  });

  return (
    <div className="card custom-card animation-fade-grids custom-card-scroll mt-4">
      <div className="row p-2">
        <Grid
          data={transformDataForTableGrid(transfers.map(item => gridDataMap(item)))}
          columns={getTransferCols()}
          search={true}
          sort={true}
          pagination={{
            enabled: true,
            limit: 10,
          }}
        />
      </div>
    </div>
  );
};

export default IncomingTransferMedicine;
