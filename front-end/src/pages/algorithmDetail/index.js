import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';
import {
	Grid,
	Row,
	Col,
	Well
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
			isLoggedIn: null,
		}
	}

	doLogout(){
		Parse.User.logOut()
			.then(() =>{
				this.setState({
					isLoggedIn: false
				});
			})
			.catch(() =>{

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
		}else if(this.state.isLoggedIn === null){
			return (
				<div></div>
			);
		}else{
			return (
				<div>
					<NavBar onClick={this.doLogout}/>
					<Grid>
						<Row>
							<Col xs={12} sm={12} md={12} lg={12}>
								<h1>{"The Algorithm "+this.props.params.nameUrlEncoded}</h1>
							</Col>
						</Row>
					</Grid>
				</div>
			);
		}
	}
}

export default Home;