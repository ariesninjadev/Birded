const mongoose = require('mongoose');

// Connect to remote MongoDB database

mongoose.set('strictQuery', true)
connA = mongoose.createConnection('mongodb+srv://ariesninja:attobro08@birdstore.0wcwtae.mongodb.net/birdalpha', { useNewUrlParser: true });

// Create a MongoDB schema for the player
const playerSchema = new mongoose.Schema({
  account: {
    playername: { type: String, required: true },
    hash: { type: String, required: true },
    email: { type: String, required: true },
    verification: {
      v: { type: Number, required: true, enum: [0, 1] },
      code: { type: Number, required: true },
      id: { type: String, required: true }
    },
    creation: { type: Date, required: false },
    status: { type: Number, required: true },
    op: { type: Number, required: true, enum: [0, 1, 2] },
    icon: { type: String, required: false },
    settings: {
      public: { type: Number, required: true, enum: [0, 1] },
      friends: { type: Number, required: true, enum: [0, 1] },
      party: { type: Number, required: true, enum: [0, 1] },
      autocomplete: { type: Number, required: true, enum: [0, 1] }
    },
    sig: { type: String, required: false },
    dataint: {
      delicon: { type: String, required: false }
    },
    globalsession: { type: String, required: false }
  },
  game: {
    rank: { type: Number, required: true, min: 0 },
    exp: { type: Number, required: true, min: 0 },
    bal: { type: Number, required: true, min: 0 },
    gems: { type: Number, required: true, min: 0 },
    faction: { type: String, required: false },
    metadata: { required: false },
    equipped: {
      abilities: {
        type: [[Number]],
        required: false
      },
      armor: {
        helm: {
          type: [Number],
          required: false
        },
        chpl: {
          type: [Number],
          required: false
        },
        legg: {
          type: [Number],
          required: false
        },
        boot: {
          type: [Number],
          required: false
        }
      }
    },
    inventory: {
      type: [[Number]],
      required: false
    },
    birds: {
      type: [[Number]],
      required: false
    },
    progress: {
      type: [[String]],
      required: false
    },
    friends: {
      type: [[String]],
      required: false
    }
  }
},{ collection: 'players' });


// Create a model for the schema
const Player = connA.model('Player', playerSchema);

// Create a new document (C in 
function moveModel(model) {
  const newPlayer = new Player(model);
  newPlayer.save((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Player data moved to alpha partition.');
    }
  });

}

console.log("Thread > ADB Connected on S-PART")

module.exports = { moveModel }