import { Card, Container } from "react-bootstrap";

import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateGroup from "../components/CreateGroup";
import SearchPeople from "../components/SearchPeople";
import AllConversations from "../components/AllConversations";
import ChatAFriend from "./ChatAFriend";
import { ArrowLeft, BoxArrowRight, Search } from "react-bootstrap-icons";

const Main = () => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

  const [messages, setMessages] = useState([]);
  const [ChatWith, setChatWith] = useState("");
  const [chooseConv, setchooseConv] = useState(true);
  const [showMessages, setshowMessages] = useState(false);
  const [search, setsearch] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {});

  useEffect(() => {
    if (readyState) {
      sendJsonMessage({ type: "LOGIN", _id: sessionStorage["userId"] });
    }
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessages([...messages, lastMessage.data]);
      dispatch({ type: "SETBC", payload: messages });
    }
  }, [lastMessage]);

  const handlechat = (e) => {
    setChatWith(e);
    setsearch(false);

    if (window.innerWidth < 787) {
      setchooseConv(false);
      setshowMessages(true);
    }
  };

  const logout = () => {
    sessionStorage["userId"] = "";
    sessionStorage["name"] = "";
    navigate("/");
  };

  return (
    <>
      {sessionStorage["userId"] && (
        <Card className="main-card">
          <Container>
            <Card className="p-4 main-subcard">
              <Card.Text className="h2 text-center">Chat</Card.Text>
              <Card className="text-center chat-main-card mt-4">
                <Card
                  className="p-1 px-1 flex-row"
                  style={{
                    borderLeft: "unset",
                    borderRight: "unset",
                    borderTop: "unset",
                    borderRadius: "unset",
                    borderBottom: "1px solid",
                  }}
                >
                  <Search size={20} onClick={() => setsearch(true)} />
                  <span
                    className="ms-auto me-1"
                    onClick={logout}
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                    <BoxArrowRight className="ms-1" size={20} />
                  </span>
                </Card>
                <Card
                  className="flex-row mt-1 px-2"
                  style={{ border: "unset" }}
                >
                  {chooseConv && (
                    <Card className="friends py-3" style={{ border: "unset" }}>
                      <Card
                        className="allconversations p-2"
                        style={{ borderRadius: "unset" }}
                      >
                        <AllConversations
                          chatWith={handlechat}
                          activechat={ChatWith}
                        />
                      </Card>
                    </Card>
                  )}
                  {ChatWith && (
                    <Card
                      className={
                        showMessages
                          ? "messages messages-show p-3 "
                          : "messages py-3 px-1"
                      }
                      style={{ border: "unset" }}
                      id="messages"
                    >
                      <ChatAFriend id={ChatWith} />
                    </Card>
                  )}
                </Card>
              </Card>
            </Card>
          </Container>
        </Card>
      )}

      {search && (
        <Card className="search p-2">
          <ArrowLeft size={20} onClick={() => setsearch(false)} />
          <SearchPeople chatWith={handlechat} />
        </Card>
      )}
      {/* <Container style={{ width: "50%" }}>
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
      </Container> */}
    </>
  );
};

export default Main;
