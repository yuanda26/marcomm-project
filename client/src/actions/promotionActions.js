import axios from 'axios';
import { GET_PROMOTION, DEL_PROMOTION, ADD_PROMOTION, PUT_PROMOTION, GET_EVENT, GET_DESIGN, ADD_DATA_P } from './types'; //, CREATE_PROMOTION, DELETE_PROMOTION

import ApiConfig from '../config/Host_Config'; //localhost:4000/api

const token = localStorage.token;
const ENDPOINTS = {
	PROMOTION: {
		PROMOTION: '/promotion',
		ITEM: '/promotionitem',
		FILE: '/prmotionfile',
		EVENT: '/event',
		DESIGN: '/design',
		T_DESIGN_ITEM: '/t_design_item'
	}
};
//<<--------------------------Get API from t_promotion--------------------------->>
export const getAllPromotion = () => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.PROMOTION,
		method: 'get',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: GET_PROMOTION,
				payload: res.data.message,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: GET_PROMOTION,
				payload: null
			});
		});
};

export const delPromotion = (param) => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.PROMOTION + '/' + param,
		method: 'delete',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: DEL_PROMOTION,
				payload: param,
				status: res.data.code
			});
		})
		.catch((error) =>
			dispatch({
				type: DEL_PROMOTION,
				status: error.response.data.code,
				message: error.response.data.message
			})
		);
};

export const createPromotion = (body, modalCallback, design = true) => (dispatch) => {
	if (design) {
		let option = {
			url: `${ApiConfig.host}/promotion_design`,
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
					type: ADD_PROMOTION,
					payload: body
				});
				modalCallback(
					1,
					'Data Saved!, Transaction request hass been add with code ' + res.data.message + '!',
					200
				);
				setTimeout(() => {
					localStorage.removeItem('PROMOTION');
					window.location.href = '/promotion';
				}, 1000);
			})
			.catch((error) => {
				dispatch({
					type: ADD_PROMOTION,
					payload: null
				});
				modalCallback(2, 'Something Error, data not saved!', 400);
			});
	} else {
		let option = {
			url: `${ApiConfig.host}/promotion`,
			method: 'post',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json'
			},
			data: body
		};
		axios(option)
			.then((response) => {
				dispatch({
					type: ADD_PROMOTION,
					payload: body
				});
				modalCallback(
					1,
					`Data Saved!, Transaction request has been add with code ${response.data.message}!`,
					200
				);
				setTimeout(() => {
					window.location.href = '/promotion';
				}, 2000);
			})
			.catch((error) => {
				dispatch({
					type: ADD_PROMOTION,
					payload: null
				});
				modalCallback(2, `Something Error, data not Saved! with message: ${error}`, 400);
			});
	}
};

export const putPromotion = (data, modalCallback, design = false) => (dispatch) => {
	let token = localStorage.token;
	let option = {
		url: ApiConfig.host + '/promotion/' + data.marketHeader._id,
		method: 'put',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json'
		},
		data: data
	};
	axios(option)
		.then((response) => {
			dispatch({
				type: PUT_PROMOTION,
				payload: data,
				status: response.data.code
			});
			if (design === false) {
				modalCallback(1, `Data Saved, Transaction with code ${data.marketHeader.code} has been Updated`, 200);
			} else {
				modalCallback(1, `Data Saved, Transaction with code ${data.marketHeader.code} has been Updated`);
			}
			setTimeout(() => {
				window.location.pathname = '/promotion';
			}, 1500);
		})
		.catch((error) => {
			if (design === false) {
				modalCallback(2, `Something Wrong, data not saved. message: ${error}`, 400);
			} else {
				modalCallback(2, `Something Wrong, data not saved. message: ${error}`);
			}

			dispatch({
				type: PUT_PROMOTION,
				payload: null,
				status: error
			});
		});
};
//<<-----------------------------End of Get API from t_promotion--------------------->>

//<<-----------------------------Get API from t_event-------------------------------->>
export const getEvent = () => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.EVENT,
		method: 'get',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: GET_EVENT,
				payload: res.data.message,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: GET_EVENT,
				payload: null
			});
		});
};
//<<------------------------------End of Get API from t_event---------------------->>
//<<-----------------------------Get API from t_design------------------------------->>
export const getDesign = () => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.DESIGN,
		method: 'get',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: GET_DESIGN,
				payload: res.data.message,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: GET_DESIGN,
				payload: null
			});
		});
};
export const getDesignByCode = (code) => (dispatch) => {
	let option = {
		url: `${ApiConfig.host}${ENDPOINTS.PROMOTION.DESIGN}/${code}`,
		method: 'get',
		headers: {
			Authorization: token
		}
	};
	axios(option)
		.then((res) => {
			dispatch({
				type: 'GET_ONE_DESIGN',
				payload: res.data.message,
				status: res.data.code
			});
		})
		.catch((err) => {
			dispatch({
				type: 'GET_ONE_DESIGN',
				payload: null,
				status: err.code
			});
		});
};
//<<----------------------------End of Get API from t_design------------------------->>
export const addDataP = (body) => (dispatch) => {
	dispatch({
		type: ADD_DATA_P,
		payload: body
	});
};
export const getPromotion = (id) => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.PROMOTION.PROMOTION + '/' + id,
		method: 'get',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: 'GET_ONE',
				payload: res.data.message,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: 'GET_ONE',
				payload: null
			});
		});
};
export const getDesignOne = (code) => (dispatch) => {
	let options = {
		url: ApiConfig.host + ENDPOINTS.DESIGN + '/' + code,
		method: 'get',
		headers: {
			Authorization: token
		}
	};
	axios(options)
		.then((res) => {
			dispatch({
				type: 'GET_D_ONE',
				payload: res.data.message,
				status: res.data.code
			});
		})
		.catch((error) => {
			dispatch({
				type: 'GET_D_ONE',
				payload: null
			});
		});
};
export const getDesignItem = (code, design) => (dispatch) => {
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
				status: res.data.status
			});
		})
		.catch((err) => {
			dispatch({
				type: 'GET_P_ITEM',
				payload: null,
				status: err
			});
		});
};
