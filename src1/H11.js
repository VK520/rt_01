import React from 'react'

class H11 extends React.Component {
    state = {
        flag: true,
        team: 'laker',
        No: [8, 24],
        msg: { 'name': 'kobe', 'hobby': 'basketball' },
        age: 25
    }

    constructor() {
        super()
        this.flag = false
    }

    change() {
        this.setState({
            age:26
        },function(){
            console.log(this.state.age,'66666666666666');
            
        })
        console.log(this.state.age,'888888888888888888');
        
    }
}



export default H11