import { useState } from "react";
import { Card, Row, Container, Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";

const Login = () => {
  const location = useLocation();
  const fromPage = location.state?.from || "unknown";

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [failed, setfailed] = useState(false);

  const auth = import.meta.env.VITE_API_BACKEND_URL + "auth";
  const accessurl = import.meta.env.VITE_API_BACKEND_URL + "access";
  const connected = import.meta.env.VITE_API_BACKEND_URL + "connected";

  const navigate = useNavigate();

  const Loginn = async () => {
    const loginData = { username: username, password: password };
    const resp = await axios.post(auth, loginData);

    const respone = await axios.get(accessurl, {
      headers: { xaccesstoken: resp.data.accessToken },
    });
    console.log(respone);
    if (respone) {
      sessionStorage["userId"] = respone.data.id;
      navigate("/main");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      Loginn();
    }
  };

  return (
    <>
      <Card className="signuplogin-card">
        <Card className="signuplogin-subcard px-3 py-5">
          <Card.Text className="h3 text-center">Login</Card.Text>
          <Container>
            <Form onSubmit={Loginn} onKeyDown={handleKeyPress}>
              <Row className="mt-4">
                <input
                  type="text"
                  placeholder="User name"
                  onChange={(e) => setusername(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-4">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </Row>
              {/* <Row className='mt-2' style={{ display: failed ? "block" : "none" }}>
                        <span style={{ color: "red", fontSize: "small" }}>User name or password is incorrect</span>
                    </Row> */}
              <Row className="mt-3 text-center">
                <Link className="link">Forgot password</Link>
              </Row>
              <Row className="mt-4 mb-4">
                <Button>Login</Button>
              </Row>
              <Card.Text className="text-center">
                Dont have an account?&nbsp;
                <Card.Link
                  className="link"
                  onClick={() => navigate("/createacc")}
                >
                  Signup
                </Card.Link>
              </Card.Text>
            </Form>
          </Container>
        </Card>
      </Card>
    </>
  );
};

export default Login;
