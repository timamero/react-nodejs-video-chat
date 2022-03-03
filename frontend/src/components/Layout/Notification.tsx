import React from "react";
import { useAppSelector } from '../../app/hooks';


const Notification = () => {
  const notificationData = useAppSelector(state => state.notification)
  return (
    <div className={`${notificationData.notificationType} notification is-flex is-flex-direction-row is-justify-content-center is-align-items-center`}>
      {notificationData.notificationContent}
      {notificationData.isLoading && <span className="bulma-loader-mixin ml-2"></span>}
    </div>
  )
}

export default Notification;