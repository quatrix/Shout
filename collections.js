export const Friends = new Mongo.Collection('friends')
export const Chat = new Mongo.Collection('chat')

if (Meteor.isServer) {
  Meteor.startup(() => {
    Friends._ensureIndex({
      'location': '2dsphere'
    })
    Chat._ensureIndex({
      'location': '2dsphere'
    })
  })
}
