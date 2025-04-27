// Header və Footer Fetch
document.addEventListener("DOMContentLoaded", function () {
  // Header-i yüklə
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    })
    .catch((error) => console.error("Header yüklənmədi:", error));

  // Footer-i yüklə
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;

      // Footer gələndən sonra year yaz
      const year = new Date().getFullYear();
      const yearSpan = document.getElementById("year");
      if (yearSpan) {
        yearSpan.textContent = year;
      }
    })
    .catch((error) => console.error("Footer yüklənmədi:", error));
});


// Başlıq və Breadcrumb dəyişən funksiya
function updatePageTitle() {
  const pageTitleElement = document.getElementById('page-title');
  const breadcrumbElement = document.getElementById('breadcrumb-page-name');
  
  if (pageTitleElement && breadcrumbElement) {
    let page = window.location.pathname.split("/").pop();
    page = page.replace(".html", ""); // .html sil
    page = page.charAt(0).toUpperCase() + page.slice(1); // İlk hərfi böyük elə
    
    if (page === "" || page === "Index") {
      page = "Home";
    }

    pageTitleElement.textContent = page;
    breadcrumbElement.textContent = page;
  }
}
