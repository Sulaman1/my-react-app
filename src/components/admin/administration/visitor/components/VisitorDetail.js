import InputWidget from '../../../../../droppables/InputWidget';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getFormattedDate } from '../../../../../common/Helpers';

const VisitorDetail = (props) => {
  return (
    <div className="tabs-wraper">
      <div className="tabs-panel hover-card">
          <div className="row ">
            <h4 className="third-heading">{props.title}</h4>
          </div>
          <div className="row">
            <div className="col-lg-6">
            <div className='inputs force-active'>
              <label>Visit Date (وزٹ کی تاریخ)</label>
              <DatePicker
                selected={getFormattedDate(props.formPayload?.visitDate || new Date())}
                onChange={(date) => {
                  const payload = {
                    ...props.formPayload,
                  };
                  payload['visitDate'] = date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';
                  props.setFormPayload(payload);
                }}
                dateFormat="dd/MM/yyyy"
                icon={'icon-operator'}
                maxDate={new Date()}
                id={'visit-date'}
                isClearable
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={120}
                showMonthDropdown
              />
              </div>
            </div>
            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                label={'Purpose (مقصد)'}
                require={false}
                id={'purpose'}
                onlyLetters={true}
                icon={'icon-search'}
                defaultValue={props?.formPayload?.purpose ?? ''}
                setValue={(value) => {
                  const payload = {
                    ...props.formPayload,
                  };
                  payload['purpose'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                label={'Luggage Detail (سامان کی تفصیل)'}
                id={'luggage-detail'}
                require={false}
                icon={'icon-boxes'}
                defaultValue={props?.formPayload?.luggageDetail ?? ''}
                setValue={(value) => {
                  const payload = {
                    ...props.formPayload,
                  };
                  payload['luggageDetail'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
            <div className="col-lg-6">
              <InputWidget
                type={'input'}
                label={'Description تفصیل'}
                id={'description'}
                require={false}
                icon={'icon-operator'}
                defaultValue={props?.formPayload?.description ?? ''}
                setValue={(value) => {
                  const payload = {
                    ...props.formPayload,
                  };
                  payload['description'] = value;
                  props.setFormPayload(payload);
                }}
              />
            </div>
          </div>
      </div>
    </div>
  );
};

export default VisitorDetail;
