const Schema = [`
  type User {
    username: String
    email: String
    age: Int
  }

  type Query {
    fetchUser: User
  }

  schema {
    query: Query
  }
`]

export default Schema
