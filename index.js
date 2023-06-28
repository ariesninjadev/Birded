/// ----------------------------- ///
//       IMPORTANT STATICS        //
/// ----------------------------- ///

const offline = true;
const reason = "The game isn't open yet!";

const version = "v0.2.8 aa-061.00"

const network = ['/','/admin','/admin/idtoname','/admin/logs','/admin/logs/automod', '/game','/game/settings/account','/game/chat']

/// ----------------------------- ///

try {

var express = require('express');
var app = express();
var server = require('http').Server(app);
const axios = require('axios');
const dbc = require('./server/dbc');
const mail = require('./server/mail');
const aximg = require('./server/axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const swearjar = require('swearjar');
const { profanity } = require("./server/profanity");
var alphanet;

function hash(string) {
  const hash = crypto.createHash('sha256');
  hash.update(string);
  return hash.digest('hex');
}
  
if (process.env['dburi'] == 'mongodb+srv://ariesninja:attobro08@birdstore.0wcwtae.mongodb.net/birddata') {
  alphanet = require('./server/misc/alpha')
}

function gsi() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${random}`;
}

  

  function getLevel(exp) {
  
  let level = 1;
  let expNeeded = 0;
  let currentExp = 0;
  let cumulative = exp;

  while (cumulative >= Math.round((100 * Math.pow(1.05, level-1)))) {
    level++;
    cumulative -= Math.round((100 * Math.pow(1.05, level-1)))}

  expNeeded = (Math.round((100 * Math.pow(1.05, level-1))))-cumulative
    currentExp = cumulative;

  return {
    level: level,
    currentExp: currentExp,
    neededExp: expNeeded
  };
}

function glog(line) {
  // Customize the path to the log file below
  const filePath = './full.log';
  const timestamp = new Date().toLocaleString();
  try {
    fs.appendFileSync(filePath, timestamp +' - '+ line + '\n');
  } catch (err) {
    console.error(err);
  }
}

function amlog(line) {
  // Customize the path to the log file below
  const filePath = './automod.log';
  const timestamp = new Date().toLocaleString();
  try {
    fs.appendFileSync(filePath, timestamp +' - '+ line + '\n');
  } catch (err) {
    console.error(err);
  }
}

function sortExport(objects) {
  const sortOrder = {
    account: {
      op: [3, 2, 1, 0],
    },
    game: {
      rank: [3, 2, 1, 0],
    },
  };

  exd = objects.sort((a, b) => {
    const aOp = a.op;
    const bOp = b.op;
    const aRank = a.rank;
    const bRank = b.rank;
    const aLevel = a.level;
    const bLevel = b.level;
    const aName = a.playername.toLowerCase();
    const bName = b.playername.toLowerCase();

    if (aOp !== bOp) {
      return sortOrder.account.op.indexOf(aOp) - sortOrder.account.op.indexOf(bOp);
    } else if (aRank !== bRank) {
      return sortOrder.game.rank.indexOf(aRank) - sortOrder.game.rank.indexOf(bRank);
    } else if (aLevel !== bLevel) {
      return bLevel - aLevel;
    } else {
      return aName.localeCompare(bName);
    }
  });

  return exd;
}
  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));
app.use(express.static(__dirname + "/public"));


  
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

for (const n in network) {
app.get(network[n], function(req, res) {
  res.render(__dirname + '/public' + network[n], {"origin":process.env['originuri']});
});
console.log("PUSHED: " + network[n])
}


app.get("/admin/profile/:username", function (req, res) {
  dbc.loadProfile(req.params.username)
  .then(result => {
    if (result) {
      var iu;
      if (result.account.settings.public == 0) {
        iu = result.account.playername + `<span style="color:gray;font-size:0.6em;">  (HIDDEN)</span>`
      }
      else {
        iu = result.account.playername
      }
      var tr = {'rank':'','badges':'','icon':'','ldata':getLevel(result.game.exp)}
      if (result.account.icon == "none") {
        tr.icon = '/game/static/avatars/avatar.png'
      } else {
        tr.icon = result.account.icon
      }
      
      if (result.account.op == 3) {
        tr.badges = `<div id="developer1" title="Birded Developer" class="ribbon ribbon-top bg-red"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-shield-code" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M12 21a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.078 7.024"></path>
   <path d="M20 21l2 -2l-2 -2"></path>
   <path d="M17 17l-2 2l2 2"></path>
</svg></div>`
      }
      if (result.game.rank >= 1) {
        tr.badges += `<div id="supporter1" title="Supporter" class="ribbon ribbon-top bg-green"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-heart-handshake" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
   <path d="M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25"></path>
   <path d="M12.5 15.5l2 2"></path>
   <path d="M15 13l2 2"></path>
</svg></div>`
      }
      if (result.account.dataint.delicon == "beta") {
        tr.badges += `<div id="beta1" title="Beta Level 1" class="ribbon ribbon-top bg-black"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-letter-b" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
   <path d="M10 16h2a2 2 0 1 0 0 -4h-2h2a2 2 0 1 0 0 -4h-2v8z"></path>
</svg></div>`
      } else if (result.account.dataint.delicon == "beta2") {
        tr.badges += `<div id="beta2" title="Beta Level 2" class="ribbon ribbon-top bg-black"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-letter-b" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
   <path d="M10 16h2a2 2 0 1 0 0 -4h-2h2a2 2 0 1 0 0 -4h-2v8z"></path>
</svg></div>`
      } else if (result.account.dataint.delicon == "beta3") {
        tr.badges += `<div id="beta3" title="Beta Level 3" class="ribbon ribbon-top bg-black"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-hexagon-letter-b" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"></path>
   <path d="M10 16h2a2 2 0 1 0 0 -4h-2h2a2 2 0 1 0 0 -4h-2v8z"></path>
</svg></div>`
      }
      if (result.game.rank == 3) {
    tr.rank = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#F2B236">Claw</span>
  <h1 class="title" style="margin: 0; padding-left: 0.5rem;">` + iu + `</h1>
</div>`
  } else if (result.game.rank == 2) {
    tr.rank = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#E5C53F">Talon</span>
  <h1 class="title" style="margin: 0; padding-left: 0.5rem;">` + iu + `</h1>
</div>`
  } else if (result.game.rank == 1) {
    tr.rank = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#E5C53F">Feather</span>
  <h1 class="title" style="margin: 0; padding-left: 0.5rem;">` + iu + `</h1>
</div>`
  } else {
    tr.rank = `<h1 class="title" style="margin: 0; padding-left: 0.5rem;">` + iu + `</h1>`
  }
      res.render('admin/profile/display.ejs', { result,tr,"origin":process.env['originuri'] });
    } else {
      res.render('admin/profile/unknown.ejs', { result,"origin":process.env['originuri'] });
    }
  })
});


app.get("/game/profile/:username", function (req, res) {
  dbc.loadProfile(req.params.username)
  .then(result => {
    if (result) {
      if (result.account.settings.public == 0) {
        res.render('profile/unknown.ejs', { 'result':false });
        return false
      }
      var tr = {'rank':'','badges':'','icon':'','ldata':getLevel(result.game.exp)}
      if (result.account.icon == "none") {
        tr.icon = '/game/static/avatars/avatar.png'
      } else {
        tr.icon = result.account.icon
      }
      
      if (result.account.op == 3) {
        tr.badges = `<div id="developer1" title="Birded Developer" class="ribbon ribbon-top bg-red"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-shield-code" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M12 21a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.078 7.024"></path>
   <path d="M20 21l2 -2l-2 -2"></path>
   <path d="M17 17l-2 2l2 2"></path>
</svg></div>`
      }
      if (result.game.rank >= 1) {
        tr.badges += `<div id="supporter1" title="Supporter" class="ribbon ribbon-top bg-green"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-heart-handshake" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
   <path d="M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25"></path>
   <path d="M12.5 15.5l2 2"></path>
   <path d="M15 13l2 2"></path>
</svg></div>`
      }
      if (result.account.dataint.delicon == "beta") {
        tr.badges += `<div id="beta1" title="Beta Level 1" class="ribbon ribbon-top bg-black"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-letter-b" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
   <path d="M10 16h2a2 2 0 1 0 0 -4h-2h2a2 2 0 1 0 0 -4h-2v8z"></path>
</svg></div>`
      } else if (result.account.dataint.delicon == "beta2") {
        tr.badges += `<div id="beta2" title="Beta Level 2" class="ribbon ribbon-top bg-black"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-letter-b" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
   <path d="M10 16h2a2 2 0 1 0 0 -4h-2h2a2 2 0 1 0 0 -4h-2v8z"></path>
</svg></div>`
      } else if (result.account.dataint.delicon == "beta3") {
        tr.badges += `<div id="beta3" title="Beta Level 3" class="ribbon ribbon-top bg-black"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-hexagon-letter-b" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"></path>
   <path d="M10 16h2a2 2 0 1 0 0 -4h-2h2a2 2 0 1 0 0 -4h-2v8z"></path>
</svg></div>`
      }
      if (result.game.rank == 3) {
    tr.rank = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#F2B236">Claw</span>
  <h1 class="title" style="margin: 0; padding-left: 0.5rem;">` + result.account.playername + `</h1>
</div>`
  } else if (result.game.rank == 2) {
    tr.rank = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#E5C53F">Talon</span>
  <h1 class="title" style="margin: 0; padding-left: 0.5rem;">` + result.account.playername + `</h1>
</div>`
  } else if (result.game.rank == 1) {
    tr.rank = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#D1D567  ">Feather</span>
  <h1 class="title" style="margin: 0; padding-left: 0.5rem;">` + result.account.playername + `</h1>
</div>`
  } else {
    tr.rank = `<h1 class="title" style="margin: 0; padding-left: 0.5rem;">` + result.account.playername + `</h1>`
  }
      res.render('profile/display.ejs', { result,tr,"origin":process.env['originuri'] });
    } else {
      res.render('profile/unknown.ejs', { result,"origin":process.env['originuri'] });
    }
  })
});


app.get('*', function(req, res){
  res.status(404).sendFile(__dirname+'/intercept/index.html');
});

process.on('SIGINT', () => {
  glog("Thread >> SERVER CLOSED");
  process.exit(0);
});

server.listen(8080);

  activecon = []



var io = require('socket.io')(server);
io.sockets.on('connection', function(socket){
  socket.emit("websiteStatics", [version]);

  socket.on('requestChat', function(loc) {
    dbc.requestChat(loc)
    .then(result => {
      socket.emit("websiteStaticsM",[version,result])
    })
  })
  
  socket.on('serverUsernameCompare', function(email, username, rpwd) {
    donehash = hash(rpwd)
    var trres
    var brres
    dbc.chkUsername(username)
  .then(result => {
    trres = result

    dbc.chkEmail(email, username)
  .then(result => {
    brres = result

    socket.emit("serverUsernameCompareResult", brres, trres, donehash);
  })
  .catch(error => {
    console.log(error);
  });
   
  })
  .catch(error => {
    console.log(error);
  });
   
  });

  socket.on("ping", (callback) => {
    callback();
  });
  

  socket.on('vhashCheck', function(providedHash) {
    var allowed
    dbc.chkVerifyHash(providedHash)
  .then(result => {
    allowed = result;
    socket.emit("vhashCheckResult", allowed);
  })
  .catch(error => {
    console.log(error);
  });
   
  });

  socket.on('alphaMove', function(id) {
    dbc.reqstat(id)
  .then(result => {
  result = result.toObject();
  delete result["_id"];
  delete result["__v"];
  alphanet.moveModel(result)
  });
  });

  socket.on('verifyId', function(id) {
    var allowed

    dbc.vid(id)
  .then(result => {
    allowed = result;
    socket.emit("verifyIdResult", allowed);
  })
  .catch(error => {
    console.log(error);
  });
   
  });

  socket.on('grabStatics', function(id,tx) {
    var allowed
    var onl = 1
    dbc.reqstat(id)
  .then(result => {
    allowed = result;
    if ((allowed.account.op <= 1) && (offline == true) && (tx == "0")) {
      onl = 0
      allowed = reason
    }
    socket.emit("grabStaticsResult", allowed, onl);
  })
  .catch(error => {
    console.log(error);
  });
   
  });

  socket.on("createUserAccount", (ema, use, pas) => {
  const codeI = Math.floor(Math.random() * (999999 - 111111 + 1) + 111111);
  const idI = gsi();
  glog("Account Creation >> " + ema + " - " + idI)
  dbc.registerUser(ema,use,pas,codeI,idI);
  mail.sendVerification(ema,codeI,idI,use);
   socket.emit("redirectV", idI);
  
});

  socket.on("getCode", (ide) => {
  dbc.idToCode(ide)
 .then(result => {
    allowed = result;
    socket.emit("codeCheckout", allowed);
  })
  .catch(error => {
    console.log(error);
    
  });

});

    socket.on("getName", (ide) => {
  dbc.idToName(ide)
 .then(result => {
    allowed = result;
    socket.emit("getNameResult", allowed);
  })
  .catch(error => {
    console.log(error);
    
  });

});

  socket.on("VALIDATE", (ide) => {
  dbc.sendVerify(ide)
   .then(result => {
    allowed = result;
    socket.emit("vS", allowed);
  })
  .catch(error => {
    console.log(error);
  });
    
});

  socket.on("changeData", ({ id,key,val }) => {
  if (typeof val === 'string') {
  const ccs = profanity(val);
  if (ccs.isBadWord) {
    amlog("PROFANITY REPORT | ID: " + id + ", KEY: " + key + ", DETAIL: " + JSON.stringify(ccs))
  }
  }
  dbc.generalData(id,key,swearjar.censor(val))
   .then(result => {
  })
  .catch(error => {
    console.log(error);
  });
    
});

  socket.on("changeEmail", (id,newemail) => {
    var approved
  dbc.changeEmail(id,newemail)
   .then(result => {
    if (result == 0) {
      approved = 0
    } else {
      approved = 1
     mail.sendReVerification(newemail,result[0],id,result[1])
     glog("Email Change >> " + newemail + " - " + id)
     socket.emit("changeEmailResult", id, approved);
    }
  })
  .catch(error => {
    console.log(error);
  });
    
});

  
  
  socket.on("globalsend", (contents,patch,loadPlayer) => {
    tack = 0
  const ccs = profanity(contents);
  if (ccs.isBadWord) {
    amlog("PROFANITY REPORT | ID: " + loadPlayer.account.verification.id + ", KEY: " + 'server.chat.global' + ", DETAIL: " + JSON.stringify(ccs))
    tack = 1
    contents = '*'.repeat(contents.length) + " (filtered)"
  }
  if (loadPlayer.account.op == 3) {
    mname = "#EB3838"
  } else if (loadPlayer.account.op == 2) {
    mname = "#E87676"
  } else if (loadPlayer.account.op == 1) {
    mname = "#C98FDE"
  } else if (loadPlayer.game.rank == 3) {
    mname = "#F2B236"
  } else if (loadPlayer.game.rank == 2) {
    mname = "#E5C53F"
  } else if (loadPlayer.game.rank == 1) {
    mname = "#D1D567"
  } else {
    mname = "#969696"
  }
    tyamp = getLevel(loadPlayer.game.exp).level
  if (tyamp <=19) {
    mlvl = "#7F7F7F"
  } else if (tyamp <=39) {
    mlvl = "#FFFFFF"
  } else if (tyamp <=59) {
    mlvl = "#FFFF49"
  } else if (tyamp <=79) {
    mlvl = "#B6E565"
  } else if (tyamp <=99) {
    mlvl = "#4A87FF"
  } else if (tyamp <=119) {
    mlvl = "#AC49FF"
  } else if (tyamp <=139) {
    mlvl = "#EEA300"
  } else if (tyamp <=159) {
    mlvl = "#63E1FF"
  } else if (tyamp <=179) {
    mlvl = "#FF79C2"
  } else if (tyamp <=199) {
    mlvl = "#FF5B5B"
  } else {
    mlvl = "#AC0000"
  }
  xm= `<idx prop="CLIENT" sid=${patch}>[<cbox style='color:${mlvl};'>${tyamp}</cbox>] <cbox style='color:${mname};'>${loadPlayer.account.playername}</cbox>: ${contents}</idx>`
  pfxm = swearjar.censor(xm)
  socket.emit("delocalizeGlobalsend", pfxm,patch,tack);
  socket.broadcast.emit("recieveGlobalsend",pfxm);
  //activecon.push(pfxm)
  dbc.postChat(pfxm,"__global__")
    .then(result => {})
});

async function deleteImage(deleteURL) {
    await axios.delete(deleteURL);
}

  socket.on("postAvatar", (id,ide) => {
    ide = decodeURIComponent(ide)
    if (ide != "none") {
    aximg.postimg(ide,id)
    .then(ilink => {

      dbc.postAvatar(id,ilink)
   .then(result => {
    allowed = result;
    socket.emit("postAvatarResult", allowed[0]);
    //console.log(allowed[1])
    if (allowed[1] == "none") {
      
    } else {
      //deleteImage(allowed[1])
    }
  })
  .catch(error => {
    console.log(error);
  
  });
    
    })
    .catch(error => {
    console.log(error);
  });
    } else {
      cast = [ide,"none"]
      dbc.postAvatar(id,cast)
   .then(result => {
    allowed = result;
    socket.emit("postAvatarResult", allowed[0]);
    //deleteImage(allowed[1])
  })
  .catch(error => {
    console.log(error);
  
  });
    }
});

  socket.on('userPublicSearch', function(playername,c=false) {
    var table

    dbc.userPublicSearch(playername,c)
  .then(result => {
    table = result;
    table.forEach((user) => {

    user.level = getLevel(user.level).level

      
  if (user.icon === "none") {
    user.icon = "/game/static/avatars/avatar.png";
  }


    if (user.op == 3) {
    user.playername = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#EB3838">Developer</span>
  <h3 class="card-title" style="margin: 0; padding-left: 0.5rem;">` + user.playername + `</h3>
</div>`
  } else if (user.op == 2) {
    user.playername = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#E87676">Admin</span>
  <h3 class="card-title" style="margin: 0; padding-left: 0.5rem;">` + user.playername + `</h3>
</div>`
  } else if (user.op == 1) {
    user.playername = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#C98FDE">Moderator</span>
  <h3 class="card-title" style="margin: 0; padding-left: 0.5rem;">` + user.playername + `</h3>
</div>`
  } else if (user.rank == 3) {
    user.playername = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#F2B236">Claw</span>
  <h3 class="card-title" style="margin: 0; padding-left: 0.5rem;">` + user.playername + `</h3>
</div>`
  } else if (user.rank == 2) {
    user.playername = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#E5C53F">Talon</span>
  <h3 class="card-title" style="margin: 0; padding-left: 0.5rem;">` + user.playername + `</h3>
</div>`
  } else if (user.rank == 1) {
    user.playername = `<div style="line-height: inherit; display: flex; align-items: center;">
  <span class="badge" style="font-size:0.9em; vertical-align: middle;background:#D1D567  ">Feather</span>
  <h3 class="card-title" style="margin: 0; padding-left: 0.5rem;">` + user.playername + `</h3>
</div>`
  } else {
    user.playername = `<h3 class="card-title" style="margin: 0; padding-left: 0.0rem;">` + user.playername + `</h3>`
  }
      
});
    ftable = sortExport(table);
    socket.emit("userPublicSearchResult", ftable);
  })
  .catch(error => {
    console.log(error);
});
});

  ///////////////////////////////////////////////////

  socket.on('checkLogin', function(username, rpwd) {
    donehash = hash(rpwd)
    var trres
    var brres
    var gofo = 0
    var uid
    dbc.chkUsernameL(username)
  .then(result => {
    uid = result

    dbc.chkPasswordL(uid)
  .then(result => {
    if (result == donehash) {
      gofo = 1
    }
    glog("LOGIN ATTEMPT >> " + gofo + ";" + uid)
    socket.emit("checkLoginResult", gofo, uid);
  })
  .catch(error => {
    console.log(error);
  });
   
  })
  .catch(error => {
    console.log(error);
  });
   
  });

  

  socket.on('requestLogs', () => {
    fs.readFile('./full.log', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        socket.emit('logData', { error: 'Failed to read log file' });
      } else {
        socket.emit('logData', { logs: data });
      }
    });
  });

  socket.on('requestAMLogs', () => {
    fs.readFile('./automod.log', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        socket.emit('logData', { error: 'Failed to read log file' });
      } else {
        socket.emit('logData', { logs: data });
      }
    });
  });


  socket.on('checkPwdChange', function(uid, curpwd, newpwd) {
    donehash = hash(curpwd)
    newhash = hash(newpwd)
    var approved = 0

    dbc.chkPasswordL2(uid)
  .then(result => {
    if (result[0] == donehash) {
      approved = 1
      mail.sendPasswordNotice(result[1],result[2])
      dbc.changePassword(uid,newhash)
 .then(result => {
   
 })
.catch(error => {
    console.log(error);
  });
   
    }

    socket.emit("checkPwdChangeResult", approved);
  })
  .catch(error => {
    console.log(error);
  });
   
  
   
  });

});

  

console.log("Thread > Server Online with 0 errors.")
//glog("Thread >> SERVER STARTED")



} catch (error) {
  console.error('Server encountered an error: ', error);

  
}
