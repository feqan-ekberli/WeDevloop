// assets/js/api.js
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "az";
  const page = window.location.pathname.split("/").pop().replace(".html", "") || "index";

  console.log("📌 Detected language:", lang);
  console.log("📄 Page:", page);



  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.value = lang;

    langSelect.addEventListener("change", (e) => {
      localStorage.setItem("lang", e.target.value);
      // Gecikdirilmiş reload – localStorage tam yazılsın deyə
      setTimeout(() => location.reload(), 100);
    });
  }


  // 🧩 Müştəri Loqoları
  fetch("/api/clients")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("client-logos");
      if (!container) return;
      container.innerHTML = data
        .map(
          (c) => `
          <div class="item wow zoomIn">
            <img src="${c.logoUrl}" alt="${c.name}">
          </div>
        `
        )
        .join("");
      new WOW().init();
    });

  // 💬 Rəylər (Testimonials)
  fetch("/api/reviews")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("testimonials");
      if (!container) return;
      container.innerHTML = data
        .map(
          (r) => `
          <div class="item">
            <div class="row align-items-center">
              <div class="col-md-6 py-3">
                <div class="testi-image">
                  <img src="${r.photoUrl}" alt="">
                </div>
              </div>
              <div class="col-md-6 py-3">
                <div class="testi-content">
                  <p>${r.comment}</p>
                  <div class="entry-footer">
                    <strong>${r.name}</strong> &mdash; <span class="text-grey">${r.company}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
        )
        .join("");
      $("#testimonials").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        smartSpeed: 700,
      });
      new WOW().init();
    });

  // 📂 Proyektlər (Blog səhifəsi üçün)
  fetch("/api/projects")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("project-list");
      if (!container || !data.length) return;

      // <a href="${p.link}" class="post-date" target="_blank">${p.link}</a>
      
      container.innerHTML = data
        .map(
          (p) => `
        <div class="col-md-6 col-lg-4 py-3">
          <div class="card-blog">
            <div class="header">
              <div class="avatar">
                <img src="${p.imageUrl}" alt="">
              </div>
              <div class="entry-footer">
                <div class="post-author">${p.title}</div>
                
              </div>
            </div>
            <div class="body">
              <div class="post-title"><a href="#">${p.description}</a></div>
              <div class="post-excerpt">Proyekt haqqında qısa məlumat</div>
            </div>
            <div class="footer">
              <a href="${p.link}" target="_blank">Visit Site <span class="mai-chevron-forward text-sm"></span></a>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    });

  // 🌐 Tərcümə API-dən gələn mətni uyğun id-lərə yaz
  fetch(`/api/lang/${lang}/${page}`)
    .then(res => {
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log("FETCH:", `/api/lang/${lang}/${page}`);
      console.log("TRANSLATION DATA:", data);

      Object.entries(data).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) {
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = value;
          } else {
            el.innerHTML = value;
          }
        }
      });
    })
    .catch(err => console.error("🛑 Translation API Error:", err));

    // 🌍 Footer translation
fetch(`/api/lang/${lang}/footer`)
  .then(res => res.ok ? res.json() : null)
  .then(data => {
    if (!data) return;
    Object.entries(data).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = value;
        } else {
          el.innerHTML = value;
        }
      }
    });
  });



});
