import { GET_P_ITEM, DEL_P_ITEM, ADD_P_ITEM, PUT_P_ITEM } from '../actions/types'; //CREATE_P_ITEM, DELETE_P_ITEM

const initialState = {
	promotItem: [], //nilai awal masih kosong (array kosong) bebas variabel
	statusGET: '',
	statusDEL: '',
	statusADD: '',
	statusPUT: ''
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_P_ITEM:
			return {
				...state,
				promotItem: action.payload,
				statusGET: action.status
			};

		case DEL_P_ITEM:
			return {
				...state,
				promotItem: state.promotItem.filter((promotItem) => promotItem._id !== action.payload),
				statusDEL: action.status
			};

		case ADD_P_ITEM:
			return {
				...state,
				promotItem: state.promotItem.concat(action.payload),
				statusADD: action.status
			};

		case PUT_P_ITEM:
			return {
				...state,
				promotItem: state.promotItem.filter((promotItem) => promotItem._id !== action.payload.id),
				statusPUT: action.status
			};

		default:
			return state;
	}
}
