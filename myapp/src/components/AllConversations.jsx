import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { ArrowRightShort } from "react-bootstrap-icons";
import ConversationDetails from "./ConversationDetails";

const AllConversations = ({ getconversation, responsive }) => {
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

  const sendid = (e) => {
    getconversation(e);
    setactivechat(e.with);
  };

  return (
    <>
      <div
        className={
          responsive
            ? "allconversations allconversations-responsive  mt-4"
            : "allconversations mt-4"
        }
      >
        {allconversations?.map((con, index) => {
          return (
            <ConversationDetails
              con={con}
              getconid={sendid}
              key={index}
              activeconv={activechat}
            />
          );
        })}
      </div>
    </>
  );
};

export default AllConversations;
