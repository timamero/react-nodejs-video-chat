/**
 * Chat text message display
 */
 import React, { useEffect, useRef } from "react";
 import { useAppSelector } from '../../../app/hooks';
 import Message from './Message';
 
 const MessagesDisplay: React.FC = () => {
   const messages = useAppSelector(state => state.room.messages);
 
   const messageEndRef = useRef<null | HTMLDivElement>(null);
 
   const scrollToBottom = () => {
     messageEndRef.current!.scrollIntoView({ behavior: 'smooth'});
   }
 
   useEffect(() => {
     scrollToBottom();
   }, [messages]);
 
   return (
     <div id="messageDisplay" className="is-flex-grow-1 box is-flex is-flex-direction-column">
       {messages.map(message => <Message message={message.content} key={message.id} className={message.className}/>)}
       <div ref={messageEndRef} />
     </div>
   )
 }
 
 export default MessagesDisplay;