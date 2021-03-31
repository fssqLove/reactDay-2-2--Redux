// import {createStore,applyMiddleware} from 'redux'
import {createStore,applyMiddleware} from '../myRedux'
// import logger from 'redux-logger';
import thunk from 'redux-thunk';
import logger from '../myReduxLogger'

export enum ECountActionType{
    add="ADD",
    minus="MINUS"
}

export interface ICountReduceAction{
    type:ECountActionType,
    payload?:number
}

function countReduce(state=0,action:ICountReduceAction){
    switch (typeof action === 'object' &&action.type) {
        case ECountActionType.add:
            state++;
            break;

        case ECountActionType.minus:
            state--;
        break;

        default:
            break;
    }
    return state;
}

// 引入中间件
export default createStore(countReduce,applyMiddleware(logger,thunk))