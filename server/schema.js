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

  type Query {
    fetchUsers: [User]
    fetchUser(userId: String): User
  }

  type Mutation {
    createMessage(userId: String, text: String, groupId: String): Message
  }

  schema {
    query: Query,
    mutation: Mutation
  }
`]

export default Schema
