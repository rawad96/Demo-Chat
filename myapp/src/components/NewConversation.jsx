import axios, { all } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import NewConversationDetails from "./NewConversationDetails";
import { X } from "react-bootstrap-icons";

const NewConversation = ({ getuser, closecomp }) => {
  const usersURL = import.meta.env.VITE_API_BACKEND_URL + "users";

  const [allusers, setallusers] = useState([]);
  const [forSearch, setforSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(usersURL);
      setallusers([...data]);
    };
    fetchData();
  }, []);

  const filterdUsers = useMemo(
    () =>
      allusers.filter((user) => {
        return user.name
          .toLocaleLowerCase()
          .includes(forSearch.toLocaleLowerCase());
      }),
    [forSearch]
  );

  const senduser = (e) => {
    getuser(e);
  };

  return (
    <>
      <Card className="newconversation p-3">
        <X size={25} onClick={() => closecomp(false)} cursor="pointer" />
        <Card className="text-center" style={{ border: "unset" }}>
          <Card.Text className="h5">New Conversation</Card.Text>
        </Card>
        <Card
          className="align-items-center mt-2 p-2"
          style={{ border: "unset" }}
        >
          <input
            type="text"
            placeholder="Search..."
            className="py-1 w-50"
            onChange={(e) => setforSearch(e.target.value)}
            style={{
              border: "1px solid rgb(210, 207, 207)",
            }}
          />
        </Card>
        <hr />
        <Card className="align-items-center" style={{ border: "unset" }}>
          {!forSearch &&
            allusers?.map((user, index) => {
              return (
                <NewConversationDetails
                  key={index}
                  user={user}
                  getuser={senduser}
                />
              );
            })}
          {forSearch &&
            filterdUsers?.map((user, index) => {
              return (
                <NewConversationDetails
                  key={index}
                  user={user}
                  getuser={senduser}
                />
              );
            })}
        </Card>
      </Card>
    </>
  );
};

export default NewConversation;
