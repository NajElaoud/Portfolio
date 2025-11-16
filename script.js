// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// Helper to close mobile menu in a safe, backwards-compatible way
function closeMobileMenu() {
  if (navToggle) {
    navToggle.checked = false;
  }
  if (hamburger) {
    hamburger.classList.remove('active');
  }
  if (navMenu) {
    navMenu.classList.remove('active');
  }
}

// If the new checkbox toggle exists, use it to open/close the menu
if (navToggle) {
  navToggle.setAttribute('aria-label', 'Toggle navigation');
  // ensure aria-expanded reflects the initial checked state
  navToggle.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');

  navToggle.addEventListener('change', () => {
    if (navToggle.checked) {
      navMenu.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
    } else {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
} else if (hamburger) {
  // fallback for older markup
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    if (navMenu) navMenu.classList.toggle("active");
  });
}

const sections = document.querySelectorAll("section");
const observerOptions = {
  threshold: 0.5, // Increased threshold for more precise detection
  rootMargin: "-20% 0px -20% 0px", // Adjusted margins to reduce sensitivity
};

// Add flag to prevent observer updates during programmatic scrolling
let isScrolling = false;
let scrollTimeout;

const sectionObserver = new IntersectionObserver((entries) => {
  // Only update active nav if NOT programmatic scrolling
  if (isScrolling) return;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Update nav links
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.classList.add("active");
        }
      });

      // Update page indicator (if present)
      try {
        const indicator = document.getElementById('pageIndicator');
        if (indicator) {
          const secs = Array.from(sections);
          const idx = secs.indexOf(entry.target);
          const dots = indicator.querySelectorAll('.dot');
          dots.forEach(d => d.classList.remove('active'));
          if (dots[idx]) dots[idx].classList.add('active');
        }
      } catch (err) {
        // ignore if indicator not ready
      }
    }
  });
}, observerOptions);

// Build page indicator UI and wire interactions
function buildPageIndicator() {
  const container = document.getElementById('pageIndicator');
  if (!container) return;
  container.innerHTML = '';
  const secs = Array.from(sections);
  secs.forEach((sec, i) => {
    const titleEl = sec.querySelector('.section-title');
    let label = sec.id || `Section ${i+1}`;
    if (titleEl) {
      // get a short text from title (strip tags)
      label = titleEl.textContent.trim().replace(/\s+/g, ' ').slice(0, 30);
    }

    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.setAttribute('data-index', i);
    dot.setAttribute('data-label', label);
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Go to ${label}`);

    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const top = sec.offsetTop - navbarHeight - 18;
      isScrolling = true;
      window.scrollTo({ top, behavior: 'smooth' });
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { isScrolling = false; }, 900);
    });

    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dot.click();
      }
    });

    container.appendChild(dot);
  });

  // mark the first dot active initially
  const firstDot = container.querySelector('.dot');
  if (firstDot) firstDot.classList.add('active');
}

// Observe sections and build the indicator
sections.forEach((section) => {
  sectionObserver.observe(section);
});

// Build after a short delay to ensure DOM is ready
window.addEventListener('load', () => {
  setTimeout(buildPageIndicator, 100);
});

// Add smooth scroll behavior to nav links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      // Set flag to prevent observer from updating during scroll
      isScrolling = true;

      // Update active state immediately
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Calculate offset for fixed navbar
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = targetSection.offsetTop - navbarHeight - 20;

      // Scroll to target
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Reset flag after scroll completes
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 1000); // Increased timeout to ensure scroll completes
    }

    // Close mobile menu
    closeMobileMenu();
  });
});

// Skill Progress Animation
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll(".skill-progress");
        progressBars.forEach((bar) => {
          const progress = bar.getAttribute("data-progress");
          bar.style.width = `${progress}%`;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const skillsSection = document.querySelector(".skills");
if (skillsSection) {
  skillObserver.observe(skillsSection);
}

// Skill Box Toggle (Click to Expand/Collapse)
const skillBoxes = document.querySelectorAll(".skill-box");
skillBoxes.forEach((box) => {
  const header = box.querySelector(".skill-box-header");
  if (header) {
    header.addEventListener("click", (e) => {
      e.stopPropagation();
      // Toggle active class on the clicked box
      box.classList.toggle("active");

      // Optional: Close other boxes when one is opened
      skillBoxes.forEach((otherBox) => {
        if (otherBox !== box) {
          otherBox.classList.remove("active");
        }
      });
    });
  }
});

// Form Handling
(function () {
  emailjs.init(EMAIL_CONFIG.publicKey);
})();

// Form Handling with EmailJS
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    // Send email using EmailJS
    emailjs
      .send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, {
        from_name: name,
        from_email: email,
        message: message,
        to_name: "Najd Elaoud",
      })
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);

        // Show success message
        const terminalBody = document.querySelector(".terminal-body");
        terminalBody.innerHTML = `
        <div style="color: var(--primary-color); font-family: 'Courier New', monospace; padding: 2rem; text-align: center;">
          <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
          <p style="font-size: 1.2rem; margin-bottom: 1rem;">$ Message sent successfully!</p>
          <p style="color: var(--text-secondary);">[ OK ] Email delivered to najdelaoud4@gmail.com</p>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">Thank you for reaching out. I'll get back to you soon.</p>
          <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 2rem;">
            <i class="fas fa-redo"></i> Send Another Message
          </button>
        </div>
      `;
      })
      .catch((error) => {
        console.error("FAILED...", error);

        // Show error message
        const terminalBody = document.querySelector(".terminal-body");
        terminalBody.innerHTML = `
        <div style="color: #ff6b6b; font-family: 'Courier New', monospace; padding: 2rem; text-align: center;">
          <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
          <p style="font-size: 1.2rem; margin-bottom: 1rem;">$ Error sending message!</p>
          <p style="color: var(--text-secondary);">[ ERROR ] Failed to send email</p>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">Please try again or contact me directly at najdelaoud4@gmail.com</p>
          <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 2rem;">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
      `;

        // Restore button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      });
  });
}

// Scroll Reveal Animation
const revealElements = document.querySelectorAll(
  ".about-box, .skill-box, .project-item, .timeline-item, .organization-card"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach((element) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(30px)";
  element.style.transition = "opacity 0.6s, transform 0.6s";
  revealObserver.observe(element);
});

// Enhanced Parallax & Scroll Effects (only on larger screens)
if (window.innerWidth > 768) {
  let lastScrollY = 0;
  
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    lastScrollY = scrolled;
    
    // Hero parallax
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // Animated circuit board parallax
    const circuitBoard = document.querySelector(".circuit-board");
    if (circuitBoard) {
      circuitBoard.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 + scrolled * 0.0001})`;
    }

    // GitHub stats fade in on scroll
    const githubStats = document.getElementById("githubStats");
    if (githubStats) {
      const rect = githubStats.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8;
      if (isVisible) {
        githubStats.style.opacity = "1";
        githubStats.style.transform = "translateY(0)";
      }
    }
  }, { passive: true });
}

// Rotating Subtitle Keywords
const subtitleKeywords = [
  "Embedded Systems Engineer",
  "Robotics Developer",
  "IoT Specialist",
  "Firmware Engineer",
  "Electronics Enthusiast",
  "Automotive Systems Dev"
];

let currentKeywordIndex = 0;

function rotateSubtitle() {
  const subtitleElement = document.getElementById("rotatingSubtitle");
  if (!subtitleElement) return;

  currentKeywordIndex = (currentKeywordIndex + 1) % subtitleKeywords.length;
  const newText = subtitleKeywords[currentKeywordIndex];

  // Fade out, change text, fade in
  subtitleElement.style.opacity = "0.3";
  setTimeout(() => {
    subtitleElement.textContent = newText;
    typeWriter(subtitleElement, newText, 30);
    subtitleElement.style.opacity = "1";
  }, 300);
}

// Rotate every 5 seconds after initial typing
window.addEventListener("load", () => {
  setTimeout(() => {
    setInterval(rotateSubtitle, 5000);
  }, 4000);
});

// Typing Effect for Hero Section
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = "";
  element.style.opacity = "1";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing effect on page load
window.addEventListener("load", () => {
  const subtitle = document.querySelector(".subtitle");
  if (subtitle) {
    const originalText = subtitle.textContent;
    typeWriter(subtitle, originalText, 50);
  }
});

// Fetch and display GitHub stats
async function fetchGitHubStats() {
  try {
    // Fetch user data
    const userResponse = await fetch("https://api.github.com/users/NajElaoud");
    const userData = await userResponse.json();

    // Update follower count
    const followerCount = document.getElementById("followerCount");
    if (followerCount) {
      followerCount.textContent = userData.followers;
      followerCount.parentElement.style.opacity = "1";
    }

    // Fetch repositories
    const reposResponse = await fetch("https://api.github.com/users/NajElaoud/repos?per_page=100");
    const repos = await reposResponse.json();

    // Update repo count
    const repoCount = document.getElementById("repoCount");
    if (repoCount) {
      repoCount.textContent = repos.length;
      repoCount.parentElement.style.opacity = "1";
    }

    // Calculate total stars
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const starCount = document.getElementById("starCount");
    if (starCount) {
      starCount.textContent = totalStars;
      starCount.parentElement.style.opacity = "1";
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    // Fallback values if API fails
    const stats = document.querySelectorAll(".stat-value");
    stats.forEach(stat => {
      if (stat.id === "repoCount") stat.textContent = "?";
      if (stat.id === "starCount") stat.textContent = "?";
      if (stat.id === "followerCount") stat.textContent = "?";
    });
  }
}

// Initialize GitHub stats on page load
window.addEventListener("load", () => {
  setTimeout(fetchGitHubStats, 1000);
});

// Add dynamic background particles (only on larger screens)
function createParticles() {
  if (window.innerWidth <= 768) return; // Skip on mobile

  const hero = document.querySelector(".hero");
  if (!hero) return;

  const particlesContainer = document.createElement("div");
  particlesContainer.style.position = "absolute";
  particlesContainer.style.top = "0";
  particlesContainer.style.left = "0";
  particlesContainer.style.width = "100%";
  particlesContainer.style.height = "100%";
  particlesContainer.style.overflow = "hidden";
  particlesContainer.style.pointerEvents = "none";

  const particleCount = window.innerWidth > 1200 ? 20 : 10;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = "2px";
    particle.style.height = "2px";
    particle.style.background = "var(--primary-color)";
    particle.style.borderRadius = "50%";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animation = `float ${
      5 + Math.random() * 10
    }s infinite ease-in-out`;
    particle.style.opacity = Math.random();
    particlesContainer.appendChild(particle);
  }

  hero.insertBefore(particlesContainer, hero.firstChild);
}

// Add CSS animation for particles
const style = document.createElement("style");
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(50px, -50px);
        }
        50% {
            transform: translate(-30px, 50px);
        }
        75% {
            transform: translate(30px, 30px);
        }
    }
`;
document.head.appendChild(style);

// Initialize particles
createParticles();

// Scroll to Top Button Functionality
const backToTopBtn = document.querySelector(".back-to-top");
if (backToTopBtn) {
  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  // Scroll to top on click
  backToTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Add hover effect to organization cards
const organizationCards = document.querySelectorAll(".organization-card");

organizationCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Add counter animation for skills
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start) + "%";
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Cursor Trail Effect (only on desktop)
let cursorTrail = [];
const trailLength = 10;

if (window.innerWidth > 968) {
  document.addEventListener("mousemove", (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY });
    if (cursorTrail.length > trailLength) {
      cursorTrail.shift();
    }
  });
}

// Responsive handling for window resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Refresh particles on resize if needed
    const existingParticles = document.querySelector(".hero > div");
    if (existingParticles && existingParticles.style.pointerEvents === "none") {
      existingParticles.remove();
      createParticles();
    }

    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }, 250);
});

// Console Easter Egg
console.log(
  "%c najd@portfolio:~$ ./welcome.sh ",
  "background: #00ff88; color: #0a0e27; font-size: 20px; font-weight: bold; padding: 10px; font-family: monospace;"
);
console.log(
  "%c Looking for something? Try: showSecretMessage() ",
  "color: #00ff88; font-size: 14px; font-family: monospace;"
);

window.showSecretMessage = function () {
  console.log(`
╔═══════════════════════════════════════════╗
║  najd@portfolio:~$ cat secret.txt         ║
║                                           ║
║  Thanks for checking the console!         ║
║  Feel free to reach out if you            ║
║  want to collaborate on embedded          ║
║  systems projects! 🚀                     ║
║                                           ║
║  while(1) { coffee++; bugs--; }           ║
║                                           ║
╚═══════════════════════════════════════════╝
    `);
};

// Prevent right-click context menu (optional - for portfolio protection)
// Uncomment if you want to disable right-click
/*
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
*/

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s";
    document.body.style.opacity = "1";
  }, 100);
});

// GitHub Stats Animation (if you want to add live stats)
async function fetchGitHubStats() {
  try {
    // Replace with your GitHub username
    const username = "NajElaoud";
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    // You can use this data to display stats on your page
    console.log("GitHub Stats:", {
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
    });
  } catch (error) {
    console.log("Could not fetch GitHub stats:", error);
  }
}

// Uncomment to fetch GitHub stats on page load
fetchGitHubStats();

// Add keyboard shortcuts (desktop only but register reliably)
function setupKeyboardShortcuts() {
  // Helper function to scroll to section and update navbar
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Set scrolling flag
    isScrolling = true;

    // Update active nav link
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.classList.add("active");
      }
    });

    // Calculate position
    const navbarHeight = document.querySelector(".navbar").offsetHeight;
    const targetPosition = section.offsetTop - navbarHeight - 20;

    // Scroll
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Reset scrolling flag
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }

  // Keydown listener: always registered, but ignored on small screens and while typing
  document.addEventListener('keydown', (e) => {
    // Ignore on small screens
    if (window.innerWidth <= 768) return;

    // Ignore when typing in inputs, textareas or contenteditable elements
    const target = e.target || {};
    const tag = (target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return;

    const key = (e.key || '').toLowerCase();

    switch (key) {
      case 'h':
        scrollToSection('home');
        break;
      case 'a':
        scrollToSection('about');
        break;
      case 's':
        scrollToSection('skills');
        break;
      case 'e':
        scrollToSection('experience');
        break;
      case 'p':
        scrollToSection('projects');
        break;
      case 'o':
        scrollToSection('organizations');
        break;
      case 'c':
        scrollToSection('contact');
        break;
      default:
        break;
    }
  });

  // Log keyboard shortcuts tip
  console.log(
    "%c Keyboard Shortcuts: ",
    "background: #0088ff; color: white; font-size: 14px; font-weight: bold; padding: 5px; font-family: monospace;"
  );
  console.log(
    "$ h -> home | a -> about | s -> skills | e -> experience | p -> projects | o -> organizations | c -> contact"
  );
}

// Initialize shortcuts
setupKeyboardShortcuts();

/* Matrix rain effect over the about profile photo */
(function () {
  let matrixAnimationId = null;
  let matrixCanvas = null;
  let matrixCtx = null;
  let matrixDrops = [];

  function createMatrixCanvas() {
    const photoContent = document.querySelector('.linux-photo-frame .photo-content');
    if (!photoContent) return null;

    // avoid duplicate canvas
    let existing = photoContent.querySelector('canvas.matrix');
    if (existing) return existing;

    const canvas = document.createElement('canvas');
    canvas.className = 'matrix';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    photoContent.appendChild(canvas);
    return canvas;
  }

  function setupMatrix() {
    // only on desktop-ish sizes
    if (window.innerWidth <= 768) return stopMatrix();

    matrixCanvas = createMatrixCanvas();
    if (!matrixCanvas) return;

    matrixCtx = matrixCanvas.getContext('2d');

    function resize() {
      const rect = matrixCanvas.getBoundingClientRect();
      matrixCanvas.width = Math.floor(rect.width * devicePixelRatio);
      matrixCanvas.height = Math.floor(rect.height * devicePixelRatio);
      matrixCtx.scale(devicePixelRatio, devicePixelRatio);
      initDrops();
    }

    function initDrops() {
      const cols = Math.floor(matrixCanvas.width / (12 * devicePixelRatio));
      matrixDrops = new Array(cols).fill(0).map(() => ({ y: Math.random() * 1000 }));
    }

    function step() {
      if (!matrixCtx) return;
      const w = matrixCanvas.width / devicePixelRatio;
      const h = matrixCanvas.height / devicePixelRatio;

      // fill with translucent black to create trail effect
      matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      matrixCtx.fillRect(0, 0, w, h);

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#00ff88';
      matrixCtx.fillStyle = primaryColor.trim();
      matrixCtx.font = '12px monospace';

      for (let i = 0; i < matrixDrops.length; i++) {
        const drop = matrixDrops[i];
        const x = i * 12 + 6;
        const text = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
        matrixCtx.fillText(text, x, drop.y);
        drop.y += 12 + Math.random() * 12;
        if (drop.y > h + 20) drop.y = -10 - Math.random() * 200;
      }

      matrixAnimationId = requestAnimationFrame(step);
    }

    // attach resize observer to keep canvas in sync
    resize();
    window.addEventListener('resize', resize);
    matrixAnimationId = requestAnimationFrame(step);
  }

  function stopMatrix() {
    if (matrixAnimationId) {
      cancelAnimationFrame(matrixAnimationId);
      matrixAnimationId = null;
    }
    if (matrixCanvas && matrixCanvas.parentNode) {
      matrixCanvas.parentNode.removeChild(matrixCanvas);
    }
    matrixCanvas = null;
    matrixCtx = null;
    matrixDrops = [];
  }

  // Initialize on load and adapt to resize
  window.addEventListener('load', () => {
    try {
      setupMatrix();
    } catch (e) {
      console.warn('Matrix effect init failed', e);
    }
  });

  // Re-init on resize (debounced)
  let matrixResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(matrixResizeTimer);
    matrixResizeTimer = setTimeout(() => {
      stopMatrix();
      setupMatrix();
    }, 250);
  });

  // expose for debugging
  window._portfolioMatrix = { setup: setupMatrix, stop: stopMatrix };
})();