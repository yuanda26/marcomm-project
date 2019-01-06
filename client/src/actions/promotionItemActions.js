import axios from 'axios';
import { GET_P_ITEM, DEL_P_ITEM, ADD_P_ITEM, PUT_P_ITEM } from './types'; //, CREATE_P_ITEM, DELETE_P_ITEM

import ApiConfig from '../config/Host_Config'; //localhost:4000/api

const token = localStorage.token;
const ENDPOINTS = {
	PROMOTION: {
		PROMOTION: '/promotion',
		ITEM: '/promotionitem',
		FILE: '/prmotionfile',
		EVENT: '/tevent',
		DESIGN: '/design',
		T_DESIGN_ITEM: '/t_design_item',
		PROMOTION_ITEM: '/promotion_item'
	}
};
export const getAllPromotionItem = () => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.ITEM,
		method: 'get',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: GET_P_ITEM,
				payload: res.data.message,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: GET_P_ITEM,
				payload: null
			});
		});
};

export const delPromotionItem = (param) => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.ITEM + '/' + param,
		method: 'delete',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: DEL_P_ITEM,
				payload: param,
				status: res.data.code
			});
		})
		.catch((error) =>
			dispatch({
				type: DEL_P_ITEM,
				status: error.response.data.code,
				message: error.response.data.message
			})
		);
};

export const createPromotionItem = (body) => (dispatch) => {
	let option = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.ITEM,
		method: 'post',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json'
		},
		data: body
	};
	axios(option)
		.then((res) => {
			dispatch({
				type: ADD_P_ITEM,
				payload: body,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: ADD_P_ITEM,
				payload: null
			});
		});
};

export const putPromotionItem = (body) => (dispatch) => {
	let option = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.ITEM + '/' + body._id,
		method: 'put',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json'
		},
		data: body
	};
	axios(option)
		.then((res) => {
			dispatch({
				type: PUT_P_ITEM,
				payload: body,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: PUT_P_ITEM,
				payload: null
			});
		});
};
export const getItem = (code) => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.ITEM + '/' + code,
		method: 'get',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: 'GET_I_ONE',
				payload: res.data.message,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: 'GET_I_ONE',
				payload: null
			});
		});
};
export const getDesignItem = (code, design, kind = 'edit') => (dispatch) => {
	if (kind !== 'edit') {
		let option = {
			url: `${ApiConfig.host}/t_design_item/${design}`,
			method: 'get',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json'
			}
		};
		axios(option)
			.then((res) => {
				dispatch({
					type: 'GET_P_ITEM',
					payload: res.data.message,
					status: res.data.code
				});
			})
			.catch((err) => {
				dispatch({
					type: 'GET_P_ITEM',
					payload: null,
					status: err
				});
			});
	} else {
		let option = {
			url: `${ApiConfig.host}/promotion_item/${code}/${design}`,
			method: 'get',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json'
			}
		};
		axios(option)
			.then((res) => {
				dispatch({
					type: 'GET_P_ITEM',
					payload: res.data.message[0],
					status: res.data.code
				});
			})
			.catch((err) => {
				dispatch({
					type: 'GET_P_ITEM',
					payload: null,
					status: err
				});
			});
	}
};
