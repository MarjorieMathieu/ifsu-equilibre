/* Améliorations progressives ; les contenus restent visibles sans JavaScript. */
(function () {
  'use strict';
  document.documentElement.setAttribute('data-ifsu-enhanced', '');
  var en = document.documentElement.lang.indexOf('en') === 0;
  var registration = document.querySelector('[data-registration-deadline]');
  if (registration) {
    var localDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Brussels' }).format(new Date());
    if (localDate > registration.dataset.registrationDeadline) {
      var closed = en ? 'Registration closed' : 'Inscriptions closes';
      var heading = registration.querySelector('h2');
      var introduction = registration.querySelector('.body-p');
      if (heading) heading.textContent = closed;
      if (introduction) introduction.textContent = en
        ? 'Registration for both November 2026 formats closed on 2 November 2026. For information, contact ifsu@etik.com.'
        : "Les inscriptions aux deux formats de novembre 2026 se sont terminées le 2 novembre 2026. Pour toute information, écris à ifsu@etik.com.";
      registration.querySelectorAll('iframe, .form-fallback').forEach(function (element) { element.hidden = true; });
      document.querySelectorAll('a[href="#reserver"]').forEach(function (link) { link.textContent = closed; });
    }
  }
  var main = document.querySelector('main, section[id], article');
  if (main) {
    if (!main.id) main.id = 'main-content';
    var skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#' + main.id;
    skip.textContent = en ? 'Skip to content' : 'Aller au contenu';
    document.body.insertBefore(skip, document.body.firstChild);
  }
  document.querySelectorAll('.fi').forEach(function (item, i) {
    var old = item.querySelector('.fq'), answer = item.querySelector('.fa');
    if (!old || !answer) return;
    var button = document.createElement('button');
    button.className = old.className;
    button.type = 'button';
    button.innerHTML = old.innerHTML;
    answer.id = answer.id || 'faq-answer-' + i;
    button.setAttribute('aria-controls', answer.id);
    function sync() {
      var open = item.classList.contains('open');
      answer.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    }
    old.replaceWith(button);
    button.addEventListener('click', function () { item.classList.toggle('open'); sync(); });
    sync();
  });
  var burger = document.querySelector('#sburger, #burger');
  var links = document.querySelector('#snav-links, #nav-links');
  if (burger && links) {
    var reserve = document.querySelector('.site-nav > .nav-reserve');
    if (reserve) {
      var reserveItem = document.createElement('li');
      reserveItem.className = 'nav-mobile-reserve';
      reserveItem.appendChild(reserve.cloneNode(true));
      links.appendChild(reserveItem);
    }
    burger.setAttribute('aria-controls', links.id);
    var update = function () {
      var open = links.classList.contains('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', en ? (open ? 'Close menu' : 'Open menu') : (open ? 'Fermer le menu' : 'Ouvrir le menu'));
    };
    var close = function () { links.classList.remove('open'); burger.classList.remove('open'); update(); };
    burger.addEventListener('click', update);
    links.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) { close(); burger.focus(); }
    });
    new MutationObserver(update).observe(links, { attributes: true, attributeFilter: ['class'] });
    update();
  }
})();
