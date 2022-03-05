import React, { useContext, useEffect, useCallback, useRef } from "react";
import { SocketContext } from "../../context/socket";
import Message from './Message';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addMessage } from "../../app/features/roomSlice";

// export interface message {
//   content: string;
//   id: number;
//   className: string;
// }

const MessagesDisplay: React.FC = () => {
  const dispatch = useAppDispatch()

  const socket = useContext(SocketContext)
  const userId = useAppSelector(state => state.user.socketId)
  const messages = useAppSelector(state => state.room.messages)
  // const [messages, setMessages] = useState<message[]>([])

  const messageEndRef = useRef<null | HTMLDivElement>(null)

  const generateRandomNum = () => {
    return Math.floor((Math.random() * 10000))
  }

  const scrollToBottom = () => {
    messageEndRef.current!.scrollIntoView({ behavior: 'smooth'})
  }

  const updateMessages = useCallback((message) => {
    dispatch(addMessage(message))
  }, [dispatch])

  useEffect(() => {
    socket.once('receive chat message', ( messageData ) => {
      console.log('received message')
      const firstMessageClassName = messages.length === 0 ? 'mt-auto' : ''
      const userClassName = messageData.userId === userId ? 'peer1Message' : 'peer2Message'
      const newMessage = {
        content: messageData.msg,
        userId: messageData.userId,
        className: `${firstMessageClassName} ${userClassName}`,
        id: generateRandomNum()
      }
      updateMessages(newMessage)
      // dispatch(addMessage(newMessage))
      // setMessages(messages.concat(newMessage))
    })
  }, [socket, messages, userId, updateMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div id="messageDisplay" className="is-flex-grow-1 box is-flex is-flex-direction-column">
      {messages.map(message => <Message message={message.content} key={message.id} className={message.className}/>)}
      <div ref={messageEndRef} />
    </div>
    
  )
}

export default MessagesDisplay;