import axios from 'axios';
import { CUSTOMERS_API } from "../config";

function getCustomers(currentPage, itemsPerPage, lastName) {
    let url = `${CUSTOMERS_API}?page=${currentPage}&count=${itemsPerPage}`

    if (lastName) {
        url = url + `&lastName=${lastName}`
    }
    return axios
        .get(url )
        .then(response => response.data)
}

function getAllCustomer () {
    return axios
        .get(`${CUSTOMERS_API}?pagination=false`)
        .then(response => response.data)
}

function getCustomer(id) {
    return axios
        .get(`${CUSTOMERS_API}/${id}`)
        .then(response => response.data)
}

function updateCustomer(id, customer) {
    return axios
        .put(`${CUSTOMERS_API}/${id}`, customer)
        .then(response => response)
}

function createCustomer(newCustomer) {
    return axios.post(CUSTOMERS_API, newCustomer)
        .then(response => response)
}

function deleteCustomer(id) {
    return axios
        .delete(`${CUSTOMERS_API}/${id}`)
}

export default {
    getCustomers,
    deleteCustomer,
    createCustomer,
    getCustomer,
    updateCustomer,
    getAllCustomer
}
