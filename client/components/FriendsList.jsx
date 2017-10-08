import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Friends} from '../../collections'

class Friend extends Component {
  render() {
    return (
      <div className='friend'> {this.props.data.name} </div>
    )
  }
}

Tracker.autorun(() => {
  let location = Geolocation.currentLocation()
  if (location) {
    Meteor.subscribe('friends', Geolocation.latLng())
  } else {
    Meteor.subscribe('friends')
  }
})

export default class FriendsList extends TrackerReact(Component) {
  friends() {
    return Friends.find().fetch()
  }
  render() {
    let friends = this.friends().map((friend) => {
      return (
          <Friend key={friend.name} data={friend} />
      )
    })
    return (
      <div className='friends'> {friends} </div>
    )
  }
}

