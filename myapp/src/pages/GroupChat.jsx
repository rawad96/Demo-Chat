import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";

const GroupChat = () => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

  const usersurl = import.meta.env.VITE_API_BACKEND_URL + "users";
  const groupsurl = import.meta.env.VITE_API_BACKEND_URL + "groups";

  const [group, setgroup] = useState({});
  const [user, setuser] = useState({});
  const [message, setMessage] = useState("");
  const [allmessages, setallmessages] = useState([]);
  const [recievedFrom, setrecievedFrom] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${groupsurl}/${sessionStorage["groupId"]}`
      );
      const { data: user } = await axios.get(
        `${usersurl}/${sessionStorage["_id"]}`
      );
      setgroup({ ...data });
      setuser({ ...user });
      setallmessages([...data.conversation]);
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
      setallmessages([...allmessages, { msg: lastMessage.data, typee: "r" }]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    const sendto = group.groupMembers.filter(
      (member) => member._id !== sessionStorage["_id"]
    );
    console.log(sendto);

    if (message.trim() !== "") {
      setallmessages([...allmessages, { msg: message, typee: "s" }]);
      sendJsonMessage({
        type: "group",
        message: message,
        to: sendto,
        from: sessionStorage["_id"],
        groupId: sessionStorage["groupId"],
      });
    }
    setMessage("");
  };

  const leaveG = async () => {
    const groupAfter = group.groupMembers.filter(
      (member) => member._id !== sessionStorage["_id"]
    );
    const userAfter = user.groups.filter(
      (g) => g._id !== sessionStorage["groupId"]
    );
    const res = await axios.put(`${groupsurl}/${sessionStorage["groupId"]}`, {
      groupMembers: [...groupAfter],
    });
    const resp = await axios.put(`${usersurl}/${sessionStorage["_id"]}`, {
      groups: [...userAfter],
    });
    const { data } = await axios.get(
      `${groupsurl}/${sessionStorage["groupId"]}`
    );
    const { data: u } = await axios.get(`${usersurl}/${sessionStorage["_id"]}`);
    setgroup({ ...data });
    setuser({ ...u });
    navigate("/last20conversations");
  };

  return (
    <>
      <Container>
        <Card.Title>{group.groupName}</Card.Title>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          style={{ width: "20%", fontFamily: "cursive", marginLeft: "1%" }}
          onClick={handleSendMessage}
        >
          send
        </Button>
        <Card>
          <Card.Body style={{ overflowY: "auto", maxHeight: "400px" }}>
            <br />
            {allmessages?.map((m, index) => {
              return m.typee === "s" || m.from === user._id ? (
                <Row key={index} style={{ textAlign: "right" }}>
                  <span value={m.msg}>{m.msg}</span>
                </Row>
              ) : (
                <Row key={index} style={{ textAlign: "left" }}>
                  <span>{m.msg}</span>
                </Row>
              );
            })}
          </Card.Body>
        </Card>
        <Button onClick={leaveG}>Leave Group</Button>
        <Button style={{ marginLeft: "1%" }}>Manage Group</Button>
      </Container>
    </>
  );
};

export default GroupChat;
