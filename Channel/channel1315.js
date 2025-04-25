(function (){
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
        loadHtml("aside", "../home/sidebar/aside.html", () => {
        styleLink.href = "../home/sidebar/style/aside.css";
        document.head.appendChild(styleLink);  
        aside.style.width = "190px";
        aside.style.display = "";
        aside.style.justifyContent = "";
    });
    }
    else if (page === 2) {
        loadHtml("aside", "../home/sidebar/aside2.html", () => {
        styleLink.href = "../home/sidebar/style/aside2.css";        
        document.head.appendChild(styleLink);
        const sidebar = document.querySelector(".sidebar");
        aside.style.width = "70px";
        aside.style.display = "flex";
        aside.style.justifyContent = "center";
        sidebar.style.position = "";

        });
    }
}
window.switchSidebar = switchSidebar;
})(); 