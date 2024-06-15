import { Button, Card, Dropdown } from "react-bootstrap";
import useWebSocket from "react-use-websocket";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckAll, Send, ThreeDots } from "react-bootstrap-icons";
import Forward from "../components/Forward";
import chatperson from "../Images/chat_person.png";

const ChatAFriend = ({ id }) => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";

  const [User, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [allmessages, setallmessages] = useState([]);
  const [allusers, setallusers] = useState([]);
  const [name, setname] = useState("");

  const [isBlocked, setisBlocked] = useState(false);

  const [msgForward, setmsgForward] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${userURL}/${sessionStorage["userId"]}`
      );
      setUser({ ...data });
      const conv = await data.conversations.find((c) => c.with === id);
      conv?.conversation.map((msg) => {
        allmessages.push(msg);
      });
      setname(conv?.name);
      const { data: users } = await axios.get(userURL);
      setallusers([...users]);

      data.blocked.map((b) => {
        if (b === id) setisBlocked(true);
      });
    };
    fetchData();
  }, []);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {});

  useMemo(() => {
    if (readyState) {
      sendJsonMessage({ type: "LOGIN", _id: sessionStorage["userId"] });
    }
  }, [readyState]);

  useMemo(() => {
    if (lastMessage !== null) {
      console.log(lastMessage);
      setallmessages([...allmessages, { msg: lastMessage.data, typee: "r" }]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setallmessages([...allmessages, { msg: message, typee: "s" }]);
      sendJsonMessage({
        type: "friend",
        message: message,
        _id: id,
        from: sessionStorage["userId"],
        isblocked: isBlocked ? "YES" : "NO",
      });
    }
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      handleSendMessage();
    }
  };

  const block = async () => {
    const resp = await axios.put(`${userURL}/${sessionStorage["userId"]}`, {
      blocked: [...User.blocked, id],
    });
    setisBlocked(true);
  };

  const unBlock = async () => {
    User.blocked = User.blocked.filter((b) => b !== id);
    const resp = await axios.put(`${userURL}/${sessionStorage["userId"]}`, {
      blocked: [...User.blocked],
    });
    setisBlocked(false);
  };

  return (
    <>
      <Card style={{ borderBottom: "unset", borderRadius: "unset" }}>
        <Card className="bg-light px-1 pt-1" style={{ border: "unset" }}>
          <Card className="bg-transparent" style={{ border: "unset" }}>
            <img
              className="m-auto "
              src={chatperson}
              alt=""
              style={{ width: "60px" }}
            />
            <Card.Text className="h3 m-auto">{name?.toUpperCase()}</Card.Text>
          </Card>
          <Dropdown className="me-auto pe-1" style={{ width: "max-content" }}>
            <Dropdown.Toggle className=" no-arrow-dropdown">
              <ThreeDots size={20} color="black" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={isBlocked ? unBlock : block}>
                {isBlocked ? "unBlock" : "Block"}
              </Dropdown.Item>
              <Dropdown.Item>Mute</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card>
        <Card.Body style={{ overflowY: "auto", height: "480px" }}>
          {allmessages?.map((m, index) => {
            return m.typee === "s" ? (
              <Card
                className="mt-1 ms-auto ps-4 p-1 bg-primary message-sent"
                key={index}
                style={{ width: "max-content" }}
              >
                <span
                  style={{ cursor: "pointer" }}
                  value={m.msg}
                  onClick={() => setmsgForward(m.msg)}
                >
                  {m.msg}
                  <CheckAll className="text-muted" />
                </span>
              </Card>
            ) : (
              <Card className="flex-row p-1" style={{ border: "unset" }}>
                <img src={chatperson} alt="" style={{ width: "40px" }} />
                <Card
                  className=" ms-1 me-auto pe-4 p-1 message-receive "
                  key={index}
                  style={{ width: "max-content" }}
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setmsgForward(m.msg)}
                  >
                    {m.msg}
                  </span>
                </Card>
              </Card>
            );
          })}
        </Card.Body>
        {isBlocked && (
          <span className="mb-2 text-muted">This contact is blocked</span>
        )}
        <Card className="flex-row send-message">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isBlocked ? true : false}
          />
          <Button
            className="p-0"
            onClick={handleSendMessage}
            disabled={isBlocked ? true : false}
          >
            <Send size={20} />
          </Button>
        </Card>

        <Forward
          allconversations={User.conversations}
          allUsers={allusers}
          msgtoforward={msgForward}
          block={isBlocked}
          forwardedFrom={id}
          setmsgforward={() => {
            setmsgForward("");
          }}
        />
      </Card>
    </>
  );
};

export default ChatAFriend;
