/* =====================================================
   TRAVEL ON WINGS — MAIN.JS v2.0
   ===================================================== */

// ===== NAVBAR SCROLL =====
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNav() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      // Only remove 'scrolled' on homepage where nav starts transparent
      if (document.querySelector('.hero')) {
        navbar.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run once on load
})();

// ===== MOBILE HAMBURGER =====
(function () {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.querySelector('.nav-links');
  var mobileBreakpoint = window.matchMedia('(max-width: 1024px)');
  if (!hamburger || !navLinks) return;

  function setNavState(isOpen) {
    document.body.classList.toggle('nav-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navLinks.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  function closeNav() {
    setNavState(false);
  }

  function toggleNav() {
    setNavState(!document.body.classList.contains('nav-open'));
  }

  setNavState(false);

  hamburger.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleNav();
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      closeNav();

      // Force reliable navigation on mobile after the drawer closes.
      if (mobileBreakpoint.matches && href && href !== '#') {
        e.preventDefault();
        window.setTimeout(function () {
          window.location.href = href;
        }, 120);
      }
    });
  });

  // Close when the mobile CTA is tapped
  document.querySelectorAll('.btn-nav').forEach(function (button) {
    button.addEventListener('click', function (e) {
      var href = button.getAttribute('href');
      closeNav();

      if (mobileBreakpoint.matches && href && href !== '#') {
        e.preventDefault();
        window.setTimeout(function () {
          window.location.href = href;
        }, 120);
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
      hamburger.focus();
    }
  });

  // Close when tapping outside the drawer
  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('nav-open')) return;

    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeNav();
    }
  });

  function handleViewportChange(e) {
    if (!e.matches) {
      closeNav();
    }
  }

  if (typeof mobileBreakpoint.addEventListener === 'function') {
    mobileBreakpoint.addEventListener('change', handleViewportChange);
  } else if (typeof mobileBreakpoint.addListener === 'function') {
    mobileBreakpoint.addListener(handleViewportChange);
  }

  // Inject Logo and Button into Mobile Drawer
  (function injectMobileElements() {
    var logo = document.querySelector('.nav-inner .logo');
    var btn  = document.querySelector('.nav-inner .btn-nav');
    if (!logo || !btn || !navLinks) return;

    // Clone Logo
    var logoClone = logo.cloneNode(true);
    logoClone.classList.add('mobile-nav-logo');
    navLinks.prepend(logoClone);

    // Clone Button
    var btnClone = btn.cloneNode(true);
    btnClone.classList.add('mobile-nav-btn');
    btnClone.removeAttribute('id'); // Fix ID collision
    navLinks.appendChild(btnClone);

    // Add click event for the cloned button to close nav
    btnClone.addEventListener('click', function() {
      closeNav();
    });
  })();
})();

// ===== SCROLL REVEAL (Intersection Observer) =====
(function () {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just make all fade-up elements visible
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(function (el) {
    revealObserver.observe(el);
  });
})();

// ===== QUOTE POPUP =====
document.addEventListener('DOMContentLoaded', function () {
  var openBtn   = document.getElementById('openQuote');
  var popup     = document.getElementById('quotePopup');
  var closeBtn  = document.getElementById('closePopupBtn');
  var overlay   = document.getElementById('closePopup');
  var mobileNavBreakpoint = window.matchMedia('(max-width: 1024px)');

  function openPopup() {
    if (!popup) return;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove('active');
    document.body.style.overflow = '';
    if (openBtn) openBtn.focus();
  }

  if (openBtn)  openBtn.addEventListener('click',  function (e) {
    if (mobileNavBreakpoint.matches) {
      return;
    }

    e.preventDefault();
    openPopup();
  });
  if (closeBtn) closeBtn.addEventListener('click',  closePopup);
  if (overlay)  overlay.addEventListener('click',   closePopup);

  // Close popup on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup && popup.classList.contains('active')) {
      closePopup();
    }
  });
});

// ===== FAQ ACCORDION =====
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      var faqItem = this.parentElement;
      var answer  = faqItem.querySelector('.faq-answer');
      var icon    = this.querySelector('.faq-icon');
      var isOpen  = faqItem.classList.contains('active');

      // Close all open items
      document.querySelectorAll('.faq-item').forEach(function (item) {
        item.classList.remove('active');
        var a = item.querySelector('.faq-answer');
        var ic = item.querySelector('.faq-icon');
        if (a)  { a.style.display = 'none'; }
        if (ic) { ic.textContent = '+'; }
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open current if it was closed
      if (!isOpen) {
        faqItem.classList.add('active');
        if (answer) { answer.style.display = 'block'; }
        if (icon)   { icon.textContent = '−'; }
        this.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support for FAQ
    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
});

// ===== SEARCH BAR — redirect to contact with destination =====
document.addEventListener('DOMContentLoaded', function () {
  var btnSearch = document.querySelector('.btn-search');
  if (btnSearch) {
    btnSearch.addEventListener('click', function (e) {
      var dest = document.getElementById('sb-destination');
      if (dest && dest.value.trim()) {
        e.preventDefault();
        window.location.href = 'contact.html?destination=' + encodeURIComponent(dest.value.trim());
      }
    });
  }
});

// ===== WHATSAPP FLOATING BUTTON =====
(function() {
  var waBtn = document.getElementById("wa-button");
  var waBox = document.getElementById("wa-box");
  var waClose = document.getElementById("wa-close");

  if (waBtn && waBox) {
    waBtn.addEventListener("click", function() {
      waBox.style.display = "block";
    });

    if (waClose) {
      waClose.addEventListener("click", function() {
        waBox.style.display = "none";
      });
    }

    // Close on escape
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && waBox.style.display === "block") {
        waBox.style.display = "none";
      }
    });

    // Close when clicking outside
    document.addEventListener("click", function(e) {
      if (waBox.style.display === "block" && !waBox.contains(e.target) && !waBtn.contains(e.target)) {
        waBox.style.display = "none";
      }
    });
  }
})();

