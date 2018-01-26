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

import validator from 'validator';

import React, {Component} from 'react';
import {
	Redirect
} from 'react-router-dom'
import Parse from "parse";

class SignUp extends Component {
	constructor(props){
		super(props);

		this.state = {
			isLoggedIn: null,
			valueUserName: "",
			valuePassword: "",
			valuePasswordValidate: "",
			valueEmail: "",
			valueEmailValidate: "",
			signUpInProgress: false
		};

		this.handleChangeUserName = this.handleChangeUserName.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.handleChangePasswordValidate = this.handleChangePasswordValidate.bind(this);
		this.handleChangeEmail = this.handleChangeEmail.bind(this);
		this.handleChangeEmailValidate = this.handleChangeEmailValidate.bind(this);
		this.initiateSignUp = this.initiateSignUp.bind(this);
		this.dismissAlert = this.dismissAlert.bind(this);
		this.isValid = this.isValid.bind(this);
		this.isValidPasswordValidate = this.isValidPasswordValidate.bind(this);
		this.isValidPassword = this.isValidPassword.bind(this);
		this.isValidEmail = this.isValidEmail.bind(this);
		this.isValidEmailValidate = this.isValidEmailValidate.bind(this);
		this.isValidUserName = this.isValidUserName.bind(this);
	}

	componentDidMount(){
		this.setState({
			isLoggedIn: Parse.User.current() !== null
		});
	}

	isValid(){
		return this.isValidEmailValidate() && this.isValidUserName() && this.isValidPasswordValidate();
	}

	isValidUserName(){
		return this.state.valueUserName.length > 3;
	}

	isValidPassword(){
		return this.state.valuePassword.length > 5;
	}

	isValidPasswordValidate(){
		return this.state.valuePassword === this.state.valuePasswordValidate && this.isValidPassword();
	}

	isValidEmail(){
		return validator.isEmail(this.state.valueEmail);
	}

	isValidEmailValidate(){
		return this.state.valueEmail === this.state.valueEmailValidate && this.isValidEmail();
	}

	handleChangeUserName(e){
		this.setState({
			isUsernameTyped: true,
			valueUserName: e.target.value
		});
	}

	handleChangePassword(e){
		this.setState({
			isPasswordTyped: true,
			valuePassword: e.target.value
		});
	}

	handleChangePasswordValidate(e){
		this.setState({
			isPasswordValidateTyped: true,
			valuePasswordValidate: e.target.value
		});
	}

	handleChangeEmail(e){
		this.setState({
			isEmailTyped: true,
			valueEmail: e.target.value
		});
	}

	handleChangeEmailValidate(e){
		this.setState({
			isEmailValidateTyped: true,
			valueEmailValidate: e.target.value
		});
	}

	initiateSignUp(){

		if(this.isValid()){
			this.setState({
				signUpInProgress: true
			});

			let user = new Parse.User();
			user.set("username", this.state.valueUserName);
			user.set("password", this.state.valuePassword);
			user.set("email", this.state.valueEmail);

			user.signUp()
				.then(()=>{
					this.setState({
						isLoggedIn: true
					});
				})
				.catch((err)=>{
					this.setState({
						signUpInProgress: false,
						signUpError: err
					});
				})
		}
	}

	dismissAlert(){
		this.setState({
			incorrectCredentials: false
		});
	}

	render(){

		let warningBox = null;

		if(this.state.signUpError){
			warningBox = <Row>
				<Alert className="text-center col-xs-12 col-sm-8 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-4 col-lg-offset-4"
				       bsStyle="danger" onDismiss={this.dismissAlert}>
					<p>{this.state.signUpError.message}</p>
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
				<div className="clear-from-left clear-from-right clear-from-top-extra">
					<h1 className="text-center">WIREST</h1>
					<Grid className="clear-from-top">
						{warningBox}
						<Row>
							<Col xs={12} sm={8} md={4} lg={4} smOffset={2} mdOffset={4} lgOffset={4}>
								<form>
									<Row className="boxed-out">
										<FormGroup
											controlId="formUserName"
											validationState={this.state.isUsernameTyped ? (this.isValidUserName() ? 'success' : 'error') : null}>
											<ControlLabel>Username:</ControlLabel>
											<FormControl
												disabled={this.state.signUpInProgress}
												autoFocus
												type="text"
												value={this.state.valueUserName}
												onChange={this.handleChangeUserName}/>
											<FormControl.Feedback />
										</FormGroup>
										<FormGroup
											controlId="formEmail"
											validationState={this.state.isEmailTyped ? (this.isValidEmail() ? 'success' : 'error') : null}>
											<ControlLabel>Email:</ControlLabel>
											<FormControl
												disabled={this.state.signUpInProgress}
												type="text"
												value={this.state.valueEmail}
												onChange={this.handleChangeEmail}/>
											<FormControl.Feedback />
										</FormGroup>
										<FormGroup
											controlId="formEmailValidate"
											validationState={this.state.isEmailValidateTyped ? (this.isValidEmailValidate() ? 'success' : 'error') : null}>
											<ControlLabel>Repeat email:</ControlLabel>
											<FormControl
												disabled={this.state.signUpInProgress}
												type="text"
												value={this.state.valueEmailValidate}
												onChange={this.handleChangeEmailValidate}/>
											<FormControl.Feedback />
										</FormGroup>
										<FormGroup
											controlId="formPassword"
											validationState={this.state.isPasswordTyped ? (this.isValidPassword() ? 'success' : 'error') : null}>
											<ControlLabel>Password:</ControlLabel>
											<FormControl
												disabled={this.state.signUpInProgress}
												type="password"
												value={this.state.valuePassword}
												onChange={this.handleChangePassword}
												/>
											<FormControl.Feedback />
										</FormGroup>
										<FormGroup
											controlId="formPasswordValidate"
											validationState={this.state.isPasswordValidateTyped ? (this.isValidPasswordValidate() ? 'success' : 'error') : null}>
											<ControlLabel>Password:</ControlLabel>
											<FormControl
												disabled={this.state.signUpInProgress}
												type="password"
												value={this.state.valuePasswordValidate}
												onChange={this.handleChangePasswordValidate}
												onKeyPress={event =>{
													if(event.key === "Enter"){
														this.initiateSignup();
													}
												}}/>
											<FormControl.Feedback />
										</FormGroup>
										<Button bsSize="large" disabled={this.state.signUpInProgress || !this.isValid()} onClick={this.initiateSignUp}
										        className="btn-block" bsStyle="primary">
											{this.state.signUpInProgress ? "Signing up.." : "Sign up"}
										</Button>
									</Row>
								</form>
							</Col>
						</Row>

						<Row>
							<Col className="text-center boxed-out clear-from-top" xs={12} sm={8} md={4} lg={4} smOffset={2} mdOffset={4} lgOffset={4}>
								If you already have an account, <a
								href="/login">please log in here</a>.
							</Col>
						</Row>

					</Grid>
				</div>
			);
		}
	}
}

export default SignUp;