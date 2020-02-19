import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        };
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        axios
            .post('http://localhost:4000/api/users/login',this.state)
            .then(res => {
                sessionStorage.setItem('token', res.data.token)
                sessionStorage.setItem('is_vendor', res.data.user.vendor)
                console.log(res)
                
                this.props.history.push('/');
            })
            .catch(err => {
                console.log(err.response);
                alert('login error')
            })
    }

    render() {
        return (
            <div className="col-md-6 m-auto">
                <h1 className="display-4 text-center">Login</h1>
                <br></br>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <input
                            type="email"
                            className='form-control'
                            name="email"
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div><div className='form-group'>
                        <input
                            type="password"
                            className='form-control'
                            name="password"
                            placeholder="Enter password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <input type="submit" value="Submit" className="btn btn-outline-warning btn-block mt-4" />
                </form>
            </div>
        );
    }
}