document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on refresh
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const overlay = document.getElementById('foliage-overlay');
    const bgVideo = document.getElementById('bg-video');

    // Disable scrolling when foliage is visible
    document.body.style.overflow = 'hidden';

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');

            // Change icon between hamburger and X
            const icon = mobileToggle.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.className = 'ph ph-x';
            } else {
                icon.className = 'ph ph-list';
            }
        });

        // Close menu when clicking on a nav link
        const navLinks = navLinksContainer.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'ph ph-list';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'ph ph-list';
            }
        });
    }

    // Single tagline configuration
    const taglineText = "ANCESTRAL FLAVORS REBORN";
    const taglineDescription = "Traditional Afghani Cuisine with a Modern Touch";

    // Helper function to wrap text in word spans with alternating direction classes
    function wrapWords(element, text) {
        const words = text.split(' ');
        element.innerHTML = words.map((word, index) => {
            const direction = index % 2 === 0 ? 'from-top' : 'from-bottom';
            const color = index % 2 === 0 ? 'brown' : 'white';
            return `<span class="word ${direction} ${color}">${word}</span>`;
        }).join(' ');
    }

    // Animate words with staggered delays (varying intervals)
    function animateWords(element, startDelay = 0) {
        const words = element.querySelectorAll('.word');

        // Varying delay intervals for more dynamic feel
        const delayIntervals = [180, 200, 160, 190, 170, 210, 150, 180];

        let cumulativeDelay = startDelay;
        words.forEach((word, index) => {
            const interval = delayIntervals[index % delayIntervals.length];
            setTimeout(() => {
                word.style.animationDelay = '0s';
                word.style.animationPlayState = 'running';
            }, cumulativeDelay);
            cumulativeDelay += interval;
        });
    }

    // Exit words off-screen (staggered float upward)
    function exitWords(element) {
        const words = element.querySelectorAll('.word');
        words.forEach((word, index) => {
            setTimeout(() => {
                // Words float up with staggered timing
                word.classList.add('exit-top');
            }, index * 50); // Staggered exit for smooth cascade effect
        });
    }

    // Remove animation classes
    function clearAnimationClasses(element) {
        const words = element.querySelectorAll('.word');
        words.forEach(word => {
            word.style.opacity = '0';
            word.style.animation = 'none';
            word.classList.remove('exit-top');
        });
    }


    overlay.addEventListener('click', () => {
        // Add the class to trigger the CSS transition (fade out)
        overlay.classList.add('hidden');

        // Re-enable scrolling
        document.body.style.overflow = '';

        // Start animations after foliage is dismissed
        setTimeout(() => {
            const navbar = document.getElementById('navbar');
            if (navbar) navbar.classList.add('visible');

            const heroTagline = document.getElementById('hero-tagline');
            const heroDescription = document.getElementById('hero-description');

            if (heroTagline && heroDescription) {
                // Make containers visible
                heroTagline.classList.add('visible');
                heroDescription.classList.add('visible');

                // Wrap initial text in word spans with alternating directions
                wrapWords(heroTagline, taglineText);
                wrapWords(heroDescription, taglineDescription);

                // Animate initial words
                animateWords(heroTagline, 200);
                animateWords(heroDescription, 800);

                // Mark taglines as visible
                taglinesCurrentlyVisible = true;

                // Show the button with the description (faster)
                setTimeout(() => {
                    if (viewGalleryBtn) {
                        viewGalleryBtn.classList.add('visible');
                    }
                    if (heroStats) {
                        heroStats.classList.add('visible');
                    }
                }, 900);
            }
        }, 100);

        // Ensure video is playing (sometimes browsers block autoplay until interaction)
        if (bgVideo.paused) {
            bgVideo.play().catch(error => {
                console.log("Video autoplay failed, but interaction should fix it:", error);
            });
        }
    });

    /* --- Menu Section Scroll Logic --- */
    const menuSection = document.getElementById('menu-section');
    const gallerySection = document.getElementById('gallery-section');
    const storySection = document.getElementById('story-section');
    const locationSection = document.getElementById('location-section');
    const contactSection = document.getElementById('contact-section');
    const viewGalleryBtn = document.querySelector('.view-gallery-btn');
    const heroStats = document.querySelector('.hero-stats');
    const menuLinks = document.querySelectorAll('.main-menu a, nav a');

    // Navigation: Scroll to Menu
    menuLinks.forEach(link => {
        if (link.textContent.trim() === 'MENU') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (menuSection) {
                    menuSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // Card navigation on desktop (Infinite Loop with DOM Rotation)
    if (window.innerWidth > 768) {
        const menuTrack = document.getElementById('menu-track');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        let isAnimating = false;
        const cardWidth = 400; // Match CSS width
        const gap = 50;        // Match CSS gap
        const moveAmount = cardWidth + gap;

        // Helper to update spotlight class
        function updateSpotlight(targetIndex = 1) {
            const cards = Array.from(menuTrack.children);
            cards.forEach((card, index) => {
                // In a 3-card view, index 1 is the middle one
                // Adjust if using more visible cards, but 1 is safe for [Left, Center, Right]
                if (index === targetIndex) {
                    card.classList.add('spotlight');
                } else {
                    card.classList.remove('spotlight');
                }
            });
        }

        // Initialize: Move last card to front so the logical "first" card (A) is in the middle slot [Last, A, B]
        if (menuTrack.children.length > 0) {
            menuTrack.prepend(menuTrack.lastElementChild);
            updateSpotlight(1);
        }

        // --- NEXT BUTTON (Move Start -> End) ---
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            // 1. Immediate Spotlight: Light up the card that WILL be in the middle (Index 2)
            // Current: [0, 1, 2] -> Next View: [1, 2, 3] -> Center is 2
            updateSpotlight(2);

            // 2. Animate track to the left
            menuTrack.style.transition = 'transform 0.4s ease';
            menuTrack.style.transform = `translateX(-${moveAmount}px)`;

            // 3. After animation, rotate DOM and reset
            setTimeout(() => {
                menuTrack.style.transition = 'none';
                menuTrack.appendChild(menuTrack.firstElementChild); // Move first visible to end
                menuTrack.style.transform = 'translateX(0)';

                // Now that we rotated, the spotlighted card (was index 2) is now index 1.
                // We re-affirm index 1 just to be safe and consistent.
                updateSpotlight(1);

                isAnimating = false;
            }, 400); // 400ms matches CSS transition
        });

        // --- PREV BUTTON (Move End -> Start) ---
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            // 1. Instantly move last card to front
            menuTrack.style.transition = 'none';
            menuTrack.prepend(menuTrack.lastElementChild);

            // 2. Immediate Spotlight: Light up the new middle card (Index 1)
            updateSpotlight(1);

            // 2. Shift track left so the new first card is off-screen (keeping view stable)
            menuTrack.style.transform = `translateX(-${moveAmount}px)`;

            // 3. Force reflow/repaint to ensure browser accepts the instant jump
            void menuTrack.offsetWidth;

            // 4. Animate back to 0
            menuTrack.style.transition = 'transform 0.4s ease';
            menuTrack.style.transform = 'translateX(0)';

            // 5. Cleanup
            setTimeout(() => {
                // Spotlight is already correct, but good to ensure state
                updateSpotlight(1);
                isAnimating = false;
            }, 400);
        });

        // Initial spotlight set
        updateSpotlight(1);
    }

    // Scroll effects for Navbar
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    let heroSectionVisible = true;
    let taglinesCurrentlyVisible = false;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar Background Toggle
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollTop >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === current) {
                link.classList.add('active');
            }
        });

        // Check if hero section is visible
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && overlay.classList.contains('hidden')) {
            const windowHeight = window.innerHeight;
            const heroRect = heroSection.getBoundingClientRect();
            const heroSectionTop = heroRect.top;
            const heroSectionBottom = heroRect.bottom;

            // Quick trigger: hero is visible if top is still above 15% down the viewport
            const isVisible = heroSectionTop > -windowHeight * 0.15;

            // If hero section visibility changed
            if (isVisible !== heroSectionVisible) {
                heroSectionVisible = isVisible;

                const heroTagline = document.getElementById('hero-tagline');
                const heroDescription = document.getElementById('hero-description');

                if (!isVisible) {
                    // Scrolled away - exit words off screen
                    if (taglinesCurrentlyVisible && heroTagline && heroDescription) {
                        exitWords(heroTagline);
                        exitWords(heroDescription);
                        taglinesCurrentlyVisible = false;

                        // Hide button and stats
                        if (viewGalleryBtn) {
                            viewGalleryBtn.classList.remove('visible');
                            viewGalleryBtn.classList.add('exit');
                        }
                        if (heroStats) {
                            heroStats.classList.remove('visible');
                        }
                    }
                } else if (isVisible && !taglinesCurrentlyVisible) {
                    // Scrolled back - animate words in immediately
                    if (heroTagline && heroDescription) {
                        // Clear any exit animations
                        clearAnimationClasses(heroTagline);
                        clearAnimationClasses(heroDescription);

                        // Re-wrap with tagline
                        wrapWords(heroTagline, taglineText);
                        wrapWords(heroDescription, taglineDescription);

                        // Animate words in
                        animateWords(heroTagline, 100);
                        animateWords(heroDescription, 400);

                        taglinesCurrentlyVisible = true;

                        // Show button and stats again
                        setTimeout(() => {
                            if (viewGalleryBtn) {
                                viewGalleryBtn.classList.remove('exit');
                                viewGalleryBtn.classList.add('visible');
                            }
                            if (heroStats) {
                                heroStats.classList.add('visible');
                            }
                        }, 600);
                    }
                }
            }
        }

        // Menu section scroll in/out effect
        if (menuSection) {
            const windowHeight = window.innerHeight;
            const menuSectionTop = menuSection.getBoundingClientRect().top;
            const menuSectionBottom = menuSection.getBoundingClientRect().bottom;

            // Show when section is in viewport (with some offset for better timing)
            if (menuSectionTop < windowHeight * 0.65 && menuSectionBottom > windowHeight * 0.35) {
                menuSection.classList.add('visible');
            } else {
                menuSection.classList.remove('visible');
            }
        }

        // Gallery section scroll in/out effect
        if (gallerySection) {
            const windowHeight = window.innerHeight;
            const gallerySectionTop = gallerySection.getBoundingClientRect().top;
            const gallerySectionBottom = gallerySection.getBoundingClientRect().bottom;

            // Show when section is in viewport
            if (gallerySectionTop < windowHeight * 0.75 && gallerySectionBottom > windowHeight * 0.25) {
                gallerySection.classList.add('visible');
            } else {
                gallerySection.classList.remove('visible');
            }
        }

        // Story section scroll in/out effect
        if (storySection) {
            const windowHeight = window.innerHeight;
            const storySectionTop = storySection.getBoundingClientRect().top;
            const storySectionBottom = storySection.getBoundingClientRect().bottom;

            // Show when section is in viewport
            if (storySectionTop < windowHeight * 0.75 && storySectionBottom > windowHeight * 0.25) {
                storySection.classList.add('visible');
            } else {
                storySection.classList.remove('visible');
            }
        }

        // Location section scroll in/out effect
        if (locationSection) {
            const windowHeight = window.innerHeight;
            const locationSectionTop = locationSection.getBoundingClientRect().top;
            const locationSectionBottom = locationSection.getBoundingClientRect().bottom;

            // Show when section is in viewport
            if (locationSectionTop < windowHeight * 0.75 && locationSectionBottom > windowHeight * 0.25) {
                locationSection.classList.add('visible');
            } else {
                locationSection.classList.remove('visible');
            }
        }

        // Contact section scroll in/out effect
        if (contactSection) {
            const windowHeight = window.innerHeight;
            const contactSectionTop = contactSection.getBoundingClientRect().top;
            const contactSectionBottom = contactSection.getBoundingClientRect().bottom;

            // Show when section is in viewport
            if (contactSectionTop < windowHeight * 0.75 && contactSectionBottom > windowHeight * 0.25) {
                contactSection.classList.add('visible');
            } else {
                contactSection.classList.remove('visible');
            }
        }

        lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set proper state
    handleScroll();

    // Smooth Scroll for Nav Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

});
