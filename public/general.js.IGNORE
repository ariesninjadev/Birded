var socket = io();
  var loadPlayer
  var tp_avatar

    function changeData(id, key, val) {
  socket.emit("changeData", { id, key, val });
}
  
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
// ------------------------------------------ //

const x = getCookie('session_id');
const y = getCookie('access_id');
var grant = 1

alertify.set({ delay: 1700 });

const codes = "14708605"

function chk() {
  if (codes.split(",").indexOf(y) !== -1) {
    
      grant = 1;
    
  }
}

  chk()

function logoutF() {
  eraseCookie('session_id')
  eraseCookie('access_id')
  window.location.href = "/login"
}

function openProfile() {
  window.location.href = "/game/profile/" + loadPlayer.account.playername
}

function rld() {
  location.reload();
}

socket.emit("verifyId", x);

socket.on('verifyIdResult', (allowed) => {
  if (allowed == 1) {
    socket.emit("grabStatics", x,"1");
  } else {
    eraseCookie(y)
    window.location.href = "/login";
  }
});

socket.on('websiteStatics', (main) => {
  document.getElementById("version").innerText = main[0]
});

socket.on('grabStaticsResult', (allowed,onl) => {
  if (onl == 0) {
    document.getElementById("loadingtext").innerText = allowed
    alertify.error(allowed,5000);
  }
  loadPlayer = allowed;

  if (loadPlayer.account.status == -1) {
    document.getElementById("loadingtext").innerText = "You are banned from Birded."
    alertify.error("You have been permanently banned from Birded.",20000);
    alertify.error("Please contact official@birded.tech if you have questions or concerns regarding your ban.",20500);
    loadPlayer = ""
  }
  
  document.getElementById("playername_holder").innerText = loadPlayer.account.playername;
  if (loadPlayer.account.icon == "none") {
    document.getElementById("playerimage_holder").style.backgroundImage = "url('/game/static/avatars/avatar.png')"
  } else {
    document.getElementById("playerimage_holder").style.backgroundImage = "url('" + loadPlayer.account.icon + "')"
  }

  if (loadPlayer.account.verification.v == 0) {
    document.getElementById("alertbar").innerHTML = verifyalert
  }
  
  if (loadPlayer.account.op == 3) {
    document.getElementById("adminbutton").classList.remove("hiddenelem");
    document.getElementById("userblocki").innerHTML += `<div class="mt-1 small" style="background:#EB3838;color:white;padding:1px;font-size:0.6em;border-radius:3px;text-align:center;">DEVELOPER</div>`;
  } else if (loadPlayer.account.op == 2) {
    document.getElementById("adminbutton").classList.remove("hiddenelem");
    document.getElementById("userblocki").innerHTML += `<div class="mt-1 small" style="background:#E87676;color:white;padding:1px;font-size:0.6em;border-radius:3px;text-align:center;">ADMIN</div>`;
  } else if (loadPlayer.account.op == 1) {
    document.getElementById("adminbutton").classList.remove("hiddenelem");
    document.getElementById("userblocki").innerHTML += `<div class="mt-1 small" style="background:#C98FDE;color:white;padding:1px;font-size:0.6em;border-radius:3px;text-align:center;">MOD</div>`;
  } else if (loadPlayer.game.rank == 3) {
    document.getElementById("userblocki").innerHTML += `<div class="mt-1 small" style="background:#F2B236;color:white;padding:1px;font-size:0.6em;border-radius:3px;text-align:center;">CLAW</div>`;
  } else if (loadPlayer.game.rank == 2) {
    document.getElementById("userblocki").innerHTML += `<div class="mt-1 small" style="background:#E5C53F;color:white;padding:1px;font-size:0.6em;border-radius:3px;text-align:center;">TALON</div>`;
  } else if (loadPlayer.game.rank == 1) {
    document.getElementById("userblocki").innerHTML += `<div class="mt-1 small" style="background:#D1D567;color:white;padding:1px;font-size:0.6em;border-radius:3px;text-align:center;">FEATHER</div>`;
  } else if (loadPlayer.game.rank == 0) {
    document.getElementById("userblocki").innerHTML += `<div class="mt-1 small" style="background:gray;color:white;padding:1px;font-size:0.6em;border-radius:3px;text-align:center;">PLAYER</div>`
  }
  document.getElementById("overlayi").remove();
  var mcobj = document.getElementById("unblurobj")
  mcobj.classList.add("unblurtype");
});

  var verifyalert = `

                <header class="navbar navbar-expand-md navbar-dark bg-red d-print-none">
                  <div class="container-xl">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
                      <span class="navbar-toggler-icon"></span>
                    </button>
                    
                    <div class="collapse navbar-collapse" id="navbar-menu">
                      <div class="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
                        <ul class="navbar-nav">    
                          <li class="nav-item">
                            <a class="nav-link disabled" href="index.html#" >
                              <span class="nav-link-title">
                                <strong>Please verify your email address to lift account restrictions!</strong>
                              </span>
                            </a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" href="/game/settings/account" >
                              <span class="nav-link-title">
                                Request new verification
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </header>
              
`
