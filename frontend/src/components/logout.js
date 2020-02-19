import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

export default class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged_out: false
        };
    }
    componentDidMount() {
        console.log("Logging out")
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('is_vendor')
        this.setState({logged_out:true})
        this.forceUpdate()
    }
    render(){
        const {logged_out} = this.state
        if (logged_out) return <Redirect to="/" push={true}/>
        return <p>Logging out....</p>
    }
}