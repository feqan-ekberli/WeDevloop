// Header və Footer Fetch
document.addEventListener("DOMContentLoaded", function () {
  

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



