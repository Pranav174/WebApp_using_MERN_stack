import React, { Component } from 'react';
import axios from 'axios';

class GetDispatchedOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendor: "",
            orders: []
        };
    }
    componentDidMount = async () => {
        await axios
            .get('http://localhost:4000/api/users/vendor/' + this.props.match.params.id, { headers: { 'my-auth-token': sessionStorage.getItem('token') } })
            .then(res => {
                console.log("res:", res.data)
                this.setState({
                    vendor: res.data.vendor,
                    orders: res.data.reviews
                })
            })
            .catch(err => {
                console.log(err);
                alert("err in getting cancelled orders")
            })
    };

    Reviewed = (rating) => {
        if (rating === -1 || rating === "") {
            return "-"
        }
        else return rating
    }

    render() {
        const { vendor, orders } = this.state
        console.log("Vendor: " + vendor);
        console.log("Orders: " + orders);
        let orderList;

        if (!orders) {
            orderList = "";
        } else {
            orderList = orders.map((order) =>
                <tr>
                    <th scope="row">{order.item_id.name}</th>
                    <td>{order.customer_id.name}</td>
                    <td>{order.quantity}</td>
                    <td>{order.date}</td>
                    <td>{this.Reviewed(order.seller_rating, order._id)}</td>
                    <td>{this.Reviewed(order.product_rating, order._id)}</td>
                    <td>{this.Reviewed(order.review, order._id)}</td>
                </tr>
            );
        }

        return (
            <div className="ShowItemList">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="display-10 text-center">Name: {vendor.name}</h2>
                            <h2 className="display-10 text-center">Email: {vendor.email}</h2>
                            <h2 className="display-10 text-center">Avg Rating: {this.Reviewed(vendor.rating)}</h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <br />
                            <h2 className="display-10 text-center">Review List</h2>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Product Name</th>
                                <th scope="col">Customer Name</th>
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