import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import chatperson from "../Images/chat_person.png";
import { Send, ThreeDots, CheckAll } from "react-bootstrap-icons";
import Message from "./Message";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useWebSocket from "react-use-websocket";
import Forward from "../components/Forward";

const Conversation = ({ id, responsive, refreshconversations }) => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";
  const groupsurl = import.meta.env.VITE_API_BACKEND_URL + "groups";

  const [User, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [allmessages, setallmessages] = useState([]);
  const [allusers, setallusers] = useState([]);

  const [name, setname] = useState("");

  const [isBlocked, setisBlocked] = useState("");

  const [msgForward, setmsgForward] = useState("");

  useMemo(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${userURL}/${sessionStorage["userId"]}`
      );
      setUser({ ...data });

      const conv = await data.conversations.find((c) => c.with === id);
      if (conv) {
        setname(conv.name);
        setallmessages([...conv.conversation]);
      } else {
        const { data: newuser } = await axios.get(`${userURL}/${id}`);

        setname(newuser.name);
        setallmessages([]);
      }
      const { data: users } = await axios.get(userURL);
      setallusers([...users]);
      data.blocked.map((b) => {
        if (b === id) setisBlocked(b);
      });
    };
    fetchData();
  }, [id]);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {});

  useMemo(() => {
    if (readyState) {
      sendJsonMessage({ type: "LOGIN", _id: sessionStorage["userId"] });
    }
  }, [readyState]);

  useMemo(() => {
    if (lastMessage !== null) {
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
        from: User._id,
        isblocked: isBlocked ? "YES" : "NO",
        forwarded: false,
      });
    }
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const block = async () => {
    const resp = await axios.put(`${userURL}/${User._id}`, {
      blocked: [...User.blocked, id],
    });
    setisBlocked(id);
  };

  const unBlock = async () => {
    User.blocked = User.blocked.filter((b) => b !== id);
    const resp = await axios.put(`${userURL}/${User._id}`, {
      blocked: [...User.blocked],
    });
    setisBlocked("");
  };

  const setforwardmsg = (e) => {
    setmsgForward(e);
  };

  const refresh = () => {
    if (allmessages.length === 1) {
      refreshconversations(true);
    }
  };

  return (
    <>
      <Card
        className={
          responsive
            ? "conversation conversation-show mt-4"
            : "conversation mt-4"
        }
      >
        <Card
          className="flex-row p-1 bg-light"
          style={{ border: "unset", borderRadius: "unset" }}
        >
          <img src={chatperson} alt="" style={{ width: "60px" }} />
          <h5 className="ms-2 my-auto text-uppercase">{name}</h5>
        </Card>
        <Card className="allmessages px-2">
          {allmessages?.map((msg, index) => {
            return <Message key={index} msg={msg} forwardmsg={setforwardmsg} />;
          })}
        </Card>
        {id && (
          <InputGroup className="mt-auto">
            <FormControl
              className="formcontrol"
              placeholder="Type your text..."
              value={message}
              aria-label="Type your text..."
              aria-describedby="basic-addon2"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                borderRadius: "unset",
                border: "1px solid rgb(210, 207, 207)",
                borderBottom: "unset",
                borderLeft: "unset",
              }}
            />
            <Button
              className="px-3 bg-transparent send-button"
              id="button-addon2"
              onClick={handleSendMessage}
              style={{
                borderRadius: "unset",
                border: "1px solid rgb(210, 207, 207)",
                borderBottom: "unset",
                borderRight: "unset",
              }}
            >
              <Send size={20} style={{ color: "#3B71CA" }} />
            </Button>
          </InputGroup>
        )}
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

export default Conversation;
