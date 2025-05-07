/* 알림창  */
function showError(message, timeout = 5000) {    

    const container = setTimeout(() => {
        location.reload();
    }, timeout)    
    alert(message);   

    clearTimeout(timeout);
    location.reload();   
}
window.showError = showError;

/* 비디오, 이미지 로드 실패시 */
// 모든 <img>와 <video>에 원본 URL 저장 
function cacheOriginalMediaSrc() {
    document.querySelectorAll('img').forEach(img => {
        img.dataset.originalSrc = img.src;
    });
    document.querySelectorAll('video').forEach(video => {
        video.querySelectorAll('source').forEach(src => {
            src.dataset.originalSrc = src.src;
        });
    });
}

//  미디어 에러 핸들러 설정 
function initMediaWithRetry({ retries = 3, delay = 1000 } = {}) {
    document.addEventListener('error', event => {
        const el = event.target;
        if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) {
            handleMediaError(el, retries, delay);
        }
    }, true);
} 

// 에러 발생 시 처리: Fallback + 재시도 로직 
function handleMediaError(el, retriesLeft, delay) {
    // 이미 처리 중인 요소면 무시
    if (el._isRetrying) return;
    el._isRetrying = true;
    
    // 기존 a태그 효과 무시
    const link = el.closest('a');   
    
    if(link){        
        link.removeAttribute('href');        
        Object.assign(link.style, {
            opacity: '0.6',
            cursor: 'default',
            pointerEvnets : 'none'
        })               
    }

    // Fallback UI 생성
    const placeholder = document.createElement('div');
    
    placeholder.className = 'media-fallback';
    placeholder.textContent = '미디어 로드 실패: 자동 재시도 중…';
    // 이미지 무시
    el.style.display = 'none';
    // 이미지 요소 앞에 넣기
    el.parentNode.insertBefore(placeholder, el);

    // 재시도
    (function retry(count, wait) {
        if (count <= 0) {            
            placeholder.textContent = '미디어 로드 실패 : ';
            // 버튼 (새로고침 기능 + text 추가)
            const btn = document.createElement('button');
            btn.className = 'retry-btn';           
            btn.textContent = '페이지 새로고침';
            btn.onclick = () => window.location.reload();
            placeholder.appendChild(btn);
            return;
        }
        setTimeout(() => {
            // 원본 URL로 재설정
            if (el instanceof HTMLImageElement) {
                el.src = el.dataset.originalSrc;
            } else {
                el.querySelectorAll('source').forEach(src => {
                    src.src = src.dataset.originalSrc;
                });
                el.load();
            }
            // 재시도 중 에러 시
            const onError = () => {
                el.removeEventListener('error', onError, true);
                retry(count - 1, wait * 2);
            };
            el.addEventListener('error', onError, true);
            // 성공 시 placeholder 제거 
            const onLoad = () => {
                placeholder.remove();
                el.style.display = '';
                el.removeEventListener(el instanceof HTMLImageElement ? 'load' : 'loadeddata', onLoad);
            };
            // 이미지 요소가 정상적으로 로드되었을때
            if (el instanceof HTMLImageElement) {
                el.addEventListener('load', onLoad, { once: true });
            }
            // 비디오 요소가 정상적으로 로드되었을때
            else {
                el.addEventListener('loadeddata', onLoad, { once: true });
            }
        }, wait);
    })(retriesLeft, delay);
}

  //  DOM 준비 후 초기화 실행 
window.addEventListener('DOMContentLoaded', () => {
    cacheOriginalMediaSrc();
    initMediaWithRetry({ retries: 3, delay: 1000 });
});