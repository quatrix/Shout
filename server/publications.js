import {Meteor} from 'meteor/meteor'
import {Friends, Chat} from '../collections'
import {GeoIP} from 'meteor/servicelocale:geoip'

const point = (coords) => {
	return {
		"type": "Point",
		"coordinates": [ coords.lng, coords.lat ]
	}
}

const now = () => {
  return new Date().valueOf()
}

this.time_passed = () => {
  return {
    "$or": [
      {ts: { 
        "$lt": (now()-50),
      }},
      {ts: { 
        "$exists": false
      }}
    ]
  }
}

Meteor.startup(() => {
  Chat._ensureIndex({ 
    "ts": 1 
  }, { 
    expireAfterSeconds: 600 
  })
})

Meteor.methods({
  'say'({text, location}) {
    let lines = Chat.find().fetch()
    let user = Meteor.user()
    if (location) {
      // do nothing
    } else {
      let ip = this.connection.clientAddress
      if (localip(ip)) {
        location = JSON.parse('{"lat":32.0965521,"lng":34.779592199999996}')
      } else {
				let geoip_data = GeoIP.lookup(ip)
				console.log(geoip_data)
				return
			}
    }
  	Chat.insert({
      text,
      name: user.username,
			location: point(location),
      ts: new Date(),
	  })
  }
})

const updateCurrentLocation = (data) => {
	let user = Meteor.user()
  Friends.upsert({
    name: user.username,
    _id: user._id
  }, {
		"$set": {
			"location": point(data)
		}
	})
}

const locationQuery = (coords, distance=1000) => {
  return {
    location: {
      $near: {
				$geometry: point(coords),
				$maxDistance: distance
      }
    }
  }
}

const localip = (ip) => {
	if (ip === '127.0.0.1') return true
	if (ip.indexOf('192.168')===0) return true
	return false
}

Meteor.publish({
  'chat'(data) {
    if (data) {
      updateCurrentLocation(data)
    } else {
      let ip = this.connection.clientAddress
      if (localip(ip)) {
        data = JSON.parse('{"lat":32.0965521,"lng":34.779592199999996}')
				updateCurrentLocation(data)
      } else {
				let geoip_data = GeoIP.lookup(ip)
				console.log(geoip_data)
				return
			}
    }
    let friends_query = locationQuery(data)
    let user = Meteor.user()
    return [
      Friends.find(friends_query)
    ]
  },
  'friends'(data) {
    if (data) {
      updateCurrentLocation(data)
    } else {
      let ip = this.connection.clientAddress
      if (localip(ip)) {
        data = JSON.parse('{"lat":32.0965521,"lng":34.779592199999996}')
				updateCurrentLocation(data)
      } else {
				let geoip_data = GeoIP.lookup(ip)
				console.log(geoip_data)
				return
			}
    }
    let chat_query = locationQuery(data)
    let user = Meteor.user()
    let friends_query = {
      $or: [
        {friends: {$in: [user._id]}},
        {_id: user._id}
      ]
    }
    return [
      Chat.find(chat_query),
      Friends.find(friends_query)
    ]
  },
})
