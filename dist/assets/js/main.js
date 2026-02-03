// Theme toggle (light/dark) persisted in localStorage
(function(){
  const btn = document.getElementById('themeToggle');
  const body = document.body;
  const LS_KEY = 'cv_theme_dark';
  function applyTheme(){
    if(localStorage.getItem(LS_KEY) === '1') body.classList.add('dark-mode'); else body.classList.remove('dark-mode');
  }
  btn && btn.addEventListener('click', ()=>{
    if(body.classList.contains('dark-mode')){ localStorage.removeItem(LS_KEY); } else { localStorage.setItem(LS_KEY,'1'); }
    applyTheme();
  });
  applyTheme();

  // Reveal & skills animation using IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        // animate skill bars inside
        entry.target.querySelectorAll && entry.target.querySelectorAll('.skill-fill').forEach(el=>{
          const w = el.dataset.width || '';
          if(w) el.style.width = w;
        });
      }
    });
  },{threshold:0.12});

  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  // Ensure skill fills also animate if already visible
  document.querySelectorAll('.skill-fill').forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight) el.style.width = el.dataset.width;
  });

  // Projects modal
  const projectModalEl = document.getElementById('projectModal');
  if(projectModalEl){
    const bsModal = new bootstrap.Modal(projectModalEl);
    document.querySelectorAll('.project-item').forEach(item=>{
      item.addEventListener('click', ()=>{
        document.getElementById('projectModalTitle').textContent = item.dataset.title || 'Projet';
        document.getElementById('projectModalBody').textContent = item.dataset.content || item.textContent;
        bsModal.show();
      });
    });
  }

  // Download PDF / print
  const downloadBtn = document.getElementById('downloadPdfBtn');
  downloadBtn && downloadBtn.addEventListener('click', ()=> window.print());

  // Small enhancement: smooth scroll for anchor links (for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });

})();
