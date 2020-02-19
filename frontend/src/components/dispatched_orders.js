import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class GetDispatchedOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        };
    }
    componentDidMount = async () => {
        await axios
            .get('http://localhost:4000/api/orders/get_list/D', { headers: { 'my-auth-token': sessionStorage.getItem('token') } })
            .then(res => {
                console.log("res:", res.data)
                this.setState({
                    orders: res.data
                })
            })
            .catch(err => {
                console.log(err);
                alert("err in getting cancelled orders")
            })
    };

    Reviewed = (rating, id, type) => {
        if (rating === -1 ||rating === "") {
            return <Link to={"/review/" + type + id}><td>give review</td></Link>
        }
        else return rating
    }

    render() {
        const orders = this.state.orders;
        console.log("Orders: " + orders);
        let orderList;

        if (!orders) {
            orderList = "";
        } else {
            orderList = orders.map((order) =>
                <tr>
                    <th scope="row">{order.item_id.name}</th>
                    <td>{order.vendor_id.name}</td>
                    <td>{order.quantity}</td>
                    <td>{order.date}</td>
                    <td>{this.Reviewed(order.seller_rating, order._id, "seller/")}</td> 
                    <td>{this.Reviewed(order.product_rating, order._id, "product/")}</td> 
                    <td>{this.Reviewed(order.review, order._id, "product/")}</td> 
                </tr>
            );
        }

        return (
            <div className="ShowItemList">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <br />
                            <h2 className="display-10 text-center">Ready order List</h2>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Product Name</th>
                                <th scope="col">Vendor Name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Date</th>
                                <th scope="col">Seller Rating</th>
                                <th scope="col">Product Rating</th>
                                <th scope="col">Product Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderList}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default GetDispatchedOrders;