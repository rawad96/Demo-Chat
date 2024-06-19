import { Card } from "react-bootstrap";
import chatperson from "../Images/chat_person.png";
const ConversationDetails = ({ con, activeconv, getconid }) => {
  return (
    <>
      <Card
        className={
          activeconv === con.with
            ? "flex-row conversation-details py-4 bg-primary"
            : "flex-row conversation-details py-4"
        }
        onClick={() => getconid(con)}
      >
        <div className="p-1">
          <img src={chatperson} alt="" style={{ width: "50px" }} />
        </div>
        <div className="p-1">
          <h6>{con.name}</h6>
          <span className="text-muted">
            {con?.conversation[con.conversation?.length - 1]?.msg}
          </span>
        </div>
      </Card>
    </>
  );
};

export default ConversationDetails;
