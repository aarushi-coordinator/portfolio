const initPortfolio = () => {
  const themeToggleButton = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backToTop = document.querySelector('.back-to-top');
  const typedText = document.querySelector('.typed-text');
  const form = document.querySelector('.contact-form');
  const revealItems = document.querySelectorAll('.reveal');

  const getSystemPrefersDark = () => {
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('portfolio-theme');
  } catch (error) {
    console.warn('Theme preference could not be loaded:', error);
  }

  const currentTheme = savedTheme || (getSystemPrefersDark() ? 'dark' : 'light');

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark', isDark);
    if (themeToggleButton) {
      themeToggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggleButton.textContent = isDark ? '☀️' : '🌙';
    }
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (error) {
      console.warn('Theme preference could not be saved:', error);
    }
  };

  applyTheme(currentTheme);

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  menuToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => navLinks?.classList.remove('open'));
  });

  const counterNumbers = Array.from(document.querySelectorAll('.achievements .number[data-count]'));

  const easeOutQuad = (t) => t * (2 - t);

  const animateCounters = () => {
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuad(progress);

      counterNumbers.forEach((element) => {
        const target = Number(element.dataset.count || 0);
        const value = Math.floor(eased * target);
        element.textContent = `${value}${element.dataset.suffix || ''}`;
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counterNumbers.forEach((element) => {
          const target = Number(element.dataset.count || 0);
          element.textContent = `${target}${element.dataset.suffix || ''}`;
        });
      }
    };

    requestAnimationFrame(tick);
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    revealItems.forEach((item) => observer.observe(item));
    setTimeout(animateCounters, 150);
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
    animateCounters();
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
