import React, { Component } from 'react';
import SingleReport from './SingleReport';
import { axiosWithAuth, baseURL } from '../../config/axiosWithAuth';
import Slack from '../Slack/Slack';

import { Link } from 'react-router-dom';
// SAME AS SURVEY LIST ON WIREFRAME

class Reports extends Component {
	state = {
		message: '',
		reports: []
	};

	componentDidMount() {
		// call to get reports and stick them in state
		const endpoint = `${baseURL}/reports`;
		axiosWithAuth()
			.get(endpoint)
			.then(res =>
				this.setState({
					message: res.data.message,
					reports: res.data.reports
				})
			)
			.catch(err => console.log(err));
	}
	deleteReport = id => {
		const endpoint = `${baseURL}/reports/${id}`;

		axiosWithAuth()
			.delete(endpoint)
			.then(res => console.log(res))
			.catch(err => console.log(err));
	};

	render() {
		if (this.state.reports.length < 1) {
			return (
				<div>
					<h2>You have not created any reports</h2>
					<Link to="/dashboard/createreport">
						<button>Create Report</button>
					</Link>
					<Slack />
				</div>
			);
		}
		return (
			<div>
				Reports:
				<div>
					<Slack />
					{/* passing reports from state to individual components */}
					{this.state.reports.map(report => (
						<SingleReport
							key={report.id}
							report={report}
							deleteReport={this.deleteReport}
						/>
					))}
					<Link to="/dashboard/createreport">
						<button>Create New Report</button>
					</Link>
					<h2>This component needs access to:</h2>
					<ul>
						<li>QUERY: all reports by teamId</li>
						<li>Report Name, schedule, team member list,</li>
					</ul>
				</div>
			</div>
		);
	}
}

export default Reports;
