function subscribe() {
    try{    
    const subscribeBtn = document.getElementById('subscribe-btn');
    const subscribeText = document.getElementById('subscribe-text');
    const bellIcon = document.getElementById('bell-icon');
    let subscribed = false;

    subscribeBtn.addEventListener('click', () => {
        subscribed = !subscribed;
        if (subscribed) {
            subscribeText.textContent = '구독중';
            subscribeBtn.style.backgroundColor = '#515353'; // 구독중 배경
            bellIcon.style.display = 'inline';
            bellIcon.classList.add('bell-shake');
        
            bellIcon.addEventListener('animationend', () => {
            bellIcon.classList.remove('bell-shake');
        }, { once: true });
    
        } else {
        subscribeText.textContent = '구독';
        subscribeBtn.style.backgroundColor = 'white'; // 구독전 배경
        bellIcon.style.display = 'none';
        }    
    });   
    }
    catch(error){
    alert("구독 버튼 오류 발생");
    location.reload();
    }
}
window.subscribe = subscribe;