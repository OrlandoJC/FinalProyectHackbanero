export default {
  Boolean: () => false,
  String: () => 'Hola Graph',
  User: () => ({
    username: () => 'Username',
    email: () => 'email@test.me',
    age: () => 20
  })
}
