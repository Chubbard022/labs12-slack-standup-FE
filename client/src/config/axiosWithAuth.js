import axios from 'axios';

 export const baseURL = 'https://master-slack-standup.herokuapp.com/api';
//export const baseURL = 'http://localhost:4000/api';
export const deployedFEURL = 'https://stand-em-ups.netlify.com/slack/auth/';
// export const localFEURL = 'http://localhost:3000/slack/auth/';

export function axiosWithAuth() {
	const token = localStorage.getItem('token');

	return axios.create({
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${token}`
		}
	});
}
