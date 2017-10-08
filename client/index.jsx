import React, { Component } from 'react'
import {Chat, FriendsList} from './components/index'
import { render } from 'react-dom'
import AccountsUIWrapper from './AccountsUIWrapper'
import TrackerReact from 'meteor/ultimatejs:tracker-react'

class App extends TrackerReact(Component) {
  render() {
    let user = Meteor.user()
    if (user) {
      return (
        <div>
          <FriendsList />
          <Chat />
        </div>
      )
    } else
      return (
        <div>
          <AccountsUIWrapper /> 
        </div>
    )
  }
}

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'))
});

