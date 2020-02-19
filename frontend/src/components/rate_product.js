import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

export default class NewItemPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order: {
                review: "",
                rating: 0,
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
            .post('http://localhost:4000/api/orders/review_product/' + this.props.match.params.id, order, { headers: { 'my-auth-token': sessionStorage.getItem('token') } })
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
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Product Review</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="rating">Rating (0-5)</label>
                        <select onChange={this.handleChange} name="rating" className="browser-default custom-select">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option selected value="5">5</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="review">Review:</label>
                        <textarea onChange={this.handleChange} name="review" value={this.state.order.review} class="form-control" rows="5" id="review"></textarea>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Write Review</button>
                        <Link to="/" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}