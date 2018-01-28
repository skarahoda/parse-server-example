import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';

import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from 'react-bootstrap';

import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class NavBar extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<Navbar inverse collapseOnSelect fluid staticTop>
				<Navbar.Header>
					<Navbar.Brand>
						<Link to="/">WIREST</Link>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						<NavItem>
							<Link to="/">Jobs</Link>
						</NavItem>
						<NavItem>
							<Link to="/algorithms">Algorithms</Link>
						</NavItem>
					</Nav>
					<Nav pullRight>
						<NavItem>
							<Link to="/profile">Profile</Link>
						</NavItem>
						<NavItem>
							<a onClick={()=> this.props.onClick()}>Log out</a>
						</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default NavBar;