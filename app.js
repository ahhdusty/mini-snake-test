import { SIZE, createGame, turn, tick } from './game.js';
const canvas = document.querySelector('#board');
const ctx = canvas.getContext('2d');
const score = document.querySelector('#score');
const status = document.querySelector('#status');
const start = document.querySelector('#start');
const pause = document.querySelector('#pause');
let game = createGame();
let running = false;
let paused = false;
function draw() {
  const cell = canvas.width / SIZE;
  ctx.fillStyle = '#e7eddb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#d7e1c8';
  ctx.lineWidth = 1;
  for (let i = 1; i < SIZE; i++) {
    ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
  }
  game.snake.forEach((p, i) => {
    ctx.fillStyle = i === 0 ? '#173b31' : '#517d46';
    ctx.fillRect(p.x * cell + 2, p.y * cell + 2, cell - 4, cell - 4);
  });
  if (game.food) {
    ctx.fillStyle = '#c54730';
    ctx.beginPath(); ctx.arc((game.food.x + .5) * cell, (game.food.y + .5) * cell, cell * .32, 0, Math.PI * 2); ctx.fill();
  }
  score.textContent = game.score;
}
function togglePause() {
  if (!running) return;
  paused = !paused;
  pause.textContent = paused ? 'Продолжить' : 'Пауза';
  status.textContent = paused ? 'Пауза' : 'За яблоками!';
}
start.addEventListener('click', () => {
  game = createGame(); running = true; paused = false;
  start.textContent = 'Заново'; pause.disabled = false; pause.textContent = 'Пауза';
  status.textContent = 'За яблоками!'; draw();
});
pause.addEventListener('click', togglePause);
const keys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
document.addEventListener('keydown', event => {
  if (event.target.closest('input, textarea, select')) return;
  if (event.code === 'Space' && event.target.closest('button')) return;
  const direction = keys[event.key] || keys[event.key.toLowerCase()];
  if (direction || event.code === 'Space') event.preventDefault();
  if (event.code === 'Space' && !event.repeat) togglePause();
  else if (direction && running && !paused) turn(game, direction);
});
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => {
  if (running && !paused) turn(game, button.dataset.direction);
}));
document.addEventListener('visibilitychange', () => { if (document.hidden && running && !paused) togglePause(); });
setInterval(() => {
  if (!running || paused) return;
  tick(game); draw();
  if (game.over) {
    running = false; pause.disabled = true;
    status.textContent = game.food ? 'Игра окончена. Ещё раз?' : 'Победа! Всё поле ваше.';
  }
}, 150);
draw();
