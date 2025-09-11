// Interactions: nav toggle, reveal on scroll, tilt pointer effect, modal case viewer, set year.
// Accessible keyboard support for modal and project cards.

document.addEventListener('DOMContentLoaded', () => {
  // year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('show');
    });
  }

  // smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.classList.remove('show');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(r => revealObs.observe(r));

  // tilt effect for project cards (pointer-based)
  const tilts = document.querySelectorAll('.tilt');
  tilts.forEach(el => {
    el.addEventListener('pointermove', tiltPointer);
    el.addEventListener('pointerleave', tiltReset);
    el.addEventListener('focus', () => el.classList.add('tilt-focus'));
    el.addEventListener('blur', () => tiltReset.call(el));
  });

  function tiltPointer(e){
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * 12; // rotateX
    const ry = (px - 0.5) * -12; // rotateY
    el.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  }

  function tiltReset(){
    this.style.transform = '';
  }

  // Modal logic for case studies
  const modal = document.getElementById('caseModal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalSub = document.getElementById('modal-sub');
  const modalDesc = document.getElementById('modal-desc');
  const modalBullets = document.getElementById('modal-bullets');
  const modalMeta = document.getElementById('modal-meta');

  const caseData = {
    1: {
      title: '“DON’T CLICK” — Phishing Awareness Campaign',
      sub: 'Phishing awareness — outreach & simulation.',
      img: 'assets/project1.jpg',
      desc: `<p>Led planning and delivery as Disciplinary Officer for a campus-wide phishing-awareness program. Focused on practical behaviour changes through short demos, simulated phishing, and interactive labs.</p>`,
      bullets: [
        'Designed modular lessons and an easy-to-run simulated phishing exercise.',
        'Delivered sessions to 200+ students & teachers; collected feedback and improved subsequent sessions.',
        'Packaged materials for reuse by future teams, enabling scale.'
      ],
      meta: 'Workshop • Awareness • Social engineering'
    },
    2: {
      title: 'ICU Cybersecurity Workshop Series',
      sub: 'Hands-on network defense labs and mentoring.',
      img: 'assets/project2.jpg',
      desc: `<p>Co-organized a three-session workshop series covering network defense fundamentals and vulnerability remediation. Facilitated hands-on labs using Kali Linux and guided attendees through vulnerability discovery and remediation steps.</p>`,
      bullets: [
        'Planned curriculum and lab environments for reproducible exercises.',
        'Trained 30+ learners on scanning, analysis, and remediation.',
        'Produced documentation and debriefs for each lab session.'
      ],
      meta: 'Kali Linux • Network Defense • Labs'
    },
    3: {
      title: 'Internship — Zambian Cyber Security Initiative Foundation',
      sub: 'Security operations support and program assistance.',
      img: 'assets/project3.jpg',
      desc: `<p>Supported foundation activities including event operations, research, and assisted analysts on small triage tasks. Gained exposure to security program delivery and practitioner workflows.</p>`,
      bullets: [
        'Assisted on event operations and security engagements.',
        'Drafted materials and assisted in triage and documentation.',
        'Shadowed analysts on practical security operations.'
      ],
      meta: 'Internship • Security Operations'
    }
  };

  // open modal
  document.querySelectorAll('.view-case').forEach(btn => {
    btn.addEventListener('click', () => openCase(btn.dataset.id));
  });
  // allow clicking whole card too
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // ensure click on button doesn't double-run
      if (e.target.closest('button')) return;
      const id = card.getAttribute('data-project');
      openCase(id);
    });
  });

  function openCase(id){
    const data = caseData[id];
    if (!data) return;
    modalImg.style.backgroundImage = `url('${data.img}')`;
    modalTitle.textContent = data.title;
    modalSub.textContent = data.sub;
    modalDesc.innerHTML = data.desc;
    modalBullets.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join('');
    modalMeta.textContent = data.meta;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    // trap focus
    document.body.style.overflow = 'hidden';
    // set focus to close button for accessibility
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  // close modal
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

});
