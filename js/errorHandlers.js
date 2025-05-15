/* ============= 비디오, 이미지 로드 실패시  ============= */
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

function initMediaWithRetry({ retries = 3, delay = 1000 } = {}) {
    document.addEventListener('error', event => {
        const el = event.target;
        if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) {
            handleMediaError(el, retries, delay);
        }
    }, true);
} 

/* ============= 에러 발생 시 처리 (fallback) ============= */
function handleMediaError(el, retriesLeft, delay) {

    if (el._isRetrying) return;
    el._isRetrying = true;    

    const link = el.closest('a');   
    
    if(link){        
        link.removeAttribute('href');        
        Object.assign(link.style, {
            opacity: '0.6',
            cursor: 'default',
            pointerEvnets : 'none'
        })               
    }
    
    const placeholder = document.createElement('div');
    
    placeholder.className = 'media-fallback';
    placeholder.textContent = '미디어 로드 실패: 자동 재시도 중…';
    
    el.style.display = 'none';    
    el.parentNode.insertBefore(placeholder, el);

    // 재시도
    (function retry(count, wait) {
        if (count <= 0) {            
            placeholder.textContent = '미디어 로드 실패 : ';
            
            const btn = document.createElement('button');
                btn.className = 'error__retry-btn';           
                btn.textContent = '페이지 새로고침';
                btn.onclick = () => window.location.reload();
                placeholder.appendChild(btn);
            return;
        }
        setTimeout(() => {
            
            if (el instanceof HTMLImageElement) {
                el.src = el.dataset.originalSrc;
            } else {
                el.querySelectorAll('source').forEach(src => {
                    src.src = src.dataset.originalSrc;
                });
                el.load();
            }            
            const onError = () => {
                el.removeEventListener('error', onError, true);
                retry(count - 1, wait * 2);
            };
            el.addEventListener('error', onError, true);            
            const onLoad = () => {
                placeholder.remove();
                el.style.display = '';
                el.removeEventListener(el instanceof HTMLImageElement ? 'load' : 'loadeddata', onLoad);
            };            
            if (el instanceof HTMLImageElement) {
                el.addEventListener('load', onLoad, { once: true });
            }            
            else {
                el.addEventListener('loadeddata', onLoad, { once: true });
            }
        }, wait);
    })(retriesLeft, delay);
}

/* ============= 네트워크 지연 에러 ============= */
function monitorPageLoad(maxRtries, timeout){
    let isPageLoaded = false;
    let retriesLeft = (Number(localStorage.getItem("retriesLeft")) || maxRtries);       
    
    const timer = setTimeout(() => {
        if(isPageLoaded){            
            localStorage.removeItem("retriesLeft");
            return;
        }

        if(localStorage.getItem("retriesLeft") == 0){            
            localStorage.removeItem("retriesLeft");                
            location.href ="../html/error.html";
            return;
        }                      
        retriesLeft--;           
        localStorage.setItem("retriesLeft", retriesLeft);                
        location.reload();                
        
    },timeout);   

    window.markPageAsLoaded = function () {
        isPageLoaded = true;
        localStorage.removeItem("retriesLeft");        
    }   
}    

/* =============  DOM 준비 후 초기화 실행  ============= */
window.addEventListener('DOMContentLoaded', () => {
    monitorPageLoad(3,5000);
    cacheOriginalMediaSrc();
    initMediaWithRetry({ retries: 3, delay: 1000 });    
    
    setTimeout(() => {
        markPageAsLoaded();   
    },4000)   
});