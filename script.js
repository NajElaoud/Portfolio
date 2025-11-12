// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll & Active Navigation
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-100px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${entry.target.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Skill Progress Animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = `${progress}%`;
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Skill Box Toggle (Click to Expand/Collapse)
const skillBoxes = document.querySelectorAll('.skill-box');
skillBoxes.forEach(box => {
    const header = box.querySelector('.skill-box-header');
    if (header) {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            // Toggle active class on the clicked box
            box.classList.toggle('active');

            // Optional: Close other boxes when one is opened
             skillBoxes.forEach(otherBox => {
                if (otherBox !== box) {
                     otherBox.classList.remove('active');
                 }
             });
        });
    }
});

// Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simulate form submission
        console.log('Form submitted:', { name, email, message });
        
        // Create success message
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.innerHTML = `
            <div style="color: var(--primary-color); font-family: 'Courier New', monospace; padding: 2rem; text-align: center;">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">$ Message sent successfully!</p>
                <p style="color: var(--text-secondary);">[ OK ] Contact form submitted</p>
                <p style="color: var(--text-secondary); margin-top: 0.5rem;">Thank you for reaching out. I'll get back to you soon.</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 2rem;">
                    <i class="fas fa-redo"></i> Send Another Message
                </button>
            </div>
        `;
        
        // In a real application, you would send this data to a server
        // Example using fetch:
        /*
        fetch('your-api-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        */
    });
}

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.about-box, .skill-box, .project-item, .timeline-item, .organization-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s, transform 0.6s';
    revealObserver.observe(element);
});

// Parallax Effect for Hero Section (only on larger screens)
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Typing Effect for Hero Section
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
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
window.addEventListener('load', () => {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText, 50);
    }
});

// Add dynamic background particles (only on larger screens)
function createParticles() {
    if (window.innerWidth <= 768) return; // Skip on mobile
    
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.overflow = 'hidden';
    particlesContainer.style.pointerEvents = 'none';
    
    const particleCount = window.innerWidth > 1200 ? 20 : 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${5 + Math.random() * 10}s infinite ease-in-out`;
        particle.style.opacity = Math.random();
        particlesContainer.appendChild(particle);
    }
    
    hero.insertBefore(particlesContainer, hero.firstChild);
}

// Add CSS animation for particles
const style = document.createElement('style');
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
const scrollToTopBtn = document.querySelector('.footer-links a[href="#home"]');
if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add hover effect to organization cards
const organizationCards = document.querySelectorAll('.organization-card');

organizationCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add counter animation for skills
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start) + '%';
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
    document.addEventListener('mousemove', (e) => {
        cursorTrail.push({ x: e.clientX, y: e.clientY });
        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
    });
}

// Responsive handling for window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Refresh particles on resize if needed
        const existingParticles = document.querySelector('.hero > div');
        if (existingParticles && existingParticles.style.pointerEvents === 'none') {
            existingParticles.remove();
            createParticles();
        }
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, 250);
});

// Console Easter Egg
console.log('%c najd@portfolio:~$ ./welcome.sh ', 'background: #00ff88; color: #0a0e27; font-size: 20px; font-weight: bold; padding: 10px; font-family: monospace;');
console.log('%c Looking for something? Try: showSecretMessage() ', 'color: #00ff88; font-size: 14px; font-family: monospace;');

window.showSecretMessage = function() {
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
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// GitHub Stats Animation (if you want to add live stats)
async function fetchGitHubStats() {
    try {
        // Replace with your GitHub username
        const username = 'NajElaoud';
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        
        // You can use this data to display stats on your page
        console.log('GitHub Stats:', {
            publicRepos: data.public_repos,
            followers: data.followers,
            following: data.following
        });
    } catch (error) {
        console.log('Could not fetch GitHub stats:', error);
    }
}

// Uncomment to fetch GitHub stats on page load
fetchGitHubStats();

// Add keyboard shortcuts (only on desktop)
if (window.innerWidth > 768) {
    document.addEventListener('keydown', (e) => {
        // Press 'h' to go to home
        if (e.key === 'h' || e.key === 'H') {
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        }
        // Press 'a' to go to about
        if (e.key === 'a' || e.key === 'A') {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        }
        // Press 'e' to go to experience
        if (e.key === 'e' || e.key === 'E') {
            document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
        }
        // Press 'p' to go to projects
        if (e.key === 'p' || e.key === 'P') {
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
        // Press 'o' to go to organizations
        if (e.key === 'o' || e.key === 'O') {
            document.getElementById('organizations').scrollIntoView({ behavior: 'smooth' });
        }
        // Press 'c' to go to contact
        if (e.key === 'c' || e.key === 'C') {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Log keyboard shortcuts tip
    console.log('%c Keyboard Shortcuts: ', 'background: #0088ff; color: white; font-size: 14px; font-weight: bold; padding: 5px; font-family: monospace;');
    console.log('$ h -> home | e -> experience | p -> projects | o -> organizations | c -> contact');
}



