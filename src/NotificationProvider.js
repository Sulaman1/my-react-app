import React from "react";
import { useSelector } from "react-redux";
import {v4} from 'uuid';
import NotificationItem from "./components/notification/notificationItem";

const NotificationProvider = ({ children }) => {

  const notes = useSelector((state) => state?.notification?.notes);

  return (
    <div>
      <div className="notification-wrapper">
        {notes?.map(note => {
          if(note.message){
            return <NotificationItem key={note.id} {...note} />
          }
        })}
      </div>
      {children}
    </div>
  )
}

export default NotificationProvider;