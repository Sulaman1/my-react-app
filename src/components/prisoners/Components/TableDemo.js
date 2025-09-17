

import ProfilePic from "./../../../assets/images/users/1.jpg";

const TableDemo = () => {
    return (
        <>

            <div className="row">
                <div className="responsive-table">
                    <div className="table-header">
                    <h2>Prisoner List</h2>
                    <div className=" head-btns">
                    <button type="button" class="app-btn green-btn"><i class="icon-file label-icon align-middle  fs-16 me-2"></i> CSV</button>
                   
                  <input type="text" placeholder="Type Search Key" ></input>
             
                    <button class="app-btn blue-btn">Show Search</button>
                    </div>
                    </div>
                    
                    <table className="user-table-ui">
                        <tr>
                            <th className="table-hends"><span>قیدی نمبر</span>Number</th>
                            <th className="table-hends"><span>قیدی کی تفصیلات</span> Prisoner Details</th>
                            <th className="table-hends"><span>تاریخ داخلہ</span>Admission Date</th>
                            <th className="table-hends" ><span>ایف آئی آر نمبر</span>FIR Number</th>
                            <th className="table-hends"><span>دفعات</span>Under section</th>
                            <th className="table-hends"><span>جیل</span>Prison Name</th>
                            <th className="table-hends"><span>عملدرامد</span>Action</th>
                        </tr>
                        <tbody>
                            <tr>
                                <td className="number"><span className="key">Number</span>UTP-117</td>
                                <td className="profille-card-ui">


                                    <div className="dp">
                                        <img src={ProfilePic} alt="" />
                                    </div>
                                    <div className="text">
                                        <div>
                                            <p className="name">Tariq mehmood</p>
                                            <p>CNIC: 2132343234545</p>
                                            <p>S/O: Khalid Mirza</p>
                                        </div>
                                        <div></div>
                                    </div>
                                   


                                </td>
                                <td className="admission"><span className="key">Admission Date</span>Mon Jul 31 2023</td>
                                <td className="fir"><span className="key">FIR</span>234</td>
                                <td className="section"><span className="key">Under section</span>CrPC/CrPC-101,CCP/CCP-102,</td>
                                <td className="prison"><span className="key">Prison</span>District Prison Islamabad</td>
                                <td className="action"><div><div className="action-btns"><button id="add-details-btn" type="button" className="tooltip btn btn-secondary waves-effect waves-light mx-1"><i className="icon-add"></i><span>Add Details</span></button><button id="view-btn" className="tooltip btn btn-success waves-effect waves-light mx-1" type="button"><i className="icon-show-password"></i><span>View</span></button></div></div></td>


                            </tr>
                            <tr>
                                <td className="number"><span className="key">Number</span>UTP-117</td>
                                <td className="profille-card-ui">


                                    <div className="dp">
                                        <img src={ProfilePic} alt="" />
                                    </div>
                                    <div className="text">
                                        <div>
                                            <p className="name">Tariq mehmood</p>
                                            <p>CNIC: 2132343234545</p>
                                            <p>S/O: Khalid Mirza</p>
                                        </div>
                                        <div></div>
                                    </div>
                                  


                                </td>
                                <td className="admission"><span className="key">Admission Date</span>Mon Jul 31 2023</td>
                                <td className="fir"><span className="key">FIR</span>234</td>
                                <td className="section"><span className="key">Under section</span>CrPC/CrPC-101,CCP/CCP-102,</td>
                                <td className="prison"><span className="key">Prison</span>District Prison Islamabad</td>
                                <td className="action"><div><div className="action-btns"><button id="add-details-btn" type="button" className="tooltip btn btn-secondary waves-effect waves-light mx-1"><i className="icon-add"></i><span>Add Details</span></button><button id="view-btn" className="tooltip btn btn-success waves-effect waves-light mx-1" type="button"><i className="icon-show-password"></i><span>View</span></button></div></div></td>


                            </tr>
                            <tr>
                                <td className="number"><span className="key">Number</span>UTP-117</td>
                                <td className="profille-card-ui">


                                    <div className="dp">
                                        <img src={ProfilePic} alt="" />
                                    </div>
                                    <div className="text">
                                        <div>
                                            <p className="name">Tariq mehmood</p>
                                            <p>CNIC: 2132343234545</p>
                                            <p>S/O: Khalid Mirza</p>
                                        </div>
                                        <div></div>
                                    </div>
                                   


                                </td>
                                <td className="admission"><span className="key">Admission Date</span>Mon Jul 31 2023</td>
                                <td className="fir"><span className="key">FIR</span>234</td>
                                <td className="section"><span className="key">Under section</span>CrPC/CrPC-101,CCP/CCP-102,</td>
                                <td className="prison"><span className="key">Prison</span>District Prison Islamabad</td>
                                <td className="action"><div><div className="action-btns"><button id="add-details-btn" type="button" className="tooltip btn btn-secondary waves-effect waves-light mx-1"><i className="icon-add"></i><span>Add Details</span></button><button id="view-btn" className="tooltip btn btn-success waves-effect waves-light mx-1" type="button"><i className="icon-show-password"></i><span>View</span></button></div></div></td>


                            </tr>
                            <tr>
                                <td className="number"><span className="key">Number</span>UTP-117</td>
                                <td className="profille-card-ui">


                                    <div className="dp">
                                        <img src={ProfilePic} alt="" />
                                    </div>
                                    <div className="text">
                                        <div>
                                            <p className="name">Tariq mehmood</p>
                                            <p>CNIC: 2132343234545</p>
                                            <p>S/O: Khalid Mirza</p>
                                        </div>
                                        <div></div>
                                    </div>
                                    <div className="text">
                                        <div className="status allocated">
                                            <i className="icon-prison"></i>
                                        </div>
                                    </div>


                                </td>
                                <td className="admission"><span className="key">Admission Date</span>Mon Jul 31 2023</td>
                                <td className="fir"><span className="key">FIR</span>234</td>
                                <td className="section"><span className="key">Under section</span>CrPC/CrPC-101,CCP/CCP-102,</td>
                                <td className="prison"><span className="key">Prison</span>District Prison Islamabad</td>
                                <td className="action"><div><div className="action-btns"><button id="add-details-btn" type="button" className="tooltip btn btn-secondary waves-effect waves-light mx-1"><i className="icon-add"></i><span>Add Details</span></button><button id="view-btn" className="tooltip btn btn-success waves-effect waves-light mx-1" type="button"><i className="icon-show-password"></i><span>View</span></button></div></div></td>


                            </tr>


                        </tbody>
                    </table>
                    <div className="flex just-right">
                        <ul className="pagination pull-right">
                            <li><a href="#"><span><i className="fa-solid fa-backward"></i></span></a></li>
                            <li><a href="#"><span>1</span></a></li>
                            <li><a href="#"><span>2</span></a></li>
                            <li><a href="#"><span>3</span></a></li>
                            <li><a href="#"><span>4</span></a></li>
                            <li><a href="#"><span>5</span></a></li>
                            <li><a href="#"><span><i className="fa-solid fa-forward"></i></span></a></li>
                        </ul>
                    </div>
                </div>
              
            </div>

        </>
    )
}
export default TableDemo;