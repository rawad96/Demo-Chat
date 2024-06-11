import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";
  const groupsURL = import.meta.env.VITE_API_BACKEND_URL + "groups";

  const navigate = useNavigate();

  const [groupName, setgroupName] = useState("");
  const [groupMembers, setgroupMembers] = useState([]);
  const [allUsers, setallUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(usersURL);
      setallUsers([...data]);
      setgroupMembers([
        ...groupMembers,
        data.find((u) => u._id === sessionStorage["_id"]),
      ]);
    };
    fetchData();
  }, []);

  const handleselect = (e) => {
    const user = groupMembers.find((u) => u._id === e.target.value);
    if (!user) {
      const userSelected = allUsers.find((user) => user._id === e.target.value);
      setgroupMembers([...groupMembers, userSelected]);
    }
  };

  const chat = async () => {
    const group = { groupName: groupName, groupMembers: [...groupMembers] };
    const res = await axios.post(groupsURL, group);

    const g = await axios.get(`${groupsURL}/${res.data}`);

    groupMembers.map(async (member) => {
      const memberr = {
        ...member,
        groups: [...member.groups, g.data],
        conversations: [...member.conversations, g.data],
      };
      const response = await axios.put(`${usersURL}/${member._id}`, memberr);
    });
    sessionStorage["groupId"] = res.data;
    navigate("/groupchat");
  };

  return (
    <>
      <Container>
        <Card>
          <Card.Title>Creat a group</Card.Title>
          <Card>
            <Card.Title>Group Members</Card.Title>
            <Card.Body
              style={{ display: groupMembers.length ? "grid" : "none" }}
            >
              {groupMembers.map((member, index) => {
                return <Card.Text key={index}>{member.name}</Card.Text>;
              })}
            </Card.Body>
          </Card>
          <Card.Body>
            <label htmlFor="name">Group Name: </label>
            <input
              type="text"
              onChange={(e) => setgroupName(e.target.value)}
              style={{ width: "50%", marginLeft: "2%" }}
            />
            <br />
            <br />
            <select onChange={handleselect}>
              <option value="/"></option>
              {allUsers?.map((user) => {
                return (
                  user._id !== sessionStorage["_id"] && (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  )
                );
              })}
            </select>
            <br />
            <Button className="mt-2" onClick={chat}>
              chat
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default CreateGroup;
