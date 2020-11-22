import React, { useState, useEffect } from 'react'
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import moment from "moment";
import { Link } from "react-router-dom";
import TableLoader from "../components/Loaders/TableLoader";

const STATUS_CLASSES = InvoicesAPI.STATUS_CLASSES

const STATUS_LABELS = InvoicesAPI.STATUS_LABELS

const STATUS_LIST = InvoicesAPI.STATUS_LIST

const InvoicesPage = () => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [customer, setCustomer] = useState("");
    const [statusSearch, setStatusSearch] = useState("");
    const [mounted, setMounted] = useState(true)
    const [loading, setLoading] = useState(true)

    const itemsPerPage = 20;

    const formatDate = (str) => {
        return moment(str).format("L") + " à " + moment(str).locale("fr").format("LT")
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleSearch = ({currentTarget}) => {
        const value = currentTarget.value;
        setCustomer(value)
    }

    const handleResetStatus = () => {
        setStatusSearch("")
    }

    const handleStatusSearch = async ({currentTarget}) => {
        setStatusSearch(currentTarget.value)
    }

    const handleDelete = async (id) => {

        const originalInvoices = [...invoices]

        try {
            await InvoicesAPI.deleteInvoice(id)
            setInvoices(invoices.filter(invoice => invoice.id !== id))

        } catch (e) {
            console.log(e.response)
            setInvoices(originalInvoices)
        }
    }

    const fetchInvoices = async () => {
        try {
            await InvoicesAPI.getInvoices(currentPage, itemsPerPage, customer, statusSearch)
                .then(data =>{
                    setInvoices(data["hydra:member"])
                    setTotalItems(data["hydra:totalItems"])
                    setLoading(false)
                })
        } catch (e) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        fetchInvoices()
        return () => {
            setMounted(false)
        }
    }, [customer, currentPage, statusSearch])

    return (
        <>
            {
                loading ?
                    <TableLoader/>
                    :
                    <>
                        <div className={"d-flex justify-content-between align-items-center mb-5"}>
                            <h1>Liste des factures</h1>
                            <Link to={"/factures/new"} className={"btn btn-primary"}>Nouvelle facture</Link>
                        </div>

                        <div className="form-group mb-5">
                            <label htmlFor="searchValue">Rechercher par client</label>
                            <input type="text" onChange={handleSearch} value={customer} className="form-control" id="searchValue" placeholder="Nom du client ..."/>
                        </div>

                        <div className={"form-group mb-3 float-right text-right"}>
                            <label htmlFor={"statusSearch"} className={"status-label-filter"}>Trier par statut</label>

                            <div className={"d-flex flex-row"}>
                                {
                                    STATUS_LIST.map(status => (
                                        <div className="form-check" key={status}>
                                            <label
                                                className={status === statusSearch ?
                                                    "btn btn-sm btn-" + STATUS_CLASSES[status] :
                                                    "btn btn-sm btn-outline-" + STATUS_CLASSES[status]}>
                                                <input hidden={true} type="radio" className="form-check-input" name="status" id={status}
                                                       value={status}
                                                       onClick={handleStatusSearch}/>
                                                {STATUS_LABELS[status]}
                                            </label>
                                        </div>
                                    ))
                                }
                                <div className={"form-check"}>
                                    <button className={"btn btn-sm btn-outline-secondary"} onClick={handleResetStatus}>Réinitialiser</button>
                                </div>
                            </div>
                        </div>


                        <table className="table table-hover">
                            <thead>
                            <tr className={"table-primary"}>
                                <th className={"text-center"} scope="col">Numéro</th>
                                <th className={"text-center"} scope="col">Client</th>
                                <th className={"text-center"} scope="col">Date d'envoi</th>
                                <th className={"text-center"} scope="col">Statut</th>
                                <th className={"text-center"} scope="col">Montant</th>
                                <td className={"text-center"} scope="col"></td>
                            </tr>
                            </thead>
                            <tbody>
                            {invoices.map(invoice => (
                                <tr key={invoice.id}>
                                    <td className={"text-center"}>{invoice.chrono}</td>
                                    <td className={"text-center"}>{invoice.customer.firstName} {invoice.customer.lastName}</td>
                                    <td className={"text-center"}>{formatDate(invoice.sent_at)}</td>
                                    <td className={"text-center"}>
                                        <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                                    </td>
                                    <td className={"text-center"}>{invoice.amount.toLocaleString()} €</td>
                                    <td className={"text-center"}>
                                        <Link
                                            to={`/factures/${invoice.id}`}
                                            className={'btn btn-sm btn-primary'}>Editer
                                        </Link>
                                        <button
                                            disabled={invoice.status !== "CANCELLED"}
                                            onClick={() => handleDelete(invoice.id)}
                                            className={'btn btn-sm btn-danger ml-2'}>Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            length={totalItems}
                            onPageChange={handlePageChange}
                        />
                    </>
            }
        </>
    )
}

export default InvoicesPage
