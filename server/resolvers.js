import { withFilter } from 'graphql-subscriptions'
import map from 'lodash/map'
import jwt from 'jsonwebtoken'
import { SECRET } from './config'
import { User, Message, Group } from './connectors'
import pubsub from './subscriptions'

const MESSAGE_ADDED = 'messageAdded'
const GROUP_ADDED = 'groupAdded'

const currentUser = async ctx => {
  try {
    const user = await ctx.user
    if (!user) throw new Error('No autenticado')
    return user
  } catch (e) {
    throw e
  }
}

export default {
  Query: {
    user: (_, { email, _id }, ctx) => User.findOne({
      $or: [{ email }, { _id }]
    }),
    messages: (_, { groupId, userId }) =>
      groupId
      ? Message.find({to: groupId})
      : Message.find({from: userId}),
    group: (_, { _id }) => Group.findById(_id)
  },

  Mutation: {
    login: async (_, { user: { email, password } }, ctx) => {
      const userExist = await User.findOne({ email })
      if (!userExist) throw new Error('No existe usuario')

      if (password !== userExist.password) throw new Error('No son las mismas contraseñas')

      const token = jwt.sign({
        _id: userExist._id,
        email: userExist.email
      }, SECRET)

      const signedUser = await User.findByIdAndUpdate(userExist._id, { jwt: token }, { new: true })
      return signedUser
    },
    createGroup: async (_, { group: { name, userIds } }, ctx) => {
      const { _id } = await currentUser(ctx)

      const group = await new Group({name, users: [userIds, _id]}).save()

      pubsub.publish(GROUP_ADDED, { [GROUP_ADDED]: group })

      return group
    },
    createMessage: async (_, { message: { text, groupId: to } }, ctx) => {
      const { _id: from, messages } = await currentUser(ctx)
      const message = await new Message({text, to, from}).save()

      await User.findByIdAndUpdate(from, { messages: [...messages, message._id] })

      const { _id: groupId, messages: groupMessages } = await Group.findById(to)
      await Group.findByIdAndUpdate(groupId, { messages: [...groupMessages, message._id] })

      pubsub.publish(MESSAGE_ADDED, { [MESSAGE_ADDED]: message })

      return message
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED),
        ({ messageAdded }, { groupIds }) => Boolean(groupIds && !groupIds.indexOf(messageAdded.groupId))
      )
    },
    groupAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GROUP_ADDED),
        ({ groupAdded }, { userId }) => Boolean(userId && map(groupAdded.users, '_id').indexOf(userId))
      )
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
