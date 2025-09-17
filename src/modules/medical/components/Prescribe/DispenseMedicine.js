import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import InputWidget from '../../../../droppables/InputWidget';

const DispenseMedicine = ({
  DispenseModalIsVisible,
  handleDispenseCloseModal,
  onUpdate,
  minLength,
  type
}) => {
  const [defaultFocus, setDefaultFocus] = useState(false);
  console.log(minLength);
  const [qty, setQty] = useState();
  console.log(minLength);

  const updatedHandler = () => {
    if (+qty > +minLength) {
      swal(
        'Issued quantity cannot be greater than required quantity.',
        '',
        'warning'
      );
    } else {
      onUpdate?.(+qty);
      setQty(null);
    }
  };

  return (
    <>
      <Modal
        show={DispenseModalIsVisible}
        onHide={handleDispenseCloseModal}
        size="md modal-center"
      >
        <Modal.Header closeButton style={{ padding: '1.25rem 1.25rem' }}>
          <h5 class="modal-title" id="exampleModalgridLabel">
            {/* {title} */}
          </h5>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              {type != 'inventory' &&
              <div className="col-lg-12">
                <InputWidget
                  type={'input'}
                  inputType={'number'}
                  id={'number-of-medicine'}
                  autoFocus={(element) => {
                    if (!defaultFocus) {
                      setDefaultFocus(true)
                      element.focus();
                    }
                  }}
                  label={'Number of Medicine'}
                  require={false}
                  icon={'icon-number'}
                  defaultValue={qty}
                  setValue={(value) => {
                    console.log('qty', value);
                    setQty(value);
                  }}
                />
                <button
                  id={'save-btn'}
                  type="button"
                  className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-auto"
                  onClick={updatedHandler}
                >
                  Save
                </button>
              </div>
                  }
              {type && type == 'inventory' &&

                <div className="col-lg-12">
                  <InputWidget
                    type={'input'}
                    inputType={'number'}
                    id={'number-of-item'}
                    autoFocus={(element) => {
                      if (!defaultFocus) {
                        setDefaultFocus(true)
                        element.focus();
                      }
                    }}
                    label={'Number of Item'}
                    require={false}
                    icon={'icon-number'}
                    defaultValue={qty}
                    setValue={(value) => {
                      console.log('qty', value);
                      setQty(value);
                    }}
                  />
                  <button
                    id={'save-btn'}
                    type="button"
                    className="btn btn-success lg-btn submit-prim waves-effect waves-light mx-auto"
                    onClick={updatedHandler}
                  >
                    Save
                  </button>
                </div>
              }
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DispenseMedicine;
