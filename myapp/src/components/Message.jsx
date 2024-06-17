import { Card } from "react-bootstrap";
import { CheckAll } from "react-bootstrap-icons";
import chatperson from "../Images/chat_person.png";
import { SlActionRedo } from "react-icons/sl";

const Message = ({ msg, forwardmsg }) => {
  return (
    <>
      {msg.typee === "s" && (
        <Card
          className="message px-2 p-1 ms-auto mt-2"
          onClick={() => forwardmsg(msg)}
        >
          <span>
            {msg.msg} <CheckAll className="text-muted" />
          </span>
        </Card>
      )}
      {msg.typee === "r" && (
        <Card className="flex-row p-1" style={{ border: "unset" }}>
          <img
            src={chatperson}
            alt=""
            style={{ width: "45px", height: "45px" }}
          />
          <Card
            className="message ms-1 px-2  p-1 me-auto"
            onClick={() => forwardmsg(msg)}
          >
            {msg.forwarded && (
              <SlActionRedo className="ms-auto text-muted" size={14} />
            )}
            <span>{msg.msg}</span>
          </Card>
        </Card>
      )}
    </>
  );
};

export default Message;
