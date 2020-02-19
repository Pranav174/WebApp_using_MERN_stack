import React, { Component } from 'react';
import axios from 'axios';

class GetItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }
    componentDidMount = async () => {
        await axios
            .get('http://localhost:4000/api/items/', { headers: { 'my-auth-token': sessionStorage.getItem('token') } })
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

    // cancel_item(id){
    //     console.log("cancelling", id)

    // }
    cancel_item(id) {
        console.log("Canceling ", id)
        axios
            .post('http://localhost:4000/api/items/cancel/' + id, {}, { headers: { 'my-auth-token': sessionStorage.getItem('token') } })
            .then(res => {
                console.log(res)
                this.setState({
                    items: this.state.items.filter((item) => item._id !== id),
                }
                )
                this.props.history.push('/');
                this.forceUpdate();
            })
            .catch(err => {
                console.log(err.response);
                alert('item cancellation faced some errors')
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
                    <td>{item.remaining}</td>
                    <td><button class="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.cancel_item(item._id) }} >#</button></td>
                </tr>
            );
        }

        return (
            <div className="ShowItemList">
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
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Remaining</th>
                                <th scope="col">Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemList}
                        </tbody>
                    </table>
                    {/* <div className="list">
                        {itemList}
                    </div> */}
                </div>
            </div>
        );
    }
}

export default GetItemList;