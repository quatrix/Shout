import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Chat} from '../../collections'

class Chatline extends Component {
  render() {
    return(
      <div className='chatline'>  
        <span className='name'> {this.props.data.name} </span>
        <span className='text'> {this.props.data.text} </span>
      </div>
    )
  }
}

export default class _Chat extends TrackerReact(Component) {
  chat() {
    return Chat.find().fetch()
  }

  send(data) {
    Meteor.call('say', {
      text: data.target.value,
      location: Geolocation.latLng(),
    })
    data.target.value = ""
  }

  render() {
    let chat = this.chat().map((line, i) => {
      return (
          <Chatline key={i} data={line} />
      )
    })
    return ( <div className='main_container'>
      <div className='chat_container'> {chat} </div>
      <div className='input_container'>
        <input onBlur={this.send.bind(this)} type='text' />
      </div>
    </div>
    )
  }
}
