import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeNotificationItem } from "../../store/notificationSlice";
import info from "../../assets/images/notificationicons/1.svg";
import success from "../../assets/images/notificationicons/1.svg";
import error from "../../assets/images/notificationicons/1.svg";
import warning from "../../assets/images/notificationicons/1.svg";

const NotificationItem = (props) => {
  const dispatch = useDispatch();
  const [exit, setExit] = useState(false);

  // Get icon based on notification type
  const getIcon = () => {
    switch (props.type) {
      case "SUCCESS":
        return success;
      case "ERROR":
        return error;
      case "INFO":
        return info;
      case "WARNING":
        return warning;
      default:
        return info;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCloseNotification();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleCloseNotification = () => {
    setExit(true);
    setTimeout(() => {
      dispatch(removeNotificationItem(props));
    }, 500); // Wait for exit animation to complete
  };

  return (
    <div
      className={`notification-item ${props.type?.toLowerCase()} ${exit ? "exit" : ""}`}
    >
      <div className="d-flex">
        <div className="notification-item-logo">
          <img src={getIcon()} alt="" height="43" width="43" />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-start notification-item-body-custom">
          <span className="notification-item-header">
            {props.title || "Notification"}
          </span>
          <div className="toast-body-custom">
            {props.message || "Hello, world! This is a toast message."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
