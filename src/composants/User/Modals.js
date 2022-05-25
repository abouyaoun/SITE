import {Badge, Button, ListGroup, Modal} from "react-bootstrap";
import React from "react";


//Fenêtre modale pour afficher le portefeuille
export function FenetrePortefeuille(props) {
    const portefeuille = props.portefeuille

    const listePortefeuille = []

    if(portefeuille.length > 0){
        portefeuille.map(item => {
            listePortefeuille.push(<ListGroup.Item><strong>{item.full_name}</strong> (ISIN: {item.isin_code} - Quantité : <Badge bg="primary">{item.quantite}</Badge> </ListGroup.Item>)
        });
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Portefeuill d'actifs
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {listePortefeuille}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>Fermer</Button>
            </Modal.Footer>
        </Modal>
    );
}

//Fenêtre modale pour afficher les mouvements (opérations)
export function FenetreMouvements(props) {
    const mouvements = props.mouvements
    console.log(mouvements)
    console.log(props.mouvements)

    const listeMouvements = []

    if(mouvements.length > 0){
        mouvements.reverse().map(item => {
            listeMouvements.push(<ListGroup.Item variant={item.type_mouvement === "BUY" ? "warning" : "success"}>[{Date(item.date_mouvement).toLocaleString()}] <strong>{item.type_mouvement === "BUY" ? "ACHAT" : "VENTE"}</strong> (ISIN: {item.isin_code} - Montant : <Badge bg="primary">{item.montant} € </Badge> Quantité : <Badge bg="primary" pill>{item.quantite}</Badge></ListGroup.Item>)
        });
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Mes opérations
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {listeMouvements}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>Fermer</Button>
            </Modal.Footer>
        </Modal>
    );
}
