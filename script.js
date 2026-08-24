document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar && navbar.classList.toggle('scrolled', window.scrollY > 50));
  const hamburger = document.querySelector('.hamburger'), navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) { hamburger.addEventListener('click', () => navLinks.classList.toggle('active')); document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('active'))) }
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', () => document.body.classList.toggle('light-mode'));
  const portrait = document.querySelector('.portrait');
  if (portrait) { portrait.style.backgroundImage = "url('assets/profile-photo.svg')"; portrait.style.backgroundSize = 'cover'; portrait.style.backgroundPosition = 'center'; const ph = portrait.querySelector('.portrait-placeholder'); if (ph) ph.style.display = 'none' }

  /* ── CURSOR GLOW ─────────────────────────────────────────── */
  const cursorGlow = document.getElementById('cursor-glow');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cursorGlow && !prefersReducedMotion) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const moveCursor = e => { cx = e.clientX; cy = e.clientY; };
    const animateCursor = () => {
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    };
    document.addEventListener('mousemove', moveCursor, { passive: true });
    requestAnimationFrame(animateCursor);
  }

  /* ── FLOATING PARTICLES (canvas) ─────────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const isLight = () => document.body.classList.contains('light-mode');
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const rand = (a, b) => Math.random() * (b - a) + a;
    const mkP = () => ({ x: rand(0, W), y: rand(0, H), r: rand(0.6, 1.8), vx: rand(-0.12, 0.12), vy: rand(-0.22, -0.06), alpha: rand(0.3, 0.85), dA: rand(0.003, 0.008) * (Math.random() < 0.5 ? 1 : -1) });
    for (let i = 0; i < 55; i++) particles.push(mkP());
    const drawP = () => {
      ctx.clearRect(0, 0, W, H);
      const col = isLight() ? '100,130,220' : '140,180,255';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.alpha += p.dA;
        if (p.alpha <= 0.15 || p.alpha >= 0.9) p.dA *= -1;
        if (p.y < -10) { p.y = H + 5; p.x = rand(0, W); }
        if (p.x < -10) p.x = W + 5;
        if (p.x > W + 10) p.x = -5;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${p.alpha})`; ctx.fill();
        if (p.r > 1.4) {
          ctx.strokeStyle = `rgba(${col},${p.alpha * 0.45})`; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(p.x - 4, p.y); ctx.lineTo(p.x + 4, p.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(p.x, p.y - 4); ctx.lineTo(p.x, p.y + 4); ctx.stroke();
        }
      });
      requestAnimationFrame(drawP);
    };
    drawP();
  }

  /* ── SECTION FADE-UP (IntersectionObserver) ──────────────── */
  if (!prefersReducedMotion) {
    const fadeTargets = [
      ...document.querySelectorAll('.glass-card'),
      ...document.querySelectorAll('.project-card'),
      ...document.querySelectorAll('.skill-card'),
      ...document.querySelectorAll('.timeline-item'),
      ...document.querySelectorAll('.section-title'),
    ];
    fadeTargets.forEach(el => el.classList.add('fx-fade-up'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fx-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.04 });
    fadeTargets.forEach(el => obs.observe(el));
  }

  /* ── NAV ACTIVE-LINK HIGHLIGHTER ─────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  const updateActive = () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ── CERTIFICATIONS GALLERY & LIGHTBOX ───────────────────── */
  const certsModal = document.getElementById('certsModal');
  const viewAllCertsBtn = document.getElementById('viewAllCertsBtn');
  const closeCertsModal = document.getElementById('closeCertsModal');

  const certLightbox = document.getElementById('certLightbox');
  const closeLightbox = document.getElementById('closeLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');

  if (viewAllCertsBtn && certsModal) {
    viewAllCertsBtn.addEventListener('click', () => certsModal.classList.add('open'));
  }
  if (closeCertsModal && certsModal) {
    closeCertsModal.addEventListener('click', () => certsModal.classList.remove('open'));
  }

  const setupLightboxTrigger = (trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = trigger.getAttribute('data-img');
      const title = trigger.getAttribute('data-title');
      const issuer = trigger.getAttribute('data-issuer');
      const date = trigger.getAttribute('data-date');

      if (lightboxImg) {
        // Use a generic placeholder or the actual image
        lightboxImg.src = img;
        // If image error, fallback to nothing/hide img
        lightboxImg.onerror = () => { lightboxImg.style.display = 'none'; };
        lightboxImg.onload = () => { lightboxImg.style.display = 'block'; };
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxMeta) lightboxMeta.textContent = `${issuer} · ${date}`;

      if (certLightbox) certLightbox.classList.add('open');
    });
  };

  document.querySelectorAll('.view-cert-btn').forEach(setupLightboxTrigger);
  document.querySelectorAll('.view-cert-trigger').forEach(setupLightboxTrigger);

  if (closeLightbox && certLightbox) {
    closeLightbox.addEventListener('click', () => certLightbox.classList.remove('open'));
  }

  if (certsModal) {
    certsModal.addEventListener('click', (e) => {
      if (e.target === certsModal) certsModal.classList.remove('open');
    });
  }
  if (certLightbox) {
    certLightbox.addEventListener('click', (e) => {
      if (e.target === certLightbox) certLightbox.classList.remove('open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (certsModal) certsModal.classList.remove('open');
      if (certLightbox) certLightbox.classList.remove('open');
    }
  });



  const chatToggle = document.getElementById('chatbotToggle'), chatWindow = document.getElementById('chatWindow'), chatClose = document.getElementById('chatClose'), chatForm = document.getElementById('chatForm'), chatInput = document.getElementById('chatInput'), messages = document.getElementById('chatMessages');
  const addMessage = (text, type) => { if (!messages) return; const d = document.createElement('div'); d.className = `chat-msg ${type}`; d.textContent = text; messages.appendChild(d); messages.scrollTop = messages.scrollHeight };
  if (chatToggle) { chatToggle.addEventListener('click', () => chatWindow.classList.toggle('open')); if (chatClose) chatClose.addEventListener('click', () => chatWindow.classList.remove('open')) }

  // Portfolio-only assistant. Answers are deliberately restricted to resume/portfolio facts.
  const KB = [
    { k: ['hi', 'hii', 'hello', 'hey', 'helo', 'heyy', 'yo', 'good morning', 'good afternoon', 'good evening', 'good night'], a: "Hi! 👋 I'm Prashanth's portfolio assistant. I can help with his skills, projects, experience, education, certifications, resume, or contact details. What would you like to know?" },
    { k: ['help', 'what can you do', 'what can i ask', 'what do you know', 'how can you help', 'options', 'topics'], a: "I can answer questions about Prashanth's profile, skills, projects, work experience, education, certifications, resume and contact details. I only use information available in his resume and portfolio." },
    { k: ['name', 'full name', 'his name', 'what is his name', 'whats his name', 'who is prashanth', 'who is he', 'tell me his name'], a: "His name is Prashanth Kumar Kavuri. He is a B.Tech CSE (AI/ML) student in Hyderabad with hands-on experience developing secure full-stack applications using Java, Spring Boot, React and PostgreSQL." },
    { k: ['tell me about him', 'about him', 'about prashanth', 'about prashanth kumar', 'profile', 'introduction', 'describe him', 'who is prashanth kumar kavuri', 'tell me about prashanth'], a: "Prashanth Kumar Kavuri is a B.Tech CSE (AI/ML) student in Hyderabad. His portfolio focuses on Java full-stack development, AI/ML, secure web applications, REST APIs, Spring Boot, React and PostgreSQL. He has internship experience at Infosys Springboard and projects including a Cloud Security Monitoring System and SpendSense." },
    { k: ['is it me', 'is this me', 'am i prashanth', 'is prashanth me', 'my portfolio', 'is this my portfolio'], a: "Yes. This portfolio is for Prashanth Kumar Kavuri. It contains his education, skills, projects, experience, certifications and contact details." },
    { k: ['age', 'how old', 'date of birth', 'dob', 'birthday', 'birth date'], a: "Prashanth's age or date of birth is not listed in his resume or portfolio, so I don't have that information." },
    { k: ['graduation', 'graduated', 'graduation year', 'degree', 'btech', 'b tech', 'education', 'college', 'university', 'qualification', 'academic', 'academics', 'what did he study', 'what is he studying'], a: "He is pursuing a B.Tech in Computer Science and Engineering (AI/ML), 2023–2027, at Marri Laxman Reddy Institute of Technology and Management, Hyderabad." },
    { k: ['branch', 'course', 'major', 'department', 'cse aiml', 'computer science', 'ai ml', 'aiml'], a: "His degree is B.Tech in Computer Science and Engineering (AI/ML), 2023–2027, at Marri Laxman Reddy Institute of Technology and Management." },
    { k: ['skill', 'skills', 'technical skills', 'technologies', 'tech stack', 'programming', 'what are his skills', 'what skills does he have', 'what technologies does he know', 'tools he knows'], a: "His resume lists Java, Python, SQL; Spring Boot, Spring Security, Spring Data JPA, React and REST APIs; MySQL, PostgreSQL and Redis; Docker, Git, Maven, IntelliJ IDEA and Visual Studio Code; plus DSA, OOP and Software Engineering." },
    { k: ['java', 'java skill', 'does he know java', 'spring boot', 'spring security', 'spring data jpa', 'react', 'rest api', 'rest apis'], a: "His technical stack includes Java, Spring Boot, Spring Security, Spring Data JPA, React and REST APIs." },
    { k: ['python', 'sql', 'mysql', 'postgresql', 'postgres', 'redis', 'database', 'databases'], a: "His resume lists Python and SQL, with MySQL, PostgreSQL and Redis among his database technologies." },
    { k: ['docker', 'git', 'maven', 'intellij', 'visual studio code', 'vscode', 'devops'], a: "His tools include Docker, Git, Maven, IntelliJ IDEA and Visual Studio Code." },
    { k: ['dsa', 'data structures', 'oop', 'object oriented', 'software engineering'], a: "His core skills include Data Structures and Algorithms (DSA), Object-Oriented Programming (OOP) and Software Engineering." },
    { k: ['soft skill', 'soft skills', 'problem solving', 'team', 'teamwork', 'communication', 'adaptability', 'analytical thinking'], a: "His listed soft skills are Problem Solving, Team Collaboration, Communication, Analytical Thinking and Adaptability." },
    { k: ['experience', 'work experience', 'internship', 'internships', 'infosys', 'springboard', 'exprenice', 'experiance', 'experience details', 'tell me about his experience', 'where did he work', 'where has he worked'], a: "He worked as a Java Full Stack Developer Intern at Infosys Springboard from Jun 2026 to Aug 2026. He contributed to an enterprise security platform with 6+ modules, validated 20+ REST API endpoints, and participated in Agile sprints implementing and testing 15+ features." },
    { k: ['infosys role', 'infosys internship', 'springboard internship', 'what did he do at infosys', 'what did he do in infosys'], a: "At Infosys Springboard, he worked as a Java Full Stack Developer Intern from Jun 2026 to Aug 2026, contributing to an enterprise security platform, validating 20+ REST API endpoints and implementing/testing 15+ features in Agile sprints." },
    { k: ['internship duration', 'internship dates', 'when was his internship', 'when did he intern'], a: "His listed Java Full Stack Developer internship at Infosys Springboard was from Jun 2026 to Aug 2026." },
    { k: ['project', 'projects', 'projects list', 'what projects', 'his projects', 'tell me about his projects', 'portfolio projects'], a: "His portfolio highlights two projects: a Cloud Security Monitoring System with Incident Management Assistance and SpendSense – Smart Expense Analysis Tracker." },
    { k: ['sentinel', 'security project', 'cloud security', 'incident management', 'security monitoring', 'security system', 'cloud security monitoring', 'incident response', 'vulnerability management'], a: "His Cloud Security Monitoring System with Incident Management Assistance uses Java 21, Spring Boot 3.x, React, PostgreSQL and Redis in a microservices architecture. It uses Keycloak RBAC with JWT security and monitored 2,847+ assets, 847 vulnerabilities and 23 active incidents, with 99.99% uptime and immutable audit logs for PCI DSS compliance." },
    { k: ['security project tech', 'security project technology', 'security stack', 'what technology security project'], a: "The security project uses Java 21, Spring Boot 3.x, React, PostgreSQL and Redis, with a microservices architecture and Keycloak RBAC/JWT security." },
    { k: ['security project metrics', 'how many assets', 'how many vulnerabilities', 'active incidents', 'security numbers'], a: "The project information lists 2,847+ assets, 847 vulnerabilities, 23 active incidents and 99.99% uptime, with immutable audit logs for PCI DSS compliance." },
    { k: ['spendsense', 'expense', 'expense tracker', 'finance', 'financial project', 'smart expense', 'expense analysis'], a: "SpendSense – Smart Expense Analysis Tracker is a full-stack expense analysis application built with React, Node.js, Express.js and Firebase Authentication. It includes Recharts analytics, CSV transaction import, budget tracking, PDF report generation and an AI-powered financial assistant for spending insights." },
    { k: ['spendsense tech', 'spendsense stack', 'expense project technology', 'what is spendsense built with'], a: "SpendSense uses React, Node.js, Express.js and Firebase Authentication, with Recharts analytics, CSV import, budget tracking, PDF reports and an AI-powered financial assistant." },
    { k: ['certification', 'certifications', 'nptel', 'mongodb', 'aws academy', 'pearson', 'certificates', 'credentials'], a: "Certifications listed on the resume include NPTEL Java, Pearson MePro Level 7, AWS Academy Cloud Foundations and MongoDB Associate Developer." },
    { k: ['nptel details', 'programming in java', 'java certificate'], a: "He has an NPTEL Programming in Java certification from IIT Kharagpur." },
    { k: ['aws certification', 'aws academy certification', 'cloud foundations'], a: "He has an AWS Academy Cloud Foundations certification." },
    { k: ['mongodb certification', 'associate developer', 'mongodb associate'], a: "He has a MongoDB Associate Developer certification." },
    { k: ['pearson', 'mepro', 'level 7'], a: "He has a Pearson MePro Level 7 Progressive certification." },
    { k: ['contact', 'contact details', 'email', 'email id', 'mail', 'mail id', 'phone', 'phone number', 'linkedin', 'github', 'location', 'how can i contact him', 'how to contact', 'contact him', 'reach him', 'reach prashanth'], a: "You can contact Prashanth at prashanthkavuri786@gmail.com or +91 8498085542. He is based in Hyderabad. LinkedIn: linkedin.com/in/kavuriprashanth/ · GitHub: github.com/237y1a6697." },
    { k: ['email address', 'his email', 'what is his email', 'what is his mail', 'give me his mail', 'give me his email', 'mail id please'], a: "Prashanth's email is prashanthkavuri786@gmail.com." },
    { k: ['phone number', 'mobile number', 'his phone', 'give me his phone'], a: "Prashanth's listed phone number is +91 8498085542." },
    { k: ['linkedin profile', 'linkedin url', 'linkedin link'], a: "His LinkedIn is linkedin.com/in/kavuriprashanth/." },
    { k: ['github profile', 'github link', 'github url', 'code repository'], a: "His GitHub is github.com/237y1a6697." },
    { k: ['resume', 'cv', 'download resume', 'resume details', 'cv details', 'what is in his resume'], a: "The portfolio includes a Download Resume option. I can summarize information contained in Prashanth's resume, including his education, skills, projects, experience and certifications." },
    { k: ['resume download', 'where is resume', 'resume link'], a: "Use the Download Resume button in the portfolio to open Prashanth's resume." },
    { k: ['should i hire', 'shoud i hire', 'hire him', 'hire prashanth', 'why hire', 'good candidate', 'candidate', 'should we hire', 'is he hireable', 'recommend hiring', 'why should i hire'], a: "Based on the resume and portfolio, Prashanth has hands-on Java full-stack experience with Spring Boot, React, PostgreSQL, REST APIs and security, plus AI/ML knowledge. His Infosys Springboard internship involved an enterprise security platform, 20+ REST API endpoints and 15+ features. Whether to hire him depends on the role and your evaluation process." },
    { k: ['job role', 'role', 'looking for job', 'looking for internship', 'opportunity', 'open to work'], a: "His portfolio presents him as an AI/ML Engineer and Full Stack Developer, with a focus on Java full-stack development and secure web applications." },
    { k: ['ai ml', 'artificial intelligence', 'machine learning', 'ai skills'], a: "His academic focus is Computer Science and Engineering (AI/ML), and his portfolio presents AI/ML alongside Java full-stack development." },
    { k: ['full stack', 'fullstack', 'full stack developer', 'java full stack', 'developer'], a: "His portfolio presents him as an AI/ML Engineer and Full Stack Developer, with hands-on Java, Spring Boot, React, REST API and database experience." },
    { k: ['location', 'where is he from', 'where does he live', 'city', 'hyderabad'], a: "He is based in Hyderabad, India." },
    { k: ['strengths', 'what is he good at', 'what are his strengths'], a: "His resume and portfolio show strengths in Java full-stack development, secure application development, REST APIs, databases, problem solving, teamwork and analytical thinking." },
    { k: ['why prashanth', 'why choose him', 'why choose prashanth', 'why him'], a: "His portfolio shows practical Java full-stack work, an enterprise security internship, security-focused project experience, AI/ML academic focus and certifications. A final hiring decision should still be based on the specific role and interview process." },
    { k: ['thank you', 'thanks', 'thank', 'thx'], a: "You're welcome! 👋 If you need anything about Prashanth's resume or portfolio, just ask." },
    { k: ['bye', 'goodbye', 'see you'], a: "Thanks for visiting Prashanth's portfolio! 👋" }
  ];

  const fallback = "Sorry, I can only answer questions using information available in Prashanth's resume and portfolio. Try asking about his profile, skills, projects, experience, education, certifications, resume, or contact details.";
  const typoMap = { cntact: 'contact', contactt: 'contact', graduaction: 'graduation', graduaton: 'graduation', gradution: 'graduation', exprenice: 'experience', experiance: 'experience', expereince: 'experience', expreience: 'experience', skil: 'skill', skils: 'skills', phne: 'phone', phon: 'phone', emal: 'email', mael: 'mail', cerification: 'certification', certifcation: 'certification', expreince: 'experience', eduction: 'education', educaton: 'education', experiance: 'experience', contct: 'contact' };
  const norm = s => s.toLowerCase().replace(/what's/g, 'what is').replace(/who's/g, 'who is').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const fix = s => s.split(' ').map(w => typoMap[w] || w).join(' ');

  function answer(question) {
    const s = fix(norm(question));
    if (!s) return fallback;
    let best = null, bestScore = 0;
    KB.forEach(item => item.k.forEach(key => {
      const k = fix(norm(key)); let score = 0;
      if (s === k) score = 10000 + k.length;
      else if (s.includes(k)) score = 1000 + k.length;
      else if (k.includes(s) && s.length >= 4) score = 700 + s.length;
      else { const q = new Set(s.split(' ')), w = k.split(' '), m = w.filter(x => q.has(x)).length; if (m === w.length && m > 0) score = 500 + k.length; else if (m >= Math.min(2, w.length) && w.length <= 3) score = 80 + m * 10 }
      if (score > bestScore) { bestScore = score; best = item }
    }));
    return best && bestScore >= 80 ? best.a : fallback;
  }
  const ask = q => { if (!q.trim()) return; addMessage(q, 'user'); setTimeout(() => addMessage(answer(q), 'bot'), 180) };
  if (chatForm) chatForm.addEventListener('submit', e => { e.preventDefault(); const q = chatInput.value.trim(); chatInput.value = ''; ask(q) });
  document.querySelectorAll('.chat-suggestions button').forEach(b => b.addEventListener('click', () => ask(b.dataset.q)));
});
