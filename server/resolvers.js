import { User, Message, Group } from './connectors'

export default {
  Query: {
    fetchUsers: (_, arg, ctx) => User.find({})
  },

  Mutation: {
    createMessage: async (_, { userId, text, groupId }, ctx) => {
      const message = await new Message({
        text,
        to: groupId,
        from: userId
      })
      .save()

      const user = await User.findById(userId)
      await User.findByIdAndUpdate(user._id, {
        messages: [...user.messages, message._id]
      })

      const group = await Group.findById(groupId)
      await Group.findByIdAndUpdate(group._id, {
        messages: [...group.messages, message._id]
      })

      return message
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
