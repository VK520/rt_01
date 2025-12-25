import React from "react";

export default class Child extends React.Component {
    state = {
        num: 12
    }
    render() {
        console.log(this.props);

        const { num } = this.props
        return (
            <div>
                <h2>{num}</h2>
                <button onClick={() => { this.props.change(this.state.value) }}>
                    12211212
                </button>
            </div>
        )
    }
}



