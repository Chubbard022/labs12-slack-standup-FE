import './profile.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { axiosWithAuth, baseURL } from '../../config/axiosWithAuth.js';

// style imports
import { Collapse } from '@blueprintjs/core';
import {
	Card,
	Button,
	Input,
	InputLabel,
	TextField,
	FormControl
} from '@material-ui/core';

// this is the whole profile page (dashboard/profile)
// admin and memeber views are different

class Profile extends Component {
	state = {
		profileInfo: [],
		users: [],
		newName: '',
		newPic: '',
		achivedReports: [],
		openAchivedReports: false,
		openEditUser: false,
		showJoinCode: false,
		openInactiveUsers: false
	};
	render() {
		const inactiveReports = this.state.achivedReports.filter(
			report => !report.active
		);

		const inactiveUsers = this.state.users.filter(user => !user.active);
		return (
			<div className="userCard">
				<Card raised={true} className="top-user-card">
					<div className="userCard-content">
						<div className="profileCard-content">
							<h3>{this.state.profileInfo.fullName}</h3>
							<TextField
								InputLabelProps={{ shrink: true }}
								className="email-field"
								label="Email"
								placeholder={this.state.profileInfo.email}
								margin="normal"
								variant="outlined"
								color="primary"
								fullWidth
								disabled
							/>
							<div className="editUser">
								<Button
									style={{ margin: '10px 0' }}
									variant="outlined"
									color="primary"
									onClick={this.openUserEdit}
								>
									{this.state.openEditUser === false ? 'Edit' : 'Cancel'}
								</Button>
								<Collapse isOpen={this.state.openEditUser}>
									<form className="userForm" onSubmit={this.updateUser}>
										<FormControl id="edit-user-content">
											<InputLabel htmlFor="custom-css-standard-input">
												Edit Name
											</InputLabel>
											<Input
												id="custom-css-standard-input"
												type="text"
												value={this.state.newName}
												name="newName"
												onChange={this.changeHandler}
												placeholder="Enter new name"
											/>
										</FormControl>
										<FormControl>
											<InputLabel htmlFor="custom-css-standard-input">
												Edit Picture
											</InputLabel>
											<Input
												id="custom-css-standard-input"
												type="text"
												value={this.state.newPic}
												name="newPic"
												placeholder="Enter new picture Link"
												onChange={this.changeHandler}
											/>
										</FormControl>
										<Button
											style={{ display: 'block', margin: '10px 0' }}
											id="edit-user-button"
											variant="contained"
											color="primary"
											type="submit"
											onClick={this.openUserEdit}
										>
											Submit
										</Button>
										<div />
									</form>
								</Collapse>
							</div>
						</div>
						<img
							src={this.state.profileInfo.profilePic}
							alt="a headshot, preferably"
						/>
					</div>
				</Card>

				{/* ADMIN VIEW STARTS HERE */}

				{this.state.profileInfo.roles === 'admin' ? (
					<Card raised={true} className="top-user-card">
						<div className="profileForms">
							<h3>Admin Controls</h3>
							<div className="admin-controls">
								<div className="join-code">
									<Button
										style={{ margin: '10px 0' }}
										id="edit-user-button"
										variant="outlined"
										color="primary"
										onClick={this.showJoinCode}
									>
										Join Code
									</Button>
									{this.state.showJoinCode === true ? (
										<TextField
											style={{ maxWidth: '105px' }}
											label="Join Code"
											value={this.state.profileInfo.joinCode}
											margin="normal"
											variant="outlined"
											disabled
										/>
									) : null}
								</div>
								<div className="deactivated-users">
									<Button
										style={{ margin: '10px 0' }}
										variant="outlined"
										color="primary"
										className={
											this.state.profileInfo.roles === 'admin'
												? 'activateButton'
												: 'display-button'
										}
										onClick={this.viewInactiveUsers}
									>
										{this.state.openInactiveUsers
											? 'Hide Inactive Users'
											: 'View Inactive Users'}
									</Button>
									<div>
										<Collapse isOpen={this.state.openInactiveUsers}>
											{inactiveUsers.length > 0 ? (
												inactiveUsers.map(user => (
													<Card key={user.id}>
														<div key={user.id} className="inactive-user-card">
															<div className="inactive-user-content">
																<img
																	src={user.profilePic}
																	id="profilePic"
																	alt="a headshot, preferably"
																/>
																<h4>{user.fullName}</h4>
															</div>
															<Button
																variant="outlined"
																className={
																	this.state.profileInfo.roles === 'admin'
																		? 'activateButton'
																		: 'display-button'
																}
																onClick={() => this.activateUser(user.id)}
																style={{ padding: '0 8px', marginTop: '4px' }}
															>
																Activate
															</Button>
														</div>
													</Card>
												))
											) : (
												<p>No inactive users</p>
											)}
										</Collapse>
									</div>
								</div>
								<div className="deactivated-reports">
									<Button
										style={{ margin: '10px 0' }}
										className={
											this.state.profileInfo.roles === 'admin'
												? 'activateButton'
												: 'display-button'
										}
										variant="outlined"
										color="primary"
										onClick={this.viewAchivedReports}
									>
										{this.state.openAchivedReports === false
											? 'View Archived Reports'
											: 'Hide Archived Reports'}
									</Button>
									<div>
										<Collapse isOpen={this.state.openAchivedReports}>
											{inactiveReports.length < 1 ? (
												<p>No archived Reports</p>
											) : (
												inactiveReports.map((report, idx) => (
													<Card key={idx}>
														<div key={idx} className="inactive-reports-content">
															<h4 className="report-title">
																{report.reportName}
															</h4>

															<Button
																variant="outlined"
																onClick={() => this.reactivateReport(report.id)}
															>
																Activate
															</Button>
														</div>
													</Card>
												))
											)}
										</Collapse>
									</div>
								</div>
							</div>
						</div>
					</Card>
				) : null}
			</div>
		);
	}

	componentDidMount() {
		const endpoint = `${baseURL}/users/byuser`;
		axiosWithAuth()
			.get(endpoint)
			.then(res =>
				this.setState({
					profileInfo: res.data.user
				})
			)
			.catch(err => console.log(err));

		axiosWithAuth()
			.get(`${baseURL}/users/team`)
			.then(res => {
				this.setState({ users: res.data.users });
			})
			.catch(err => console.log(err));
	}
	viewAchivedReports = () => {
		const endpoint = `${baseURL}/reports`;
		axiosWithAuth()
			.get(endpoint)
			.then(res =>
				this.setState({
					achivedReports: res.data.reports,
					openAchivedReports: !this.state.openAchivedReports
				})
			)
			.catch(err => console.log(err));
	};
	reactivateReport = id => {
		const editedReport = {
			active: true
		};

		console.log(editedReport);
		const endpoint = `${baseURL}/reports/${id}`;
		axiosWithAuth()
			.put(endpoint, editedReport)
			.then(res => console.log(res))
			.catch(err => console.log(err));
		// this does not rerender dashboard - report does not show up without a refresh. Sorry!
		this.props.history.push('/dashboard');
	};

	updateUser = e => {
		e.preventDefault();
		const endpoint = `${baseURL}/users/`;
		const editedUser = {};
		if (this.state.newName) {
			editedUser.fullName = this.state.newName;
			this.setState({
				profileInfo: {
					...this.state.profileInfo,
					fullName: editedUser.fullName
				}
			});
		}
		if (this.state.newPic) {
			editedUser.profilePic = this.state.newPic;
			this.setState({
				profileInfo: {
					...this.state.profileInfo,
					profilePic: editedUser.profilePic
				}
			});
		}
		console.log(editedUser);
		axiosWithAuth()
			.put(endpoint, editedUser)
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
	};

	changeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
	openUserEdit = () => {
		this.setState({ openEditUser: !this.state.openEditUser });
	};
	showJoinCode = () => {
		this.setState({ showJoinCode: !this.state.showJoinCode });
	};

	viewInactiveUsers = () => {
		this.setState({ openInactiveUsers: !this.state.openInactiveUsers });
	};

	activateUser = id => {
		const endpoint = `${baseURL}/users/${id}`;
		const editedUser = {
			active: true
		};
		//create an array with everyone but the user the function's been called on
		const newUsers = this.state.users.filter(user => user.id !== id);

		axiosWithAuth()
			.put(endpoint, editedUser)
			.then(res => {
				newUsers.push(res.data.editedUser);
				this.setState({
					users: newUsers
				});
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export default Profile;