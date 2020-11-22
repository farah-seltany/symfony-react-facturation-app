import React, { useState, useEffect } from 'react';
import InvoicesAPI from "../services/InvoicesAPI";
import CustomersAPI from "../services/CustomersAPI";
import { Link, useParams, useHistory } from "react-router-dom";
import {toast} from "react-toastify";
import FormLoader from "../components/Loaders/FormLoader";

const STATUS_CLASSES = InvoicesAPI.STATUS_CLASSES

const STATUS_LABELS = InvoicesAPI.STATUS_LABELS

const STATUS_LIST = InvoicesAPI.STATUS_LIST

const InvoiceCreateEdit = () => {

    const history = useHistory();
    const { id } = useParams();

    const [ invoice, setInvoice ] = useState({
        amount: "",
        status: "",
        customer: ""
    });
    const [ errors, setErrors ] = useState({
        amount: "",
        status: "",
        customer: ""
    });
    const [ customers, setCustomers ] = useState([]);
    const [ editing, setEditing ] = useState(false);
    const [ mounted, setMounted ] = useState(true)
    const [ loading, setLoading ] = useState(true)

    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.getAllCustomer();
            setCustomers(data["hydra:member"])
            setLoading(false)
        } catch (e) {
            console.log(e.response)
        }
    }

    const fetchInvoice = async () => {
        try {
            await InvoicesAPI.getInvoice(id)
                .then(response => {
                    const data = {
                        amount: response.amount,
                        status: response.status,
                        customer: response.customer.id
                    }
                    setInvoice(data)
                })
        } catch (e) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        if (id !== "new") {
            setEditing(true)
            fetchInvoice(id)
        }
        fetchCustomers();
        return () => {
            setMounted(false)
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                await InvoicesAPI.updateInvoice(id, invoice)
                    .then(() => {
                        toast.success("Facture modifiée !")
                        history.replace("/factures")
                    })
            } else {
                await InvoicesAPI.createInvoice(invoice)
                    .then(() => {
                        toast.success("Facture créée !")
                        history.replace("/factures")
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
                console.log(e.response)
                toast.error("Une erreur a eu lieu !")
            }
        }
    }

    const handleChange = ({currentTarget}) => {
        const { value, name } = currentTarget
        setInvoice({ ...invoice, [name]: value })
    }

    return (
        <>
            { editing ?
                <h1 className={"text-center mb-5"}>Modification de la facture</h1> :
                <h1 className={"text-center mb-5"}>Nouvelle facture</h1>
            }

            { loading ?
                <FormLoader/>
                :
                <>
                    <form onSubmit={handleSubmit} className={"form-group container col-6"}>
                        <div className="mb-4">
                            <label htmlFor={"customer"}>Client *</label>
                            <select className="custom-select" onChange={handleChange} name={"customer"} value={invoice.customer}>
                                <option value={""} name={"customer"}>Choisissez un client</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <div className={"mb-4"}>
                            <label htmlFor="amount">Montant € *</label>
                            <input
                                type="float"
                                className={"form-control" + (errors.amount ? " is-invalid" : "")}
                                id="amount"
                                name={"amount"}
                                value={invoice.amount}
                                onChange={handleChange}/>
                            {errors.amount && (
                                <small className={"invalid-feedback"}>{errors.amount}</small>
                            )}
                        </div>
                        <div className={"d-flex mb-4"}>
                            <label htmlFor="status">Statut *</label>
                            {
                                STATUS_LIST.map(status => (
                                    <div className="form-check" key={status}>
                                        <label
                                            className={status === invoice.status ?
                                                "btn btn-sm btn-" + STATUS_CLASSES[status] :
                                                "btn btn-sm btn-outline-" + STATUS_CLASSES[status]}>
                                            <input hidden={true} type="radio" className="form-check-input" name="status" id={status}
                                                   value={status}
                                                   onClick={handleChange}/>
                                            {STATUS_LABELS[status]}
                                        </label>
                                    </div>
                                ))
                            }
                            {errors.status && (
                                <small className={"invalid-feedback"}>{errors.status}</small>
                            )}
                        </div>
                        <div className={'btn-container d-flex mt-5'}>
                            <button disabled={!invoice.status || !invoice.customer} type={"submit"} className={"btn btn-primary"}>Enregistrer facture</button>
                            <Link to={"/factures"} className={"btn btn-link ml-2"}>Retour à la liste</Link>
                        </div>
                    </form>
                </>
            }
        </>
    )
}

export default InvoiceCreateEdit;
