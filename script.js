const initPortfolio = () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backToTop = document.querySelector('.back-to-top');
  const typedText = document.querySelector('.typed-text');
  const form = document.querySelector('.contact-form');
  const revealItems = document.querySelectorAll('.reveal');
  var prefersDark = false;
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark = mq && mq.matches;
  }

  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem('portfolio-theme');
  } catch (error) {
    console.warn('Theme preference could not be loaded:', error);
  }

  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.body.classList.toggle('dark', initialTheme === 'dark');
  themeToggle?.setAttribute('aria-label', initialTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

  themeToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    try {
      localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.warn('Theme preference could not be saved:', error);
    }
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });

  menuToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => navLinks?.classList.remove('open'));
  });

  const counterNumbers = document.querySelectorAll('.counter-card .number');

  const easeOutQuad = (t) => t * (2 - t);

  const animateCounter = (element) => {
    if (!element || element.dataset.animated) return;
    const target = Number(element.dataset.count || 0);
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuad(progress);
      const value = Math.floor(eased * target);
      element.textContent = `${value}${element.dataset.suffix || ''}`;
      if (progress < 1) requestAnimationFrame(tick);
      else element.dataset.animated = 'true';
    };

    requestAnimationFrame(tick);
  };

  const animateVisibleCounters = () => {
    counterNumbers.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        animateCounter(item);
      }
    });
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('counter-card')) {
            animateCounter(entry.target.querySelector('.number'));
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    revealItems.forEach((item) => observer.observe(item));
    animateVisibleCounters();
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
    counterNumbers.forEach((item) => animateCounter(item));
  }

  const words = ['Coordinating Teams.', 'Managing Projects.', 'Delivering Results.'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    if (!typedText) return;
    const currentWord = words[wordIndex];
    typedText.textContent = currentWord.slice(0, charIndex);

    if (!deleting && charIndex < currentWord.length) {
      charIndex++;
    } else if (deleting && charIndex > 0) {
      charIndex--;
    } else if (!deleting) {
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    } else {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(typeLoop, deleting ? 50 : 110);
  };

  typeLoop();

  const handleScroll = () => {
    backToTop?.classList.toggle('show', window.scrollY > 560);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    const errors = form.querySelectorAll('.error-text');
    errors.forEach((item) => (item.textContent = ''));

    let valid = true;

    if (!name?.value.trim()) {
      name?.parentElement?.querySelector('.error-text').textContent = 'Please enter your name.';
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value.trim() || !emailPattern.test(email.value)) {
      email?.parentElement?.querySelector('.error-text').textContent = 'Please enter a valid email.';
      valid = false;
    }

    if (!message?.value.trim()) {
      message?.parentElement?.querySelector('.error-text').textContent = 'Please enter your message.';
      valid = false;
    }

    if (valid) {
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.textContent = 'Message Sent';
        button.disabled = true;
      }
      form.reset();
      setTimeout(() => {
        if (button) {
          button.textContent = 'Send Message';
          button.disabled = false;
        }
      }, 1800);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio, { once: true });
} else {
  initPortfolio();
}
