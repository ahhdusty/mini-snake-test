export const SIZE = 16;
const vectors = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const same = (a, b) => a.x === b.x && a.y === b.y;
function foodFor(snake, random) {
  const free = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    if (!snake.some(p => same(p, { x, y }))) free.push({ x, y });
  }
  return free.length ? free[Math.floor(random() * free.length)] : null;
}
export function createGame(random = Math.random) {
  const snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
  return { snake, direction: 'right', turned: false, food: foodFor(snake, random), score: 0, over: false };
}
export function turn(game, direction) {
  if (!vectors[direction] || game.turned || game.over) return;
  const [x, y] = vectors[game.direction];
  const [nx, ny] = vectors[direction];
  if (x + nx === 0 && y + ny === 0) return;
  game.direction = direction;
  game.turned = true;
}
export function tick(game, random = Math.random) {
  if (game.over) return;
  const [dx, dy] = vectors[game.direction];
  const head = { x: game.snake[0].x + dx, y: game.snake[0].y + dy };
  const eating = same(head, game.food);
  const body = eating ? game.snake : game.snake.slice(0, -1);
  if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE || body.some(p => same(p, head))) {
    game.over = true;
    return;
  }
  game.snake.unshift(head);
  if (eating) {
    game.score++;
    game.food = foodFor(game.snake, random);
    if (!game.food) game.over = true;
  } else game.snake.pop();
  game.turned = false;
}
