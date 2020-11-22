/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import Navbar from "./js/components/Navbar";
import HomePage from "./js/pages/HomePage";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import CustomersPage from "./js/pages/CustomersPage";
import LoginPage from "./js/pages/LoginPage";
import InvoicesPage from "./js/pages/InvoicesPage";
import AuthAPI from "./js/services/AuthAPI";
import AuthContext from "./js/contexts/AuthContext";
import PrivateRoute from "./js/components/PrivateRoute";
import CustomerCreate from "./js/pages/CustomerCreate";
import InvoiceCreateEdit from "./js/pages/InoviceCreateEdit";
import Register from "./js/pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

AuthAPI.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated)

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated}}>
            <Router>
                <Navbar/>

                <main className={"container pt-5 pb-5"}>
                    <Switch>
                        <PrivateRoute path={"/clients/:id"} component={CustomerCreate}/>
                        <PrivateRoute path={"/clients"} component={CustomersPage}/>
                        <PrivateRoute path={"/factures/:id"} component={InvoiceCreateEdit}/>
                        <PrivateRoute path={"/factures"} component={InvoicesPage}/>
                        <Route path={"/login"} component={LoginPage}/>
                        <Route path={"/inscription"} component={Register}/>
                        <Route path={"/"} component={HomePage}/>
                    </Switch>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />                </main>

            </Router>
        </AuthContext.Provider>
    )
}

const rootElement = document.querySelector('#app');
ReactDom.render(<App/>, rootElement);
