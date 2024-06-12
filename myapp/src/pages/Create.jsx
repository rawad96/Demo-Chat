import { useState } from "react";
import { Button, Card, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/App.css";
const Create = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");

  const usersurl = import.meta.env.VITE_API_BACKEND_URL + "users";

  const navigate = useNavigate();

  const createuser = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        name: name.toLowerCase(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
      };
      const sendData = await axios.post(usersurl, newUser);
      navigate("/", { state: { from: "signup" } });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <Card className="signuplogin-card">
        <Card className="signuplogin-subcard px-3 py-5">
          <Container>
            <Card.Text className="h3 text-center">Sign Up</Card.Text>
            <Form onSubmit={createuser}>
              <Row className="mt-3">
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setname(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-3">
                <input
                  type="text"
                  placeholder="User name"
                  onChange={(e) => setusername(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-3">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setemail(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-3">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-4 mb-2">
                <Button type="submit">Create</Button>
              </Row>

              <Card.Text className="text-center">
                Already have an account? &nbsp;
                <Card.Link className="link" onClick={() => navigate("/")}>
                  Login
                </Card.Link>
              </Card.Text>
            </Form>
          </Container>
        </Card>
      </Card>
    </>
  );
};

export default Create;
