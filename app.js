(function () {
  const S = window.SITE;
  const igProfile = `https://www.instagram.com/${S.instagram}/`;
  const igDm = `https://ig.me/m/${S.instagram}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(S.mapsQuery)}`;
  const reviewsUrl = S.googleReviewsUrl || mapsUrl;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(S.mapsQuery)}&output=embed`;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (name, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24"><use href="#i-${name}" /></svg>`;
  const stars = (cls = "icon") => `<div class="stars">${icon("star", cls + " fill").repeat(5)}</div>`;

  document.querySelectorAll("[data-tel]").forEach((a) => (a.href = `tel:${S.phone}`));
  document.querySelectorAll("[data-ig-dm]").forEach((a) => (a.href = igDm));

  const views = {
    home: () => `
      <section class="hero">
        <div>
          <p class="eyebrow">Микроблейдинг · Hairstrokes</p>
          <h1 class="hero-title">Вежди, които <em>изглеждат</em> твои.</h1>
          <p class="lead">Фини косъмчета, изрисувани на ръка. Събуждаш се с готови вежди — без молив, всеки ден.</p>
          <div class="rating-row">
            ${stars()}
            <button class="link" data-go="reviews">Виж отзивите в Google</button>
          </div>
          <button class="btn-outline mt-8" data-go="services">Разгледай услугите →</button>
        </div>
        <div class="hero-media">
          <img src="assets/hero-brow.jpg" alt="Естествени вежди с микроблейдинг" width="1024" height="1280" />
          <div class="since">
            <p class="since-big">от 2017</p>
            <p class="since-small">с любов към детайла</p>
          </div>
        </div>
      </section>`,

    services: () => `
      <section>
        <h2 class="section-title">Услуги</h2>
        <p class="muted mt-2">Всяка процедура започва с разговор и избор на техника според кожата ти.</p>
        <div class="grid3 mt-8">
          ${S.services.map((s) => `
            <article class="card">
              ${icon(s.icon, "icon-lg primary")}
              <h3 class="card-title">${esc(s.name)}</h3>
              <p class="muted small mt-2">${esc(s.desc)}</p>
              <p class="tag">${esc(s.time)}</p>
            </article>`).join("")}
        </div>
      </section>`,

    reviews: () => `
      <section>
        <div class="reviews-head">
          <div>
            <h2 class="section-title">Отзиви в Google</h2>
            <div class="rating-row mt-2">
              <span class="rating-num">${esc(S.rating)}</span>
              ${stars()}
            </div>
          </div>
          <a class="btn-outline small-btn" href="${reviewsUrl}" target="_blank" rel="noreferrer">Всички отзиви / Напиши отзив</a>
        </div>
        <div class="grid3 mt-6">
          ${S.reviews.map((r) => `
            <blockquote class="card">
              ${stars("icon-sm")}
              <p class="quote">“${esc(r.text)}”</p>
              <footer class="tag muted">${esc(r.name)}</footer>
            </blockquote>`).join("")}
        </div>
        <iframe class="map mt-6" title="Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${mapsEmbed}"></iframe>
      </section>`,

    contact: () => `
      <section class="contact">
        <a class="contact-big dark" href="tel:${esc(S.phone)}">
          ${icon("phone", "icon-xl")}
          <h2 class="section-title mt-6">Обади се</h2>
          <p class="mt-2 o70">Най-бързият начин да запазиш час.</p>
          <p class="mt-6 contact-val">${esc(S.phone)}</p>
        </a>
        <a class="contact-big primary-bg" href="${igDm}" target="_blank" rel="noreferrer">
          ${icon("instagram", "icon-xl")}
          <h2 class="section-title mt-6">Пиши в Instagram</h2>
          <p class="mt-2 o80">Изпрати снимка на веждите си за консултация.</p>
          <p class="mt-6 contact-val">@${esc(S.instagram)}</p>
        </a>
        <a class="card maps-link span2" href="${mapsUrl}" target="_blank" rel="noreferrer">
          ${icon("map-pin", "icon-md primary")}<span class="small">Виж студиото в Google Maps</span>
        </a>
        <iframe class="map span2" title="Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${mapsEmbed}"></iframe>
        <a class="portfolio span2" href="${igProfile}" target="_blank" rel="noreferrer">Портфолио в Instagram →</a>
      </section>`,
  };

  const main = document.getElementById("main");
  const tabs = document.querySelectorAll("[data-tab]");

  function show(id, push) {
    if (!views[id]) id = "home";
    main.innerHTML = views[id]();
    // restart the fade-in animation on every tab change
    main.classList.remove("fade-in-up");
    void main.offsetWidth;
    main.classList.add("fade-in-up");
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
    });
    if (push) {
      history.pushState(null, "", id === "home" ? location.pathname : `#${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-tab],[data-go]");
    if (el) show(el.dataset.tab || el.dataset.go, true);
  });
  window.addEventListener("popstate", () => show(location.hash.slice(1)));

  show(location.hash.slice(1));
})();
