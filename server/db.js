import { User, Message, Group } from './connectors'
import faker from 'faker'
import random from 'lodash/random'
import asyncTimes from 'async/times'
import asyncMap from 'async/map'
import sample from 'lodash/sample'
import mongoose from 'mongoose'

export const seed = async () => {
  try {
    const users = await manyUsers()
    const groups = await manyGroups(users)
    await manyMessages([].concat.apply([], groups))
    return true
  } catch (e) {
    throw e
  }
}

const manyUsers = () => {
  return new Promise((resolve, reject) => {
    asyncTimes(
      10,
      (n, c) => new User({
        email: faker.internet.email(),
        password: faker.internet.password()
      }).save(c),
      (err, done) => err
        ? reject(err)
        : resolve(done)
    )
  })
}

const manyGroups = users => {
  return new Promise((resolve, reject) => {
    asyncMap(users, (user, c) => {
      asyncTimes(2, (n, c) => {
        const friendA = sample(users.filter(x => String(x._id) !== String(user._id)))
        const friendB = sample(users.filter(x => String(x._id) !== String(user._id) && String(x._id) !== String(friendA._id)))

        new Group({
          name: faker.lorem.text(),
          users: [
            user._id,
            friendA._id,
            friendB._id
          ]
        }).save((err, group) => {
          if (err) c(err)
          User.findByIdAndUpdate(user._id, {
            friends: [friendA._id, friendB._id]
          })
          .then(() => {
            return User.findById(friendA._id)
            .then(_user => {
              return User.findByIdAndUpdate(friendA._id, {
                friends: [..._user.friends, user._id, friendB._id]
              })
            })
          })
          .then(() => {
            return User.findById(friendB._id)
            .then(_user => {
              return User.findByIdAndUpdate(friendB._id, {
                friends: [..._user.friends, friendA._id, user._id]
              })
            })
          })
          .then(() => {
            c(null, group)
          })
          .catch(c)
        })
      }, c)
    },
    (err, done) => err
      ? reject(err)
      : resolve(done)
    )
  })
}

const manyMessages = groups => {
  return new Promise((resolve, reject) => {
    asyncMap(groups, (group, c) => {
      asyncTimes(10, (n, c) => {
        new Message({
          from: group.users[random(0, (group.users.length - 1), false)],
          to: group._id,
          text: faker.lorem.text()
        }).save((err, message) => {
          if (err) return c(err)
          return User.findById(message.from)
          .then(user => {
            return User.findByIdAndUpdate(user._id, {
              messages: [...user.messages, message._id]
            })
          })
          .then(() => {
            return Group.findById(message.to)
            .then(group => {
              return Group.findByIdAndUpdate(group._id, {
                messages: [...group.messages, message._id]
              }, c)
            })
            .catch(c)
          })
          .catch(c)
        })
      }, c)
    },
    (err, done) => err
      ? reject(err)
      : resolve(done)
    )
  })
}

export const databaseInit = (dburl) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(dburl, () => {
      mongoose.connection.db.dropDatabase(() => {
        console.log('Database cleaned')
        resolve()
      })
    })
  })
}
