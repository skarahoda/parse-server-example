import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';
import {
	Grid,
	Row,
	Col,
	Well, ListGroup, ListGroupItem
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

		console.log("yeni proplar: ", this.props);

		this.doLogout = this.doLogout.bind(this);

		this.state = {
			isLoggedIn: null,
			algorithmData: {
				name: this.props.match.params.name
			}
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
		algorithmQuery.equalTo("name", this.state.algorithmData.name);
		algorithmQuery.first()
			.then((algo) =>{
				if(algo){
					this.setState({
						algorithmData: {
							name: algo.get("name"),
							description: algo.get("description"),
							synopsis: algo.get("synopsis")
						}
					});
				}
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
			let {name, description, synopsis} = this.state.algorithmData;
			return (
				<div>
					<NavBar onClick={this.doLogout}/>
						<h3>Algorithm Details</h3>
					<Row className="clear-from-top">
						<Col xs={12} sm={12} md={12} lg={12}>
							{name && description && synopsis ? <ListGroup>
								<ListGroupItem><h4>{name}</h4></ListGroupItem>
								<ListGroupItem className="slightly-bigger-text">{description}</ListGroupItem>
								<ListGroupItem className="slightly-bigger-text">{synopsis}</ListGroupItem>
							</ListGroup>: null}
						</Col>
					</Row>
				</div>
			);
		}
	}
}

export default Home;