import React, { useEffect, useRef, useState } from 'react';
import ProfilePic from '../../../../src/assets/images/users/1.jpg'
//import { useHistory } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";

import { validateDate } from '../../../common/Helpers';
import { baseImageUrl } from '../../../services/request';
import $ from "jquery";

const PrintMarasla = props => {
	const stateParamVal = useLocation().state?.stateParam;

	const [logo, setLogo] = useState('');

	const Logo = () => {
	  
	  import(`../../${process.env.REACT_APP_LOGO}`).then((module) => {
		setLogo(module.default);
	  });
	
	  return (
		<img src={logo} alt="" height="100" width="100" style={{ "borderRadius": "10px" }}/>
	  );
	};

	
	useEffect(() => {

		const timeout = setTimeout(() => {
			handlePrint();
		}, 200);
		return () => clearTimeout(timeout);

	}, []);


	const handlePrint = () => {
		var restorepage = $('body').html();
		var printcontent = $('#my-element').clone();
		$('body').empty().html(printcontent);
		window.print();
		$('body').html(restorepage);
		window.location.href = "/admin/court-production/list?tab=3";
		// history.goBack()

	}
	const myElementRef = useRef(null);

	const today = new Date();
	const time = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
	const formattedDate = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;


	return (
		<>
			<div className='print-marasla' id="my-element" ref={myElementRef}>
				<style>
					{`
					@media print {
						body {
					        -webkit-print-color-adjust: exact;
							print-color-adjust: exact;
						}
					}
                    .paper {
                        margin: auto;
                        width: 13in;
                        height: 8.5in;
                        background-position: center;
                        background-repeat: no-repeat;
                        padding: 0.25in;
                    }
                    .header-0 {
                        margin: 0 0 0 0 !important;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        width: 100%;
                    }
                    .parent-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 12px;
                        border: 1px solid #000 !important;
                    }
                    .parent-table th, .parent-table td {
                        vertical-align: middle;
                    }
                    .parent-th {
                        font-weight: bold;
                        text-align: center;
                        border-bottom: 1px solid #000;
                    }
                    .parent-td {
                        text-align: left;
                    }
                    .table-subheading{
                        text-align: center;
                        font-weight: bold;
                    }
                    .subheading-pad{
                        padding: 3px 0 3px 0;
						font-size: 13px !important;
                    }
                    .padding{
                        padding: 5px;
                        vertical-align: middle;
                    }
                    .padding img{
                        height: 45px;
                        border-radius: 50%;
                        vertical-align: middle;
                    }
                    .Under-Section{
                        width: 100%;
                        border-collapse: collapse;
                        margin-left: 8%;
                        text-align: left;
                    }
                    .Under-Section th {
                        vertical-align: middle;
                        font-size: 11px;
                        font-weight: bold;
                        padding: 5px;
                    }
                    .Under-Section td {
                        vertical-align: middle;
                        font-size: 10px;
                        padding: 5px;
                        word-wrap: break-word;
                        white-space: normal;
                        max-width: 80px;
                        overflow: hidden;
                    }
                    .long-section-text {
                        display: inline-block;
                        max-width: 300px;
                        word-wrap: break-word;
                        white-space: normal;
                        line-height: 1.2;
                    }
                    .officer-warrant-container {
                        display: flex;
                        justify-content: space-between;
                        font-size: 10px;
                    }
                    .officer-warrant-container div {
                        width: 50%;
                        text-align: center;
                        padding: 2px 0;
                    }
                    .signature{
                        text-align: center;
                        font-weight: bold;
                        font-size: 12px;
                        width: 150px;
                        border-top: 1px solid #000;
                        margin-top: 45px;
                        margin-left: auto;
                        margin-right: 0.5in;
                    }
						.signature p{
							margin-top: 5px;
							justify-self: center;

						}
				`}
			    </style>
                <div className="paper">
                    <div className="row header-0">
                        <div className="col-sm-4 d-flex flex-column gap-4" style={{ padding: "4px 0px 0px 3px" }}>
                            {Logo()}
                            <div >
                                <h5 style={{ fontSize: "14px", fontWeight: "normal" }}>
                                    Prison Department of <br />
                                    <b style={{ fontSize: "24px" }}>{process.env.REACT_APP_PRISON_NAME}</b>
                                    <br/>
                                    <b style={{ fontSize: "24px" }}>
                                        {stateParamVal?.e?.prisoners?.length > 0 
                                            ? stateParamVal?.e?.prisoners[0]?.prisoner?.prisonName 
                                            : ''}
                                    </b>
                                </h5>
                            </div>
                        </div>
                        <div className="col-sm-6" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div style={{ paddingTop: "26px", textAlign: "right", paddingRight: "0px" }}>
                                <div>
                                    <h4 style={{ marginRight: "0px", fontWeight: "bolder", fontSize: "24px" }}>Marasla Report</h4>
                                </div>
                                <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                                    <div style={{ paddingLeft: "10px" }}>{validateDate(formattedDate)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Case Table */}
                    <div style={{ width: "100%", marginTop: "20px" }}>
                        <table className="parent-table">
                            {/* Main Heading Row */}
                            <thead>
                                <tr className="parent-th">
                                    <th className="padding">Picture</th>
                                    <th className="padding">Full Name</th>
                                    <th className="padding">Relationship Type</th>
                                    <th className="padding">Relationship Name</th>
                                    <th className="padding">Court</th>
                                    <th className="padding">Judge</th>
                                    <th className="padding">Case Status</th>
                                    <th className="padding">Special Guard</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stateParamVal?.e?.prisoners?.map((prisoner, index) => (
                                    <React.Fragment key={index}>
                                        {/* Main Data Row */}
                                        <tr style={{ textAlign: "center", textAlignLast: "center" }}>
                                            <td className="padding">
                                                <img 
                                                    src={prisoner.prisoner.frontPic ? baseImageUrl + prisoner.prisoner.frontPic : ProfilePic} 
                                                    alt="" 
                                                />
                                            </td>
                                            <td className="padding">{prisoner.prisoner.fullName}</td>
                                            <td className="padding">{prisoner.prisoner.relationshipType}</td>
                                            <td className="padding">{prisoner.prisoner.relationshipName}</td>
                                            {/* <td className="padding">
                                                <span className="long-section-text">
                                                    {prisoner.prisoner.underSection || "not added yet"}
                                                </span>
                                            </td> */}
                                            <td className="padding">{prisoner.court || 'N/A'}</td>
                                            <td className="padding">{prisoner.judge || 'N/A'}</td>
                                            <td className="padding">{prisoner.caseData?.status || '-'}</td>
                                            <td className="padding">{prisoner.specialGuard ? "Yes" : "No"}</td>
                                        </tr>
                                        {/* Subsection Row */}
                                       
                                        {/* Divider row - only show if not the last prisoner */}
                                        {index < stateParamVal?.e?.prisoners.length - 1 && (
                                            <tr className="divider-row">
                                                <td colSpan="8" style={{ padding: 0 }}>
                                                    <div style={{ 
                                                        height: "2px", 
                                                        backgroundColor: "#000", 
                                                        width: "100%",
                                                        margin: "10px 0"
                                                    }}></div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="signature">
                        <p>Signature</p>
                    </div>
                </div>
			</div>
		</>
	);
};
export default PrintMarasla;
