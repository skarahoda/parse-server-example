import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';

import {Nav, Navbar, NavItem} from 'react-bootstrap';

import React, {Component} from 'react';
import {Link} from 'react-router-dom'

//<NavItem>
	//<Link to="/profile">Profile</Link>
//</NavItem>

class NavBar extends Component {
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
						<NavItem>
							<Link to="/submit-job">Submit Job</Link>
						</NavItem>
					</Nav>
					<Nav pullRight>
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