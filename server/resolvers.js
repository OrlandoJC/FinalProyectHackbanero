import axios from 'axios'
import asyncMap from 'async/map'
import { SeenMovies } from './connectors'

export default {
  Query: {
    fetchUser: async (_, arg, ctx) => {
      try {
        const response = await axios.get('http://swapi.co/api/people')
        return response.data.results
      } catch (e) {
        throw e
      }
    }
  },

  People: {
    films: async ({ people }) => {
      return new Promise((resolve, reject) => {
        asyncMap(
          films,
          (m, c) => axios.get(m).then(({ data }) => c(null, data)).catch(c),
          (err, done) => err ? reject(err) : resolve(done)
        )
      })
    }
  },

  Film: {
    isSeen: async ({ episode_id }) => {
      try {
        const seen = await SeenMovies.findOne({episodeId: episode_id})
        if (!seen) return false
        return seen
      } catch (e) {
        throw e
      }
    }
  }
}
