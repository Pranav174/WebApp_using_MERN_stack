import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

export default class RegisterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                name: '',
                email: '',
                password: '',
                password2: '',
                vendor: false
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { user } = this.state;
        user.vendor = (user.vendor === 'true')
        console.log(user)
        axios
            .post('http://localhost:4000/api/users/register',user)
            .then(res => {
                console.log(res)
                this.props.history.push('/login');
            })
            .catch(err => {
                console.log(err.response);
                alert('registration error')
            })
    }

    render() {
        const { user } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Register</h2>
                <p> reload if already logged in </p>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="string"
                            className='form-control'
                            name="name"
                            placeholder="Enter name"
                            value={user.name}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className='form-control'
                            name="email"
                            placeholder="Enter email"
                            value={user.email}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className='form-control'
                            name="password"
                            placeholder="Enter password"
                            value={user.password}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password2">Password 2</label>
                        <input
                            type="password"
                            className='form-control'
                            name="password2"
                            placeholder="Enter password again"
                            value={user.password2}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="vendor">Vendor?</label>
                        <br />
                        <label class="radio-inline">
                            <input type="radio" name="vendor" value="true" onChange={this.handleChange}/>Yes</label>
                        <label class="radio-inline">
                            <input type="radio" name="vendor" value="false" onChange={this.handleChange}/>No</label>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Register</button>
                        <Link to="/login" className="btn btn-link">Already have an account?</Link>
                    </div>
                </form>
            </div>
        );
    }
}