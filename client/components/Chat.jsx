import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Chat, Friends} from '../../collections'
import {moment} from 'meteor/rzymek:moment'
import X from 'meteor/oaf:html5-desktop-notifications'
console.log(X)

this.Friends = Friends
this.Chat = Chat

Notification.requestPermission()

class Chatline extends TrackerReact(Component) {
  user() {
    let me = Friends.find(Meteor.user()._id).fetch()
    if (me.length ===1) 
      return me[0]
    return null
  }
  
  location() {
    return latLng(this.props.data)
  }

  componentWillMount() {
    if (this.props.data.text.indexOf('@'+this.user().name) > -1) {
      let a = new Notification('Alert!')
    }
  }
  render() {
    let date = moment(this.props.data.ts)
    let distance = distanceBetween(
      latLng(this.user()), 
      this.location()
    )
    return(
      <div className='chatline'>  
        <span className='time'> {date.format('HH:MM.SS')} </span>
        <span className='name'> &lt;{this.props.data.name}&gt;</span>
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

  keypress(event) {
    if (event.key === 'Enter')
      this.send(event)
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
        <input onKeyPress={this.keypress.bind(this)} onBlur={this.send.bind(this)} type='text' />
      </div>
    </div>
    )
  }
}
