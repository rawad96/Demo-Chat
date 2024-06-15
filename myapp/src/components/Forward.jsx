import { Button, Card } from "react-bootstrap";
import SearchPeople from "./SearchPeople";
import { ArrowLeft, ArrowRightShort } from "react-bootstrap-icons";
import useWebSocket from "react-use-websocket";
import axios from "axios";
import { useState } from "react";

const Forward = ({
  allconversations,
  allUsers,
  msgtoforward,
  setmsgforward,
  block,
  forwardedFrom,
}) => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

  const [confirmSending, setconfirmSending] = useState(false);
  const [forwardto, setforwardto] = useState("");
  const [forwardto_id, setforwardto_id] = useState("");

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {});

  const forward = () => {
    sendJsonMessage({
      type: "friend",
      message: msgtoforward,
      _id: forwardto_id,
      from: sessionStorage["userId"],
      isblocked: block ? "YES" : "NO",
    });
    setmsgforward("");
  };

  return (
    <>
      <Card
        className={msgtoforward ? "forward-card-active p-2" : "forward-card"}
      >
        <Card.Text className="me-auto">
          <ArrowLeft
            size={25}
            onClick={() => setmsgforward("")}
            cursor="pointer"
          />
        </Card.Text>
        <Card.Text className="h5">Forward</Card.Text>
        <SearchPeople />
        <Card
          style={{ overflowY: "auto", border: "unset" }}
          className="px-1 align-items-center"
        >
          {allconversations?.map((con, index) => {
            return (
              con.with !== forwardedFrom && (
                <Card
                  className="conversation px-2 my-2 py-2 w-50"
                  key={index}
                  onClick={() => {
                    setforwardto(con.name);
                    setconfirmSending(true);
                    setforwardto_id(con.with);
                  }}
                >
                  <Card.Text className="h6">{con.name}</Card.Text>
                  <Card.Text className="text-muted ">
                    <ArrowRightShort size={20} />
                    {con.conversation[con.conversation.length - 1].msg}
                  </Card.Text>
                </Card>
              )
            );
          })}
        </Card>
        {confirmSending && (
          <Card className="py-1 confirm">
            <Card.Text>Forward to {forwardto.toUpperCase()}</Card.Text>
            <div className="py-2">
              <Button onClick={forward}>Forward</Button>
              <Button
                className="ms-1"
                onClick={() => {
                  setconfirmSending(false);
                  setforwardto("");
                  setforwardto_id("");
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </Card>
    </>
  );
};

export default Forward;
