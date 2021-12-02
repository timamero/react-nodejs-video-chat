import React from "react";

const Notification = () => {
  return (
    <div className="notification is-warning is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
      Waiting for response from user
      <span className="bulma-loader-mixin ml-2"></span>
    </div>
  )
}

export default Notification;