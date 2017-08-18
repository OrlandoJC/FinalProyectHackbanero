const Schema = [`
  type User {
    _id: String
    email: String
    messages: [Message]
    groups: [Group]
    friends: [User]
    jwt: String
  }

  type Message {
    _id: String
    to: Group
    from: User
    text: String
  }

  type Group {
    _id: String
    name: String
    users: [User]
    messages: [Message]
  }

  input MessageInput {
    groupId: Int!
    text: String!
  }

  input GroupInput {
    name: String!
    userIds: [Int!]
  }

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    user(email: String, _id: Int): User
    messages(groupId: Int, userId: Int): [Message]
    group(_id: Int!): Group
  }

  type Mutation {
    login(user: UserInput!): User
    createMessage(message: MessageInput!): Message
    createGroup(group: GroupInput!): Group
  }

  type Subscription {
    messageAdded(groupIds: [Int]): Message
    groupAdded(userId: Int): Group
  }

  schema {
    query: Query,
    mutation: Mutation
    subscription: Subscription
  }
`]

export default Schema
