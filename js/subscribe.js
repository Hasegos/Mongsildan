/* ============ 버튼 초기화 + 클릭 핸들러 세팅 ============ */
function initSubscribeButton(channelId, channelName, channelProfile) {
    const btn = document.getElementById('subscribe-btn');
    const text = document.getElementById('subscribe-text');
    const bell = document.getElementById('bell-icon');
    const aside = document.querySelector('aside');

    
    const saved = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    let isSubscribed = saved.some(s => s.channelId === channelId);

    reflectSubscribeUI(isSubscribed, text, btn, bell);

    btn.addEventListener('click', () => {    
        isSubscribed = toggleSubscription(channelId, channelName, channelProfile);    
        reflectSubscribeUI(isSubscribed, text, btn, bell);        
        renderSavedSubscriptions(aside);
    });
}

/* ============ LocalStorage 토글 함수 ============ */
function toggleSubscription(channelId, channelName, channelProfile) {    
    const saved = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const idx = saved.findIndex(s => s.channelId === channelId);

    if (idx >= 0) {
        saved.splice(idx, 1);
        localStorage.setItem('subscriptions', JSON.stringify(saved));
        
        const e = document.querySelector(`.sidebar-expanded__subscription li[data-channel-id="${channelId}"]`);
        if (e) {
            e.remove();
        }
        return false;
    } else {        
        saved.push({ channelId, channelName, channelProfile });
        localStorage.setItem('subscriptions', JSON.stringify(saved));
        
        const ul = document.querySelector('.sidebar-expanded__subscription');
        if(!ul) return;

        const titleLi = ul.querySelector('.sidebar-expanded__title');
        const li = document.createElement('li');
        li.dataset.channelId = channelId;
        li.innerHTML = `
        <a href="../html/channel.html?id=${channelId}" class="sidebar-expanded__content">
            <img src="${channelProfile}" alt="${channelName}">
            <span>${channelName}</span>
        </a>
        `;        
        const ref = titleLi.nextElementSibling;
        if (ref){
            ul.insertBefore(li, ref);
        }         
        else {
            ul.appendChild(li);
        }  
        return true;
    }
}

/* ============ 버튼 UI만 바꿔 주는 헬퍼  ============ */
function reflectSubscribeUI(yes, text, btn, bell) {
    text.textContent = yes ? '구독중' : '구독';
    btn.style.backgroundColor = yes ? '#515353' : 'white';
    bell.style.display = yes ? 'inline' : 'none';
    if (yes) {
        bell.classList.add('common__bell--shake');
        bell.addEventListener('animationend',
            () => bell.classList.remove('common__bell--shake'), { once: true });
    }
}

/* ============ 저장된 구독 목록을 사이드바에 렌더링 ============ */
function renderSavedSubscriptions(aside) {
    
    const ul = aside.querySelector('.sidebar-expanded__subscription'); 
    const saved = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const titleLi = ul.querySelector('.sidebar-expanded__title');
    const ref = titleLi.nextElementSibling;

    saved.forEach(({channelId, channelName, channelProfile}) => {
        if (ul.querySelector(`li[data-channel-id="${channelId}"]`)) return;
        const li = document.createElement('li');
        li.dataset.channelId = channelId;
        li.innerHTML = `
            <a href="../html/channel.html?id=${channelId}" class="sidebar-expanded__content">
            <img src="${channelProfile}" alt="${channelName}">
            <span>${channelName}</span>
            </a>
        `;
        if (ref){
            ul.insertBefore(li, ref);
        } 
        else  {
            ul.appendChild(li);
        }   
    });
}

window.initSubscribeButton = initSubscribeButton;
window.renderSavedSubscriptions = renderSavedSubscriptions;