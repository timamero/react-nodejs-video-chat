/**
 * Chat text message
 */
import React, { memo } from "react";

interface MessageProps {
  message: string;
  className: string;
};

const Message: React.FC<MessageProps> = memo(({ message, className }) => {
  return (
    <div className={`Message box ${className} py-1 my-2`}>
      {message}
    </div>
  )
})

export default Message;