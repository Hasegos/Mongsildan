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
            loadHtml("aside", "./sidebar/aside.html", () => {
            styleLink.href = "./sidebar/style/aside.css";
            document.head.appendChild(styleLink);  
            aside.style.width = "240px";
            aside.style.display = "";
            aside.style.justifyContent = "";
        });
        }
        else if (page === 2) {
            loadHtml("aside", "./sidebar/aside2.html", () => {
            styleLink.href = "./sidebar/style/aside2.css";
            document.head.appendChild(styleLink);
            aside.style.width = "70px";
            aside.style.display = "flex";
            aside.style.justifyContent = "center";
            });
        }
    }
    window.switchSidebar = switchSidebar;
})(); 
