/* ============ 625px 미만 최상단 반응형 ============ */
function topLoad600px(){
    const searchButton = document.getElementById("searchButton");
    const backButton = document.getElementById("backButton");
    const headerTop = document.querySelector(".header-global");

    searchButton.addEventListener("click",  () => {                       
        if (window.innerWidth <= 600) {            
            if (!headerTop.classList.contains("searching")) {
                // 처음 클릭 → 검색창 모드로 전환
                headerTop.classList.add("searching");
                backButton.style.display = "block"; // 뒤로가기 버튼 보이기                          
                return; 
            }
        }
    });

    backButton.addEventListener("click",  () => {      
        const headerTop = document.querySelector(".header-global");
        headerTop.classList.remove("searching");
        backButton.style.display = "none";       
    });

    window.addEventListener("resize",  () => {
        const headerTop = document.querySelector(".header-global");
        const backButton = document.getElementById("backButton");

        if (window.innerWidth > 600) {        
            headerTop.classList.remove("searching");
            backButton.style.display = "none";            
        }
    });
}

window.topLoad600px = topLoad600px;