import { useState } from "react"
import "./Chat.scss"
import Message from "./Message"
import {FaPaperPlane} from "react-icons/fa"
import { useSelector } from "react-redux"
const Chat = () => {


   const {messages, user} = useSelector(state => state.auth)
  return (
    <div className="chat">
        {messages.length > 0 ? (
                   messages.map((message) => (
                    <Message key={message.id} mine={message.exp_user_id === user.id } message={message}/>
                ))
        ): (
            <p>Vous n'avez pas encore de message</p>
        )}
     
   
     
 
    </div>
  )
}
export default Chat