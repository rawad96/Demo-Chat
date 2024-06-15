import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { ArrowRightShort } from "react-bootstrap-icons";

const AllConversations = ({ chatWith }) => {
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";

  const [allconversations, setallconversations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: user } = await axios.get(
        `${userURL}/${sessionStorage["userId"]}`
      );
      setallconversations([...user.conversations]);
      console.log(user.conversations);
    };
    fetchData();
  }, []);
  return (
    <>
      {allconversations?.map((con, index) => {
        return (
          <Card
            className="conversation px-2 my-2 py-2"
            key={index}
            onClick={() => chatWith(con.with)}
          >
            <Card.Text className="h6">{con.name}</Card.Text>
            <Card.Text className="text-muted ">
              <ArrowRightShort size={20} />
              {con.conversation[con.conversation.length - 1].msg}
            </Card.Text>
          </Card>
        );
      })}
    </>
  );
};

export default AllConversations;
