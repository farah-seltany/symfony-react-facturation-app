import React, { useContext, useEffect, useState } from 'react';
import AuthAPI from "../services/AuthAPI";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";
import HomePageLoader from "../components/Loaders/HomePageLoader";

const HomePage = (props) => {

    const { isAuthenticated } = useContext(AuthContext);
    const [ totalCustomers, setTotalCustomers ] = useState(0)
    const [ totalInvoices, setTotalInvoices ] = useState(0)
    const [ totalPAIDInvoices, setTotalPAIDInvoices ] = useState(0)
    const [ totalSENTInvoices, setTotalSENTInvoices ] = useState(0)
    const [ totalCANCELLEDInvoices, setTotalCANCELLEDInvoices ] = useState(0)
    const [ loading, setLoading ] = useState(true)

    const getCustomers = async () => {
        try {
            await CustomersAPI.getAllCustomer()
                .then(response => setTotalCustomers(response["hydra:totalItems"]))
        } catch (e) {
            console.log(e.response)
        }
    }

    const getInvoices = async () => {
        try {
            await InvoicesAPI.getAllInvoices()
                .then(response => { setTotalInvoices(response["hydra:totalItems"])})
        } catch (e) {
            console.log(e.response)
        }
    }

    const getPAIDInvoices = async () => {
        try {
            await InvoicesAPI.getAllInvoices("PAID")
                .then(response => { setTotalPAIDInvoices(response["hydra:totalItems"])})
        } catch (e) {
            console.log(e.response)
        }
    }

    const getSENTInvoices = async () => {
        try {
            await InvoicesAPI.getAllInvoices("SENT")
                .then(response => { setTotalSENTInvoices(response["hydra:totalItems"])})
        } catch (e) {
            console.log(e.response)
        }
    }

    const getCANCELLEDInvoices = async () => {
        try {
            await InvoicesAPI.getAllInvoices("CANCELLED")
                .then(response => {
                    setTotalCANCELLEDInvoices(response["hydra:totalItems"])
                    setLoading(false)
                })
        } catch (e) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        getCustomers()
        getInvoices()
        getPAIDInvoices()
        getSENTInvoices()
        getCANCELLEDInvoices()
    })

    return (
        <div className="jumbotron">
            { isAuthenticated ?
                <h1 className="display-3">Bonjour { AuthAPI.connectedUser().firstName } { AuthAPI.connectedUser().lastName } ! </h1>
                :
                <h1 className="display-3">Bonjour ! </h1>
            }
            <p className="lead">Bienvenue sur SymReact, votre base de données interactive de facturation.</p>
            <hr className="my-4"/>

            { isAuthenticated ?
                <>
                    <p>Heureux de vous revoir ! </p>
                    <div className="card border-primary mb-3">
                        <div className="card-header">Vos statistiques</div>
                        { loading ?
                            <HomePageLoader/>
                            :
                            <>
                                <div className="card-body">
                                    <ul className="list-group">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <Link to={"/clients"}>Clients</Link>
                                            <span className="badge badge-success badge-pill">{totalCustomers}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <Link to={"/factures"}>Factures</Link>
                                            <span className="badge badge-success badge-pill">{totalInvoices}</span>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        }
                    </div>
                    <div className="card border-primary mb-3">
                        <div className="card-header">Facturation</div>
                        {loading ?
                            <HomePageLoader/>
                            :
                            <>
                                <div className="card-body">
                                    <ul className="list-group">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Factures envoyées en attente de paiement
                                            <span className="badge badge-warning badge-pill">{totalSENTInvoices}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Factures payées
                                            <span className="badge badge-success badge-pill">{totalPAIDInvoices}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Factures annulées
                                            <span className="badge badge-danger badge-pill">{totalCANCELLEDInvoices}</span>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        }
                    </div>
                </> :
                <>
                    <p>Vous pouvez enregistrer les informations de vos clients ainsi que les informations des factures qui leur sont adressés.</p>
                    <p className="lead mt-5">
                        <span>Créer votre compte pour commencer, </span>
                        <Link to={"/inscription"} role="button">c'est par ici !</Link>
                    </p>
                    <p className="lead">
                        <span>Ou </span>
                        <Link to={"/login"} role="button">connectez vous !</Link>
                    </p>
                </>
            }
        </div>
    )
}

export default HomePage;
