/* ============================================================
   ALYCE ALEXANDER — Portfolio Interactions v2.0
   Custom cursor · Loader · Parallax · Counter · Lightbox
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PAGE LOADER ---------- */
  const loader = document.getElementById('loader');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 2000);
  });

  // Fallback: hide loader after 4s max
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
  }, 4000);

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Cursor follows instantly
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      // Follower trails behind
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .photography__item, .works__card, .editors__card, .resume__skill-tag');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        follower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        follower.classList.remove('hovering');
      });
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const reveals = document.querySelectorAll('.reveal, .reveal-slide');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ---------- STICKY NAV ---------- */
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          }
        }

        requestAnimationFrame(updateCount);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---------- WORKS CAROUSEL ---------- */
  const track = document.querySelector('.works__track');
  const prevBtn = document.querySelector('.works__carousel-btn--prev');
  const nextBtn = document.querySelector('.works__carousel-btn--next');
  const progressBar = document.getElementById('carouselProgress');

  if (track && prevBtn && nextBtn) {
    let scrollPos = 0;
    const cardWidth = 340 + 28; // card + gap

    function updateProgress() {
      const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
      const percent = maxScroll > 0 ? (scrollPos / maxScroll) * 100 : 0;
      if (progressBar) {
        progressBar.style.width = Math.max(15, percent) + '%';
      }
    }

    nextBtn.addEventListener('click', () => {
      const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
      scrollPos = Math.min(scrollPos + cardWidth, maxScroll);
      track.style.transform = `translateX(-${scrollPos}px)`;
      updateProgress();
    });

    prevBtn.addEventListener('click', () => {
      scrollPos = Math.max(scrollPos - cardWidth, 0);
      track.style.transform = `translateX(-${scrollPos}px)`;
      updateProgress();
    });

    // Drag to scroll
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX;
      startScroll = scrollPos;
      track.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const diff = startX - e.pageX;
      const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
      scrollPos = Math.max(0, Math.min(startScroll + diff, maxScroll));
      track.style.transform = `translateX(-${scrollPos}px)`;
      updateProgress();
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        track.style.transition = '';
      }
    });

    // Touch support
    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX;
      startScroll = scrollPos;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diff = startX - e.touches[0].pageX;
      const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
      scrollPos = Math.max(0, Math.min(startScroll + diff, maxScroll));
      track.style.transform = `translateX(-${scrollPos}px)`;
      updateProgress();
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isDragging = false;
      track.style.transition = '';
    });

    updateProgress();
  }

  /* ---------- PHOTOGRAPHY LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__prev');
  const lightboxNext = document.querySelector('.lightbox__next');
  const photoItems = document.querySelectorAll('.photography__item');
  let currentPhoto = 0;

  function getPhotoSrc(index) {
    const img = photoItems[index]?.querySelector('img');
    return img ? img.src.replace('w=600', 'w=1400') : '';
  }

  function getPhotoAlt(index) {
    const img = photoItems[index]?.querySelector('img');
    return img ? img.alt : '';
  }

  function showPhoto(index) {
    currentPhoto = index;
    if (lightboxImg) {
      lightboxImg.src = getPhotoSrc(index);
      lightboxImg.alt = getPhotoAlt(index);
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} / ${photoItems.length}`;
    }
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  photoItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
    showPhoto((currentPhoto - 1 + photoItems.length) % photoItems.length);
  });

  if (lightboxNext) lightboxNext.addEventListener('click', () => {
    showPhoto((currentPhoto + 1) % photoItems.length);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ---------- EDITOR'S CHOICE — Spotlight Reveal ---------- */
  const spotlight = document.getElementById('editorsSpotlight');
  const flashCards = document.querySelectorAll('.flash-reveal');

  if (flashCards.length && spotlight) {
    let spotlightTriggered = false;
    let spotlightIndex = 0;
    let spotlightInterval = null;

    function moveSpotlight(card) {
      const stage = card.closest('.editors__stage');
      const stageRect = stage.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      // Position spotlight centered on the card, relative to stage
      const x = (cardRect.left - stageRect.left) + cardRect.width / 2;
      const y = (cardRect.top - stageRect.top) + cardRect.height / 2;

      spotlight.style.left = x + 'px';
      spotlight.style.top = y + 'px';
    }

    function spotlightCard(index) {
      // Remove spotlit from all cards
      flashCards.forEach(c => c.classList.remove('spotlit'));

      // Add to current
      const card = flashCards[index];
      if (!card) return;

      card.classList.add('flashed');
      card.classList.add('spotlit');
      moveSpotlight(card);
    }

    function runSpotlightSequence() {
      // Reset all cards to dim state
      flashCards.forEach(c => {
        c.classList.add('flashed');
        c.classList.remove('spotlit', 'all-lit');
      });

      // Activate spotlight
      spotlight.classList.add('active');

      // Spotlight each card in sequence
      spotlightIndex = 0;
      spotlightCard(0);

      spotlightInterval = setInterval(() => {
        spotlightIndex++;
        if (spotlightIndex < flashCards.length) {
          spotlightCard(spotlightIndex);
        } else {
          // All cards lit briefly, then restart
          clearInterval(spotlightInterval);
          setTimeout(() => {
            flashCards.forEach(c => {
              c.classList.remove('spotlit');
              c.classList.add('all-lit');
            });
            spotlight.classList.remove('active');

            // Pause with all lit, then loop
            setTimeout(runSpotlightSequence, 2000);
          }, 1000);
        }
      }, 1400);
    }

    const spotlightObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !spotlightTriggered) {
          spotlightTriggered = true;
          spotlightObserver.disconnect();
          // Small delay so user sees the dark stage first
          setTimeout(runSpotlightSequence, 400);
        }
      });
    }, { threshold: 0.25 });

    const editorsSection = document.getElementById('editors');
    if (editorsSection) spotlightObserver.observe(editorsSection);
  }

  /* ---------- PARALLAX on HERO IMAGE ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (parallaxEls.length && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax'));
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  /* ---------- SMOOTH SCROLL for nav links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

});
