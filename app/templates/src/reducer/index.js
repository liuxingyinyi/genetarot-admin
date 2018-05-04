/**
 * Created by 叶子 on 2017/7/30.
 */
import { combineReducers } from 'redux';
import * as type from '../action/type';

const handleData = (state = {isFetching: true, data: {}}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true};
        case type.RECEIVE_DATA:
            return {...state, isFetching: false, data: action.data};
        default:
            return {...state};
    }
};
const httpData = (state = {}, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return {...state};
    }
};

const menuState = (state = {}, action) => {
    const {menuState = {}} = action
    const {name = ''} = menuState
    const {description = ''} = menuState
    const {id = 0} = menuState
    const {fileList = []} = menuState
    return {
        ...state,
        name,
        description,
        id,
        fileList
    }
}

const singleRateState = (state = {}, action) => {
    switch(action.type) {
        case 'UPDATE_RATE_DATA':
            // console.log(action);
            return {
                ...state,
                ...action.rateData
            }
        break;
        // case 'INSERT_RATE_DATA':
        //     const {id, insertData} = action.rateData;
        //     const {[id]: singleData} = this.state;
        //     if (singleData) {
        //         let {data, total} = singleData;
        //         data.push(insertData);
        //         total = data.length;
        //         Object.assign(this.state, {[id]: data});
        //     }
        //     return {
        //         ...state
        //     }
        break;
        default:
            return {
                ...state
            }
    }
}

export default combineReducers({
    httpData,
    menuState,
    singleRateState
});
