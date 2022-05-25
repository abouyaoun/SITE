import '../App.css';
import { Container, Row, Col, Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import {useState} from 'react';
import Axios from "axios";
import React from 'react';
import SessionManager from '../Session/Session';
import {Link} from 'react-router-dom';

function Login() {

  document.title = 'Salle de marché : Connexion';

  const [show, setShow] = useState(false);
  const [mail,setMail] = useState("");    
  const [mdp,setMdp] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [change, setChange] = useState("");


  const login = () => {
    Axios.post("http://localhost:9000/login", {
      email: mail,
      password: mdp,
    }).then((response) => {
        if (response.data.status==="ERROR")
        {
          setLoginStatus(response.data.message);
          setChange("");
          setShow(true)
        }
        if (response.data.status==="SUCCESS"){
          setLoginStatus("Authentification réusie");

          let resultat = response.data.result;

          SessionManager.setAuth(resultat[0])
          window.location = '/trading'
        }
      });
};

  return (
      <Container className='login_container' id="container">
        <img src="/img/Logo2.png"/>
        <Row>
          {show === true &&
              <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Erreur</Alert.Heading>
                <p>
                  {loginStatus}
                </p>
              </Alert>
          }
          <Col className='login_form'>
            <Form>
              <FloatingLabel controlId="floatingInput" label="Adresse électronique" className="mb-3" style={{color: 'black'}}>
                <Form.Control type="email" placeholder="nom@exemple.com" onChange={(e) => {
                  setMail(e.target.value);}}/>
              </FloatingLabel>
              <FloatingLabel controlId="floatingPassword" label="Mot de passe" style={{color: 'black'}}>
                <Form.Control type="password" placeholder="Password" onChange={(e) => {
                  setMdp(e.target.value);}}/>
              </FloatingLabel>

              <Row className="mt-2 test">
                <Button className="btn btn-success" onClick={login}>Connexion</Button>
                <Link to="/register" className="btnregisterlink"><Button className="btn btn-warning btnregister">Inscription</Button></Link>
              </Row>

            </Form>
          </Col>

        </Row>
      </Container>
  );


}
  
export default Login;

