import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

export default class NewItemPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: {
                name: '',
                quantity: 0,
                price: 0,
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { item } = this.state;
        this.setState({
            item: {
                ...item,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { item } = this.state;
        console.log(item)
        axios
            .post('http://localhost:4000/api/items/create',item,{headers: {'my-auth-token': sessionStorage.getItem('token')}})
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
        const { item } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>New Item</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="string"
                            className='form-control'
                            name="name"
                            placeholder="Enter item name"
                            value={item.name}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="name">Price</label>
                        <input
                            type="number"
                            className='form-control'
                            name="price"
                            placeholder="Enter item price"
                            value={item.price}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="name">Quantity</label>
                        <input
                            type="number"
                            className='form-control'
                            name="quantity"
                            placeholder="Enter item quantity"
                            value={item.quantity}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Create</button>
                        <Link to="/" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}