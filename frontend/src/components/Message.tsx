import React from "react";

interface MessageProps {
  message: string;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="message box">
      {message}
    </div>
  )
}

export default Message;