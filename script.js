document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize EmailJS (only if library is loaded)
    if (window.emailjs) {
        emailjs.init("wVg5o9trQIHPStERj");
    }

    // 2. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        // Check for saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', savedTheme);
        if (themeIcon) updateThemeIcon(themeIcon, savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (themeIcon) updateThemeIcon(themeIcon, newTheme);
        });
    }

    function updateThemeIcon(icon, theme) {
        if (theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // 3. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Navbar blur effect on scroll
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.padding = '0.5rem 0';
                navbar.style.background = 'var(--glass-bg)';
            } else {
                navbar.style.padding = '1rem 0';
                navbar.style.background = 'var(--glass-bg)';
            }
        }
    });

    // 4. Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Fallback: Reveal everything if for some reason observer doesn't trigger after a delay
    // This solves the "blank page" issue in some browsers/Live Server environments
    const forceReveal = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100) {
                el.classList.add('active');
            }
        });
    };

    // Initial check on load
    window.addEventListener('load', forceReveal);
    // Recurring check just in case
    setTimeout(forceReveal, 500);
    setTimeout(forceReveal, 1500); // Secondary fallback for slower renders

    // Smooth reveal on scroll even if observer fails
    window.addEventListener('scroll', forceReveal);

    // 5. Contact Form with EmailJS
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        const btnText = submitBtn.querySelector('span');

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Show loading state
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';

            // Parameters for EmailJS
            const templateParams = {
                name: document.getElementById('user_name').value,
                email: document.getElementById('user_email').value,
                from_name: document.getElementById('user_name').value,
                reply_to: document.getElementById('user_email').value,
                message: document.getElementById('message').value,
                subject: `New Portfolio Message from ${document.getElementById('user_name').value}`
            };

            emailjs.send('service_3rg6nxr', 'template_3htrh3u', templateParams)
                .then(function () {
                    if (btnText) btnText.textContent = 'Message Sent!';
                    submitBtn.style.background = '#27ae60';
                    submitBtn.style.color = '#fff';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        if (btnText) btnText.textContent = 'Send Message';
                        submitBtn.style.background = 'var(--primary)';
                        submitBtn.style.opacity = '1';
                    }, 3000);
                }, function (error) {
                    console.log('FAILED...', error);
                    if (btnText) btnText.textContent = 'Error Occurred';
                    submitBtn.style.background = '#e74c3c';

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        if (btnText) btnText.textContent = 'Send Message';
                        submitBtn.style.background = 'var(--primary)';
                        submitBtn.style.opacity = '1';
                    }, 3000);
                });
        });
    }

    // 6. Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
    // 8. Hero Reveal Trigger
    const heroElements = document.querySelectorAll('.reveal-stagger');
    setTimeout(() => {
        heroElements.forEach(el => el.classList.add('active'));
    }, 200);

    // 9. Text Rotator for Hero
    const rotator = document.getElementById('rotator-text');
    if (rotator) {
        const words = [
            "Future AI Systems",
            "Intelligent Interfaces",
            "Scalable Flutter Apps",
            "Computer Vision Models",
            "Generative AI Research"
        ];
        let wordIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIdx];
            if (isDeleting) {
                rotator.textContent = currentWord.substring(0, charIdx - 1);
                charIdx--;
                typeSpeed = 50;
            } else {
                rotator.textContent = currentWord.substring(0, charIdx + 1);
                charIdx++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIdx === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // 10. Background Glow Mouse Follow
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });

    // 11. 3D Tilt Effect for Cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    });

    // 12. Magnetic Buttons
    const magnets = document.querySelectorAll('.glass-btn-magnetic');
    magnets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });
});
