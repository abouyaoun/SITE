import '../App.css';
import React from 'react';
import {Container, Form, FloatingLabel, Row, Col, Alert} from 'react-bootstrap';
import { useState} from 'react';
import Axios from "axios";
import SessionManager from "../Session/Session";


function Register() {
  
  document.title = 'Salle de marché : Inscription';

  const [show, setShow] = useState(false)
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");


  const register = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:9000/register", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    }).then((response) => {
      console.log(response.data.status)
        if (response.data.status==="ERROR"){
            setRegisterStatus(response.data.message);
            setShow(true)
        }
        if (response.data.status==="SUCCESS"){
            window.location = '/login'
        }
      });
  };
 
  return (
        <Container fluid className='register_block'>
            <img src="/img/Logo2.png"/>
            {show === true &&
                <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>Erreur</Alert.Heading>
                    <p>
                        {registerStatus}
                    </p>
                </Alert>
            }
              <Form>
                   <Row>
                          <Col>
                   <FloatingLabel controlId="floatingInput" label="Prénom" className="mb-3" style={{color: 'black'}}>
                        <Form.Control required minlength="2" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => {
                                  setFirstName(e.target.value);}}/>
                   </FloatingLabel>
                          </Col>
                       <Col>
                      <FloatingLabel controlId="floatingInput" label="Nom" className="mb-3" style={{color: 'black'}}>
                        <Form.Control minlength="2" required type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => {
                                  setLastName(e.target.value);}}/>
                      </FloatingLabel>
                       </Col>
                   </Row>
                  <FloatingLabel controlId="floatingInput" label="Adresse électronique" className="mb-3" style={{color: 'black'}}>
                    <Form.Control required type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => {
                              setEmail(e.target.value);}}/>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingInput" label="Mot de passe" className="mb-3" style={{color: 'black'}}>

                  <Form.Control required minlength="8" type="password" class="form-control" id="password" onChange={(e) => {
                              setPassword(e.target.value);}}/>
                  </FloatingLabel>

                   <FloatingLabel controlId="floatingInput" label="Confirmation du mot de passe" className="mb-3" style={{color: 'black'}}>

                    <Form.Control required minlength="8" type="password" class="form-control" id="confirm_password" onChange={(e) => {
                              setConfirmPassword(e.target.value);}}/>
                   </FloatingLabel>

                  <Row>
                      <Col><button class="btn btn-danger" onClick={() => { window.location = '/login'}}>Retour</button></Col>
                      <Col><button class="btn btn-primary" onClick={register} type="submit">S'inscrire</button></Col>
                  </Row>
              </Form>

      </Container>
    );
  }

export default Register;