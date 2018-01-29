import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';
import {
	Grid,
	Row,
	Col,
	Well, Glyphicon
} from 'react-bootstrap';

import {NavBar} from '../../components';

import React, {Component} from 'react';
import {
	Link,
	Redirect
} from 'react-router-dom'
import Parse from "parse";

class Home extends Component {
	constructor(props){
		super(props);

		this.doLogout = this.doLogout.bind(this);

		this.state = {
			isLoggedIn: null,
			algorithms: []
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

		let algorithmQuery = new Parse.Query('Algorithm');
		algorithmQuery.find()
			.then((algorithms) =>{
				this.setState({algorithms});
			})
			.catch(((err) =>{
				alert(err.message);
			}))
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

			let algorithmCells = this.state.algorithms.map(function(algo){
				return (
					<Col key={algo.id} xs={12} sm={12} md={6} lg={4}>
						<Link to={"/algorithms/" + algo.get("name")}>
							<Well className="well-link-hover-class" bsSize="large">
								{algo.get("name")}
								<Glyphicon bsSize="large" className="pull-right" glyph="chevron-right"></Glyphicon>
							</Well>
						</Link>
					</Col>
				);
			});

			return (
				<div>
					<NavBar onClick={this.doLogout}/>
					<h3>Available Algorithms</h3>
					<Row>
						{algorithmCells}
					</Row>
				</div>
			);
		}
	}
}

export default Home;