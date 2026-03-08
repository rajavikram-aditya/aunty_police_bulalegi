function startGame(){

setInterval(spawnSoda,2000)
setInterval(moveSodas,30)
setInterval(timerTick,1000)

auntyCycle()

}

let gameStarted = false

document.getElementById("playBtn").addEventListener("click", function(){

document.getElementById("startScreen").style.display="none"

gameStarted = true

startGame()

})


// Loader
window.addEventListener("load", function(){

setTimeout(function(){

document.getElementById("loader").style.display="none"
document.getElementById("startScreen").style.display="flex"

},1500)

})

// Game variables
const kid = document.getElementById("kid")
const aunty = document.getElementById("aunty")
const statusText = document.getElementById("status")

let score = 0
let level = 1
let time = 60

let auntyLooking = true
let drinking = false
let gameOver = false

let sodaList = []

let lookAwayTime = 2000
let watchTime = 2000

const scoreText = document.getElementById("score")
const levelText = document.getElementById("level")
const timerText = document.getElementById("timer")

// Update HUD
function updateHUD(){
scoreText.innerText = "Score: " + score
levelText.innerText = "Level: " + level
timerText.innerText = "Time: " + time
}

// Aunty behavior
function auntyCycle(){

if(gameOver) return

auntyLooking = false
statusText.innerText = "Aunty sleeping 😴"
aunty.innerText = "😴 💤"

setTimeout(()=>{

auntyLooking = true
statusText.innerText = "Aunty watching 👀"
aunty.innerText = "👵👀"

if(drinking){
loseGame()
}

setTimeout(auntyCycle, watchTime)

}, lookAwayTime)

}

// Spawn soda
function spawnSoda(){

if(gameOver) return

const soda = document.createElement("div")
soda.classList.add("soda")
soda.innerText = "🥤"

soda.style.left = "900px"

document.getElementById("game").appendChild(soda)

sodaList.push(soda)

}

// Move sodas
function moveSodas(){

sodaList.forEach((soda,index)=>{

let x = parseInt(soda.style.left)

x -= 5 + level

soda.style.left = x + "px"

if(x < 130 && x > 80){

if(drinking && !auntyLooking){

score++
updateHUD()

soda.remove()
sodaList.splice(index,1)

if(score % 10 == 0){
level++
lookAwayTime -= 200
watchTime -= 100
}

}

}

if(x < -50){
soda.remove()
sodaList.splice(index,1)
}

})

}

// Game over
function loseGame(){

gameOver = true

document.getElementById("gameover").style.display = "block"
document.getElementById("restartBtn").style.display = "block"
document.getElementById("siren").play()

saveScore()

}

// Keyboard controls
document.addEventListener("keydown", e=>{

if(e.code === "Space" && !gameOver){

drinking = true

kid.classList.add("drink")
kid.innerText = "🧒🥤"

if(auntyLooking){
loseGame()
}

}

})

document.addEventListener("keyup", e=>{

if(e.code === "Space"){

drinking = false

kid.classList.remove("drink")
kid.innerText = "🧒"

}

})

// Timer
function timerTick(){

if(gameOver) return

time--

updateHUD()

if(time <= 0){
level++
time = 60
lookAwayTime -= 200
}

}

// Save leaderboard
function saveScore(){

let scores = JSON.parse(localStorage.getItem("auntyScores") || "[]")

scores.push(score)

scores.sort((a,b)=>b-a)

scores = scores.slice(0,5)

localStorage.setItem("auntyScores", JSON.stringify(scores))

showLeaderboard()

}

// Show leaderboard
function showLeaderboard(){

let scores = JSON.parse(localStorage.getItem("auntyScores") || "[]")

let html = "<h3>Leaderboard</h3>"

scores.forEach((s,i)=>{
html += `${i+1}. ${s}<br>`
})

document.getElementById("leaderboard").innerHTML = html

}

// Game loops
setInterval(spawnSoda, 2000)
setInterval(moveSodas, 30)
setInterval(timerTick, 1000)

auntyCycle()
showLeaderboard()
document.getElementById("restartBtn").addEventListener("click", function(){

location.reload()

})