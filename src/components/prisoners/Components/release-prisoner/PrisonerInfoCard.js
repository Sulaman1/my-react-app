import React from "react";
import { baseImageUrl } from "../../../../services/request";
import dummyPic from "../../../../assets/images/users/1.jpg";
import Carousel from "react-bootstrap/Carousel";
import { validateDate } from "../../../../common/Helpers";
import { useSelector } from "react-redux";
const PrisonerInfoCard = ({ prisoner, title }) => {
  const show = useSelector((state) => state.language.urdu);
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="third-heading">
            {title || "Prisoner Basic Information "}{" "}
            {show && (
              <label className="urdu-font"> (قیدی کی بنیادی معلومات)</label>
            )}
          </h4>
          <div className="row d-flex ">
            <div className="col-lg-2 details-photo">
              <Carousel>
                <Carousel.Item className="slide-item">
                  <div className="avatar-pic ">
                    <>
                      <img
                        src={
                          prisoner?.frontPic
                            ? baseImageUrl + prisoner?.frontPic
                            : dummyPic
                        }
                        className="avatar-xs rounded-circle"
                        alt=""
                      />
                    </>
                  </div>
                </Carousel.Item>
                <Carousel.Item className="slide-item">
                  <div className="avatar-pic ">
                    <>
                      <img
                        src={
                          prisoner?.frontPic && prisoner?.leftPic
                            ? baseImageUrl + prisoner?.leftPic
                            : dummyPic
                        }
                        className="avatar-xs rounded-circle"
                        alt=""
                      />
                    </>
                  </div>
                </Carousel.Item>
                <Carousel.Item className="slide-item">
                  <div className="avatar-pic ">
                    <>
                      <img
                        src={
                          prisoner?.frontPic && prisoner?.rightPic
                            ? baseImageUrl + prisoner?.rightPic
                            : dummyPic
                        }
                        className="avatar-xs rounded-circle"
                        alt=""
                      />
                    </>
                  </div>
                </Carousel.Item>
              </Carousel>
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
                              Prisoner Number{" "}
                              {show && (
                                <label className="urdu-font">(قیدی نمبر)</label>
                              )}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">
                                {prisoner?.category || ""}{" "}
                                {prisoner?.category ? "-" : ""}{" "}
                                {prisoner?.prisonerNumber}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              Prisoner Name:{" "}
                              {show && (
                                <label className="urdu-font">(نام)</label>
                              )}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{prisoner?.fullName}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              Grand Father Name:{" "}
                              {show && (
                                <label className="urdu-font">(نام)</label>
                              )}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{prisoner?.grandFatherName}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                            Relationship Type:{" "}
                              {show && (
                                <label className="urdu-font">(ولدیت)</label>
                              )}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{prisoner?.relationshipType}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                            Relationship Name:{" "}
                              {show && (
                                <label className="urdu-font">(ولدیت)</label>
                              )}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{prisoner?.relationshipName}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              Prison Name:{" "}
                              {show && (
                                <label className="urdu-font">(جیل)</label>
                              )}{" "}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{prisoner?.prisonName}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              CNIC:{" "}
                              {show && (
                                <label className="urdu-font">
                                  (شناختی تارڈ)
                                </label>
                              )}{" "}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">{prisoner?.cnic}</h3>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item">
                        <div class="d-flex align-items-center pagi-list">
                          <div class="flex-grow-1 overflow-hidden">
                            <p className="born fs-14 timestamp md-0">
                              Admission Date:{" "}
                              {show && (
                                <label className="urdu-font">
                                  (داخلہ تاریخ)
                                </label>
                              )}{" "}
                            </p>
                          </div>
                          <div class="flex-shrink-0 ms-2">
                            <div>
                              <h3 class="fs-16 mb-1">
                                {validateDate(prisoner?.admissionDate) || ""}
                              </h3>
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

export default PrisonerInfoCard;
