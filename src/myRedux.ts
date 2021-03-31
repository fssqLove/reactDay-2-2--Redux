// myRedux.ts

export function createStore(reducer:Function,enhancer?:Function) {
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

export function applyMiddleware(...middlewares:Array<Function>) {
    // 返回强化以后的函数
    return (createStore:Function) => (...args:any)=>{
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

function compose(...funcs:Array<Function>) {
    if(funcs.length === 0){
        return (arg:any) => arg
    }

    if(funcs.length === 1){
        return funcs[0]
    }

    return funcs.reduce((a,b)=>(...args:any)=>a(b(...args)))
}