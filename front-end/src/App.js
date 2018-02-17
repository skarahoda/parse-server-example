import React, {Component} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom'
import Parse from "parse";
import {Jobs, Login, SignUp, Algorithms, AlgorithmDetail, SubmitJob} from './pages';

import './App.css';

Parse.serverURL = "https://wirest.herokuapp.com/api";
Parse.initialize("wirest");

class App extends Component {
	render(){
		return (
			<Router>
				<div>
					<Switch>
						<Route exact path="/" component={Jobs}/>
						<Route exact path="/login" component={Login}/>
						<Route exact path="/sign-up" component={SignUp}/>
						<Route exact path="/submit-job" component={SubmitJob}/>
						<Route exact path="/algorithms" component={Algorithms}/>
						<Route path="/algorithms/:name" component={AlgorithmDetail}/>
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
