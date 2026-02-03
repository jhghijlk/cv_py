/**
 * Modern CV 2026 - Main JavaScript
 * Enhanced interactions and animations
 */

(function () {
  'use strict';

  // ============================================================================
  // Theme Toggle with smooth transitions
  // ============================================================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const LS_KEY = 'cv_theme_dark';

  function applyTheme(animated = false) {
    const isDark = localStorage.getItem(LS_KEY) === '1';

    if (animated) {
      body.style.transition = 'background 0.5s ease, color 0.5s ease';
      setTimeout(() => {
        body.style.transition = '';
      }, 500);
    }

    if (isDark) {
      body.classList.add('dark-mode');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="lucide-sun"></i>';
      }
    } else {
      body.classList.remove('dark-mode');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="lucide-moon"></i>';
      }
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.contains('dark-mode');
      if (isDark) {
        localStorage.removeItem(LS_KEY);
      } else {
        localStorage.setItem(LS_KEY, '1');
      }
      applyTheme(true);

      // Add a pulse animation
      themeToggle.style.animation = 'none';
      setTimeout(() => {
        themeToggle.style.animation = '';
      }, 10);
    });
  }

  applyTheme(false);

  // ============================================================================
  // Intersection Observer for reveal animations
  // ============================================================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation delay
        setTimeout(() => {
          entry.target.classList.add('show');

          // Animate skill bars if present
          const skillFills = entry.target.querySelectorAll('.skill-fill');
          skillFills.forEach((fill, i) => {
            const width = fill.dataset.width;
            if (width) {
              setTimeout(() => {
                fill.style.width = width;
              }, i * 100);
            }
          });
        }, index * 50);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ============================================================================
  // Animate visible skill bars on load
  // ============================================================================
  setTimeout(() => {
    document.querySelectorAll('.skill-fill').forEach((fill, index) => {
      const rect = fill.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isVisible) {
        setTimeout(() => {
          fill.style.width = fill.dataset.width || '0%';
        }, index * 100);
      }
    });
  }, 300);

  // ============================================================================
  // Project Modal with Bootstrap
  // ============================================================================
  const projectModalEl = document.getElementById('projectModal');

  if (projectModalEl && typeof bootstrap !== 'undefined') {
    const bsModal = new bootstrap.Modal(projectModalEl);
    const modalTitle = document.getElementById('projectModalTitle');
    const modalBody = document.getElementById('projectModalBody');

    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', function () {
        const title = this.dataset.title || 'Projet';
        const content = this.dataset.content || this.querySelector('.project-info h6')?.textContent || '';

        if (modalTitle) modalTitle.innerHTML = `<i class="lucide-folder-open me-2"></i>${title}`;
        if (modalBody) modalBody.textContent = content;

        bsModal.show();

        // Add animation class
        projectModalEl.querySelector('.modal-content').style.animation = 'slideIn 0.3s ease';
      });
    });
  }

  // ============================================================================
  // Download PDF / Print with loading state
  // ============================================================================
  const downloadBtn = document.getElementById('downloadPdfBtn');

  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      const originalContent = this.innerHTML;
      this.innerHTML = '<i class="lucide-loader me-2"></i>Préparation...';
      this.disabled = true;

      // Small delay for better UX
      setTimeout(() => {
        window.print();

        // Reset button after print dialog
        setTimeout(() => {
          this.innerHTML = originalContent;
          this.disabled = false;
        }, 500);
      }, 300);
    });
  }

  // ============================================================================
  // Smooth scroll for anchor links
  // ============================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================================================
  // Navbar scroll effect
  // ============================================================================
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
      }

      lastScroll = currentScroll;
    });
  }

  // ============================================================================
  // Parallax effect for hero section
  // ============================================================================
  const heroSection = document.querySelector('.hero-section');

  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;

      if (scrolled < 500) {
        heroSection.style.transform = `translateY(${rate}px)`;
        heroSection.style.opacity = 1 - (scrolled / 500);
      }
    });
  }

  // ============================================================================
  // Add hover effect to timeline items
  // ============================================================================
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
      this.querySelector('.timeline-marker')?.style.setProperty('transform', 'scale(1.5)');
      this.querySelector('.timeline-marker')?.style.setProperty('transition', 'transform 0.3s ease');
    });

    item.addEventListener('mouseleave', function () {
      this.querySelector('.timeline-marker')?.style.setProperty('transform', 'scale(1)');
    });
  });

  // ============================================================================
  // Animated counter for stats (if needed in future)
  // ============================================================================
  function animateCounter(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = Math.round(target);
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current);
      }
    }, 16);
  }

  // ============================================================================
  // Add typing effect to hero title (optional, can be enabled)
  // ============================================================================
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // Uncomment to enable typing effect
  // const heroTitle = document.querySelector('.hero-section h1');
  // if (heroTitle) {
  //   const originalText = heroTitle.textContent;
  //   typeWriter(heroTitle, originalText, 50);
  // }

  // ============================================================================
  // Keyboard shortcuts
  // ============================================================================
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      downloadBtn?.click();
    }

    // Ctrl/Cmd + D for dark mode toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      themeToggle?.click();
    }
  });

  // ============================================================================
  // Add loading animation on page load
  // ============================================================================
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // ============================================================================
  // Initialize Lucide icons
  // ============================================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ============================================================================
  // Easter egg: Konami code
  // ============================================================================
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 3s linear infinite';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 3000);
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // ============================================================================
  // Console message for developers
  // ============================================================================
  console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #667eea;');
  console.log('%cCe CV a été créé avec ❤️ en 2026', 'font-size: 14px; color: #764ba2;');
  console.log('%cRaccourcis clavier:', 'font-size: 12px; font-weight: bold; margin-top: 10px;');
  console.log('%c  • Ctrl/Cmd + P : Imprimer/Télécharger PDF', 'font-size: 11px;');
  console.log('%c  • Ctrl/Cmd + D : Mode sombre', 'font-size: 11px;');

})();

// ============================================================================
// Add CSS keyframes dynamically for rainbow animation
// ============================================================================
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
