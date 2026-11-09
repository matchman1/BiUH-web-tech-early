// machine.js — 这一页的两个玩具
//
// 1) 无用机器：把开关打开，机械臂伸出来把它关掉。
// 2) 猜数字：1 到 100 之间，只告诉你「高了」或「低了」。
//
// 两段互不相干，各自包在自己的函数里，变量名不冲突。

// ---------------------------------------------------------------------------
// 1. 无用机器
// ---------------------------------------------------------------------------

(function () {
  'use strict';

  var box = document.querySelector('.mx-box');
  var sw = document.getElementById('mx-switch');
  var status = document.getElementById('mx-status');
  var countEl = document.getElementById('mx-count');

  if (!box || !sw || !status || !countEl) return;

  var flips = 0;
  var busy = false;           // 机械臂动作期间不接受点击，否则动画会打架

  function setSwitch(on) {
    sw.setAttribute('aria-pressed', on ? 'true' : 'false');
    sw.querySelector('.sr-only').textContent = on
      ? 'Switch is on — the machine will turn it off'
      : 'Flip the switch on';
  }

  sw.addEventListener('click', function () {
    if (busy) return;
    busy = true;

    setSwitch(true);
    status.textContent = 'On. The machine has noticed.';

    // 机械臂伸出
    window.setTimeout(function () {
      box.classList.add('is-reaching');
      status.textContent = 'Something is coming out of the box…';
    }, 450);

    // 把开关拨回去
    window.setTimeout(function () {
      setSwitch(false);
      flips += 1;
      countEl.textContent = 'Flips: ' + flips;
      status.textContent = '…and off again. Attempt ' + flips + ' failed.';
    }, 950);

    // 机械臂收回
    window.setTimeout(function () {
      box.classList.remove('is-reaching');
      busy = false;
    }, 1500);
  });
})();

// ---------------------------------------------------------------------------
// 2. 猜数字
// ---------------------------------------------------------------------------

(function () {
  'use strict';

  var form = document.getElementById('game-form');
  var input = document.getElementById('game-input');
  var status = document.getElementById('game-status');
  var countEl = document.getElementById('game-count');
  var reset = document.getElementById('game-reset');

  if (!form || !input || !status || !countEl || !reset) return;

  var target = 0;      // 本局要猜的数
  var guesses = 0;     // 已经猜了几次
  var finished = false;

  function newGame(shouldFocus) {
    target = 1 + Math.floor(Math.random() * 100);
    guesses = 0;
    finished = false;

    input.value = '';
    input.disabled = false;
    countEl.textContent = 'Guesses: 0';
    status.textContent = 'Make your first guess.';
    status.classList.remove('is-win');

    // 只有玩家主动点「New game」时才抢焦点；
    // 页面刚加载时抢焦点会把整页滚到输入框那里
    if (shouldFocus) input.focus();
  }

  function complain(message) {
    status.textContent = message;
    status.classList.remove('is-win');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();          // 不要真的把表单提交走，页面不能刷新

    if (finished) {
      complain('This game is over. Press “New game” to start again.');
      return;
    }

    var raw = input.value.trim();
    var guess = Number(raw);

    if (raw === '') {
      complain('Type a number first.');
      input.focus();
      return;
    }

    if (!Number.isInteger(guess)) {
      complain('Whole numbers only, please.');
      input.focus();
      return;
    }

    if (guess < 1 || guess > 100) {
      complain('Between 1 and 100 — that one is outside.');
      input.focus();
      return;
    }

    guesses += 1;
    countEl.textContent = 'Guesses: ' + guesses;

    if (guess === target) {
      finished = true;
      input.disabled = true;
      status.textContent = 'That’s it — ' + guesses +
        (guesses === 1 ? ' guess.' : ' guesses.') + ' Press “New game” to play again.';
      status.classList.add('is-win');
      return;
    }

    if (guess < target) {
      status.textContent = 'Higher than ' + guess + '.';
    } else {
      status.textContent = 'Lower than ' + guess + '.';
    }

    input.value = '';
    input.focus();
  });

  reset.addEventListener('click', function () { newGame(true); });

  newGame(false);
})();
