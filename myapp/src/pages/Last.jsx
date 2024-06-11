import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Last = () => {
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";

  const [last20conversations, setlast20conversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${usersURL}/${sessionStorage["_id"]}`);
      const conversations = data.conversations.map((con) => {
        if (con.with) {
          return con;
        } else {
          return {
            with: con._id,
            name: con.groupName,
            type: "group",
            groupMembers: [...con.groupMembers],
            conversation: con.conversation,
          };
        }
      });
      if (conversations.length <= 20) {
        setlast20conversations(conversations);
      } else {
        setlast20conversations(conversations.slice(-20));
      }
    };
    fetchData();
  }, []);

  const gochat = (e) => {
    const g = last20conversations.find((con) => con.with === e);

    if (g.type === "group") {
      sessionStorage["groupId"] = e;
      navigate("/groupchat");
    } else {
      sessionStorage["id"] = e;
      navigate("/chatafriend");
    }
  };

  return (
    <>
      <Container>
        <Card>
          <Card.Title>Last 20 Conversations</Card.Title>
          <Card.Body>
            {last20conversations?.map((con, index) => {
              return (
                <Row
                  className="mt-2"
                  style={{
                    border: "1px solid",
                    borderRadius: "5px",
                    fontSize: "large",
                    cursor: "pointer",
                  }}
                  key={index}
                >
                  {" "}
                  <span onClick={() => gochat(con.with)}>{con.name}</span>
                </Row>
              );
            })}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Last;
