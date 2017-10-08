import {Meteor} from 'meteor/meteor'
import {Friends, Chat} from '../collections'

Meteor.methods({
  'say'({text, location}) {
    Chat.insert({
      "name": "erez",
      text,
			"location": {
				"type": "Point",
				"coordinates": [ location.lng, location.lat ]
			}
    })
  }
})

const updateCurrentLocation = (data) => {
  Friends.upsert({
    name: 'erez',
  }, {
		"$set": {
			"location": {
				"type": "Point",
				"coordinates": [ data.lng, data.lat ]
			}
		}
	})
}

const locationQuery = (coords, distance=1000) => {
  return {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coords.lng, coords.lat]
        },
      $maxDistance: distance
      }
    }
  }
}

Meteor.publish({
  'friends'(data) {
    console.log(this.connection.clientAddress)
    if (data) {
      updateCurrentLocation(data)
    } else {
      return
    }
    let location_query = locationQuery(data)
    return [
      Chat.find(location_query),
      Friends.find(location_query)
    ]
  },
})
