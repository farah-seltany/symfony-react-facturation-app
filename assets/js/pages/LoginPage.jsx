import React, { useState, useContext } from 'react';
import AuthAPI from "../services/AuthAPI";
import { useHistory } from "react-router";
import AuthContext from "../contexts/AuthContext";
import {toast} from "react-toastify";

const LoginPage = () => {

    const history = useHistory();
    const { setIsAuthenticated } = useContext(AuthContext);

    const [ credentials, setCredentials ] = useState({
        username: "",
        password: ""
    });

    const [ error, setError ] = useState("");

    // gestion des champs
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget
        setCredentials({ ...credentials, [name]: value })
    }

    //gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("")
            setIsAuthenticated(true)
            history.replace("/")
            toast.success(`Bonjour ${AuthAPI.connectedUser().firstName} ${AuthAPI.connectedUser().lastName} 🙂 !`)
        } catch (e) {
            setError("Adresse email et/ou mot de passe incorrect(s).")
            toast.error("Veuillez vérifier vos identifiants !")
        }
    }

    return (
        <>
            <h1 className={"mb-5 text-center"}>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group container col-6 mb-4">
                    <label htmlFor="exampleInputEmail1">Email *</label>
                    <input
                        type="email"
                        className={"form-control" + (error ? " is-invalid" : "")}
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Email..."
                        name={"username"}
                        value={credentials.username}
                        onChange={handleChange}/>
                </div>
                <div className="form-group container col-6 mb-4">
                    <label htmlFor="exampleInputPassword1">Mot de passe *</label>
                    <input
                        type="password"
                        className={"form-control " + (error ? " is-invalid" : "")}
                        id="exampleInputPassword1"
                        placeholder="Mot de passe ..."
                        name={"password"}
                        value={credentials.password}
                        onChange={handleChange}/>
                    { error && <small className={"invalid-feedback"}>{error}</small>}
                </div>
                <div className="form-group container col-6">
                    <button type={"submit"} className={"btn btn-primary mt-5"}>Connexion</button>
                </div>
            </form>
        </>
    )
}

export default LoginPage;
