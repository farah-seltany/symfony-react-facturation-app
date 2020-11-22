import axios from 'axios';
import { INVOICES_API } from "../config";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "warning",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "PAYÉE",
    SENT: "ENVOYÉE",
    CANCELLED: "ANNULÉE"
}

const STATUS_LIST = ["PAID", "SENT", "CANCELLED"]

function getInvoices(currentPage, itemsPerPage, lastName, searchStatus) {
    let url = `${INVOICES_API}?page=${currentPage}&count=${itemsPerPage}`
    if (lastName) {
        url = url + `&customer.lastName=${lastName}`
    }
    if (searchStatus) {
        url = url + `&status=${searchStatus}`
    }
    return axios.get(url).then(response => response.data)
}

function getAllInvoices(searchStatus) {
    let url = `${INVOICES_API}?pagination=false`
    if (searchStatus) {
        url = url + `&status=${searchStatus}`
    }
    return axios
        .get(url)
        .then(response => response.data)
}

function getInvoice(id) {
    return axios
        .get(`${INVOICES_API}/${id}`)
        .then(response => response.data)
}

function createInvoice (invoice) {
    const data = {
        customer: `/api/customers/${invoice.customer}`,
        amount: invoice.amount,
        status: invoice.status
    }
    return axios.post(INVOICES_API, data)
        .then(response => response)
}

function updateInvoice (id, invoice) {
    const data = {
        customer: `/api/customers/${invoice.customer}`,
        amount: invoice.amount,
        status: invoice.status
    }
    return axios
        .put(`${INVOICES_API}/${id}`, data)
        .then(response => response)
}

function deleteInvoice(id) {
    return axios.delete(`${INVOICES_API}/${id}`)
}

export default {
    getInvoices,
    deleteInvoice,
    createInvoice,
    getInvoice,
    updateInvoice,
    getAllInvoices,
    STATUS_LIST,
    STATUS_CLASSES,
    STATUS_LABELS
}
