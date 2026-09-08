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

  // 6. Interactive Terminal Engine (tarun_profile.exe v3.0)
  const termBody = document.getElementById('terminalBody');
  const termHistory = document.getElementById('terminalHistory');
  const termInput = document.getElementById('termInput');
  const terminalChips = document.getElementById('terminalChips');
  const termClose = document.getElementById('termClose');
  const termMinimize = document.getElementById('termMinimize');
  const termMaximize = document.getElementById('termMaximize');

  if (termBody && termInput && termHistory) {
    // Focus terminal input when clicking anywhere inside terminal body
    termBody.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) {
        termInput.focus();
      }
    });

    function runTerminalCommand(rawCmd) {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;

      const entry = document.createElement('div');
      entry.className = 'terminal-entry';

      let outputHtml = '';

      if (cmd === 'whoami') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">whoami</span></p>
          <p class="terminal-output">"Tarun Dobhal — Branch Topper & Machine Learning / DSA Enthusiast"</p>
        `;
        playRetroSound('success');
      } else if (cmd === 'cat credentials.json' || cmd === 'credentials' || cmd === 'credentials.json') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">cat credentials.json</span></p>
          <div class="code-block">
            <span class="key">"academics":</span> <span class="val">"B-Tech CSE, AKTU (2023-27)"</span>,<br>
            <span class="key">"cgpa":</span> <span class="val">"9.05 / 10.00 (Branch Topper)"</span>,<br>
            <span class="key">"honor":</span> <span class="val">"Meenakshi Dixit Award (₹21,000)"</span>,<br>
            <span class="key">"experience":</span> <span class="val">"Data Science Intern @ CodeAlpha"</span>,<br>
            <span class="key">"stack":</span> <span class="val">["C++", "Python", "DSA", "ML", "Pandas", "Scikit-learn"]</span>
          </div>
        `;
        playRetroSound('success');
      } else if (cmd === './check_profiles.sh' || cmd === 'check_profiles.sh' || cmd === 'profiles' || cmd === 'links') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">./check_profiles.sh</span></p>
          <div class="terminal-quote">
            <a href="https://www.linkedin.com/in/tarun-dobhal-b89b07288" target="_blank" class="term-link">LinkedIn ↗</a> • 
            <a href="https://github.com/Tarundobhal" target="_blank" class="term-link">GitHub ↗</a> • 
            <a href="https://leetcode.com" target="_blank" class="term-link">LeetCode ↗</a>
            <span style="color:#107C41; font-weight: bold; margin-left: 6px;">[VERIFIED ✓]</span>
          </div>
        `;
        playRetroSound('success');
      } else if (cmd === 'skills') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">skills</span></p>
          <p class="terminal-output" style="color: #0369A1;">
            💻 <strong>Languages:</strong> C++, C, Python, JavaScript, SQL<br>
            🧠 <strong>CS Core:</strong> Data Structures & Algorithms, Problem Solving, OOP, Complexity Analysis<br>
            📊 <strong>Data Science:</strong> Machine Learning (KNN), Data Cleaning, Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn<br>
            🛠️ <strong>Tools:</strong> Git, GitHub, Jupyter Notebook, Google Colab, VS Code
          </p>
        `;
        playRetroSound('click');
      } else if (cmd === 'projects') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">projects</span></p>
          <p class="terminal-output" style="color: #0369A1;">
            📁 <strong>1. Iris Flower Classification</strong> — ML KNN Classifier (100% Test Accuracy)<br>
            📁 <strong>2. Unemployment Rate Analysis</strong> — Regional trends with Pandas & Seaborn<br>
            📁 <strong>3. DSA & Algorithmic Suite</strong> — Modular C++ data structure implementations<br>
            👉 <a href="#projects" class="term-link">Jump down to Project Cards ↓</a>
          </p>
        `;
        playRetroSound('click');
      } else if (cmd === 'education' || cmd === 'academics') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">education</span></p>
          <p class="terminal-output" style="color: #0369A1;">
            🎓 <strong>B.Tech in CSE (2023-27):</strong> AKTU — 9.05 / 10.00 CGPA (Branch Topper)<br>
            🎖️ <strong>Award:</strong> Meenakshi Dixit Award (₹21,000)<br>
            🏫 <strong>Class XII (2021-22):</strong> UP Board — 85.80%<br>
            🏫 <strong>Class X (2019-20):</strong> UP Board — 81.67%
          </p>
        `;
        playRetroSound('click');
      } else if (cmd === 'contact') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">contact</span></p>
          <p class="terminal-output" style="color: #0369A1;">
            📧 <strong>Email:</strong> <a href="mailto:tarundobhal9@gmail.com" class="term-link">tarundobhal9@gmail.com</a><br>
            📞 <strong>Phone:</strong> <a href="tel:+918756093267" class="term-link">+91 8756093267</a><br>
            📍 <strong>Location:</strong> Lucknow, Uttar Pradesh, India
          </p>
        `;
        playRetroSound('click');
      } else if (cmd === 'resume' || cmd === 'cv') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">resume</span></p>
          <p class="terminal-output" style="color: #0369A1;">
            📄 Opening resume: <a href="assets/Tarun_Resume.pdf" target="_blank" class="term-link">Tarun_Resume.pdf ↗</a>
          </p>
        `;
        playRetroSound('success');
      } else if (cmd === 'help') {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">help</span></p>
          <div class="code-block" style="font-size: 0.78rem;">
            <strong>Available Commands:</strong><br>
            • <span style="color: #0284C7; font-weight: bold;">whoami</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: View identity & core bio<br>
            • <span style="color: #0284C7; font-weight: bold;">cat credentials.json</span> &nbsp;: View branch topper credentials & stack<br>
            • <span style="color: #0284C7; font-weight: bold;">./check_profiles.sh</span> &nbsp;&nbsp;: View verified LinkedIn, GitHub & LeetCode<br>
            • <span style="color: #0284C7; font-weight: bold;">skills</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Display technical skills & tools<br>
            • <span style="color: #0284C7; font-weight: bold;">projects</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: List featured projects<br>
            • <span style="color: #0284C7; font-weight: bold;">education</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Display academic qualifications<br>
            • <span style="color: #0284C7; font-weight: bold;">contact</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Show phone, email & location<br>
            • <span style="color: #0284C7; font-weight: bold;">resume</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Download / View resume PDF<br>
            • <span style="color: #0284C7; font-weight: bold;">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Clear the terminal window
          </div>
        `;
        playRetroSound('click');
      } else if (cmd === 'clear' || cmd === 'cls') {
        termHistory.innerHTML = '';
        termInput.value = '';
        playRetroSound('click');
        return;
      } else {
        outputHtml = `
          <p class="terminal-line"><span class="prompt">$</span> <span class="cmd">${rawCmd}</span></p>
          <p class="terminal-output" style="color: #DC2626;">
            zsh: command not found: "${rawCmd}". Type <span style="text-decoration: underline; cursor: pointer;" onclick="document.getElementById('termInput').value='help'; document.getElementById('termInput').dispatchEvent(new KeyboardEvent('keydown', {'key':'Enter'}));">'help'</span> for list of commands.
          </p>
        `;
        playRetroSound('click');
      }

      entry.innerHTML = outputHtml;
      termHistory.appendChild(entry);
      termInput.value = '';
      termBody.scrollTop = termBody.scrollHeight;
    }

    // Enter key handler
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runTerminalCommand(termInput.value);
      }
    });

    // Quick Command Chips click handler
    document.querySelectorAll('.term-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          termInput.value = cmd;
          runTerminalCommand(cmd);
          termInput.focus();
        }
      });
    });

    // Window control buttons
    if (termClose) {
      termClose.addEventListener('click', () => {
        termHistory.innerHTML = `
          <div class="terminal-entry">
            <p class="terminal-output" style="color: #16A34A;">● Terminal session cleared. Type 'help' or click a quick command below to begin.</p>
          </div>
        `;
        playRetroSound('click');
      });
    }

    if (termMinimize && terminalChips) {
      termMinimize.addEventListener('click', () => {
        terminalChips.style.display = (terminalChips.style.display === 'none') ? 'flex' : 'none';
        playRetroSound('click');
      });
    }

    if (termMaximize) {
      termMaximize.addEventListener('click', () => {
        runTerminalCommand('help');
      });
    }
  }
});
