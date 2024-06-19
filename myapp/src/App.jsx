import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Main from "./pages/Main";

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
