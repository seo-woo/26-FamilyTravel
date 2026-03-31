(function () {
  /* ── 스타일 주입 ── */
  const style = document.createElement('style');
  style.textContent = `
    .resort-btn {
      display: block;
      width: 100%;
      text-align: left;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.4rem 0.5rem;
      border-radius: 0.375rem;
      transition: background 0.15s;
    }
    .resort-btn:hover { background: rgba(0,0,0,0.04); }
    .rm-camera {
      font-size: 0.65rem;
      color: #9ca3af;
      vertical-align: middle;
    }

    /* ── 모달 오버레이 ── */
    #rm-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.82);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
    }
    #rm-overlay.rm-hidden { display: none; }

    /* ── 모달 박스 ── */
    #rm-box {
      position: relative;
      background: #fff;
      border-radius: 0.75rem;
      overflow: hidden;
      width: min(640px, 100%);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    /* ── 헤더 ── */
    #rm-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.85rem 1.1rem 0.75rem;
      border-bottom: 1px solid #f3f4f6;
      font-family: 'Noto Sans KR', sans-serif;
    }
    #rm-title { font-size: 0.875rem; font-weight: 600; color: #1f2937; }
    #rm-close {
      background: none; border: none; cursor: pointer;
      color: #9ca3af; font-size: 1.1rem; line-height: 1;
      padding: 0.2rem 0.4rem; border-radius: 0.25rem;
      transition: color 0.15s;
    }
    #rm-close:hover { color: #374151; }

    /* ── 슬라이드 뷰포트 ── */
    #rm-viewport {
      position: relative;
      overflow: hidden;
      flex: 1;
      background: #0a0a0a;
      min-height: 260px;
    }
    #rm-track {
      display: flex;
      height: 100%;
      transition: transform 0.35s ease;
    }
    .rm-slide {
      flex: 0 0 100%;
      display: flex; align-items: center; justify-content: center;
    }
    .rm-slide img {
      width: 100%; height: 100%;
      max-height: 420px;
      object-fit: contain;
    }
    .rm-placeholder {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 0.5rem;
      color: #6b7280; font-family: 'Noto Sans KR', sans-serif;
      font-size: 0.8rem;
      width: 100%; height: 260px;
    }
    .rm-placeholder i { font-size: 2rem; color: #d1d5db; }

    /* ── 이전/다음 버튼 ── */
    .rm-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      background: rgba(0,0,0,0.45); border: none; cursor: pointer;
      color: #fff; font-size: 0.85rem;
      width: 2rem; height: 2rem; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s; z-index: 2;
    }
    .rm-arrow:hover { background: rgba(0,0,0,0.7); }
    #rm-prev { left: 0.6rem; }
    #rm-next { right: 0.6rem; }

    /* ── 닷 인디케이터 ── */
    #rm-dots {
      display: flex; align-items: center; justify-content: center;
      gap: 0.4rem; padding: 0.6rem;
      background: #fff;
    }
    .rm-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #d1d5db; cursor: pointer;
      border: none; transition: background 0.15s, transform 0.15s;
    }
    .rm-dot.active { background: #374151; transform: scale(1.3); }
  `;
  document.head.appendChild(style);

  /* ── 모달 HTML 삽입 ── */
  const overlay = document.createElement('div');
  overlay.id = 'rm-overlay';
  overlay.className = 'rm-hidden';
  overlay.innerHTML = `
    <div id="rm-box" role="dialog" aria-modal="true" aria-labelledby="rm-title">
      <div id="rm-header">
        <span id="rm-title"></span>
        <button id="rm-close" aria-label="모달 닫기"><i class="fas fa-times"></i></button>
      </div>
      <div id="rm-viewport">
        <div id="rm-track"></div>
        <button id="rm-prev" class="rm-arrow" aria-label="이전 이미지"><i class="fas fa-chevron-left"></i></button>
        <button id="rm-next" class="rm-arrow" aria-label="다음 이미지"><i class="fas fa-chevron-right"></i></button>
      </div>
      <div id="rm-dots"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  let cur = 0;
  let imgs = [];

  function buildSlides(list) {
    const track = document.getElementById('rm-track');
    track.innerHTML = '';
    list.forEach(function (src) {
      const slide = document.createElement('div');
      slide.className = 'rm-slide';
      if (src && src.trim() !== '') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '리조트 이미지';
        img.loading = 'lazy';
        img.onerror = function () {
          slide.innerHTML = '';
          const ph = document.createElement('div');
          ph.className = 'rm-placeholder';
          ph.innerHTML = '<i class="fas fa-image"></i><span>이미지를 추가해주세요</span>';
          slide.appendChild(ph);
        };
        slide.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'rm-placeholder';
        ph.innerHTML = '<i class="fas fa-image"></i><span>이미지를 추가해주세요</span>';
        slide.appendChild(ph);
      }
      track.appendChild(slide);
    });
  }

  function buildDots(count) {
    const dotsEl = document.getElementById('rm-dots');
    dotsEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'rm-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', (i + 1) + '번째 이미지');
      dot.addEventListener('click', function () { goTo(i); });
      dotsEl.appendChild(dot);
    }
  }

  function goTo(idx) {
    const list = document.querySelectorAll('.rm-dot');
    if (list[cur]) list[cur].classList.remove('active');
    cur = (idx + imgs.length) % imgs.length;
    if (list[cur]) list[cur].classList.add('active');
    document.getElementById('rm-track').style.transform = 'translateX(-' + (cur * 100) + '%)';
  }

  function closeModal() {
    overlay.classList.add('rm-hidden');
    document.body.style.overflow = '';
  }

  window.openResortModal = function (name, list) {
    imgs = list;
    cur = 0;
    document.getElementById('rm-title').textContent = name;
    buildSlides(list);
    buildDots(list.length);
    document.getElementById('rm-track').style.transform = 'translateX(0)';
    overlay.classList.remove('rm-hidden');
    document.body.style.overflow = 'hidden';
  };

  document.getElementById('rm-close').addEventListener('click', closeModal);
  document.getElementById('rm-prev').addEventListener('click', function () { goTo(cur - 1); });
  document.getElementById('rm-next').addEventListener('click', function () { goTo(cur + 1); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (overlay.classList.contains('rm-hidden')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goTo(cur - 1);
    if (e.key === 'ArrowRight') goTo(cur + 1);
  });

  /* ── 버튼 초기화 ── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.resort-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const name = this.dataset.name || '';
        const list = JSON.parse(this.dataset.images || '["","",""]');
        openResortModal(name, list);
      });
    });
  });
})();
