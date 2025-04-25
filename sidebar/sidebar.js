function menuButton(initialPage, cehck) {
    const menuButton = document.getElementById("menuButton");
    const aside = document.querySelector("aside");
    let currentPage = initialPage; // 함수 안에서 상태 유지
    let styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";

    menuButton.addEventListener("click", () => {
        // 기존 스타일 제거
        document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
            if (link.href.includes("aside")) {
                link.remove();
            }
        });

        // 사이드바 축소 상태 (기본 상태)
        if (currentPage === 1) {
            loadHtml("aside", "/sidebar/html/aside2.html", () => {
                styleLink.href = "/sidebar/style/aside2.css";
                document.head.appendChild(styleLink);
                aside.style.width = "70px";
                aside.style.display = "flex";
                aside.style.justifyContent = "center";

                currentPage = cehck === 2 ? 3 : 2;
            });
        }

        // 사이드바 확장 상태
        else if (currentPage === 2) {
            loadHtml("aside", "/sidebar/html/aside.html", () => {
                styleLink.href = "/sidebar/style/aside.css";
                document.head.appendChild(styleLink);
                aside.style.width = "240px";
                aside.style.display = "";
                aside.style.justifyContent = "";

                currentPage = cehck === 2 ? 3 : 1;
            });
        }

        // 사이드바 숨김 상태
        else if (currentPage === 3) {
            aside.style.display = "none";
            currentPage = 2;
        }
    });
}

window.menuButton = menuButton;
