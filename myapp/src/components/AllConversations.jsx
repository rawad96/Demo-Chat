import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import ConversationDetails from "./ConversationDetails";

const AllConversations = ({
  getconversation,
  responsive,
  refreshconversation,
}) => {
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";

  const [allconversations, setallconversations] = useState([]);
  const [activechat, setactivechat] = useState("");
  const [allconv, setallconv] = useState(true);
  const [forSearch, setforSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: user } = await axios.get(
        `${userURL}/${sessionStorage["userId"]}`
      );
      setallconversations([...user.conversations]);
    };
    fetchData();
  }, [refreshconversation]);

  const filterdConversations = useMemo(
    () =>
      allconversations.filter((conv) => {
        return conv.name
          .toLocaleLowerCase()
          .includes(forSearch.toLocaleLowerCase());
      }),
    [forSearch]
  );

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
        <input
          type="text"
          placeholder="Search..."
          className="py-1 w-100"
          onChange={(e) => setforSearch(e.target.value)}
          style={{
            borderRadius: "unset",
            border: "1px solid rgb(210, 207, 207)",
          }}
        />
        {!forSearch &&
          allconversations?.map((con, index) => {
            return (
              <ConversationDetails
                con={con}
                getconid={sendid}
                key={index}
                activeconv={activechat}
              />
            );
          })}
        {forSearch &&
          filterdConversations?.map((con, index) => {
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
