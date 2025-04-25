function menuButton(cuurrentPage,cehck) {
    const menuButton = document.getElementById("menuButton");    
    // width 넓이 수정을위해서
    const aside = document.querySelector("aside");    

    menuButton.addEventListener("click", () => {           
        let styleLink = document.createElement("link");     
        styleLink.rel = "stylesheet";                
        document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
            if(link.href.includes("aside")) {
                link.remove();
            }
        })
        if(cuurrentPage == 1){             
            loadHtml("aside","../sidebar/html/aside2.html", () => {            
                styleLink.href = "../sidebar/style/aside2.css";
                document.head.appendChild(styleLink);          
                toggleSidebarClass();

                aside.style.width = "70px";        
                aside.style.display = "flex";
                aside.style.justifyContent = "center";
                if(cehck == 2){
                    cuurrentPage = 3;
                }                
                else if(cehck == 1){
                    cuurrentPage = 2;
                }
            });            
        }      
        else if (cuurrentPage == 2){
            loadHtml("aside","../sidebar/html/aside.html",() =>{          
                styleLink.href = "../sidebar/style/aside.css";
                document.head.appendChild(styleLink); 
                toggleSidebarClass();
                cuurrentPage = 1;     
                aside.style.width = "240px";
                aside.style.display = "";
                aside.style.justifyContent = "";
                if(cehck == 2) {
                    cuurrentPage = 3;
                }
                else{
                    cuurrentPage = 1;      
                }
            });            
        }  
        else if(cuurrentPage == 3){ 
            aside.style.display = "none"; 
            cuurrentPage = 2;           
        }    
    });
}
// 사이드바 변경
function toggleSidebarClass() {
    const el = document.querySelector(".sidebarClosed, .sidebarExpanded");
    if (!el) return;

    el.classList.toggle("sidebarClosed");
    el.classList.toggle("sidebarExpanded");
}
window.menuButton = menuButton;