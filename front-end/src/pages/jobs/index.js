import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';
import {
	Grid,
	Row,
	Col,
	Button, PageHeader,
	Modal
} from 'react-bootstrap';

import {NavBar} from '../../components';

import React, {Component} from 'react';
import {
	Redirect
} from 'react-router-dom'
import Parse from "parse";
import Table from "react-bootstrap/es/Table";
import Panel from "react-bootstrap/es/Panel";
import Well from "react-bootstrap/es/Well";



class Home extends Component {
	constructor(props){
		super(props);

		this.doLogout = this.doLogout.bind(this);

		this.state = {
			isLoggedIn: null,
			jobs: [],
			selectedRow: null
		}
	}

	doLogout(){
		Parse.User.logOut()
			.then(()=>{
				this.setState({
					isLoggedIn: false
				});
			})
			.catch(()=>{

			});
	}

	componentDidMount(){
		this.setState({
			isLoggedIn: Parse.User.current() !== null
		});
		this.fetchJobs();
	}

	fetchJobs(){
		new Parse.Query("Job").descending("createdAt").include("algorithm").find()
			.then((jobs)=>{
				this.setState({
					jobs: jobs
				});
				setTimeout(()=> this.fetchJobs(), 15000);
			})
			.catch(()=>{setTimeout(()=>this.fetchJobs(), 15000);});

	}

	formatDate = (date) => {
		if(date != null){
			return date.toString();
		}
		else{
			return '-';
		}
	};

	handleCloseDialog = () => {
		this.setModalRow();
	};

	setModalRow = (job) => {
		this.setState({
			selectedRow: job
		});
	};

	inferStatus = (job) => {
		let errorCode = job.get("errorCode");
		if(job.get("startTime") == null){
			return "Pending";
		}else if(job.get("endTime") == null){
			return "Running";
		}else if(errorCode == null){
			return "Succeeded";
		}else if(errorCode == -1){
			return "Timed out";
		}else{
			return "Failed";
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
		} else if(this.state.isLoggedIn === null){
			return (
				<div>
				</div>
			);
		} else {
			let jobRows = this.state.jobs.map((job) => {
				return <tr className="clickable" onClick={()=>{this.setModalRow(job)}}>
					<td>{job.get('tag')}</td>
					<td>{job.get('algorithm').get('name')}</td>
					<td>{job.get('parameters')}</td>
					<td>{this.inferStatus(job)}</td>
					<td><a>Details..</a></td>
				</tr>
			});

			let selectedRow = this.state.selectedRow;

			return (
				<div>
					{selectedRow ? <Modal show={selectedRow} onHide={this.handleCloseDialog}>
							<Modal.Header closeButton>
								<Modal.Title>{selectedRow.get("tag")}</Modal.Title>
							</Modal.Header>

							<Modal.Body>
								<Row>
									<Col xs={6} md={3}>
										<label>{"Submission Time: "}</label>
									</Col>
									<Col xs={6} md={9}>
										{this.formatDate(selectedRow.get("createdAt"))}
									</Col>
								</Row>
								<Row>
									<Col xs={6} md={3}>
										<label>{"Execution Begin Time: "}</label>
									</Col>
									<Col xs={6} md={9}>
										{this.formatDate(selectedRow.get("startTime"))}
									</Col>
								</Row>
								<Row>
									<Col xs={6} md={3}>
										<label>{"Execution Finish Time: "}</label>
									</Col>
									<Col xs={6} md={9}>
										{this.formatDate(selectedRow.get("endTime"))}
									</Col>
								</Row>
								<Row>
									<Col xs={6} md={3}>
										<label>{"Output Log: "}</label>
									</Col>
									<Col xs={6} md={9}>
										{selectedRow.get("stdOutput")}
									</Col>
								</Row>
								<Row>
									<Col xs={6} md={3}>
										<label>{"Error Log: "}</label>
									</Col>
									<Col xs={6} md={9}>
										{selectedRow.get("stdError")}
									</Col>
								</Row>
								<Row>
									<Col xs={6} md={3}>
										<label>{"Error Code: "}</label>
									</Col>
									<Col xs={6} md={9}>
										{selectedRow.get("errorCode")}
									</Col>
								</Row>

							</Modal.Body>

							<Modal.Footer>
								<Button onClick={this.handleCloseDialog}>Close</Button>
							</Modal.Footer>
					</Modal>: null}
					<NavBar onClick={this.doLogout}/>
						<h3>Your Jobs</h3>
					<Well className="white-well">
						<Row>
							<Col xs={12} sm={12} md={12} lg={12}>
								<Table responsive condensed hover bordered>
									<thead>
									<tr className="info">
										<td>Tag</td>
										<td>Algorithm</td>
										<td>Parameters</td>
										<td>Status</td>
										<td></td>
									</tr>
									</thead>
									<tbody className="smallFont">
									{jobRows}
									</tbody>
								</Table>
							</Col>
						</Row>
					</Well>
				</div>
			);
		}
	}
}

export default Home;