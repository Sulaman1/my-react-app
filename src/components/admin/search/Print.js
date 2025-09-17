import React from 'react';
import { CSVLink } from 'react-csv';
import { apiDownloadRequest } from '../../../common/XmlToXsls';
const Print = (props) => {
    return (
        <>
        <div className='btns'>
            <CSVLink className='csv-link' data={props?.data || ''} headers={props.headers || ''} filename={props.filename || ''} >
                <button type="button" className="btn my-2 btn-success">
                    <i className="icon-file label-icon align-middle  fs-16 me-2"></i> CSV
                </button>
            </CSVLink>
            {(( props?.filename && props?.filename.indexOf('Report') > -1  && !props?.noExcel) && 
                <button type="button" className="btn my-2 btn-primary" onClick={()=>{props?.payload ? apiDownloadRequest(props.payload): {} } }>
                    <i className="icon-file label-icon align-middle  fs-16 me-2"></i> Download Excel
                </button>
            )}
               
            </div>
        </>
    )
}
export default Print;
