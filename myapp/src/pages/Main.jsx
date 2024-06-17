import { Card, Dropdown } from "react-bootstrap";

import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateGroup from "../components/CreateGroup";
import SearchPeople from "../components/SearchPeople";
import AllConversations from "../components/AllConversations";
import ChatAFriend from "./ChatAFriend";
import { BoxArrowRight, Gear, ThreeDots } from "react-bootstrap-icons";
import Conversation from "../components/Conversation";

const Main = () => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

  const [messages, setMessages] = useState([]);
  const [conversation, setconversation] = useState({});
  const [chooseConv, setchooseConv] = useState(false);
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

  const setconversationbyId = (e) => {
    setconversation({ ...e });
    if (window.innerWidth < 767) {
      setchooseConv(true);
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
        <Card className="main-card bg-transparent">
          <Card
            className="px-1"
            style={{ borderRadius: "unset", border: "unset" }}
          >
            <Dropdown style={{ width: "max-content" }}>
              <Dropdown.Toggle className=" no-arrow-dropdown">
                <ThreeDots size={20} color="black" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  Settings
                  <Gear className="ms-1" size={18} />
                </Dropdown.Item>
                <Dropdown.Item onClick={logout}>
                  Logout
                  <BoxArrowRight className="ms-1" size={18} />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card>
          <Card
            className="flex-row"
            style={{ border: "unset", borderRadius: "unset", height: "100%" }}
          >
            <AllConversations
              getconversation={setconversationbyId}
              responsive={chooseConv}
            />
            <Conversation id={conversation.with} responsive={showMessages} />
          </Card>
        </Card>
      )}
    </>
  );
};

export default Main;
