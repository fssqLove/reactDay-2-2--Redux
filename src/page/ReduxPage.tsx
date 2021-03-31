import React, { Component } from 'react'
import store, { ECountActionType } from '../store/index'
import { Dispatch } from 'redux'

export default class ReduxPage extends Component {

    componentDidMount() {
        store.subscribe(this.update.bind(this))
    }

    update() {
        this.forceUpdate()
    }

    add = () => store.dispatch({ type: ECountActionType.add })

    minus = () => store.dispatch({ type: ECountActionType.minus })

    asyAdd = () => {
        store.dispatch((dispatch: Dispatch) => {
            setTimeout(() => {
                dispatch({ type: ECountActionType.add })
            }, 2000)
        })
    }

    render() {
        return (
            <div>
                <h3>ReduxPage</h3>
                <p>{store.getState()}</p>
                <button onClick={this.add}>add</button>
                <button onClick={this.minus}>minus</button>
                <button onClick={this.asyAdd}>asyAdd</button>
            </div>
        )
    }
}
