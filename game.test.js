import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, turn, tick } from './game.js';

test('moves forward and rejects reverse direction', () => {
  const game = createGame(() => 0);
  turn(game, 'left');
  tick(game, () => 0);
  assert.deepEqual(game.snake[0], { x: 9, y: 8 });
  assert.equal(game.snake.length, 3);
});
test('grows and scores when eating', () => {
  const game = createGame(() => 0);
  game.food = { x: 9, y: 8 };
  tick(game, () => 0);
  assert.equal(game.score, 1);
  assert.equal(game.snake.length, 4);
  assert.ok(!game.snake.some(p => p.x === game.food.x && p.y === game.food.y));
});
test('wall collision ends the game', () => {
  const game = createGame();
  for (let i = 0; i < 8; i++) tick(game);
  assert.equal(game.over, true);
});
test('only one turn is accepted per tick', () => {
  const game = createGame();
  turn(game, 'up');
  turn(game, 'left');
  tick(game);
  assert.deepEqual(game.snake[0], { x: 8, y: 7 });
});
test('body collision ends the game', () => {
  const game = createGame();
  game.snake = [{x: 2,y: 2},{x: 2,y: 3},{x: 3,y: 3},{x: 3,y: 2},{x: 4,y: 2}];
  tick(game);
  assert.equal(game.over, true);
});
