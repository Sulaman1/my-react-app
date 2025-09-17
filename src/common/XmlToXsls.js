import axios, { AxiosRequestConfig, Method } from 'axios';
import { postData } from '../services/request';
import swal from 'sweetalert';

export const apiDownloadRequest = async (payload = {}) => {
  const res = await postData(
    "/services/app/Reports/MasterReportCsv",
    payload
  );
  const {result} = res; 
  FileDownloadButton(result);
}

const FileDownloadButton = (pdf) => {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    console.log(linkSource);
    downloadLink.href = linkSource;
    downloadLink.target = "_blank";
    downloadLink.click();
}

export const apiExcelRequest = async (columns, data) => {
  const payload = {
    columns: columns,
    data: data
  };
  
  try {
    const res = await postData("/services/app/Reports/MasterReportExel", payload);
    const { result, success, error } = res;
    
    if (!success) {
      // Show error message with sweetalert
      swal({
        title: "Export Failed",
        text: error?.message || 'Failed to generate Excel report',
        icon: "error",
        button: "OK",
      });
      return;
    }
    
    if (!result) {
      swal({
        title: "Export Failed",
        text: "No data received from server",
        icon: "error",
        button: "OK",
      });
      return;
    }

    FileDownloadButton(result);
    swal({
      title: "Success",
      text: "Excel report generated successfully",
      icon: "success",
      timer: 1500,
      buttons: false,
    });
  } catch (error) {
    console.error("Error downloading Excel:", error);
    swal({
      title: "Export Failed",
      text: "Failed to generate Excel report",
      icon: "error",
      button: "OK",
    });
  }
};