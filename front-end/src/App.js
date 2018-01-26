import React, {Component} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect
} from 'react-router-dom'
import Parse from "parse";
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/signUp';

import './App.css';

Parse.serverURL = "https://wirest.herokuapp.com/api";
Parse.initialize("wirest");

class App extends Component {
	constructor(props){
		super(props);

	}

	render(){
		return (
			<Router>
				<div>
					<Switch>
						<Route exact path="/" component={Home}/>
						<Route exact path="/login" component={Login}/>
						<Route exact path="/sign-up" component={SignUp}/>
						<Route component={Redirection}/>
					</Switch>
				</div>
			</Router>
		);
	}
}

class Redirection extends Component {
	constructor(props){
		super(props);
		this.state = {
			mounted: false
		}
	}

	componentDidMount(){
		this.setState({
			mounted: true
		});
	}

	render(){

		if(this.state.mounted){
			return (
				<Redirect to={{
					pathname: '/',
					state: {}
				}}/>
			);
		}

		return (
			<div></div>
		);
	}
}

export default App;
