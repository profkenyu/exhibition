/* ===== 작품 간 인터스티셜 (시네마틱 모드) =====
   메뉴 클릭 또는 NEXT 버튼으로 진입할 때, 작품이 시작되기 전
   화면 중앙에 짧은 연결 문장을 2~3초 띄운 뒤
   중력렌즈 왜곡 + 성운의 흐름과 함께 작품으로 이어진다. */
(function(){
  'use strict';
  /* 관측소 프리뷰(iframe embed)에서는 실행하지 않는다 — 플래그를 선점 소비하는 것 방지 */
  if(location.search.indexOf('embed') > -1) return;

  var LINES = {
    '01-RGB_Galaxy.html':        { text:'Birth of light.' },
    '02-Hyperbolic_Nebula.html': { text:'Light gathers.' },
    '03-Riemann_dream.html':     { text:'Patterns emerge.' },
    '04-Quantum_sing.html':      { text:'Geometry awakens.', key:true },
    '05-Dual_Galaxy.html':       { text:'Gravity begins.' },
    '06-Lambert_Essential.html': { text:'Space bends.', key:true },
    '07-Lambert_Archive.html':   { text:'Time slows.' },
    '08-Lambert_nebu.html':      { text:'Matter disappears.', key:true },
    '09-Bessel_bloom.html':      { text:'Only equations remain.', key:true },
    '10-Lorenz_butt.html':       { text:'Silence creates.' },
    '11-Odyssey_Essential.html': { text:'Life organizes itself.' },
    '12-Odyssey_Archive.html':   { text:'Consciousness observes.' },
    '13-Event_Horizon.html':     { text:'The voyage begins.' },
    '14-Black_Voyage.html':      { text:'Everything returns.' },
    '15-Kerr_Plasma.html':       { text:'The equation continues.' }
  };

  var FLAG = 'odyssey_interstitial';
  var here = decodeURIComponent((location.pathname.split('/').pop() || ''));
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* --- 다른 작품으로 향하는 모든 내부 링크(NEXT, voyage nav)에 인터스티셜 예약.
         실제 페이드아웃/이동은 각 페이지의 기존 링크 인터셉터가 담당한다. --- */
  document.addEventListener('click', function(ev){
    var el = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if(!el) return;
    var target = (el.getAttribute('href') || '').split('/').pop().split('?')[0].split('#')[0];
    if(target && LINES[target] && target !== here){
      try{ sessionStorage.setItem(FLAG, target); }catch(e){}
    }
  }, true);

  /* --- 도착 페이지: 예약된 경우에만 인터스티셜 표시 --- */
  var entry = LINES[here];
  if(!entry) return;
  var due = false;
  try{
    due = sessionStorage.getItem(FLAG) === here;
    if(due) sessionStorage.removeItem(FLAG);
  }catch(e){}
  if(!due) return;

  var HOLD = entry.key ? 1700 : 1200;   // 중요 문장은 조금 더 오래
  var FADE_IN = 1000, EXIT = 1300;

  var css = document.createElement('style');
  css.textContent =
    '#ody-inter{position:fixed;inset:0;z-index:99999;background:#000;pointer-events:none;' +
      'display:flex;align-items:center;justify-content:center;overflow:hidden;' +
      'transition:opacity ' + (EXIT/1000) + 's ease;}' +
    '#ody-inter .wisp{position:absolute;width:130vmax;height:130vmax;left:50%;top:50%;' +
      'border-radius:50%;opacity:0;filter:blur(2px);will-change:transform,opacity;' +
      'transition:opacity 2.2s ease,transform 2.6s cubic-bezier(.16,1,.3,1);}' +
    '#ody-inter .wisp.a{background:radial-gradient(closest-side,rgba(30,48,110,.34),rgba(10,14,40,.12) 42%,transparent 68%);' +
      'transform:translate(-58%,-46%) scale(.85) rotate(8deg);}' +
    '#ody-inter .wisp.b{background:radial-gradient(closest-side,rgba(86,16,52,.26),rgba(40,8,30,.1) 40%,transparent 66%);' +
      'transform:translate(-42%,-55%) scale(.8) rotate(-14deg);}' +
    '#ody-inter.on .wisp{opacity:.28;}' +
    '#ody-inter.out .wisp{opacity:.55;}' +
    '#ody-inter.out .wisp.a{transform:translate(-64%,-40%) scale(1.35) rotate(16deg);}' +
    '#ody-inter.out .wisp.b{transform:translate(-36%,-62%) scale(1.3) rotate(-24deg);}' +
    '#ody-inter .ring{position:absolute;left:50%;top:50%;width:min(46vmin,340px);height:min(46vmin,340px);' +
      'margin:calc(min(46vmin,340px)/-2) 0 0 calc(min(46vmin,340px)/-2);border-radius:50%;' +
      'border:1px solid rgba(145,200,255,.55);box-shadow:0 0 34px rgba(110,220,235,.22),inset 0 0 24px rgba(110,220,235,.12);' +
      'opacity:0;transform:scale(.18);will-change:transform,opacity;}' +
    '#ody-inter.out .ring{transition:transform ' + (EXIT/1000) + 's cubic-bezier(.16,1,.3,1),opacity ' + (EXIT/1000) + 's ease;' +
      'opacity:0;transform:scale(2.6);}' +
    '#ody-inter.out .ring.go{opacity:1;animation:odyRing ' + (EXIT/1000) + 's cubic-bezier(.16,1,.3,1) forwards;}' +
    '@keyframes odyRing{0%{opacity:0;transform:scale(.18);}18%{opacity:.9;}100%{opacity:0;transform:scale(2.7) scaleY(.92);}}' +
    '#ody-inter .line{position:relative;font-family:"DM Mono","Space Mono",ui-monospace,Menlo,monospace;' +
      'font-weight:300;font-size:clamp(10px,1.15vw,13px);letter-spacing:.55em;text-indent:.55em;' +
      'color:rgba(243,245,248,.92);white-space:nowrap;opacity:0;' +
      'transition:opacity ' + (FADE_IN/1000) + 's ease,letter-spacing ' + (FADE_IN/1000) + 's cubic-bezier(.16,1,.3,1),' +
      'text-indent ' + (FADE_IN/1000) + 's cubic-bezier(.16,1,.3,1),filter .9s ease;will-change:opacity,filter,letter-spacing;}' +
    '#ody-inter .line.key{color:rgba(197,228,255,.96);text-shadow:0 0 26px rgba(110,220,235,.35);}' +
    '#ody-inter.on .line{opacity:1;letter-spacing:.3em;text-indent:.3em;}' +
    '#ody-inter.out .line{opacity:0;letter-spacing:.75em;' +
      'transition:opacity 1s ease .1s,letter-spacing ' + (EXIT/1000) + 's ease;}' +
    '@media(max-width:640px){#ody-inter .line{font-size:10px;white-space:normal;text-align:center;line-height:2;padding:0 24px;}}';
  document.head.appendChild(css);

  var ov = document.createElement('div');
  ov.id = 'ody-inter';
  ov.innerHTML =
    '<div class="wisp a"></div><div class="wisp b"></div>' +
    '<div class="ring"></div>' +
    '<div class="line' + (entry.key ? ' key' : '') + '">' + entry.text + '</div>';

  /* 중력렌즈 왜곡 필터 (퇴장 시 문장을 굴절시키는 데 사용) */
  var svgNS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(svgNS,'svg');
  svg.setAttribute('width','0'); svg.setAttribute('height','0');
  svg.style.position = 'absolute';
  svg.innerHTML =
    '<filter id="ody-lens" x="-60%" y="-300%" width="220%" height="700%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>';
  ov.appendChild(svg);

  function mount(){ document.body.appendChild(ov); run(); }
  if(document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  function cleanup(){
    if(ov.parentNode) ov.parentNode.removeChild(ov);
    if(css.parentNode) css.parentNode.removeChild(css);
  }

  function run(){
    if(reduce){
      /* 모션 최소화: 왜곡 없이 문장만 잔잔하게 보여준 뒤 사라진다 */
      var line = ov.querySelector('.line');
      line.style.transition = 'opacity .8s ease';
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ line.style.opacity = '1'; }); });
      setTimeout(function(){
        line.style.opacity = '0';
        ov.style.transition = 'opacity .8s ease';
        ov.style.opacity = '0';
        setTimeout(cleanup, 900);
      }, 2200);
      return;
    }

    requestAnimationFrame(function(){ requestAnimationFrame(function(){ ov.classList.add('on'); }); });

    setTimeout(function(){
      ov.classList.add('out');
      ov.querySelector('.ring').classList.add('go');
      ov.style.opacity = '0';

      /* 문장에 렌즈 왜곡을 점점 강하게 건다 */
      var line = ov.querySelector('.line');
      var turb = svg.querySelector('feTurbulence');
      var disp = svg.querySelector('feDisplacementMap');
      var t0 = performance.now();
      (function warp(now){
        var p = Math.min(1, (now - t0) / EXIT);
        var e = p * p * (3 - 2 * p);
        disp.setAttribute('scale', (e * 58).toFixed(1));
        turb.setAttribute('baseFrequency', (0.012 + e * 0.02).toFixed(4) + ' ' + (0.02 + e * 0.05).toFixed(4));
        line.style.filter = 'url(#ody-lens) blur(' + (e * 6).toFixed(2) + 'px)';
        if(p < 1) requestAnimationFrame(warp);
      })(t0);

      setTimeout(cleanup, EXIT + 250);
    }, FADE_IN + HOLD);
  }

  /* bfcache 복귀 시 잔여 오버레이 제거 */
  addEventListener('pageshow', function(e){ if(e.persisted) cleanup(); });
})();
