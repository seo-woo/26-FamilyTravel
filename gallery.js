(function () {
    function slug(s) {
        return String(s)
            .replace(/\s*\([^)]*\)\s*/g, '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '');
    }

    function buildImages(cardImgSrc, destinationSeed) {
        if (REAL_PHOTOS[destinationSeed] && REAL_PHOTOS[destinationSeed].length) {
            return REAL_PHOTOS[destinationSeed];
        }
        var seed = destinationSeed || 'travel';
        return [
            cardImgSrc,
            'https://picsum.photos/seed/' + seed + 'a/800/600',
            'https://picsum.photos/seed/' + seed + 'b/800/600',
            'https://picsum.photos/seed/' + seed + 'c/800/600',
        ];
    }

    function openGallery(images, title) {
        var overlay = document.getElementById('galleryOverlay');
        var imgEl = document.getElementById('galleryMainImg');
        var titleEl = document.getElementById('galleryTitle');
        var counterEl = document.getElementById('galleryCounter');
        if (!overlay || !imgEl) return;
        galleryImages = images;
        galleryIndex = 0;
        if (titleEl) titleEl.textContent = title || '사진 갤러리';
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        updateGalleryImage();
    }

    function updateGalleryImage() {
        var imgEl = document.getElementById('galleryMainImg');
        var counterEl = document.getElementById('galleryCounter');
        var prevBtn = document.getElementById('galleryPrev');
        var nextBtn = document.getElementById('galleryNext');
        if (!imgEl || !galleryImages.length) return;
        imgEl.src = galleryImages[galleryIndex];
        if (counterEl) counterEl.textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
        if (prevBtn) prevBtn.style.visibility = galleryImages.length > 1 ? 'visible' : 'hidden';
        if (nextBtn) nextBtn.style.visibility = galleryImages.length > 1 ? 'visible' : 'hidden';
    }

    function closeGallery() {
        var overlay = document.getElementById('galleryOverlay');
        if (overlay) overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function nextImg() {
        if (!galleryImages.length) return;
        galleryIndex = (galleryIndex + 1) % galleryImages.length;
        updateGalleryImage();
    }

    function prevImg() {
        if (!galleryImages.length) return;
        galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
        updateGalleryImage();
    }

    var galleryImages = [];
    var galleryIndex = 0;

    function init() {
        var existing = document.getElementById('galleryOverlay');
        if (existing) return;

        var overlay = document.createElement('div');
        overlay.id = 'galleryOverlay';
        overlay.innerHTML =
            '<div id="galleryModal">' +
            '  <div class="gallery-header">' +
            '    <h2 class="gallery-title" id="galleryTitle">사진 갤러리</h2>' +
            '    <button type="button" class="gallery-close" id="galleryClose" aria-label="닫기">×</button>' +
            '  </div>' +
            '  <div id="galleryMainWrap">' +
            '    <img id="galleryMainImg" src="" alt=""/>' +
            '    <button type="button" id="galleryPrev" aria-label="이전">‹</button>' +
            '    <button type="button" id="galleryNext" aria-label="다음">›</button>' +
            '  </div>' +
            '  <div id="galleryCounter"></div>' +
            '</div>';

        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeGallery();
        });
        document.getElementById('galleryClose').addEventListener('click', closeGallery);
        document.getElementById('galleryPrev').addEventListener('click', function (e) {
            e.stopPropagation();
            prevImg();
        });
        document.getElementById('galleryNext').addEventListener('click', function (e) {
            e.stopPropagation();
            nextImg();
        });
        document.getElementById('galleryModal').addEventListener('click', function (e) {
            e.stopPropagation();
        });
        document.addEventListener('keydown', function (e) {
            if (!document.getElementById('galleryOverlay').classList.contains('is-open')) return;
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowLeft') prevImg();
            if (e.key === 'ArrowRight') nextImg();
        });
        document.addEventListener('click', function (e) {
            var card = e.target.closest('.destination-card');
            if (!card) return;
            e.preventDefault();
            var dest = card.getAttribute('data-destination');
            if (dest === 'sapa') {
                window.open('https://triple.guide/articles/1a940e0e-09b1-4f83-be13-2a2143923be3', '_blank');
                return;
            }
            if (dest === 'chiangmai') {
                window.open('https://www.getyourguide.com/ko-kr/explorer/chiang-mai-ttd32247/first-time-in-chiang-mai/', '_blank');
                return;
            }
            if (dest === 'danang') {
                window.open('https://www.getyourguide.com/ko-kr/explorer/danang-ttd32248/first-time-in-danang/', '_blank');
                return;
            }
            if (dest === 'manado') {
                window.open('https://pkg.ybtour.co.kr/promotion/promotionDetail.yb?mstNo=20000030904&subDspMenu=PKG', '_blank');
                return;
            }
            if (dest === 'kotakinabalu') {
                window.open('https://www.kkday.com/ko/blog/11028/asia-malaysia-kota-kinabalu-attractions?srsltid=AfmBOoocZ8WBCUNRDGs8XBk1APitCgH9lCOYmsw3akSbbaovpk0oidB9', '_blank');
                return;
            }
            if (dest === 'hongkong') {
                window.open('https://www.discoverhongkong.com/content/dam/dhk/market-site/kr/e-guidebooks/2023-hk-mini-guide-e-book-kr.pdf', '_blank');
                return;
            }
            if (dest === 'taiwan') {
                window.open('https://www.getyourguide.com/ko-kr/explorer/taiwan-ttd32252/first-time-in-taiwan/', '_blank');
                return;
            }
            
            var img = card.querySelector('.image-container img');
            var h2 = card.querySelector('.image-overlay h2, .image-container h2, h2');
            var title = h2 ? h2.textContent.trim() : '여행지 사진';
            var cardSrc = img && img.src ? img.src : '';
            var seed = dest || slug(title);
            var images = buildImages(cardSrc, seed);
            openGallery(images, title);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
