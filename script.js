const game = document.getElementById("game");
const killsDisplay = document.getElementById("kills");
const timerDisplay = document.getElementById("timer");
const killSound = document.getElementById("killSound");
const bgMusic = document.getElementById("bgMusic");
const soundToggle = document.getElementById("soundToggle");
const offlineWarning = document.getElementById("offlineWarning");
const installBtn = document.getElementById("installBtn");

let killCount = 0;
let seconds = 0;
let spawnRate = 2000;

// Play music on first interaction
window.addEventListener('click', () => {
  bgMusic.play();
}, { once: true });

setInterval(() => {
  seconds++;
  timerDisplay.textContent = seconds;

  if (seconds % 10 === 0 && spawnRate > 500) {
    spawnRate -= 200;
    showSpeedUp();
  }
}, 1000);

function showSpeedUp() {
  const div = document.createElement('div');
  div.className = 'speed-up';
  div.textContent = 'Speed Up!';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1000);
}

function spawnCockroach() {
  const cockroach = document.createElement("img");
  cockroach.src = "cockroach.png";
  cockroach.className = "cockroach";
  cockroach.style.top = Math.random() * (game.clientHeight - 100) + "px";
  cockroach.style.left = Math.random() * (game.clientWidth - 100) + "px";

  // Move it randomly every 800ms
  let moveInterval = setInterval(() => {
    cockroach.style.top = Math.random() * (game.clientHeight - 100) + "px";
    cockroach.style.left = Math.random() * (game.clientWidth - 100) + "px";
  }, 800);

  cockroach.onclick = () => {
    killSound.currentTime = 0;
    killSound.play();
    cockroach.src = "dead-cockroach.png";
    clearInterval(moveInterval);
    cockroach.onclick = null;
    killCount++;
    killsDisplay.textContent = killCount;
    setTimeout(() => cockroach.remove(), 300);
  };

  game.appendChild(cockroach);
  setTimeout(() => {
    if (game.contains(cockroach)) {
      clearInterval(moveInterval);
      cockroach.remove();
    }
  }, 4000);
}

function gameLoop() {
  spawnCockroach();
  setTimeout(gameLoop, spawnRate);
}
gameLoop();

soundToggle.onclick = () => {
  const muted = bgMusic.muted = killSound.muted = !bgMusic.muted;
  soundToggle.textContent = muted ? "🔇" : "🔊";
};

function updateOnlineStatus() {
  offlineWarning.style.display = navigator.onLine ? "none" : "block";
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// PWA install logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome !== 'accepted') {
        installBtn.style.display = 'block';
      }
    });
  });
});

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}
