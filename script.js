/* ==========================================================
   TARUN DOBHAL - RETRO PORTFOLIO JAVASCRIPT
   Sound FX, Copy-to-clipboard, Form handler & Interactivity
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Web Audio API Retro Sound Generator (8-bit Synthesizer)
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playRetroSound(type = 'click') {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      // Crisp 8-bit blip
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      // Retro power-up chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  }

  // Sound toggle button
  const soundToggleBtn = document.getElementById('soundToggle');
  const soundStatus = document.getElementById('soundStatus');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundStatus.textContent = soundEnabled ? 'ON' : 'OFF';
      if (soundEnabled) {
        playRetroSound('success');
      }
    });
  }

  // Attach sound to all buttons and links
  document.querySelectorAll('button, a.retro-btn, a.retro-btn-sm, .nav-link').forEach(elem => {
    elem.addEventListener('click', () => {
      playRetroSound('click');
    });
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Copy to Clipboard & Toast
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    playRetroSound('success');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" 📋`);
          const originalText = btn.textContent;
          btn.textContent = 'COPIED!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 1500);
        }).catch(() => {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast(`Copied "${textToCopy}" 📋`);
        });
      }
    });
  });

  // 4. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Contact Form Handler (Opens Default Mail App)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const msg = document.getElementById('senderMsg').value;

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Tarun,\n\n${msg}\n\nFrom: ${name}\nEmail: ${email}`);
      const mailtoLink = `mailto:tarundobhal9@gmail.com?subject=${subject}&body=${body}`;

      showToast('Opening email client... 🚀');
      window.location.href = mailtoLink;
    });
  }
});
