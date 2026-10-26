(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const storedTheme = localStorage.getItem('nabiel-theme');
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (preferredDark ? 'dark' : 'light');

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem('nabiel-theme', theme);
    const dark = theme === 'dark';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.innerHTML = `<i data-lucide="${dark ? 'sun' : 'moon'}"></i>`;
    themeMeta?.setAttribute('content', dark ? '#121212' : '#eae6df');
    window.lucide?.createIcons();
  };

  setTheme(initialTheme);
  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
    window.lucide?.createIcons();
  });

  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      window.lucide?.createIcons();
    }
  }));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  document.querySelectorAll('[data-reveal]').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-links a')];
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => activeObserver.observe(section));

  const onScroll = () => document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 15);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.lucide?.createIcons();
})();
