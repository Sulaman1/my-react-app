import moment from "moment-mini";
import { useState, useCallback } from 'react';
import { useSelector } from "react-redux";
import Button from "./Button";

export const validateNumber = (e) => {
  const reg = /^[0-9\b-]+$/;
  let preval = e.target.value;
  if (e.target.value === "" || reg.test(e.target.value)) return true;
  else e.target.value = preval.substring(0, preval.length - 1);
};

export const allLetter = (e) => {
  const reg = /^[A-Za-z ]+$/;
  let preval = e.target.value;
  if (e.target.value === "" || reg.test(e.target.value)) return true;
  else e.target.value = preval.substring(0, preval.length - 1);
};

export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }

  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }

  return clonedObj;
};

export const transfromStringArray = (
  data,
  selectedData,
  dataType,
  filterType,
  transformType
) => {
  if (!data || !selectedData) {
    return;
  }
  let dt = data;
  /*if (typeof (dt) === "string") {
		dt = dt.split(' ');
	} else if (typeof (dt) === "number") {
		dt = `${dt}`.split(' ');
	}*/
  /*if (dt && dt.length > 0) {
		return dt.map((item) => ({ value: item, label: item }));
	}*/
  let newArray = [];
  if (typeof selectedData === "object") {
    if (dataType && dataType === "object-arrays") {
      selectedData.forEach((element) => {
        if(transformType === "Gaurd"){
          newArray.push(
            data.filter(function (el) {
              return el.value === element.policeOfficerId;
            })[0]
          );
        }else{
          newArray.push(
            data.filter(function (el) {
              return el.value === element.prisonId;
            })[0]
          );
        }
       
      });
    } else {
      selectedData.forEach((element) => {
        newArray.push(
          data.filter(function (el) {
            return dataType && dataType === "array" && filterType !== "value"
              ? el.label === element
              : el.value === element;
          })[0]
        );
      });
    }
  } else {
    newArray = data.filter(function (el) {
      return el.value === selectedData;
    });
  }
  return newArray;
};

export const gridData = [
  [
    { readOnly: true, value: "" },
    { readOnly: true, value: "Day Plan" },
    { readOnly: true, value: "Details" },
  ],
  [{ readOnly: true, value: "00:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "01:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "02:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "03:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "04:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "05:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "06:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "07:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "08:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "09:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "10:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "11:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "12:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "13:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "14:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "15:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "16:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "17:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "18:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "19:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "20:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "21:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "22:00" }, { value: "" }, { value: "" }],
  [{ readOnly: true, value: "23:00" }, { value: "" }, { value: "" }],
];

export const transformDataForTableGrid = (data) => {
  const dt = data?.map((el) => Object.values(el));
  return dt;
};

export const transformData = (data,isTrue) => {
  
  if (data && data.length > 0) {
    if( isTrue) {
      return data.map(({ fullName, id }) => ({ value: id, label: fullName }));
    }else{
      return data.map(({ name, id }) => ({ value: id, label: name }));
    }

    
  }
};

export const transformEmployeeData = (data) => {
  if (data && data.length > 0) {
    return data.map(({ userName, id }) => ({ value: id, label: userName }));
  }
};

export const formatDate = (date) => {
  if (!date) {
    return null;
  } else {
    return moment(date).format("YYYY-MM-DD");
  }
};

export const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};




export const useCheckbox = (initialValue = false) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleCheckboxChange = useCallback(() => {
    setIsChecked(prevValue => !prevValue);
  }, []);

  return [isChecked, handleCheckboxChange];
}

export const getFormattedDate = (date) => (date ? new Date(date) : null);

export const scrollToTop = () => {
  const body = document.querySelector("#root");
  body.scrollIntoView(
    {
      behavior: "smooth",
    },
    500
  );
};
export const formatDateAndTime = (dateString)=> {
  if (!dateString) return "";

  const date = new Date(dateString);

  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
}

export const validateDate = (dateString) => {
  if (!dateString) return false;
  const dt = new Date(dateString);
  let isValid = true;
  
  if (dt.getFullYear() === 1 || dt === "Invalid Date") {
    isValid = false;
    return isValid;
  }

  // If date is valid, format it
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const day = dt.getDate().toString().padStart(2, '0');
  const month = months[dt.getMonth()];
  const year = dt.getFullYear();
  
  return `${day}-${month} ${year}`;
};

export const  formatedTime = (isoDate) => {
  const date = new Date(isoDate);

// Extract the time components
const hours = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();

// Format the time as a string (HH:MM:SS)
const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
return formattedTime;
}

export const getItemFromList = (list, id) => {
  if (list && id) {
    return list.find((item) => item.value === id)?.label;
  }
};

export const getValueFromList = (list, id) => {
  if (list && id) {
    return list.find((item) => item.value === id) ?? "";
  }
};

export const getDateMinusDays = (date, days) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
};

export const getDatePlusDays = (date, days) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
};

export function getIds(data) {
  return data.map((item) => item.value);
}

export function removeSpace(inputString) {
  return inputString.split(" ").join("");
}

export function generateActionButtons({events,data,key, userMeta, extraProps}) {
 
  const actionButtons = [];
  if(userMeta?.role && userMeta?.permissions?.length) { 
    
      const actions = userMeta?.permissions?.find((el) => el.view === key)
      if(data.appealInProgress == true) {
        actionButtons.push(
          <Button 
            id={"view-more-btn"}
            classes={"tooltip btn btn-danger waves-effect waves-light mx-1 "}
            label={"Appeal In process"}
            icon="icon-glamping"
          />
        )
      }
      
      if(data.retrailInProgress == true) {
        actionButtons.push(
          <Button 
            id={"view-more-btn"}
            classes={"tooltip btn btn-danger waves-effect waves-light mx-1 "}
            label={"Re-trial"}
            icon="icon-glamping"
          />
        )
      }
         
      actions.permissions.forEach(item => {
       switch (item) {
        case 'view':
          actionButtons.push(
            <Button
            id={"view-btn"}
            handleClick={ () => {events.view(data)}}
            classes={"tooltip btn btn-success waves-effect waves-light mx-1"}
            label={"View"}
            icon="icon-show-password"
          />
          )
          break;
        case 'edit':
          actionButtons.push(
            <Button 
            id={"edit-btn"}
            handleClick={ () => { events.edit(data) }}
            classes={"tooltip  btn btn-warning waves-effect waves-light"}
            label={!data.prisonName ? "Add" : "Edit"}
            icon="icon-edit"
            />
          )
          break;
        case 'add':
          actionButtons.push(
            <Button 
              id={"add-details-btn"}
              handleClick={ () => {events.add(data)}}
              classes={"tooltip btn btn-secondary waves-effect waves-light mx-1 "}
              label={"Add Details"}
              icon="icon-add"
            />
          )
          break;
        case 'allocate':
          {extraProps == 1 &&
            actionButtons.push(
            <>
            <Button 
              id={"Allocate"}
              handleClick={ () => {events.allocate(data)}}
              classes={"tooltip  btn  btn-primary waves-effect waves-light mx-2"}
              label={"Allocate"}
              icon="icon-culutural"
              />
              </>
         
          )}
          break;
        case 'reallocate':
          {extraProps != 1 &&
          actionButtons.push(
            <Button 
              id={"Re-Allocate"}
              handleClick={ () => {events.reallocate(data)}}
              classes={"tooltip  btn  btn-primary waves-effect waves-light mx-1"}
              label={"Re-Allocate"}
              icon="icon-culutural"
            />
          )
        }
          break;
        case 'allocationhistory':
          {extraProps != 1 &&
          actionButtons.push(
            <Button 
              id={"allocation-history"}
              handleClick={ () => {events.allocationhistory(data)}}
              classes={"tooltip  btn  btn-success waves-effect waves-light mx-2"}
              label={"Allocation History"}
              icon="icon-culutural"
            />
          )
        }
          break;
        default:
          break;
       }

      })
  }
    return (
        <div className="action-btns">
          {actionButtons}
        </div>
      );
}

// Function for cleaning the null and empty values from the payload
export const cleanThePayload = (payload) => {
  return Object.keys(payload).reduce((acc, key) => {
    if (payload[key] !== null && payload[key] !== '') {
        acc[key] = payload[key];
  }
    return acc;
  }, {});
}

export const cleanReportsPayload = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value];
      }
      if (value && typeof value === 'object' && !isNaN(Object.keys(value)[0])) {
        return [key, Object.values(value)];
      }
      if (value && typeof value === 'object') {
        const cleaned = cleanReportsPayload(value);
        return [key, Object.keys(cleaned).length ? cleaned : undefined];
      }
      if (value === false) {
        return [key, false];
      }
      return [key, value || undefined];
    }).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null;
    })
  );
};