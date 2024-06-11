import { Button, Card, Container, Form, Row } from "react-bootstrap";
import AllUsers from "../components/AllUsers";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateGroup from "../components/CreateGroup";

const Main = () => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

  const [messages, setMessages] = useState([]);
  const [chatAFriend, setchatAFriend] = useState(false);
  const [chatAGroup, setchatAGroup] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {});

  useEffect(() => {
    if (readyState) {
      sendJsonMessage({ type: "LOGIN", _id: sessionStorage["userId"] });
    }
  }, []);

  const sendmessage = (e) => {
    console.log(e);
    sendJsonMessage(e);
  };

  useEffect(() => {
    if (lastMessage !== null) {
      setMessages([...messages, lastMessage.data]);
      dispatch({ type: "SETBC", payload: messages });
    }
  }, [lastMessage]);

  const last20 = () => {
    navigate("/last20conversations");
  };

  const chatafriend = () => {
    setchatAFriend(!chatAFriend);
    setchatAGroup(false);
  };

  const chatagroup = () => {
    setchatAGroup(!chatAGroup);
    setchatAFriend(false);
  };

  return (
    <>
      <Container style={{ width: "50%" }}>
        <Card>
          <Card.Title>Chat</Card.Title>
          <Card.Body>
            <Button style={{ marginRight: "1%" }} onClick={chatafriend}>
              chat a friend
            </Button>
            <Button onClick={chatagroup}>create group</Button>
            <Button style={{ marginLeft: "1%" }} onClick={last20}>
              last 20 conersations
            </Button>
          </Card.Body>
          {chatAFriend && !chatAGroup && (
            <AllUsers sendJsonMessage={sendmessage} messages={messages} />
          )}
          {chatAGroup && !chatAFriend && <CreateGroup />}
        </Card>
      </Container>
    </>
  );
};

export default Main;