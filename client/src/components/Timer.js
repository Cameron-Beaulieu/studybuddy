import React, { Component } from 'react'

export default class Timer extends Component {
    constructor(props){
        super(props)
        this.state = {
            hours: this.props.hours,
            minutes: this.props.minutes,
            seconds: this.props.seconds,
            preText: this.props.preText, //text for before the timer
            postText: this.props.postText, //text for after the timer
        }
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { hours, seconds, minutes } = this.state

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    if(hours === 0){
                    clearInterval(this.myInterval)
                    }
                    else if(hours > 0){
                        this.setState(({ hours }) => ({
                            hours: hours - 1,
                            minutes: 59,
                            seconds: 59
                        }))
                    }
                } else if (minutes > 0){
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            } 
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const {postText, preText, hours, minutes, seconds } = this.state
        return (
            <div>
                { hours === 0 && minutes === 0 && seconds === 0
                    ? <h1>Time Up</h1> //adjust this to what you want to happen when the timer is up
                    : <h1>{preText} {hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds} {postText}</h1>
                }
            </div>
        )
    }
}