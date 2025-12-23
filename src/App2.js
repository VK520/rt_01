import React, { Component } from 'react'
import Child from './component/Child'

export default class App2 extends Component {
    state = {
        num: 9999
    }

    changeNum = (val) => {
        this.setState({
            num: val
        })
    }

    render() {
        return (
            <div>
                <Child changeNum={this.changeNum} num={this.state}>21</Child>
            </div>
        )
    }
}
