import { baseImageUrl } from '../../../../services/request';
import React from "react"
const mockUrl =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy2swEhaovbs0u5Aic_i1XaO20WfwutWsqbGVKpuNXYZVJEoWGgbj0zoMNoVzFmnsEoRo&usqp=CAU';

const EmployeeInfoCard = ({ emp, title }) => {
  const prisonArray = emp?.prison.split(',');
  const count = prisonArray?.length - 2;
  const firstTwoPrisons = prisonArray?.slice(0, 2);
  const restPrisons = count > 0 ? ` and ${count} more` : '';
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="third-heading">{title}</h4>
          <div className="row d-flex ">
            <div className="col-lg-2">
              <div className="avatar-pic ">
                <>
                  <img
                    src={emp?.imgUrl ? baseImageUrl + emp.imgUrl : mockUrl}
                    className="avatar-xs rounded-circle"
                    alt=""
                  />
                </>
              </div>
            </div>
            <div class="col-lg-10">
              <div class="card-body">
                <div id="pagination-list">
                  <div class="d-flex just-space mx-n3">
                    <ul class="list col-xl-12 list-group list-group-flush grid-5-5 mb-0">
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              Employee Number (ملازم کا نمبر)
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{emp?.employeeNumber}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              Employee Name: (ملازم کا نام)
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{emp?.fullName}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              Department: (شعبہ)
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{emp?.department}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              Prison Name: (جیل کا نام){' '}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                            {firstTwoPrisons?.map((prisonName, index) => (
                                <h3 className="fs-16 mb-1" key={index}>{prisonName}</h3>
                              ))}
                              {count > 0 && (
                                <h3 className="fs-16 mb-1">
                                  {restPrisons}
                                </h3>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">Role: (کردار) </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{emp?.role}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">Bps: (بی پی ایس) </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{emp?.bps}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeInfoCard;
