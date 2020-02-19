import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

export default class NewItemPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order: {
                item_id: this.props.match.params.id,
                quantity: 0,
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { order } = this.state;
        this.setState({
            order: {
                ...order,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { order } = this.state;
        console.log(order)
        axios
            .post('http://localhost:4000/api/orders/new',order,{headers: {'my-auth-token': sessionStorage.getItem('token')}})
            .then(res => {
                console.log(res)
                this.props.history.push('/');
            })
            .catch(err => {
                console.log(err.response);
                alert('item creation faced some errors')
            })
    }

    render() {
        const { order } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>New Order</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Quantity</label>
                        <input
                            type="number"
                            className='form-control'
                            name="quantity"
                            placeholder="Enter item quantity"
                            value={order.quantity}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Place Order</button>
                        <Link to="/" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}