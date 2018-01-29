import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';
import {
	Grid,
	Row,
	Col,
	Button, PageHeader
} from 'react-bootstrap';

import {NavBar} from '../../components';

import React, {Component} from 'react';
import {
	Redirect
} from 'react-router-dom'
import Parse from "parse";

class Home extends Component {
	constructor(props){
		super(props);

		this.doLogout = this.doLogout.bind(this);

		this.state = {
			isLoggedIn: null
		}
	}

	doLogout(){
		Parse.User.logOut()
			.then(()=>{
				this.setState({
					isLoggedIn: false
				});
			})
			.catch(()=>{

			});
	}

	componentDidMount(){
		this.setState({
			isLoggedIn: Parse.User.current() !== null
		});
	}

	render(){
		if(this.state.isLoggedIn === false){
			return (
				<Redirect to={{
					pathname: '/login',
					state: {}
				}}/>
			);
		} else if(this.state.isLoggedIn === null){
			return (
				<div></div>
			);
		} else {
			return (
				<div>
					<NavBar onClick={this.doLogout}/>
						<h3>Your Jobs</h3>
				</div>
			);
		}
	}
}

export default Home;