import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { ArrowRightShort } from "react-bootstrap-icons";
import chatperson from "../Images/chat_person.png";

const AllConversations = ({ chatWith }) => {
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";

  const [allconversations, setallconversations] = useState([]);
  const [activechat, setactivechat] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: user } = await axios.get(
        `${userURL}/${sessionStorage["userId"]}`
      );
      setallconversations([...user.conversations]);
    };
    fetchData();
  }, []);

  return (
    <>
      {allconversations?.map((con, index) => {
        return (
          <Card
            className={
              activechat === con.with
                ? "conversation px-2 py-3 flex-row bg-primary"
                : "conversation px-2 py-3 flex-row"
            }
            key={index}
            onClick={() => {
              chatWith(con.with);
              setactivechat(con.with);
            }}
          >
            <Card
              className="p-1 bg-transparent"
              style={{ width: "70px", border: "unset" }}
            >
              <img src={chatperson} alt="" style={{ width: "50px" }} />
            </Card>
            <Card
              className="w-100 ms-1 bg-transparent"
              style={{ border: "unset" }}
            >
              <Card.Text className="h6 text-uppercase">{con.name}</Card.Text>
              <Card.Text className="text-muted ms-1">
                {con.conversation[con.conversation.length - 1].msg}
              </Card.Text>
            </Card>
          </Card>
        );
      })}
    </>
  );
};

export default AllConversations;
