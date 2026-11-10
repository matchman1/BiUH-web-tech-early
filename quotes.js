// quotes.js — 页面顶上的「随机一条」
//
// 不另存一份引文数据：直接从页面里已经写好的 <article class="q"> 里读，
// 所以加一条引文只需要在 HTML 里加一张卡片，这里不用动。

(function () {
  'use strict';

  var cards = Array.prototype.slice.call(document.querySelectorAll('.q'));
  var textEl = document.getElementById('quote-hero-text');
  var citeEl = document.getElementById('quote-hero-cite');
  var button = document.getElementById('quote-next');

  if (!cards.length || !textEl || !citeEl || !button) return;

  var lastIndex = -1;

  function randomIndex() {
    if (cards.length === 1) return 0;
    var i = lastIndex;
    while (i === lastIndex) {
      i = Math.floor(Math.random() * cards.length);
    }
    return i;
  }

  function show(index) {
    var card = cards[index];
    var quote = card.querySelector('blockquote p');
    var cite = card.querySelector('cite');

    textEl.innerHTML = '';
    var p = document.createElement('p');
    p.textContent = quote ? quote.textContent.trim() : '';
    textEl.appendChild(p);

    citeEl.textContent = cite ? cite.textContent.trim() : '';
    lastIndex = index;
  }

  function shuffle() {
    show(randomIndex());
  }

  button.addEventListener('click', shuffle);
  show(randomIndex());
})();
