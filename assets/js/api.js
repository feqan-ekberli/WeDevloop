// assets/js/api.js
document.addEventListener("DOMContentLoaded", () => {
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

    // fetch('/api/projects')
    // .then(res => res.json())
    // .then(data => {
    //   const container = document.getElementById('project-list');
    //   if (!container) return;

    //   container.innerHTML = data.map(p => `
    //     <div class="col-md-6 col-lg-4 py-3">
    //       <div class="card-blog">
    //         <div class="header">
    //           <img src="${p.imageUrl}" alt="">
    //         </div>
    //         <div class="body">
    //           <h5 class="post-title">${p.title}</h5>
    //           <p>${p.description}</p>
    //           ${p.link ? `<a href="${p.link}" class="btn btn-primary btn-sm">Daha ətraflı</a>` : ""}
    //         </div>
    //       </div>
    //     </div>
    //   `).join('');
    // });

    fetch('/api/projects')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('project-list');
      if (!container) return;

      container.innerHTML = data.map(p => `
        <div class="col-md-6 col-lg-4 py-3">
          <div class="card-blog">
            <div class="header">
              <div class="avatar">
                <img src="${p.imageUrl}" alt="">
              </div>
              <div class="entry-footer">
                <div class="post-author">${p.title}</div>
                <a href="${p.link}" target="_blank" class="post-date">Sayta keçid</a>
              </div>
            </div>
            <div class="body">
              <div class="post-title"><a href="${p.link}" target="_blank">${p.title}</a></div>
              <div class="post-excerpt">${p.description}</div>
            </div>
            <div class="footer">
              <a href="${p.link}" target="_blank">Read More <span class="mai-chevron-forward text-sm"></span></a>
            </div>
          </div>
        </div>
      `).join('');
    });
});
