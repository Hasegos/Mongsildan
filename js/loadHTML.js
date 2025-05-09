// 다른 html 페이지 불러오는 함수 
function loadHtml(targetSelector, filePath, callback){    
    fetch(filePath)
        .then((res) => {
        if (!res.ok) {
            throw new Error("파일을 불러오지 못했습니다.");        
        }
        return res.text();
        })
        .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const bodyContent = doc.body.innerHTML;
        document.querySelector(targetSelector).innerHTML = bodyContent;
        if(callback){ callback();}
        })
        .catch((err) => {
            console.error("fetch 실패:", err);
        });
}
window.loadHtml = loadHtml;