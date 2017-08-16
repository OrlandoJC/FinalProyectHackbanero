const Schema = [`
  type Film {
    title: String
    isSeen: Boolean
  }

  type People {
    name: String
    films: [Film]
  }

  type Query {
    fetchUser: [People]
  }

  schema {
    query: Query
  }
`]

export default Schema
