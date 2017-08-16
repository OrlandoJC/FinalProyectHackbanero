import mongoose, { Schema } from 'mongoose'

mongoose.connect('mongodb://localhost:27017/graph-test')

const seenMoviesSchema = new Schema({
  episodeId: { type: Number },
  isSeen: { type: Boolean, default: false }
})

const SeenMovies = mongoose.model('SeenMovies', seenMoviesSchema)

export {
  SeenMovies
}
