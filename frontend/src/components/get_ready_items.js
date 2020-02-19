import React, { Component } from 'react';
import axios from 'axios';

class GetReadyItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }
    componentDidMount = async () => {
        await axios
            .get('http://localhost:4000/api/items/ready_to_dispatch', { headers: { 'my-auth-token': sessionStorage.getItem('token') } })
            .then(res => {
                console.log("res:", res.data)
                this.setState({
                    items: res.data
                })
            })
            .catch(err => {
                console.log(err);
                alert("err in getting items")
            })
    };

    dispatch_item(id) {
        console.log("Dispatching ", id)
        axios
            .post('http://localhost:4000/api/items/dispatch/' + id, {}, { headers: { 'my-auth-token': sessionStorage.getItem('token') } })
            .then(res => {
                console.log(res)
                this.setState({
                    items: this.state.items.filter((item) => item._id !== id),
                }
                )
            })
            .catch(err => {
                console.log(err.response);
                alert('item dispatch faced some errors')
            })

    }
    render() {
        const items = this.state.items;
        console.log("Items: " + items);
        let itemList;

        if (!items) {
            itemList = "";
        } else {
            itemList = items.map((item) =>
                <tr>
                    <th scope="row">{item.name}</th>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td><button class="btn btn-primary btn-sm" onClick={() => { if (window.confirm('Are you sure you wish to dispatch this item?')) this.dispatch_item(item._id) }}>✓</button></td>
                </tr>
            );
            // itemList = items
        }

        return (
            <div className="ShowItemList">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <br />
                            <h2 className="display-8 text-center">Ready-to-be-dispatched Items List</h2>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Dispatch</th>
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