import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AdminRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props => {
				const token = localStorage.getItem('token');
				if (!token) {
					return <Redirect to="/login" />;
				}
				const decoded = jwt_decode(token);

				if (token && !decoded.teamId) {
					return <Redirect to="/onboarding" />;
				} else if (decoded.roles === 'member') {
					return <Redirect to="/dashboard" />;
				} else if (decoded.roles === 'admin') {
					return <Component {...props} />;
				}
			}}
		/>
	);
};

export default AdminRoute;
