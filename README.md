# 1.状态容器Redux
+ 1.createStore 创建store 保存数据
+ 2.reducer初始化state,并且定义state修改规则
+ 3.dispatch一个action来提交对数据的修改
+ 4.action提交到reducer函数里面，根据传入的action的type,返回新的state
+ 5.getState 获取状态值
+ 6.subscribe 变更订阅

## 安装
```
npm i redux 
```

## 基本使用
### 第一步创建store ,`src/store/index.ts`
```
import {createStore} from 'redux'


export enum ECountActionType{
    add="ADD",
    minus="MINUS"
}

export interface ICountReduceAction{
    type:ECountActionType,
    payload:number
}

function countReduce(state=0,action:ICountReduceAction){
    switch (action.type) {
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

export default createStore(countReduce)
```

## 第二步使用引入后使用
```
// ReduxPage.tsx

import React, { Component } from 'react'
import store, { ECountActionType } from '../store/index'

export default class ReduxPage extends Component {

    componentDidMount() {
        store.subscribe(this.update.bind(this))
    }

    update() {
        this.forceUpdate()
    }

    add = () => store.dispatch({ type: ECountActionType.add })

    minus = () => store.dispatch({ type: ECountActionType.minus })

    render() {
        return (
            <div>
                <h3>ReduxPage</h3>
                <p>{store.getState()}</p>
                <button onClick={this.add}>add</button>
                <button onClick={this.minus}>minus</button>
            </div>
        )
    }
}

```
***

# 2.实现自己的 `Redux`

## 第一步定义Redux
```
// myRedux.ts

export function createStore(reducer:Function,enhancer:Function) {
    if(enhancer){
        return enhancer(createStore)(reducer)
    }

    // 保存状态
    let currentState:any = undefined;

    // 回调函数
    let currentListeners:Array<Function> = [];

    function getState() {
       return  currentState
    }

    function subscribe(listener:Function) {
        currentListeners.push(listener)
    }

    function dispatch(action:any) {
        currentState = reducer(currentState,action)

        currentListeners.forEach(fn=>fn())

        return action
    }

    dispatch({type:'@@0000/MY-REDUX'})

    return {getState,subscribe,dispatch}
}
```
## 将引入的`Redux`修改为自己的 `myRedux`
```
// import {createStore,applyMiddleware} from 'redux'
import {createStore} from '../myRedux'
```
***

# 3.中间件
+ Redux 是一个纯粹的状态管理器，默认支支持同步，实现异步，需要中间件支持，
+ `npm i redux-thunk redux-logger -S` 安装中间件

## 3.1使用异步中间件
## 第一步修改  `src/store/index.ts` 增加中间件
```
import {createStore,applyMiddleware} from 'redux'
import logger from 'redux-logger';
import thunk from 'redux-thunk';

export enum ECountActionType{
    add="ADD",
    minus="MINUS"
}

export interface ICountReduceAction{
    type:ECountActionType,
    payload?:number
}

function countReduce(state=0,action:any){
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
```

## 第二步，使用`thunk` 中间件带来的异步提交
```
import { Dispatch } from 'redux'

    asyAdd = () => {
        store.dispatch((dispatch: Dispatch) => {
            setTimeout(() => {
                dispatch({ type: ECountActionType.add })
            }, 2000)
        })
    }
```
***

# 4.用自己的实现`redux` 使用自己的中间件
## 第一步增加 `myRedux`方法
```
export function applyMiddleware(...middlewares:Array<Function>) {
    // 返回强化以后的函数
    return (createStore:any) => (...args:any)=>{
        const store = createStore(...args)

        let dispatch = store.dispatch

        const midApi = {
            getState:store.getState,
            dispatch:(...args:any)=>dispatch(...args)
        }

        // 使中间件可以获取状态值，派发action
        const middlewareChain = middlewares.map(middleware=>middleware(midApi))

        // compose可以使middlewareChain函数合并成一个函数
        dispatch = compose(...middlewareChain)(store.dispatch)

        return {
            ...store,
            dispatch
        }
    }
}

export function compose(...funcs:Array<Function>) {
    if(funcs.length === 0){
        return (arg:any) => arg
    }

    if(funcs.length === 1){
        return funcs[0]
    }

    return funcs.reduce((a,b)=>(...args:any)=>a(b(...args)))
}
```
## 第二步修改引入
```
// import {createStore,applyMiddleware} from 'redux'
import {createStore,applyMiddleware} from '../myRedux'

```
***

# 5.自己实现中间件
## redux-logger 实现
```
//myReduxLogger.ts

export default function logger() {
    return (dispatch:any) => (action:any) => {
        console.log(action)
        return dispatch(action)
    }
}
```
[源码](https://github.com/fssqLove/reactDay-2-2--Redux)