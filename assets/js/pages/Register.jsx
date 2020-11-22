import React, { useState } from 'react';
import AuthAPI from "../services/AuthAPI";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import {toast} from "react-toastify";

const Register = () => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        password: "",
        secondPassword: "",
        email: ""
    })

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        password: "",
        secondPassword: "",
        email: ""
    })

    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (user.password === user.secondPassword) {
                await AuthAPI.register(user)
                    .then(response => {
                        toast.success("Votre compte a bien été créé, vous pouvez désormais vous connecter !")
                        history.push("/login")
                        setErrors({})
                    })
            } else {
                setErrors({secondPassword: "Les deux mots de passe doivent être identiques."})
            }
        } catch (e) {
            if(e.response.data && e.response.data.violations) {
                const apiErrors = {}

                e.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors)
            } else {
                console.log(e.response)
                toast.error("Une erreur a eu lieu !")
            }
        }
    }

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget
        setUser({...user, [name] : value })
    }

    return (
        <>
            <h1 className={"text-center mb-5"}>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group container col-6">
                    <label htmlFor="exampleInputEmail1">Prénom *</label>
                    <input
                        type="text"
                        className={"form-control" + (errors.firstName ? " is-invalid" : "")}
                        id="exampleInputEmail1"
                        name={"firstName"}
                        value={user.firstName}
                        onChange={handleChange}/>
                    {errors.firstName && (
                        <small className={"invalid-feedback"}>{errors.firstName}</small>
                    )}
                </div>
                <div className="form-group container col-6">
                    <label htmlFor="exampleInputEmail1">Nom *</label>
                    <input
                        type="text"
                        className={"form-control" + (errors.lastName ? " is-invalid" : "")}
                        id="exampleInputEmail1"
                        name={"lastName"}
                        value={user.lastName}
                        onChange={handleChange}/>
                    {errors.lastName && (
                        <small className={"invalid-feedback"}>{errors.lastName}</small>
                    )}
                </div>

                <div className="form-group container col-6">
                    <label htmlFor="exampleInputEmail1">Email *</label>
                    <input
                        type="email"
                        className={"form-control" + (errors.email ? " is-invalid" : "")}
                        id="exampleInputEmail1"
                        name={"email"}
                        value={user.email}
                        onChange={handleChange}/>
                    {errors.email && (
                        <small className={"invalid-feedback"}>{errors.email}</small>
                    )}
                </div>

                <div className="form-group container col-6">
                    <label htmlFor="exampleInputPassword1">Mot de passe *</label>
                    <input
                        type="password"
                        className={"form-control" + (errors.password ? " is-invalid" :"")}
                        id="exampleInputPassword1"
                        name={"password"}
                        value={user.password}
                        onChange={handleChange}/>
                    {errors.password && (
                        <small className={"invalid-feedback"}>{errors.password}</small>
                    )}
                </div>

                <div className="form-group container col-6">
                    <label htmlFor="exampleInputPassword1">Confirmation du mot de passe *</label>
                    <input
                        type="password"
                        className={"form-control" + (errors.secondPassword ? " is-invalid" : "")}
                        id="exampleInputPassword1"
                        name={"secondPassword"}
                        value={user.secondPassword}
                        onChange={handleChange}/>
                    {errors.secondPassword && (
                        <small className={"invalid-feedback"}>{errors.secondPassword}</small>
                    )}
                </div>

                <div className="form-group container col-6 mt-5">
                    <button
                        disabled={!user.firstName ||
                        !user.lastName ||
                        !user.email ||
                        !user.password ||
                        !user.secondPassword}
                        type={"submit"}
                        className={"btn btn-primary"}>
                        S'inscrire</button>
                    <Link to={"/login"} className={"ml-2"}>J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    )
}

export default Register
