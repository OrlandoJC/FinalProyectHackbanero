import { User, Message, Group } from './connectors'

export default {
  Query: {
    fetchUsers: async (_, arg, ctx) => {
      return User.find({})
    }
  },

  User: {
    messages: ({ messages }) => Message.find({ _id: { $in: messages } }),
    groups: ({ groups }) => Group.find({ _id: { $in: groups } }),
    friends: ({ friends }) => User.find({ _id: { $in: friends } })
  },

  Message: {
    to: ({ to }) => Group.findById(to),
    from: ({ from }) => User.findById(from)
  },

  Group: {
    users: ({ users }) => User.find({ _id: { $in: users } }),
    messages: ({ messages }) => Message.find({ _id: { $in: messages } })
  }
}
