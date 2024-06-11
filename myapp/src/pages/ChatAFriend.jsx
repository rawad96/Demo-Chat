import { Button, Card, Container, Row } from "react-bootstrap";
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import axios from "axios";

const ChatAFriend = () => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";

  const [message, setMessage] = useState("");
  const [allmessages, setallmessages] = useState([]);
  const [allusers, setallusers] = useState([]);

  const [isBlocked, setisBlocked] = useState(false);

  const [msgForward, setmsgForward] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${userURL}/${sessionStorage["_id"]}`);
      const conv = await data.conversations.find(
        (c) => c.with === sessionStorage["id"]
      );
      conv?.conversation.map((msg) => {
        allmessages.push(msg);
      });
      const { data: users } = await axios.get(userURL);
      setallusers([...users]);

      data.blocked.map((b) => {
        if (b === sessionStorage["id"]) setisBlocked(true);
      });
    };
    fetchData();
  }, []);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {});

  useEffect(() => {
    if (readyState) {
      sendJsonMessage({ type: "LOGIN", _id: sessionStorage["_id"] });
    }
  }, [readyState]);

  useEffect(() => {
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
        _id: sessionStorage["id"],
        from: sessionStorage["_id"],
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

  const forward = (e) => {
    sendJsonMessage({
      type: "friend",
      message: msgForward,
      _id: e.target.value,
      from: sessionStorage["_id"],
      isblocked: isBlocked ? "YES" : "NO",
    });
    setmsgForward("");
  };

  const block = async () => {
    const { data } = await axios.get(`${userURL}/${sessionStorage["_id"]}`);
    const resp = await axios.put(`${userURL}/${sessionStorage["_id"]}`, {
      blocked: [...data.blocked, sessionStorage["id"]],
    });
    setisBlocked(true);
  };

  const unBlock = async () => {
    const { data } = await axios.get(`${userURL}/${sessionStorage["_id"]}`);
    data.blocked = data.blocked.filter((b) => b !== sessionStorage["id"]);
    const resp = await axios.put(`${userURL}/${sessionStorage["_id"]}`, {
      blocked: [...data.blocked],
    });
    setisBlocked(false);
  };

  return (
    <>
      <Container>
        <Card.Title className="mb-2">{sessionStorage["name"]}</Card.Title>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "200px" }}
          onKeyDown={handleKeyPress}
        />
        <Button
          style={{ width: "20%", fontFamily: "cursive", marginLeft: "1%" }}
          onClick={handleSendMessage}
        >
          send
        </Button>
        <Card className="mt-2">
          <Card.Body style={{ overflowY: "auto", maxHeight: "400px" }}>
            <br />
            {allmessages?.map((m, index) => {
              return m.typee === "s" ? (
                <Row key={index} style={{ textAlign: "right" }}>
                  <span value={m.msg} onClick={() => setmsgForward(m.msg)}>
                    {m.msg}
                  </span>
                </Row>
              ) : (
                <Row key={index} style={{ textAlign: "left" }}>
                  <span onClick={() => setmsgForward(m.msg)}>{m.msg}</span>
                </Row>
              );
            })}
          </Card.Body>
        </Card>
        <Button className="mt-3" onClick={isBlocked ? unBlock : block}>
          {isBlocked ? "unBlock" : "Block"}
        </Button>

        <Card
          className="mt-3"
          style={{
            width: "40%",
            margin: "auto",
            display: msgForward ? "block" : "none",
          }}
        >
          <Card.Text>Forward to:</Card.Text>
          <Card.Body>
            <select onChange={forward}>
              <option value="" hidden></option>
              {allusers?.map((user, index) => {
                return (
                  <option key={index} value={user._id}>
                    {user.name}
                  </option>
                );
              })}
            </select>
            <Button
              style={{ marginLeft: "2%", fontSize: "small" }}
              onClick={() => setmsgForward("")}
            >
              cancel
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ChatAFriend;
