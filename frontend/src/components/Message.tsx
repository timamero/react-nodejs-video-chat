import React, { memo } from "react";

interface MessageProps {
  message: string;
}

const Message: React.FC<MessageProps> = memo(({ message }) => {
  console.log('message rendered', message)
  return (
    <div className="message box">
      {message}
    </div>
  )
})

export default Message;