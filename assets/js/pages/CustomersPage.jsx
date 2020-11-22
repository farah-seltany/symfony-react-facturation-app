import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/Loaders/TableLoader";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const itemsPerPage = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleSearch = ({currentTarget}) => {
        const value = currentTarget.value;
        setSearch(value)
    }

    const fetchCustomers = async () => {
        try {
            await CustomersAPI.getCustomers(currentPage, itemsPerPage, search)
                .then(response => {
                    setCustomers(response["hydra:member"])
                    setTotalItems(response["hydra:totalItems"])
                    setLoading(false)
                })
        } catch (e) {
            console.log(e.response)
        }

    }

    const deleteCustomer = async (id) => {

        const originalCustomers = [...customers]

        try {
            await CustomersAPI.deleteCustomer(id)
            setCustomers(customers.filter(customer => customer.id !== id))
            toast.success("Client supprimé !")
        } catch (e) {
            console.log(e.response)
            setCustomers(originalCustomers)
            toast.error("Une erreur a eu lieu lors de la suppression du client !")
        }
    }

    useEffect( () => {
        fetchCustomers()
    }, [currentPage, search])

    return (
        <>
            {loading ? <TableLoader/>
            :
            <>
                <div className={"d-flex justify-content-between align-items-center"}>
                    <h1 className={"mb-5"}>Liste des clients</h1>
                    <Link to={"/clients/new"} className={"btn btn-primary"}>Nouveau client</Link>
                </div>

                <div className="form-group mb-5">
                    <label htmlFor="searchValue">Rechercher</label>
                    <input type="text" onChange={handleSearch} value={search} className="form-control" id="searchValue" placeholder="Rechercher ..."/>
                </div>

                <table className="table table-hover">
                    <thead>
                    <tr className={"table-primary"}>
                        <th className={"text-center"} scope="col">Id</th>
                        <th className={"text-center"} scope="col">Client</th>
                        <th className={"text-center"} scope="col">Email</th>
                        <th className={"text-center"} scope="col">Entreprise</th>
                        <th className={"text-center"} scope="col">Factures</th>
                        <th className={"text-center"} scope="col">Montant total</th>
                        <th className={"text-center"} scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td className={"text-center"}>{customer.id}</td>
                            <td className={"text-center"}>
                                <Link to={`/clients/${customer.id}`}>{customer.firstName} {customer.lastName}</Link>
                            </td>
                            <td className={"text-center"}>{customer.email}</td>
                            <td className={"text-center"}>{customer.company}</td>
                            <td className={"text-center"}>
                                <span className="badge badge-pill badge-light">{customer.inVoices.length}</span>
                            </td>
                            <td className={"text-center"}>{customer.totalAmount.toLocaleString()} €</td>
                            <td className={"text-center"}>
                                <Link to={`/clients/${customer.id}`} className={"btn btn-sm btn-primary mr-2"}>Modifier</Link>
                                <button
                                    onClick={() => deleteCustomer(customer.id)}
                                    disabled={customer.inVoices.length > 0}
                                    className={'btn btn-sm btn-outline-danger'}>Supprimer</button>
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
            </>}
        </>
    )
}

export default CustomersPage
