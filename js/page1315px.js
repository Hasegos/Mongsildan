function switchSidebar(page) {
    document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
        if(link.href.includes("aside")) {
            link.remove();
        }
    })
    const aside = document.querySelector("aside");
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";  
    if (page === 1) {
        loadHtml("aside", "../sidebar/html/aside.html", () => {
        styleLink.href = "../sidebar/style/aside.css";
        // 초기 구독상태 확인
        renderSavedSubscriptions(aside);
        document.head.appendChild(styleLink);      
    });
    }
    else if (page === 2) {
        loadHtml("aside", "../sidebar/html/aside2.html", () => {
        styleLink.href = "../sidebar/style/aside2.css";
        // 초기 구독상태 확인
        renderSavedSubscriptions(aside);
        document.head.appendChild(styleLink);        
        });
    }
}
window.switchSidebar = switchSidebar;
