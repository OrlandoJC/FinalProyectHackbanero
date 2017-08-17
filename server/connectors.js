import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  email: { type: String },
  password: { type: String },
  messages: [{ type: Schema.Types.ObjectId }],
  groups: [{ type: Schema.Types.ObjectId }],
  friends: [{ type: Schema.Types.ObjectId }],
  jwt: { type: String }
})

const MessagesSchema = new Schema({
  from: { type: Schema.Types.ObjectId },
  to: { type: Schema.Types.ObjectId },
  text: { type: String }
})

const GroupSchema = new Schema({
  name: { type: String },
  users: [{ type: Schema.Types.ObjectId }],
  messages: [{ type: Schema.Types.ObjectId }]
})

export const User = mongoose.model('User', UserSchema)
export const Message = mongoose.model('Message', MessagesSchema)
export const Group = mongoose.model('Group', GroupSchema)
