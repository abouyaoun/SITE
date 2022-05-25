import '../App.css';
import React, { useEffect } from 'react';
import {Line } from "react-chartjs-2"
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import {Col, Container, Row, Button, Form, Navbar, Nav, Badge, Alert} from 'react-bootstrap';
import Axios from "axios";
import { useState } from 'react';
import { FenetreMouvements, FenetrePortefeuille } from './Modals'
import SessionManager from "../Session/Session";

function Trading(){

  document.title = 'Salle de marché : Accueil'

  /// liste nom entreprise
  const [data_name, setData_name] = useState([]);
  const [full_name,setFull_name] = useState("");
  const [isin_code, setIsin_code] = useState("")
  const [stock_opening_value,setStock_opening_value] = useState("0");
  const [stock_closing_value,setStock_closing_value] = useState("0");
  const [stock_highest_value,setStock_highest_value] = useState("0");
  const [stock_lowest_value,setStock_lowest_value] = useState("0");
  const [stock_volume,setStock_volume] = useState();

  const [modalShow, setModalShow] = useState(false);
  const [mouvementShow, setMouvementShow] = useState(false);

  const user = SessionManager.getUser()
  const [quantiteAchat, setQuantiteAchat] = useState(0)
  const [quantiteVente, setQuantiteVente] = useState(0)
  const [budget, setBudget] = useState(user.budget)
  const [operationReponse, setOperationReponse] = useState("")
  const [alertColor, setAlertColor] = useState("")
  const [portefeuille, setPortefeuille] = useState({})
  const [mouvements, setMouvements] = useState({})
  
  /// graphe

  const data_chart = {
    labels: ["", "", "", "",],
    datasets: [{
      label: "Prix (€)",
      data: [stock_opening_value, stock_lowest_value, stock_highest_value, stock_closing_value],
      backgroundColor:"#fc5c65",
      borderColor: "#eb3b5a",
      fill: true
    }]
  };

  const chart_options = {
      elements: {
        line: {
            tension: 0.5
        }
    }
  }

//Actions
  const achat = () =>{
    Axios.post('http://localhost:9000/cotations/buy', {
      userToken: user.loginToken,
      isinCode: isin_code,
      quantity: quantiteAchat
    }).then(reponse =>{
      if(reponse.data.status === "SUCCESS"){
        setBudget(reponse.data.budgetFinal)
        setAlertColor("success")
      }
      else {
        setAlertColor("danger")
      }
      setOperationReponse(reponse.data.message)
    })
  }

  const vente = (e) =>{
    e.preventDefault();
    Axios.post('http://localhost:9000/cotations/sell', {
      userToken: user.loginToken,
      isinCode: isin_code,
      quantity: quantiteVente
    }).then(reponse =>{
      if(reponse.data.status === "SUCCESS"){
        setBudget(reponse.data.budgetAChanger)
        setAlertColor("success")
      }
      else {
        setAlertColor("danger")
      }
      setOperationReponse(reponse.data.message)
    })
  }

  const chargerPortefeuille = async () =>{
      await Axios.get('http://localhost:9000/users/portefeuille/'+SessionManager.getId()).then(reponse => {
        if(reponse.data.status === "SUCCESS"){
          setPortefeuille(reponse.data.result);
        }
      })
  }

  const chargerMouvements = () =>{
     Axios.get('http://localhost:9000/users/'+SessionManager.getId()+'/mouvements').then(reponse => {
      if(reponse.data.status === "SUCCESS"){
        setMouvements(reponse.data.mouvements);
      }
    })
  }



  /// graphe

  useEffect(() => {
    const fetchData = async () => {
      const result = await Axios(
        'http://localhost:9000/cotations/entreprise',
      );
      setData_name(result.data);
    };

    fetchData();
  }, [])

    return(
        <Container fluid className='trading_back'>

          <FenetrePortefeuille show={modalShow} onHide={() => setModalShow(false)} portefeuille={portefeuille}/>
          <FenetreMouvements show={mouvementShow} onHide={() => setMouvementShow(false)} mouvements={mouvements}/>

          <Navbar bg="primary" variant="dark">
            <Container>
              <Navbar.Brand href="">LLWS</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link onClick={() => {setModalShow(true); chargerPortefeuille()}}>Mon portefeuille</Nav.Link>
                <Nav.Link onClick={() => {setMouvementShow(true); chargerMouvements() }}>Mes opérations</Nav.Link>
                <Nav.Link onClick={() => {window.location = '/logout'; }}><Badge bg="warning" >Déconnexion</Badge></Nav.Link>
              </Nav>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  <h5 className='badge-budget'><Badge bg="success" className="mr-2 spanbadge">Budget : {budget} €</Badge></h5>
                </Navbar.Text>
                <Navbar.Text>
                  Bonjour, <strong style={{color:'white'}}>{user.first_name} {user.last_name}</strong>
                </Navbar.Text>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Row className='trading_name'>
            <Col className='trading_name_1' xl={2}>
              {data_name.map(item =>(
                  <p className='enterprise-item' onClick={() => {setOperationReponse("");setFull_name(item.full_name);setIsin_code(item.isin_code);setStock_opening_value(item.stock_opening_value);setStock_closing_value(item.stock_closing_value);setStock_highest_value(item.stock_highest_value);setStock_lowest_value(item.stock_lowest_value);setStock_volume(item.stock_volume);}}>{item.full_name}</p>
              ))}
            </Col>
            <Col className='trading_graphe col-8'>
              <Line data={data_chart} options={chart_options}/>
              {operationReponse !== "" &&
                  <Alert key={alertColor} variant={alertColor}>
                    {operationReponse}
                  </Alert>
              }
              <Col className='panelActions'>
                {full_name !== "" &&
                    <>
                      <Row>
                        <h2 className="mt-2">Opérations</h2>
                      </Row>
                      <Row className='mb-2'>
                        <Form className="row">
                        <Col>
                          <Form.Control type="number" min={1} step="1" id="" aria-describedby="" placeholder='Quantité (max. 100)' onChange={(e) => {
                            setQuantiteAchat(e.target.value);}}/>
                        </Col>
                        <Col><Button variant="btn btn-success" onClick={achat}>Achat</Button></Col>
                        </Form>
                      </Row>

                  <Row>
                    <Form className="row">
                      <Col>
                        <Form.Control type="number" min={1} step="1" id="" aria-describedby="" placeholder='Quantité (max. 100)' onChange={(k) => {
                          setQuantiteVente(k.target.value);}}/>
                      </Col>
                      <Col><Button type="number" min="1" max="100" step="1" variant="btn btn-warning" onClick={vente}>Vente</Button></Col>
                    </Form>
                  </Row>
                    </>
                }

              </Col>

              <Row className="mt-3">
                <h3 className="mt-2">Mon budget : <Badge bg="primary">{budget} €</Badge></h3>
              </Row>

            </Col>

            <Col className='trading_interface'>

              <Row>
                <Col className='title_right'>{full_name}</Col>
                <p>ISIN : ({isin_code})</p>
              </Row>
              <Row>
                <Col className='valeur_right'>Valeur actuelle</Col>
              </Row>
              <Row>
                <Col className='name_valeur_right'><h4><Badge bg="primary">{stock_closing_value} €</Badge></h4></Col>
              </Row>
              <Row>
                <Col className='valeur_right'>Prix ouverture</Col>
              </Row>
              <Row>
                <Col className='name_valeur_right'><h4><Badge bg="primary">{stock_opening_value} €</Badge></h4></Col>
              </Row>
              <Row>
                <Col className='valeur_right'>Plus haute</Col>
              </Row>
              <Row>
                <Col className='name_valeur_right'><h4><Badge bg="primary">{stock_highest_value} €</Badge></h4></Col>
              </Row>
              <Row>
                <Col className='valeur_right'>Plus basse</Col>
              </Row>
              <Row>
                <Col className='name_valeur_right'><h4><Badge bg="primary">{stock_lowest_value} €</Badge></h4></Col>
              </Row>
              <Row>
                <Col className='valeur_right'>Volume de transaction</Col>
              </Row>
              <Row>
                <Col className='name_valeur_right'><h4><Badge bg="primary">{stock_volume}</Badge></h4></Col>
              </Row>
              <Row>

              </Row>
              <Row>

              </Row>
            </Col>

          </Row>
        </Container>
    );
}



export default Trading;