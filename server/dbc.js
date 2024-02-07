const mongoose = require('mongoose');

// Connect to remote MongoDB database


mongoose.set('strictQuery', true)
mongoose.connect(process.env['dburi'], { useNewUrlParser: true });

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
    status: { type: Number, required: true, enum: [0, 1, 2] },
    op: { type: Number, required: true, enum: [0, 1, 2] },
    icon: { type: String, required: true },
    settings: {
      public: { type: Number, required: true, enum: [0, 1] },
      options: { required: false }
    },
    sig: { type: String, required: true },
    dataint: {
      badges: { type: String, required: true }
    },
    globalsession: { type: String, required: true }
  },
  game: {
    rank: { type: Number, required: true, min: 0 },
    exp: { type: Number, required: true, min: 0 },
    bal: { type: Number, required: true, min: 0 },
    gems: { type: Number, required: true, min: 0 },
    gamedata: { required: false },
    friends: { required: false }
  }
},{ collection: 'players' });

const chatSchema = new mongoose.Schema({
  identifier: { type: String, required: false },
  nongame: {
    recentchat: { type: [String], required: false }
  }
},{ collection: 'chats' });


// Create a model for the schema
const Player = mongoose.model('players', playerSchema);

const ChatData = mongoose.model('chats', chatSchema);

// Create a new document (C in 
function registerUser(email, user, pwdh, codeI, idI) {
  const now = new Date();
  const newPlayer = new Player({
    account: {
      playername: user,
      hash: pwdh,
      email: email,
      verification: {
        v: 0,
        code: codeI,
        id: idI
      },
      creation: now,
      status: 1,
      op: 0,
      icon: "none",
      settings: {
        public: 1,
        options: {}
      },
      sig: " ",
      dataint: {
        badges: "none" 
      },
      globalsession: " "
    },
    game: {
      rank: 0,
      exp: 0,
      bal: 0,
      gems: 0,
      gamedata: {},
      friends: {}
    }
  });


  // Save the document to the database (C in CRUD)

  newPlayer.save((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Player data saved successfully!');
    }
  });

}

// Find all documents in the database (R in CRUD)

/* FIND BOILERPLATE
Player.find((error, players) => {
  if (error) {
    console.log(error);
  } else {
    console.log(players);
  }
});
*/


async function chkUsername(usr) {
  try {
    const players = await Player.find({});
    for (let i = 0; i < players.length; i++) {
      curref = players[i].account.playername
      if (curref.toLowerCase() === usr.toLowerCase()) {
        return 0;
      }
    }

    return 1;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function chkEmail(eml, usr) {
  try {
    const players = await Player.find({});
    for (let i = 0; i < players.length; i++) {
      curref = players[i].account.email
      if (curref.toLowerCase() === eml.toLowerCase()) {
        return 0;
      }
    }
    console.log("NEW MAKE REQUEST >> " + usr);
    return 1;
  } catch (err) {
    console.error(err);
    return false;
  }
}


async function chkVerifyHash(given) {
  try {
    const players = await Player.find({});
    for (let i = 0; i < players.length; i++) {
      curref = players[i].account.verification.id
      if (curref.toLowerCase() === given.toLowerCase()) {
        if (players[i].account.verification.v == 0) {
          return 1;
        } else {
          return -1;
        }
      }
    }
    return 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function vid(given) {
  try {
    const players = await Player.find({});
    for (let i = 0; i < players.length; i++) {
      curref = players[i].account.verification.id
      if (curref.toLowerCase() === given.toLowerCase()) {
        return 1;
      }
    }
    return 0;
  } catch (err) {
    //console.error(err);
    return false;
  }
}

async function reqstat(ide) {
  try {
    const player = await Player.findOne({ "account.verification.id": ide });
    if (!player) return false;
    const a_name = player.account.playername;
    const a_icon = player.account.icon;
    const a_status = player.account.status;
    const a_op = player.account.op;
    
    return player;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function idToCode(ide) {
  try {
    const player = await Player.findOne({ "account.verification.id": ide });
    if (!player) return false;
    const code = player.account.verification.code;
    if (player.account.verification.v == 1) {
      return "d";
    } else {
    return code;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function idToName(ide) {
  try {
    const player = await Player.findOne({ "account.verification.id": ide });
    if (!player) return false;
    const code = player.account.playername;
    return code;
  } catch (err) {
    console.error(err);
    return "err";
  }
}

async function sendVerify(ide) {
  try {
    const result = await Player.updateOne(
      { "account.verification.id": ide },
      {
        $set: {
          "account.verification.v": 1
        },
      });

    return (result);

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function generalData(id,key,val) {
  try {
    const result = await Player.updateOne(
      { "account.verification.id": id },
      {
        $set: {
          [key]: val
        },
      });

    return (result);

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function postChat(content,location) {
  try {
    const result = await ChatData.updateOne(
      { "identifier": location },
      {
        $push: {
          "nongame.recentchat": content
        },
      });

    return (result);

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function clearChat(location) {
  try {
    const valuesToAdd = Array(50).fill("<x></x>");

    const result = await ChatData.updateOne(
      { "identifier": location },
      {
        $push: {
          "nongame.recentchat": { $each: valuesToAdd }
        },
      });

    return result;

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function requestChat(location) {
  try {
    const result = await ChatData.findOne({ "identifier": location });
    if (!result) return false;

    const recentchat = result.nongame.recentchat;
    // Use slice to get the last 50 values of the array
    const last50Values = recentchat.slice(-50);

    return last50Values;
  } catch (err) {
    console.error(err);
    return false;
  }
}


async function userPublicSearch(content,c) {
  try {
    var players
    if (c) {
      players = await Player.find({
      "account.playername": { $regex: `^${content}`, $options: "i" }
    });
    } else {
    players = await Player.find({
      "account.playername": { $regex: `^${content}`, $options: "i" },
      "account.settings.public": 1
    });
    }

    const result = players.map(player => ({
      playername: player.account.playername,
      level: player.game.exp,
      rank: player.game.rank,
      icon: player.account.icon,
      op: player.account.op
    }));

    return result;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function changeEmail(id,eml) {
  try {
    const emailExists = await Player.findOne({'account.email': eml}); // Check if email already exists
    if (emailExists) {
      return 0; // Return an error message
    }
    const codeI = Math.floor(Math.random() * (999999 - 111111 + 1) + 111111);
    const playerN = await Player.findOne({ "account.verification.id": id });
    const result = await Player.updateOne(
      { "account.verification.id": id },
      {
        $set: {
          'account.email': eml,
          'account.verification.v': 0,
          'account.verification.code': codeI
        },
      });
    return ([codeI,playerN.account.playername]);
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function changePassword(id,newhash) {
  try {
    const result = await Player.updateOne(
      { "account.verification.id": id },
      {
        $set: {
          'account.hash': newhash
        },
      });

    return (result);

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function postAvatar(id,ide) {
  try {
    const result = await Player.updateOne(
      { "account.verification.id": id },
      {
        $set: {
          "account.icon": ide[0]
        },
      });

    return ([result,""]);

  } catch (err) {
    console.error(err);
    return false;
  }
}

async function chkUsernameL(usr) {
  try {
    const player = await Player.findOne({ "account.playername": { $regex: new RegExp("^" + usr + "$", "i") } });
    if (!player) return "NO_SUCH_PLAYERNAME";
    const code = player.account.verification.id;
    return code;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function chkPasswordL(uid) {
  try {
    const player = await Player.findOne({ "account.verification.id": uid });
    if (!player) return "NO_SUCH_ID";
    const code = player.account.hash;
    return code;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function chkPasswordL2(uid) {
  try {
    const player = await Player.findOne({ "account.verification.id": uid });
    if (!player) return "NO_SUCH_ID";
    const code = player.account.hash;
    return [player.account.hash,player.account.playername,player.account.email];
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function loadProfile(username) {
  try {
    const players = await Player.find({});
    for (let i = 0; i < players.length; i++) {
      curref = players[i].account.playername
      if (curref.toLowerCase() === username.toLowerCase()) {
        return players[i];
      }
    }

    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}


/*
// Find a specific document by its ID (R in CRUD)
Player.findById('<player_id>', (error, player) => {
  if (error) {
    console.log(error);
  } else {
    console.log(player);
  }
});

// Update a specific document (U in CRUD)
Player.findByIdAndUpdate('<player_id>', {
  level: 2
}, (error, player) => {
  if (error) {
    console.log(error);
  } else {
    console.log(player);
  }
});

// Delete a specific document (D in CRUD)
Player.findByIdAndDelete('<player_id>', (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Player data deleted successfully!');
  }
});
*/
console.log("Thread > DB Connected on MAIN")

module.exports = { registerUser, chkUsername, chkEmail, chkUsernameL, chkPasswordL, chkPasswordL2, chkVerifyHash, idToCode, sendVerify, vid, reqstat, postAvatar, generalData, changePassword, changeEmail, idToName, loadProfile, userPublicSearch, postChat, requestChat, clearChat }

