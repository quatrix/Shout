import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Friends} from '../../collections'

class Friend extends Component {
	user_location() {
    let me = Friends.find(Meteor.user()._id).fetch()
    if (me.length ===1) 
      return latLng(me[0])
    return null
	}
  
  location() {
    return latLng(this.props.data)
  }

  render() {
    let date = moment(this.props.data.ts)
    let distance = distanceBetween(
      this.user_location(), 
      this.location()
    )
    console.log(distance)
    return (
      <div className='friend'> 
        <div className='distance'> {distance}M </div>
        <div className='name'> 
          {this.props.data.name} 
        </div>
      </div>
    )
  }
}

Tracker.autorun(() => {
  let location = Geolocation.currentLocation()
  if (location) {
    Meteor.subscribe('friends', Geolocation.latLng())
    Meteor.subscribe('chat', Geolocation.latLng())
  } else {
    Meteor.subscribe('friends')
    Meteor.subscribe('chat')
  }
})

export default class FriendsList extends TrackerReact(Component) {
  constructor() {
    super()
  }

  friends() {
    const friends = Friends.find().fetch()
    if (this.state.show != 'all')
      return friends.filter((friend) => {
        return ((friend.friends) && (friend.friends.indexOf(this._user) > -1))
      })
    return Friends.find().fetch()
  }

  selectFriends() {
    this.setState({show: 'friends'})
  }

  location() {
    return latLng(this.props.data)
  }

  selectAll() {
    this.setState({show: 'all'})
  }

  componentWillMount() {
    if (!this.state)
      return this.selectFriends()
  }

  render() {
    this._user = Friends.find(Meteor.user()._id).fetch()
    let left_tab_class = 'select left'
    let right_tab_class = 'select right'
    if (this.state.show === 'all')
      right_tab_class += ' selected'
    else
      left_tab_class += ' selected'
    let friends = this.friends().map((friend) => {
      return (<Friend key={friend.name} data={friend} />)
    })
    return (
      <div className='friends_container'>
        <div className='tab'>
          <div className={left_tab_class} onClick={this.selectFriends.bind(this)}> Friends </div>
          <div className={right_tab_class} onClick={this.selectAll.bind(this)}> All </div>
        </div>
        <div className='friends'> 
          {friends} 
        </div>
      </div>
    )
  }
}

