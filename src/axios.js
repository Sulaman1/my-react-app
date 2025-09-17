import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://182.184.83.159:44311/api'
});

export default instance;
