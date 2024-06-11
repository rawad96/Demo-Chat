import useWebSocket, { ReadyState } from "react-use-websocket";
import { useCallback, useEffect, useState } from "react";
import { DefaultEditor, Editor } from "react-simple-wysiwyg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Main from "./pages/Main";
import ChatAFriend from "./pages/ChatAFriend";
import Last from "./pages/Last";
import GroupChat from "./pages/GroupChat";

function App() {
  // const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState([]);

  // const WS_URL = 'ws://localhost:3000'

  // const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
  //   onOpen: () => {
  //     console.log('Connected');
  //   },
  // })

  // const handleChangeInput = (e) => {
  //   setMessage(e.target.value)
  // }

  // const handleSendMessage = () => {
  //   if (message.trim() !== '') {
  //     sendJsonMessage({ message: message, _id: "" })
  //   }
  // }

  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSendMessage()
  //   }
  // }
  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     setMessages([...messages, lastMessage.data])
  //   }
  // }, [lastMessage])

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createacc" element={<Create />} />
        <Route path="/main" element={<Main />} />
        <Route path="/chatafriend" element={<ChatAFriend />} />
        <Route path="/last20conversations" element={<Last />} />
        <Route path="/groupchat" element={<GroupChat />} />
      </Routes>
      {/* <div>
        <div>
          messages
          {
            messages.map((msg, index) => {
              return <div key={index}>{msg}</div>
            })
          }
        </div>
        <input type="text" placeholder='Type your message...' value={message} onChange={handleChangeInput} />
        <button onClick={handleSendMessage}>send</button>
      </div> */}
    </>
  );
}

export default App;
