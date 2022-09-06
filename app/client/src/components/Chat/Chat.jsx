import { useState } from "react"
import "./Chat.scss"
import Message from "./Message"
import {FaPaperPlane} from "react-icons/fa"
import { useSelector } from "react-redux"
const Chat = () => {

  // const messages = [
  //   {
  //     id: "1",
  //     isMine: true,
  //     avatar: "https://randomuser.me/api/portraits/men/57.jpg",
  //     message: "hello",
  //     user: "Ypm",
  //     date: "22/20/2002"
  //   },
  //   {
  //     id: "2",
  //     isMine: false,
  //     avatar: "https://randomuser.me/api/portraits/men/57.jpg",
  //     message: "hello",
  //     user: "Ypm",
  //     date: "22/20/2002"
  //   },
  //   {
  //     id: "3",
  //     isMine: true,
  //     avatar: "https://randomuser.me/api/portraits/men/57.jpg",
  //     message: "hello",
  //     user: "Ypm",
  //     date: "22/20/2002"
  //   },
  // ]

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
        {/* {messages.map(message => (
          <Message key={message.id} mine={message.isMine} message={message}/>
        ))} */}
  
    </div>
  )
}
export default Chat