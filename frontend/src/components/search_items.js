import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class GetReadyItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            query: {
                search_string: "",
                key: "price",
                order: "ASC"
            },
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        console.log(name, value)
        const { query } = this.state;
        this.setState({
            query: {
                ...query,
                [name]: value
            }
        });
    }

    Reviewed = (rating) => {
        if (rating === -1||rating === "") {
            return "-"
        }
        else return rating
    }

    handleSubmit(event) {
        event.preventDefault();
        const { query } = this.state
        console.log(query)
        axios
            .get('http://localhost:4000/api/items/search', { params: query, headers: { 'my-auth-token': sessionStorage.getItem('token') } })
            .then(res => {
                console.log(res)
                this.setState({
                    items: res.data,
                    submitted: true
                })
            })
            .catch(err => {
                console.log(err.response);
                alert('item search faced some errors')
            })
    }

    render() {
        const { items, search_string } = this.state;
        console.log("Items: " + items);
        let itemList;

        if (!items) {
            itemList = "";
        } else {
            itemList = items.map((item) =>
                
                    <tr>
                        <th scope="row"><Link to={"/order/new/" + item._id}>{item.name}</Link></th>
                        <td><Link to={"/viewVendor/" + item.vendor_id._id}>{item.vendor_id.name}</Link></td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.remaining}</td>
                        <td>{this.Reviewed(item.vendor_id.rating)}</td>
                    </tr>
            );
        }

        return (
            <div className="ShowItemList">
                <div className="container">
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="name">Name</label>
                            <div className="md-form active-cyan active-cyan-2 mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="search_string"
                                    placeholder="Search"
                                    value={search_string}
                                    onChange={this.handleChange}
                                    aria-label="Search"
                                />
                            </div>
                        </div>
                        <div className='form-group'>
                            <select onChange={this.handleChange} name="key" className="browser-default custom-select">
                                <option selected value="price">price</option>
                                <option value="remaining">remaining</option>
                                <option value="seller_rating">seller_rating</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <select onChange={this.handleChange} name="order" className="browser-default custom-select">
                                <option selected value="ASC">ASC</option>
                                <option value="DSC">DSC</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Search</button>
                        </div>
                    </form>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <br />
                            <h2 className="display-8 text-center">Items List</h2>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Vendor's Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Remaining</th>
                                <th scope="col">Seller Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemList}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default GetReadyItemList;