       // 1. REUSABLE PARTICLE CANVAS ENGINE
        function initParticleCanvas(canvasId, particleCount, connectionDistance, speedMultiplier) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            let width = canvas.width = canvas.parentElement.offsetWidth;
            let height = canvas.height = canvas.parentElement.offsetHeight;
            
            let particles = [];
            
            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * speedMultiplier;
                    this.vy = (Math.random() - 0.5) * speedMultiplier;
                    this.radius = Math.random() * 2 + 1;
                }
                
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                }
                
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'; // Faint emerald green
                    ctx.fill();
                }
            }
            
            function initParticles() {
                particles = [];
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
            }
            
            function animateParticles() {
                ctx.clearRect(0, 0, width, height);
                
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                    
                    for (let j = i + 1; j < particles.length; j++) {
                        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                        if (dist < connectionDistance) {
                            const opacity = (1 - dist / connectionDistance) * 0.15;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(animateParticles);
            }
            
            initParticles();
            animateParticles();
            
            window.addEventListener('resize', () => {
                width = canvas.width = canvas.parentElement.offsetWidth;
                height = canvas.height = canvas.parentElement.offsetHeight;
                initParticles();
            });
        }

        // Initialize animations on load
        document.addEventListener('DOMContentLoaded', () => {
            // Activate constellation background in Hero (45 particles, fast/dynamic)
            initParticleCanvas('hero-canvas', 45, 110, 0.4);
            
            // Activate constellation background in Footer (25 particles, calm/resting connections)
            initParticleCanvas('footer-canvas', 25, 130, 0.2);
        });

        // 2. SCROLL REVEAL (Intersection Observer API)
        document.addEventListener('DOMContentLoaded', () => {
            const revealElements = document.querySelectorAll('.reveal');
            
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.05,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(element => {
                revealObserver.observe(element);
            });
        });

        // 3. ACTIVE NAVIGATION LINK ON SCROLL
        const sections = document.querySelectorAll('section, footer');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let currentSection = '';
            sections.forEach(sec => {
                const sectionTop = sec.offsetTop;
                if (window.pageYOffset >= (sectionTop - 120)) {
                    currentSection = sec.getAttribute('id') || '';
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });

        // 4. INTERACTIVE PROJECT FILTERING
        function filterProjects(category) {
            // Adjust buttons styling
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            const cards = document.querySelectorAll('.project-card');
            
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    // Delay slightly to trigger visual transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95) translateY(12px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        }