/*! IFSU Équilibre — popup « retraite novembre 2026 ». Autonome, sans dépendance.
 *
 * SITE (Jekyll) et APP : une balise script (src="/retraite-popup.js", attribut defer) avant la fermeture du body.
 * Réglages : window.IFSU_RETRAITE = { ... } AVANT le chargement du script.
 */
(function () {
  'use strict';

  var CFG = {
    pageUrl: 'https://ifsu-equilibre.be/retraite.html', // absolu : fonctionne aussi depuis l'app
    startDate: '2026-10-30',          // premier jour d'affichage (AAAA-MM-JJ)
    endDate: '2026-11-15',            // dernier jour d'affichage, inclus
    delayMs: 3000,
    snoozeDays: 5,                    // après « Plus tard » / fermeture : silence pendant 5 jours
    storageKey: 'ifsu-retraite-popup',
    excludePaths: ['/retraite', '/retraite.html'],
    excludePrefixes: ['/en/'],        // pages anglaises : pas de popup en français
    onlyPaths: null,
    watchRoutes: true,
    preview: false,
    onCta: null,
    version: 'B'
  };

  var user = window.IFSU_RETRAITE || {};
  for (var key in user) {
    if (Object.prototype.hasOwnProperty.call(user, key)) CFG[key] = user[key];
  }

  /* ---------- Textes (version B retenue) ---------- */
  var ROWS = [['Les 5 jours', '750 €'], ['Une journée : mardi, mercredi ou jeudi', '150 €']];
  var VERSIONS = {
    B: {
      eyebrow: 'Retraite IFSU · 23 – 27 novembre',
      title: 'Une journée de retraite, concrètement',
      body: 'Marche silencieuse le matin, pratique de groupe, un temps d’écoute et d’échanges, relaxation guidée en fin d’après-midi. Il y a des pauses : ce n’est pas un marathon.',
      rows: ROWS,
      note: 'À Koningsteen, entre Bruxelles et Anvers. Hébergement et repas compris.',
      cta: 'Voir le programme'
    }
  };
  var COMMON = { later: 'Plus tard', close: 'Fermer' };
  function texts(v) {
    var t = {}, k, base = VERSIONS[v] || VERSIONS.B;
    for (k in base) t[k] = base[k];
    for (k in COMMON) t[k] = COMMON[k];
    return t;
  }
  var T = texts(CFG.version);

  /* ---------- Outils ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function readState() {
    try { return JSON.parse(window.localStorage.getItem(CFG.storageKey) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeState(s) {
    try { window.localStorage.setItem(CFG.storageKey, JSON.stringify(s)); } catch (e) { /* stockage indisponible : on continue */ }
  }
  function pathOf() { return (window.location.pathname || '/'); }
  function listHas(list, p) {
    for (var i = 0; i < list.length; i++) { if (list[i] === p) return true; }
    return false;
  }

  function shouldShow() {
    if (CFG.preview) return true;
    var forced = /[?&]retraite=1(&|$)/.test(window.location.search);
    if (forced) return true;
    var t = today();
    if (CFG.startDate && t < CFG.startDate) return false;
    if (CFG.endDate && t > CFG.endDate) return false;
    var p = pathOf();
    if (CFG.excludePaths && listHas(CFG.excludePaths, p)) return false;
    for (var i = 0; CFG.excludePrefixes && i < CFG.excludePrefixes.length; i++) { if (p.indexOf(CFG.excludePrefixes[i]) === 0) return false; }
    if (CFG.onlyPaths && !listHas(CFG.onlyPaths, p)) return false;
    var s = readState();
    if (s.clicked) return false;
    if (s.dismissedAt && (Date.now() - s.dismissedAt) < CFG.snoozeDays * 86400000) return false;
    return true;
  }

  /* ---------- Styles ---------- */
  var CSS = [
    '.irt-root,.irt-root *{box-sizing:border-box}',
    '.irt-root{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;',
    'background:rgba(44,44,44,.55);font-family:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;color:#2C2C2C;',
    'opacity:0;transition:opacity .25s ease}',
    '.irt-root.irt-in{opacity:1}',
    '.irt-dialog{position:relative;width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow:auto;background:#F7F3EE;',
    'border-radius:4px;box-shadow:0 18px 60px rgba(0,0,0,.28);transform:translateY(10px);transition:transform .25s ease}',
    '.irt-root.irt-in .irt-dialog{transform:none}',
    '.irt-dialog:focus{outline:none}',
    '.irt-band{height:9px;background:linear-gradient(90deg,#4A6274 0 70%,#C9A84C 70% 100%)}',
    '.irt-body{padding:28px 30px 26px}',
    '.irt-eyebrow{margin:0 0 10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#4A6274}',
    '.irt-title{margin:0 0 14px;font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:36px;line-height:1.05;color:#2C2C2C}',
    '.irt-text{margin:0 0 14px;font-size:16px;line-height:1.55}',
    '.irt-quote{margin:0 0 6px;font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:21px;line-height:1.3;color:#C4714A}',
    '.irt-pickup{margin:0;font-size:14px;color:#4A6274}',
    '.irt-rows{margin:0 0 12px;padding:0;list-style:none;border-top:1px solid rgba(74,98,116,.25)}',
    '.irt-rows li{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-bottom:1px solid rgba(74,98,116,.25);font-size:16px}',
    '.irt-rows b{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:24px;line-height:1;color:#2C2C2C;white-space:nowrap}',
    '.irt-actions{display:flex;flex-wrap:wrap;align-items:center;gap:14px 20px;margin-top:22px}',
    '.irt-btn{appearance:none;display:inline-block;border:0;border-radius:3px;padding:13px 22px;background:#4A6274;color:#F7F3EE;',
    'font:500 15px/1 "DM Sans",system-ui,sans-serif;letter-spacing:.02em;text-decoration:none;cursor:pointer}',
    '.irt-btn:hover{background:#3d5262}',
    '.irt-link{appearance:none;border:0;background:none;padding:6px 2px;color:#4A6274;font:400 15px/1 "DM Sans",system-ui,sans-serif;',
    'text-decoration:underline;text-underline-offset:3px;cursor:pointer}',
    '.irt-x{position:absolute;top:14px;right:14px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(247,243,238,.92);',
    'color:#2C2C2C;font-size:22px;line-height:1;cursor:pointer}',
    '.irt-x:hover{background:#fff}',
    '.irt-btn:focus-visible,.irt-link:focus-visible,.irt-x:focus-visible{outline:3px solid #C9A84C;outline-offset:2px}',
    '@media (max-width:480px){.irt-body{padding:24px 22px 22px}.irt-title{font-size:32px}}',
    '@media (prefers-reduced-motion:reduce){.irt-root,.irt-dialog{transition:none}}'
  ].join('');

  /* ---------- Ouverture / fermeture ---------- */
  var root = null, lastFocus = null, prevOverflow = '';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function close(reason) {
    if (!root) return;
    if (!CFG.preview) {
      var s = readState();
      if (reason === 'cta') s.clicked = true;
      else s.dismissedAt = Date.now();
      writeState(s);
    }
    document.removeEventListener('keydown', onKey, true);
    document.documentElement.style.overflow = prevOverflow;
    var r = root; root = null;
    r.classList.remove('irt-in');
    window.setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 260);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* rien */ } }
  }

  function onKey(e) {
    if (!root) return;
    if (e.key === 'Escape') { e.stopPropagation(); close('dismiss'); return; }
    if (e.key !== 'Tab') return;
    var f = root.querySelectorAll('button,a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function open(version) {
    if (root || document.getElementById('irt-root')) return;
    if (typeof version === 'string') T = texts(version);
    if (!document.getElementById('irt-style')) {
      var st = document.createElement('style');
      st.id = 'irt-style';
      st.appendChild(document.createTextNode(CSS));
      document.head.appendChild(st);
    }
    lastFocus = document.activeElement;

    root = el('div', 'irt-root');
    root.id = 'irt-root';
    var dlg = el('div', 'irt-dialog');
    dlg.setAttribute('role', 'dialog');
    dlg.setAttribute('aria-modal', 'true');
    dlg.setAttribute('aria-labelledby', 'irt-title');
    dlg.setAttribute('tabindex', '-1');

    dlg.appendChild(el('div', 'irt-band'));

    var x = el('button', 'irt-x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', T.close);
    x.addEventListener('click', function () { close('dismiss'); });
    dlg.appendChild(x);

    var body = el('div', 'irt-body');
    body.appendChild(el('p', 'irt-eyebrow', T.eyebrow));
    var h = el('h2', 'irt-title', T.title);
    h.id = 'irt-title';
    body.appendChild(h);
    body.appendChild(el('p', 'irt-text', T.body));
    if (T.rows) {
      var ul = el('ul', 'irt-rows');
      for (var r = 0; r < T.rows.length; r++) {
        var li = el('li');
        li.appendChild(el('span', '', T.rows[r][0]));
        li.appendChild(el('b', '', T.rows[r][1]));
        ul.appendChild(li);
      }
      body.appendChild(ul);
    }
    if (T.quote) body.appendChild(el('p', 'irt-quote', T.quote));
    if (T.note) body.appendChild(el('p', 'irt-pickup', T.note));

    var actions = el('div', 'irt-actions');
    var cta = el('a', 'irt-btn', T.cta);
    cta.href = CFG.pageUrl;
    cta.addEventListener('click', function (e) {
      if (typeof CFG.onCta === 'function') {
        e.preventDefault();
        close('cta');
        CFG.onCta();
      } else {
        close('cta'); // la navigation normale se poursuit
      }
    });
    var later = el('button', 'irt-link', T.later);
    later.type = 'button';
    later.addEventListener('click', function () { close('dismiss'); });
    actions.appendChild(cta);
    actions.appendChild(later);
    body.appendChild(actions);
    dlg.appendChild(body);

    root.appendChild(dlg);
    root.addEventListener('mousedown', function (e) { if (e.target === root) close('dismiss'); });

    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.appendChild(root);
    document.addEventListener('keydown', onKey, true);
    window.requestAnimationFrame(function () {
      if (root) { root.classList.add('irt-in'); dlg.focus(); }
    });
  }

  /* ---------- Déclenchement ---------- */
  var timer = null;
  function check() {
    if (timer) { window.clearTimeout(timer); timer = null; }
    if (root) return;
    if (!shouldShow()) return;
    timer = window.setTimeout(function () {
      timer = null;
      if (!root && shouldShow() && !document.hidden) open();
    }, CFG.delayMs);
  }

  function watchRoutes() {
    ['pushState', 'replaceState'].forEach(function (name) {
      var orig = window.history[name];
      if (typeof orig !== 'function') return;
      window.history[name] = function () {
        var out = orig.apply(this, arguments);
        window.setTimeout(check, 0);
        return out;
      };
    });
    window.addEventListener('popstate', check);
  }

  window.IfsuRetraite = { check: check, open: open, close: function () { close('dismiss'); } };

  function start() {
    if (CFG.watchRoutes) watchRoutes();
    check();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
