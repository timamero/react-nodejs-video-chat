import React, { memo } from "react";

interface MessageProps {
  message: string;
  className: string;
}

const Message: React.FC<MessageProps> = memo(({ message, className }) => {
  return (
    <div className={`message box ${className}`}>
      {message}
    </div>
  )
})

export default Message;