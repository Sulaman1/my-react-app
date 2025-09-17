import { Modal } from 'react-bootstrap';
import { Grid, _ } from 'gridjs-react';

import {
  transformDataForTableGrid,
  validateDate,
} from '../../../../common/Helpers';
import { useState } from 'react';
import DispenseMedicine from '../../../medical/components/Prescribe/DispenseMedicine';
// import DispenseMedicine from './DispenseMedicine';

const getStockCols = () => {
  const entries = {
    'Batch Number (بیچ نمبر)': '',
    'Total Received (موصول شدہ)': '',
    'Total In Store (اسٹور میں تعداد)': '',
    'Total Issued (کل جاری کردہ)': '',

    'Receive Date (تاریخ موصولی)': '',
    'Action (عملدرامد)': '',
  };

  return Object.keys(entries);
};

const getPriscriptionCols = () => {
  const entries = {
    'Inventory Name (انوینٹری)': '',
    'inventory Type (انوینٹری کی قسم)': '',
    'Quantity Required (تعداد ضرورت)': '',
    'Quantity Issued (جاری کردہ مقدار)': '',
    'Action (عملدرامد)': '',
  };

  return Object.keys(entries);
};

const InventoryModal = ({
  onClose,
  visible,
  title,
  priscriptions,
  stockList,
  onShowStockDetails,
  gridIsVisible,
  onUpdate,
  onIssue,
  onUndoTotalIssued,
}) => {
  const [DispenseModalIsVisible, setDispenseModalIsVisible] = useState(false);
  const [stockItemId, setStockItemId] = useState();
  const [minLength, setMinLength] = useState();

  const filteredStock = stockList.filter((item) => item.totalIssued);
  console.log('STOCK', filteredStock);
  const issueMedicine = filteredStock.length > 0;

  const viewDetailsHandler = (entry) => {
    onShowStockDetails(entry);
    setMinLength(entry.quantityRequired);
  };

  const gridPriscriptionsDataMap = (entry) => {
    const hasStock = entry?.stock?.length > 0;
    const mapObj = {
      inventoryName: entry.inventoryName,
      inventoryType: entry.inventoryType,
      quantityRequired: entry.quantityRequired,
      quantityIssued: entry.quantityIssued,
      Actions: _(
        hasStock && (
          <div className="action-btns">
            <button
              id={'view-details-prescribe-btn'}
              type="button"
              onClick={viewDetailsHandler.bind(this, entry)}
              className="tooltip btn btn-prim waves-effect waves-light mx-1"
            >
              <i className="icon-show-password"></i>
              <span>View Details</span>
            </button>
          </div>
        )
      ),
    };

    return mapObj;
  };

  const gridStockDataMap = (e) => {
    const mapObj = {
      batchNo: e.batchNumber,
      totalRecived: e.totalRecived,
      totalInStore: e.totalInStore,
      totalIssued: e.totalIssued,

      recieveDate: validateDate(e.recieveDate),
      Actions: _(
        <div className="action-btns">
          <button
            id={'dispense-btn'}
            type="button"
            onClick={handleDispenseOpenModal.bind(this, e.id)}
            className="btn btn-success p-2 tooltip"
          >
            Dispense
          </button>
          {!!e.totalIssued && (
            <button
              id={'undo-dispense-btn'}
              type="button"
              className="btn btn-danger p-2 tooltip"
              onClick={undoDispenseValue.bind(this, e)}
            >
              Undo
            </button>
          )}
        </div>
      ),
    };

    return mapObj;
  };

  const undoDispenseValue = (e) => {
    onUndoTotalIssued?.(e.id, e.totalIssued);
    setMinLength((curMin) => curMin + e.totalIssued);
  };

  const handleDispenseOpenModal = (id) => {
    setDispenseModalIsVisible(true);
    setStockItemId(id);
  };

  const handleDispenseCloseModal = () => {
    setDispenseModalIsVisible(false);
  };

  const updateTotalIssuesHandler = (value) => {
    onUpdate(stockItemId, value);
    setDispenseModalIsVisible(false);
    setMinLength((curMin) => curMin - value);
  };

  return (
    <Modal show={visible} onHide={onClose} size="xl">
      <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
        <h5 class="modal-title" id="exampleModalgridLabel">
          {title}
        </h5>
      </Modal.Header>
      <Modal.Body>
        <div className="card custom-card animation-fade-grids custom-card-scroll">
          <div className="row">
            <Grid
              data={transformDataForTableGrid(
                priscriptions?.map((e) => gridPriscriptionsDataMap(e))
              )}
              columns={getPriscriptionCols()}
              search={true}
              sort={true}
              pagination={{
                enabled: true,
                limit: 10,
              }}
            />
          </div>
        </div>

        {gridIsVisible && (
          <div className="card custom-card animation-fade-grids custom-card-scroll mt-5">
            <div className="row">
              <Grid
                data={transformDataForTableGrid(
                  stockList?.map((e) => gridStockDataMap(e))
                )}
                columns={getStockCols()}
                search={true}
                sort={true}
                pagination={{
                  enabled: true,
                  limit: 10,
                }}
              />
            </div>
          </div>
        )}

        <DispenseMedicine
          DispenseModalIsVisible={DispenseModalIsVisible}
          handleDispenseCloseModal={handleDispenseCloseModal}
          onUpdate={updateTotalIssuesHandler}
          minLength={minLength}
          type="inventory"
        />

        {issueMedicine && (
          <div className="mt-4 mb-4 d-flex justify-content-center gap-2">
            <button
              id={'issue-medicine-btn'}
              type="submit"
              className="btn rounded-pill w-lg btn-prim waves-effect waves-light"
              onClick={onIssue}
            >
              <i className="icon-add ml-2"></i> Issue Inventory
            </button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          id={'close-btn'}
          className="btn btn-light lg-btn submit-prim waves-effect waves-light mx-1"
          onClick={onClose}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventoryModal;
