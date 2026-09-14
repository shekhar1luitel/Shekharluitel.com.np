/* =========================================================
   Shekhar Luitel - Developer Portfolio JavaScript (2026)
   Interactive terminal, theme switching, clipboard, and UI
   ========================================================= */

(function () {
  'use strict';

  // 1. Theme Management
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Close on nav click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.textContent = '☰';
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.textContent = '☰';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.textContent = '☰';
      }
    });
  }

  // 3. Interactive Developer Terminal
  const terminalCard = document.querySelector('.terminal-card');
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  // Focus terminal input on card click
  if (terminalCard && terminalInput) {
    terminalCard.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('a')) {
        terminalInput.focus();
      }
    });
  }

  const commands = {
    help: () => `Available commands:
  <span class="command-highlight">bio</span>        - Learn about Shekhar Luitel
  <span class="command-highlight">skills</span>     - View technical stack & engineering specialties
  <span class="command-highlight">experience</span> - View career history & 3+ years timeline
  <span class="command-highlight">projects</span>   - Discover key production systems (Veda, Symphony, Aabhyas)
  <span class="command-highlight">aabhyas</span>    - Explore Aabhyas Nepal Exam Prep platform
  <span class="command-highlight">huddle</span>     - View the daily standup Git alias trick
  <span class="command-highlight">blog</span>       - Read latest tech articles & event reflections
  <span class="command-highlight">education</span>  - Check BCA completion & academic credentials
  <span class="command-highlight">contact</span>    - Show direct email, phone, and LinkedIn
  <span class="command-highlight">resume</span>     - Open clean printable CV / Resume (/resume/)
  <span class="command-highlight">clear</span>      - Clear terminal screen`,

    bio: () => `Shekhar Luitel · Full Stack Developer (Mid Backend - Jr. Frontend)
Experience: 3+ years in production environments (ed-tech, multi-tenant SaaS, API microservices).
Location: Biratnagar / Lalitpur, Nepal
Specialization: High-throughput PHP 8+ (Symfony, Laravel, CodeIgniter), React.js, MySQL, and resilient RESTful APIs.
Current: Shipping high-availability core mobile APIs and enterprise platforms at Veda App (वेद).`,

    skills: () => `Engineering Stack:
  ▹ Backend:  PHP 8+, Symfony, Laravel, CodeIgniter, RESTful APIs, HMVC/MVC
  ▹ Frontend: JavaScript (ES6+), React.js, Tailwind CSS, Modern CSS, Responsive UI
  ▹ Database: MySQL, Schema Normalization, Composite Indexing, Query Tuning, ACID
  ▹ Arch:     Multi-tenant ERP Architecture, Institutional Core SaaS, Audit Trails
  ▹ DevOps:   Arch Linux (Omarchy), Docker, Postman, Git (Enterprise Repos), Nginx`,

    experience: () => `Career Timeline (3+ Years Production Engineering):
  [2025–Present] Full Stack Developer @ Veda App (वेद)
                → Lead core mobile APIs + React frontend portals, high concurrency.
  [2023–2025]    Back End Developer @ Veda App (वेद)
                → Scalable REST endpoints, query optimization, enterprise services.
  [2023]         Jr. Web Developer @ Infinite IT Solutions
                → Responsive web delivery, collaborative releases, version control.`,

    projects: () => `Highlighted Production Systems:
  1. Veda App (वेद) Core & Mobile APIs (CodeIgniter / PHP / MySQL)
     → https://veda-app.com
     → High-availability backend powering hundreds of schools & colleges + 50k+ mobile users.
  2. Veda Inventory Symphony (Symfony / React / PHP / MySQL)
     → https://inventory.ingrails.com
     → Multi-tenant enterprise inventory, procurement, and institutional asset ERP.
  3. Aabhyas App — Nepal Competitive Exam Prep (Laravel / React)
     → https://aabhyas.app/
     → Focused exam preparation platform with live mock testing and percentile analytics.
  4. Tech Content & Community Creator (Sashwat UM - 600+ Subscribers)
     → Video walkthroughs, developer tutorials, and community initiatives.`,

    aabhyas: () => {
      window.open('https://aabhyas.app/', '_blank');
      return `Opening Aabhyas App (https://aabhyas.app/)... Built with Laravel & React.`;
    },

    huddle: () => `Daily Standup Git Command & Alias:
  Command:
    git log --all --no-merges --since="yesterday" --author="Shekhar" --pretty=format:"* %s"

  Set as global alias:
    git config --global alias.huddle 'log --all --no-merges --since="yesterday" --author="Shekhar" --pretty=format:"* %s"'

  Usage:
    git huddle
  → Outputs an instant clean bullet list of all yesterday's commits across all branches!
  → Read full post at /blog/why-i-use-git-huddle-command-daily-standups/`,

    blog: () => `Recent Engineering Notes & Articles:
  1. [Guide] My Experience Learning Omarchy & Arch Linux: A Productive Developer Setup
  2. [Event] Inside Atlassian Community Kathmandu: Bitbucket Evolution with AI & Rovo Dev
  3. [Event] Building AI-First Product Organizations with Hermes Agents (Om Prakash Sharma)
  4. [Story] From Intern to Full Stack Developer: 3 Years of Backend Engineering at Veda
  5. [Git]   Why I Use This Command: Supercharge Your Daily Standups with a Git Alias
  → Scroll to the #blog section to read the full articles!`,

    education: () => `Academic Credentials:
  ✓ Bachelor of Computer Applications (BCA) · Nihareeka College [Completed / Graduated]
  ✓ Diploma in Computer Hardware and Networking [2019]`,

    contact: () => `Direct Contact:
  ✉ Email:    shekharluitelofficial@gmail.com
  ☎ Phone:    +977 9846684310
  🔗 LinkedIn: https://www.linkedin.com/in/shekhar-luitel33/
  🏢 Enterprise Codebases: Maintained in private corporate repositories.`,

    resume: () => {
      window.open('/resume/', '_blank');
      return `Opening resume page (/resume/)...`;
    },

    'curl resume': () => {
      window.open('/resume/', '_blank');
      return `Opening resume page (/resume/)...`;
    },

    cv: () => {
      window.open('/resume/', '_blank');
      return `Opening resume page (/resume/)...`;
    },

    ls: () => commands.help(),
    dir: () => commands.help(),
    about: () => commands.bio(),

    clear: () => {
      if (terminalBody) {
        terminalBody.innerHTML = '';
      }
      return null;
    }
  };

  function executeTerminalCommand(rawCmd) {
    if (!terminalBody) return;
    const cleanCmd = rawCmd.trim().toLowerCase();
    
    // Create command echo line
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line';
    echoLine.innerHTML = `<span class="prompt-symbol">shekhar@portfolio:~$</span> <span class="command-highlight">${escapeHTML(cleanCmd)}</span>`;
    terminalBody.appendChild(echoLine);

    if (cleanCmd === 'clear' || cleanCmd === 'cls') {
      commands.clear();
      return;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';

    if (commands[cleanCmd]) {
      const result = commands[cleanCmd]();
      if (result) {
        outputLine.innerHTML = `<div style="white-space: pre-wrap; margin-left: 0.5rem; margin-top: 0.25rem;">${result}</div>`;
        terminalBody.appendChild(outputLine);
      }
    } else if (cleanCmd === '') {
      // Empty enter, do nothing
    } else {
      outputLine.innerHTML = `<span class="output-dim">command not found: "${escapeHTML(cleanCmd)}". Type <span class="command-highlight">help</span> for available commands.</span>`;
      terminalBody.appendChild(outputLine);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeTerminalCommand(terminalInput.value);
        terminalInput.value = '';
      }
    });
  }

  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeTerminalCommand(cmd);
      }
    });
  });

  // 4. Copy to Clipboard Functionality
  function showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast(`Copied to clipboard`);
        });
      }
    });
  });

  // 5. Tech Stack Matrix Category Filter
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      skillCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });

  // 7. Interactive Reader Reactions (No fake metrics, real local interaction)
  const reactionButtons = document.querySelectorAll('.devto-reaction-btn');
  reactionButtons.forEach(btn => {
    const slug = btn.getAttribute('data-slug');
    if (!slug) return;
    const isLiked = localStorage.getItem('article_like_' + slug) === 'true';
    if (isLiked) {
      btn.classList.add('liked');
      const label = btn.querySelector('.reaction-label');
      if (label) label.textContent = 'Liked';
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentlyLiked = btn.classList.contains('liked');
      if (currentlyLiked) {
        btn.classList.remove('liked');
        localStorage.removeItem('article_like_' + slug);
        const label = btn.querySelector('.reaction-label');
        if (label) label.textContent = 'Like';
      } else {
        btn.classList.add('liked');
        localStorage.setItem('article_like_' + slug, 'true');
        const label = btn.querySelector('.reaction-label');
        if (label) label.textContent = 'Liked';
      }
    });
  });

})();

