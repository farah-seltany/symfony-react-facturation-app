import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import {useHistory, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import FormLoader from "../components/Loaders/FormLoader";

const CustomerCreate = () => {

    const { id } = useParams();

    const [ editing, setEditing ] = useState(false)

    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    })

    const [ errors, setErrors ] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });

    const [ mounted, setMounted ] = useState(true)

    const [ loading, setLoading ] = useState(true)

    const history = useHistory();

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            getCustomer(id)
        } else {
            setLoading(false)
        }
        return () => {
            setMounted(false)
        }
    }, [id]);


    const handleChange = ({currentTarget}) => {
        const { value, name } = currentTarget
        setCustomer({ ...customer, [name]: value })
    }

    const getCustomer = async (id) => {
        try {
            await CustomersAPI.getCustomer(id)
                .then(response => {
                    const data = {
                        firstName: response.firstName,
                        lastName: response.lastName,
                        email: response.email,
                        company: response.company
                    }
                    setCustomer(data)
                    setLoading(false)
                })
        } catch (e) {
            console.log(e.response)
        }

    }

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if (editing) {
                await CustomersAPI.updateCustomer(id, customer)
                    .then(() => {
                        toast.success("Client modifié !")
                        history.replace("/clients")
                    })
            } else {
                await CustomersAPI.createCustomer(customer)
                    .then(() => {
                        toast.success("Client créé !")
                        history.replace("/clients")
                    })
            }
            setErrors({})
        } catch (e) {
            if(e.response.data && e.response.data.violations) {
                const apiErrors = {}

                e.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors)
            } else {
                toast.error("Une erreur a eu lieu !")
            }
        }
    }

    return(
        <>
            { editing ? (
                <h1 className={"text-center mb-5"}>Modification des informations du client</h1>
            ) : (
                <h1 className={"text-center mb-5"}>Création d'un nouveau client</h1>
            )}
            { loading ?
                <FormLoader/>
                :
                <>
                    <form onSubmit={handleSubmit} className={"form-group container col-6"}>
                        <div className={"mb-4"}>
                            <label htmlFor="firstName">Prénom *</label>
                            <input
                                type="text"
                                className={"form-control" + (errors.firstName ? " is-invalid" : "")}
                                id="firstName"
                                name={"firstName"}
                                value={customer.firstName}
                                onChange={handleChange}/>
                            {errors.firstName && (
                                <small className={"invalid-feedback"}>{errors.firstName}</small>
                            )}
                        </div>
                        <div className={"mb-4"}>
                            <label htmlFor="firstName">Nom *</label>
                            <input
                                type="text"
                                className={"form-control" + (errors.lastName ? " is-invalid" : "")}
                                id="lastName"
                                name={"lastName"}
                                value={customer.lastName}
                                onChange={handleChange}/>
                            {errors.lastName && (
                                <small className={"invalid-feedback"}>{errors.lastName}</small>
                            )}
                        </div>
                        <div className={"mb-4"}>
                            <label htmlFor="firstName">Email *</label>
                            <input
                                type="email"
                                className={"form-control" + (errors.email ? " is-invalid" : "")}
                                id="email"
                                name={"email"}
                                value={customer.email}
                                onChange={handleChange}/>
                            {errors.email && (
                                <small className={"invalid-feedback"}>{errors.email}</small>
                            )}
                        </div>
                        <div className={"mb-4"}>
                            <label htmlFor="firstName">Société</label>
                            <input
                                type="text"
                                className={"form-control mb-4"}
                                id="company"
                                name={"company"}
                                value={customer.company}
                                onChange={handleChange}/>
                        </div>
                        <div className={'btn-container d-flex mt-5 float-right'}>
                            <button type={"submit"} className={"btn btn-primary"}>Enregistrer client</button>
                            <Link to={"/clients"} className={"btn btn-link ml-2"}>Retour à la liste</Link>
                        </div>
                    </form>
                </>
            }
        </>
    )
}

export default CustomerCreate;
