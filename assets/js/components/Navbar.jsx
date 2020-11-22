import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {

    const history = useHistory();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        toast.info("Vous êtes désormais déconnecté !")
        history.push("/login")
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <Link className="navbar-brand" to={"/"}>SymReact</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01"
                    aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to={"/clients"}>Clients</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/factures"}>Factures</Link>
                        </li>
                    </ul>
                <ul className={"navbar-nav ml-auto "}>
                    {!isAuthenticated && <>
                        <li className={"nav-item"}>
                            <Link to={"/inscription"} className={"nav-link"}>Inscription</Link>
                        </li>
                        <li className={"nav-item ml-2"}>
                            <Link to={"/login"} className={"btn btn-success"}>Connexion</Link>
                        </li>
                    </> || <>
                        <li className={"nav-item ml-2"}>
                            <button onClick={handleLogout} className={"btn btn-danger"}>Déconnexion</button>
                        </li>
                    </>}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;
