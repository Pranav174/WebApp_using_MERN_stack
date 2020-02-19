import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';
import register from "./register"
import new_item from "./new_item"
import search_items from "./search_items"
import canceled_orderes from "./cancelled_orders"
import dispatched_orderes from "./dispatched_orders"
import pending_orderes from "./pending_orders"
import new_order from "./new_order"
import edit_order from "./edit_order"
import ready_orders from "./ready_orders"
import review_seller from "./rate_seller"
import review_product from "./rate_product"
import view_vendor from "./view_vendor"
import get_items from "./get_items"
import get_ready_items from "./get_ready_items"
import get_dispatched_items from "./get_dispatched_items"

export default class vendorDashbboard extends Component {
    constructor() {
        super();
        this.state = {
            is_vendor: false,
            logged_in: false,
            loaded: false
        };
    }
    componentDidMount = async () => {
        await this.handleUpdateToken();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.logged_in !== this.state.logged_in) {
            console.log("updated!!!")
            this.handleUpdateToken();
        }
    }
    handleUpdateToken = () => {
        console.log("checking for token")
        if (sessionStorage.getItem("token") === null) {
            console.log("session token doesn't exist")
            this.setState({ logged_in: false })
        }
        else {
            axios
                .get('http://localhost:4000/api/users/is_authenticated', { headers: { 'my-auth-token': sessionStorage.getItem('token') } })
                .then(res => {
                    console.log(res)
                    this.setState({
                        logged_in: true
                    })
                }).catch((err) => {
                    this.setState({
                        logged_in: false
                    })
                })
            this.setState({ is_vendor: (sessionStorage.getItem("is_vendor") === 'true') })
        }
        this.setState({ loaded: true })
    }
    logout = () => {
        console.log("Logging out")
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('is_vendor')
        this.setState({ logged_in: false })
        this.props.history.push('/');
    }
    after_login = () => {
        this.setState({
            logged_in: true
        })
    }
    render() {
        var { is_vendor, logged_in, loaded } = this.state;
        console.log("user logged in", logged_in)
        if (!loaded) return <div>Loading...</div>
        else {
            if (!logged_in) {
                return (
                    <Route path="/" exact component={register} />
                )
            }
            else if (is_vendor) {
                return (
                    <Router>
                        <div className="container">
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                <div className="collapse navbar-collapse">
                                    <ul className="navbar-nav mr-auto">
                                        <li className="navbar-item">
                                            <Link to="/" className="nav-link">Pending Items</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to="/new" className="nav-link">New_Item</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to="/ready" className="nav-link">Ready Items</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to="/dispatched" className="nav-link">Dispatched Orders</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to={this.props.myroute} onClick={this.logout} className="nav-link">Log out</Link>
                                        </li>
                                    </ul>
                                </div>
                            </nav>

                            <br />
                            <Route path="/" exact component={get_items} />
                            <Route path="/new" exact component={new_item} />
                            <Route path="/ready" exact component={get_ready_items} />
                            <Route path="/dispatched" exact component={get_dispatched_items} />
                        </div>
                    </Router>
                )
            }
            else {
                return (
                    <Router>
                        <div className="container">
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                <div className="collapse navbar-collapse">
                                    <ul className="navbar-nav mr-auto">
                                        <li className="navbar-item">
                                            <Link to="/" className="nav-link">Search Items</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to="/order/W" className="nav-link">Pending Orders</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to="/order/P" className="nav-link">Placed Orders</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to="/order/D" className="nav-link">dispatched Orders</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to="/order/C" className="nav-link">Canceled Orders</Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to={this.props.myroute} onClick={this.logout} className="nav-link">Log out</Link>
                                        </li>
                                    </ul>
                                </div>
                            </nav>

                            <br />
                            <Route path="/" exact component={search_items} />
                            <Route path="/order/C" exact component={canceled_orderes} />
                            <Route path="/order/W" exact component={pending_orderes} />
                            <Route path="/order/P" exact component={ready_orders} />
                            <Route path="/order/D" exact component={dispatched_orderes} />
                            <Route path="/order/new/:id" exact component={new_order} />
                            <Route path="/order/edit/:id" exact component={edit_order} />
                            <Route path="/review/seller/:id" exact component={review_seller} />
                            <Route path="/review/product/:id" exact component={review_product} />
                            <Route path="/viewVendor/:id" exact component={view_vendor} />
                        </div>
                    </Router>
                )
            }
        }
    }
}