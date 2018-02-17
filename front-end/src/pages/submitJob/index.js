import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';
import {
	Grid,
	Row,
	Col,
	Button, PageHeader,
	FormControl
} from 'react-bootstrap';

import {NavBar} from '../../components';

import React, {Component} from 'react';
import {
	Redirect
} from 'react-router-dom'
import Parse from "parse";
import ButtonToolbar from "react-bootstrap/es/ButtonToolbar";
import SplitButton from "react-bootstrap/es/SplitButton";
import MenuItem from "react-bootstrap/es/MenuItem";
import FormGroup from "react-bootstrap/es/FormGroup";
import ControlLabel from "react-bootstrap/es/ControlLabel";
import Well from "react-bootstrap/es/Well";

class SubmitJob extends Component {
	constructor(props){
		super(props);

		this.doLogout = this.doLogout.bind(this);

		this.state = {
			isLoggedIn: null,
			isSubmitted: false,
			algorithms: [],
			parameters: "",
			chosenAlgorithmId: null,
			algorithmDropdownTitle: "Pick an Algorithm",
			submissionInProgress: false,
			valueJobTag: "",
			valueParameters: "",
			isParameterTyped: false,
			isJobTagTyped: false
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
		this.fetchAlgorithms();
	}

	fetchAlgorithms(){
		new Parse.Query("Algorithm").find()
			.then((algos) =>{
				console.log(algos);
				this.setState({
					algorithms: algos,
					chosenAlgorithmId: algos.length > 0 ? algos[0].id : undefined
				});
			})
			.catch(() =>{
			})

	}

	handleChangeAlgorithm = (e) =>{
		this.setState({
			chosenAlgorithmId: e.target.value
		});
	};

	handleChangeParameters = (e) =>{
		this.setState({
			isParameterTyped: true,
			valueParameters: e.target.value
		});
	};

	handleChangeJobTag = (e) =>{
		this.setState({
			isJobTagTyped: true,
			valueJobTag: e.target.value
		});
	};

	isValidAlgorithm = () =>{
		return this.state.chosenAlgorithmId != null;
	};

	isValidJobTag = () =>{
		return true;
	};

	isValidParameter = () =>{
		return true;
	};

	isValid = () =>{
		return this.isValidAlgorithm() && this.isValidJobTag() && this.isValidParameter() &&
		       !this.state.submissionInProgress;
	};

	initiateJobSubmission = () =>{
		if(this.isValid()){
			this.setState({
				submissionInProgress: true
			});

			let Job = Parse.Object.extend("Job");
			let Algorithm = Parse.Object.extend("Algorithm");
			let newJob = new Job();
			newJob.set("algorithm", new Algorithm({id: this.state.chosenAlgorithmId}));
			newJob.set("tag", this.state.valueJobTag);
			newJob.set("parameters", this.state.valueParameters);
			newJob.save(null, {})
				.then(() =>{
					this.setState({
						isSubmitted: true
					})
				})
				.catch(alert)
		}
	};

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
		}else if(this.state.isSubmitted){
			return (
				<Redirect to={{
					pathname: '/jobs',
					state: {}
				}}/>
			)
		}
		else{

			let optionsInAlgorithmDropdown = this.state.algorithms.map((item) =>{
				return (<option value={item.id}>{item.get("name")}</option>);
			});

			return (
				<div>
					<NavBar onClick={this.doLogout}/>
					<h3>Job Submission Form</h3>

					<Well className="white-well">
						<form>
							<Row>
								<Col xs={12}>
									<FormGroup
										controlId="formAlgorithmPick"
										validationState={this.isValidAlgorithm() ? 'success' : 'error'}>
										<ControlLabel>Algorithm: </ControlLabel>
										<FormControl placeholder="Pick an Algorithm"
										             componentClass="select"
										             disabled={this.state.submissionInProgress}
										             autoFocus
										             type="select"
										             onChange={this.handleChangeAlgorithm}>
											{optionsInAlgorithmDropdown}
										</FormControl>
									</FormGroup>
									<FormGroup
										controlId="formParameters"
										validationState={this.state.isParameterTyped ? (this.isValidParameter()
											? 'success'
											: 'error') : null}>
										<ControlLabel>Parameters: </ControlLabel>
										<FormControl
											disabled={this.state.submissionInProgress}
											type="text"
											value={this.state.valueParameters}
											onChange={this.handleChangeParameters}/>
										<FormControl.Feedback />
									</FormGroup>
									<FormGroup
										controlId="formJobTag"
										validationState={this.state.isJobTagTyped ? (this.isValidJobTag()
											? 'success'
											: 'error') : null}>
										<ControlLabel>Job Tag: </ControlLabel>
										<FormControl
											disabled={this.state.submissionInProgress}
											type="text"
											value={this.state.valueJobTag}
											onChange={this.handleChangeJobTag}/>
										<FormControl.Feedback />
									</FormGroup>
									<Button disabled={!this.isValid()}
									        onClick={this.initiateJobSubmission}
									        className="pull-right" bsStyle="primary">
										{this.state.submissionInProgress ? "Submitting Job.." : "Submit Job"}
									</Button>
								</Col>
								<Col xs={4}>
								</Col>
							</Row>

						</form>

					</Well>


				</div>
			);
		}
	}
}

export default SubmitJob;