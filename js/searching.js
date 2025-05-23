/* =========== 검색시 해당 페이지 확인 =========== */
function searching() {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    function handleSearch(e){        
        const raw = searchInput.value.trim();
        const keyword = raw.replace(/\s/g, "");        
        if(keyword){
            if(window.location.pathname.includes('home')) {
                window.isSearching = true;
                searchVideos(keyword);
            }
            else {
                const url = `../index.html?search=${encodeURIComponent(keyword)}`;
                window.location.href = url;             
            }
        }
        else{
            alert("검색어를 입력하세요!");
        }        
    }    
    searchButton.addEventListener("click", handleSearch);    
    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {                                
            handleSearch();
        }
    });
}
window.searching = searching;