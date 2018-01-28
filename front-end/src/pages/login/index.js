import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';

import {
	Grid,
	Row,
	Col,
	FormGroup,
	ControlLabel,
	Button,
	FormControl,
	Alert
} from 'react-bootstrap';


import React, {Component} from 'react';
import {
	Redirect,
	Link
} from 'react-router-dom'
import Parse from "parse";

class Login extends Component {
	constructor(props){
		super(props);

		this.state = {
			isLoggedIn: null,
			valueUserName: "",
			valuePassword: "",
			loginInProgress: false,
		};

		this.handleChangeUserName = this.handleChangeUserName.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.initiateLogin = this.initiateLogin.bind(this);
		this.dismissAlert = this.dismissAlert.bind(this);
	}

	componentDidMount(){
		this.setState({
			isLoggedIn: Parse.User.current() !== null
		});
	}

	handleChangeUserName(e){
		this.setState({valueUserName: e.target.value});
	}

	handleChangePassword(e){
		this.setState({valuePassword: e.target.value});
	}

	initiateLogin(){
		this.setState({
			loginInProgress: true,
		});

		Parse.User.logIn(this.state.valueUserName, this.state.valuePassword)
			.then(() =>{
				this.setState({
					isLoggedIn: true
				});
			})
			.catch((err) =>{
				this.setState({
					loginInProgress: false,
					incorrectCredentials: true
				});
			});
	}

	dismissAlert(){
		this.setState({
			incorrectCredentials: false
		});
	}

	render(){

		let warningBox = null;

		if(this.state.incorrectCredentials){
			warningBox = <Row>
					<Alert className="text-center col-xs-12 col-sm-8 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-4 col-lg-offset-4"
						bsStyle="danger" onDismiss={this.dismissAlert}>
						<p>Incorrect user credentials!</p>
					</Alert>
			</Row>;
		}

		if(this.state.isLoggedIn === true){
			return (
				<Redirect to={{
					pathname: '/',
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
					<h1 className="text-center">WIREST</h1>
					<Grid className="clear-from-top">
						{warningBox}
						<Row>
							<Col xs={12} sm={8} md={4} lg={4} smOffset={2} mdOffset={4} lgOffset={4}>
								<form>
									<Row className="boxed-out">
										<FormGroup
											controlId="formUserName">
											<ControlLabel>Username or email:</ControlLabel>
											<FormControl
												disabled={this.state.loginInProgress}
												autoFocus
												type="text"
												value={this.state.valueUserName}
												onChange={this.handleChangeUserName}/>
											<FormControl.Feedback />
										</FormGroup>
										<FormGroup
											controlId="formPassword">
											<ControlLabel>Password:</ControlLabel>
											<FormControl
												disabled={this.state.loginInProgress}
												type="password"
												value={this.state.valuePassword}
												onChange={this.handleChangePassword}
												onKeyPress={event =>{
													if(event.key === "Enter"){
														this.initiateLogin();
													}
												}}/>
											<FormControl.Feedback />
										</FormGroup>
										<Button bsSize="large" disabled={this.state.loginInProgress} onClick={this.initiateLogin}
										        className="btn-block" bsStyle="success">
											{this.state.loginInProgress ? "Logging in.." : "Log in"}
										</Button>
									</Row>
								</form>
							</Col>
						</Row>

						<Row>
							<Col className="text-center boxed-out clear-from-top" xs={12} sm={8} md={4} lg={4} smOffset={2} mdOffset={4} lgOffset={4}>
											If you don't have an account, <Link
								to="/sign-up">kindly sign up here</Link>.
							</Col>
						</Row>

					</Grid>
				</div>
			);
		}
	}
}

export default Login;