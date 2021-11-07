import React from "react";

interface MessageFormProps {
  handleMessageSubmit: React.FormEventHandler
}

const MessageForm: React.FC<MessageFormProps> = ({ handleMessageSubmit }) => {
  return (
    <form id="form" onSubmit={handleMessageSubmit} className="is-flex is-flex-direction-row mb-2">
      <input 
        type="text" 
        name="message" 
        id="message" 
        className="input"/>
      <button type="submit" className="button is-primary">Send</button>
    </form>
  )
}

export default MessageForm;