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

        // --- Dynamic Dimension Calculation ---
        function updateCarouselDimensions() {
            // Logic: 3 cards visible. 
            // Center card (spotlight) + 2 side cards. 
            // Center is usually scale(1.15), keeping sides smaller.
            // Constraint: Container = 3 * width + 2 * gap.
            // Let's use 25vw for width and 2.5vw for gap.
            // Total visible width = 25*3 + 2.5*2 = 75 + 5 = 80vw.
            // This leaves 10vw margins on each side.

            const viewportWidth = window.innerWidth;
            const widthVal = viewportWidth * 0.25;
            const gapVal = viewportWidth * 0.025;

            // Update CSS Variables root-wide or on the container
            document.documentElement.style.setProperty('--card-width', `${widthVal}px`);
            document.documentElement.style.setProperty('--card-gap', `${gapVal}px`);
        }

        // Run on load and resize
        updateCarouselDimensions();
        window.addEventListener('resize', () => {
            updateCarouselDimensions();
            // Re-spotlight to ensure center is correct after resize might have shifted things
            updateSpotlight(1);
        });

        // Helper to get current dynamic movement amount
        function getMoveAmount() {
            const width = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-width'));
            const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-gap'));
            return width + gap;
        }

        // Helper to update spotlight class
        function updateSpotlight(targetIndex = 1) {
            const cards = Array.from(menuTrack.children);
            cards.forEach((card, index) => {
                // In a 3-card view, index 1 is the middle one
                if (index === targetIndex) {
                    card.classList.add('spotlight');
                } else {
                    card.classList.remove('spotlight');
                }
            });
        }

        // Initialize: Move last card to front so the logical "first" card (A) is in the middle slot [Last, A, B]
        if (menuTrack && menuTrack.children.length > 0) {
            menuTrack.prepend(menuTrack.lastElementChild);
            updateSpotlight(1);
        }

        if (nextBtn && menuTrack) {
            // --- NEXT BUTTON (Move Start -> End) ---
            nextBtn.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                const moveAmount = getMoveAmount();

                // 1. Immediate Spotlight: Light up the card that WILL be in the middle (Index 2)
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
                    updateSpotlight(1);

                    isAnimating = false;
                }, 400); // 400ms matches CSS transition
            });
        }

        if (prevBtn && menuTrack) {
            // --- PREV BUTTON (Move End -> Start) ---
            prevBtn.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                const moveAmount = getMoveAmount();

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
                    updateSpotlight(1);
                    isAnimating = false;
                }, 400);
            });
        }

        // Initial spotlight set
        if (menuTrack) updateSpotlight(1);
    }

    // --- Mobile Menu Card Focus Logic ---
    const menuCards = document.querySelectorAll('.menu-card');

    // Create overlay if not exists
    let mobileMenuOverlay = document.querySelector('.menu-overlay-mobile');
    if (!mobileMenuOverlay) {
        mobileMenuOverlay = document.createElement('div');
        mobileMenuOverlay.className = 'menu-overlay-mobile';
        document.body.appendChild(mobileMenuOverlay);
    }

    let activeModal = null;

    // Function to dismiss focus
    function dismissMobileFocus() {
        if (activeModal) {
            // Force reflow to ensure animation triggers freshly if needed
            void activeModal.offsetWidth;

            // Trigger exit animation
            activeModal.classList.add('closing');

            // Remove overlay active state immediately for sync fade
            mobileMenuOverlay.classList.remove('active');

            // Wait for animation to finish before removing
            setTimeout(() => {
                if (activeModal) {
                    activeModal.remove();
                    activeModal = null;
                }
                document.body.style.overflow = ''; // Restore scroll after fully closed
            }, 300); // 300ms matches CSS animation duration
        } else {
            // Fallback if no active modal
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Add click icons to menu cards on mobile
    function addClickIcons() {
        if (window.innerWidth <= 768) {
            menuCards.forEach(card => {
                // Check if click icon already exists
                if (!card.querySelector('.card-click-icon')) {
                    const clickIcon = document.createElement('div');
                    clickIcon.className = 'card-click-icon';
                    clickIcon.innerHTML = '<i class="ph ph-hand-pointing"></i>';
                    card.appendChild(clickIcon);
                }
            });
        } else {
            // Remove click icons on desktop
            menuCards.forEach(card => {
                const clickIcon = card.querySelector('.card-click-icon');
                if (clickIcon) {
                    clickIcon.remove();
                }
            });
        }
    }

    // Add click icons initially
    addClickIcons();

    // Re-add icons on window resize
    window.addEventListener('resize', addClickIcons);

    // Add click listeners to cards
    menuCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Only trigger on mobile
            if (window.innerWidth <= 768) {
                // Prevent multiple modals
                if (activeModal) return;

                // --- CREATE WRAPPER ---
                const wrapper = document.createElement('div');
                wrapper.className = 'mobile-focus-wrapper';

                // Create a clone for the card
                const cardClone = card.cloneNode(true);
                cardClone.classList.add('mobile-focus-inner'); // Replaces mobile-focus styles on the card itself
                cardClone.removeAttribute('id');

                // --- INJECT CLOSE BUTTON INTO WRAPPER (Sibling to card) ---
                const closeBtn = document.createElement('button');
                closeBtn.className = 'mobile-menu-close-btn';
                closeBtn.innerHTML = '<i class="ph ph-x"></i>';
                closeBtn.onclick = (ev) => {
                    ev.stopPropagation();
                    dismissMobileFocus();
                };

                // Assemble
                wrapper.appendChild(cardClone);
                wrapper.appendChild(closeBtn); // Appended after card, but absolute positioned

                // Set active modal to the wrapper
                activeModal = wrapper;

                // Append to body to escape any parent transforms/z-indexes
                document.body.appendChild(activeModal);

                // Show overlay
                mobileMenuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scroll

                e.stopPropagation(); // Stop bubbling
            }
        });
    });

    // Close on overlay click
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', () => {
            dismissMobileFocus();
        });
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
                            heroStats.classList.add('exit');
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
                                heroStats.classList.remove('exit');
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

        // Gallery Title Animation (Separate from Gallery Section bg effect)
        const galleryLine1 = document.getElementById('gallery-line-1');
        const galleryLine2 = document.getElementById('gallery-line-2');
        const binocularsContainer = document.querySelector('.binoculars-container');

        if (gallerySection && galleryLine1 && galleryLine2) {
            const windowHeight = window.innerHeight;
            const galleryRect = gallerySection.getBoundingClientRect();
            // Trigger when top is 70% down viewport (entering) or bottom is 20% down (leaving)
            const isGalleryVisible = (galleryRect.top < windowHeight * 0.7) && (galleryRect.bottom > windowHeight * 0.2);

            // Access state stored on element to avoid global var pollution
            if (isGalleryVisible !== (gallerySection.dataset.isVisible === 'true')) {
                gallerySection.dataset.isVisible = isGalleryVisible; // Store state

                if (isGalleryVisible) {
                    // Enter
                    wrapWords(galleryLine1, "CLICK BELOW");
                    wrapWords(galleryLine2, "TO EXPLORE");
                    animateWords(galleryLine1, 0);
                    animateWords(galleryLine2, 400); // Slight delay for second line

                    if (binocularsContainer) {
                        binocularsContainer.classList.remove('exit');
                        binocularsContainer.classList.add('visible');
                    }
                } else {
                    // Exit
                    exitWords(galleryLine1);
                    exitWords(galleryLine2);

                    if (binocularsContainer) {
                        binocularsContainer.classList.remove('visible');
                        binocularsContainer.classList.add('exit');
                    }
                }
            }
        }

        lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set proper state
    handleScroll();

    // Smooth Scroll for Nav Links
    const navLinksMain = document.querySelectorAll('.nav-link, .view-gallery-btn');
    navLinksMain.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Calculate exact position - sections are full viewport height, so use offsetTop directly
                    let targetPosition;
                    if (targetId === 'home') {
                        targetPosition = 0;
                    } else {
                        targetPosition = targetElement.offsetTop;
                    }

                    // Scroll to exact position
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Art Gallery Logic ---
    const galleryOverlay = document.getElementById('gallery-overlay');
    const galleryCloseBtn = document.getElementById('gallery-close');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');
    const backToGalleryBtn = document.getElementById('back-to-gallery');
    const framesContainer = document.getElementById('frames-container');
    const galleryExpanded = document.getElementById('gallery-expanded');
    const expandedImg = document.getElementById('expanded-img');

    // Gallery Images (Filler images for now)
    const galleryImages = [
        'assets/BBQ.webp',
        'assets/Chapli Kabab.webp',
        'assets/Chicken.webp',
        'assets/Lamb.webp',
        'assets/Mutton.webp',
        'assets/Platter.webp',
        'assets/Pulao.webp',
        'assets/Meetha.webp',
        'assets/Sides.webp',
        'assets/Beverages.webp'
    ];

    let currentIndex = 0;

    // --- Initialization: Render Gallery Frames ---
    function initGallery() {
        if (!framesContainer) return;
        framesContainer.innerHTML = '';

        galleryImages.forEach((imgSrc, index) => {
            // Create frame item
            const frameItem = document.createElement('div');
            frameItem.className = 'gallery-frame-item';
            frameItem.dataset.index = index;

            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-frame-wrapper';

            // Frame image
            const frameImg = document.createElement('img');
            frameImg.className = 'frame-img';
            frameImg.src = 'assets/Frame.webp';
            frameImg.alt = 'Frame';

            // Thumbnail image
            const thumbnailImg = document.createElement('img');
            thumbnailImg.className = 'thumbnail-img';
            thumbnailImg.src = imgSrc;
            thumbnailImg.alt = `Gallery Image ${index + 1}`;
            thumbnailImg.loading = 'lazy';

            // Assemble
            wrapper.appendChild(thumbnailImg);
            wrapper.appendChild(frameImg);
            frameItem.appendChild(wrapper);
            framesContainer.appendChild(frameItem);

            // Click handler: Expand frame
            frameItem.addEventListener('click', () => {
                expandFrame(index);
            });
        });
    }

    // --- Expand Frame (Zoom to center) ---
    function expandFrame(index) {
        currentIndex = index;
        if (!expandedImg || !galleryExpanded) return;

        expandedImg.src = galleryImages[currentIndex];
        galleryExpanded.classList.remove('hidden');
    }

    // --- Navigate Images (Prev/Next) ---
    function changeImage(direction) {
        if (!expandedImg) return;

        // Add fade-out animation
        expandedImg.style.opacity = '0';
        expandedImg.style.transform = 'translate(-50%, -50%) scale(0.9)';

        setTimeout(() => {
            // Update image
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % galleryImages.length;
            } else {
                currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            }
            expandedImg.src = galleryImages[currentIndex];

            // Add fade-in animation
            setTimeout(() => {
                expandedImg.style.opacity = '1';
                expandedImg.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 50);
        }, 300);
    }

    // --- Open/Close Gallery ---
    const binocularsContainers = document.querySelectorAll('.binoculars-container');
    binocularsContainers.forEach(container => {
        container.addEventListener('click', () => {
            openGallery();
        });
    });

    // --- Scrollbar Compensation Helper ---
    function openGallery() {
        if (!galleryOverlay) return;

        galleryOverlay.classList.remove('hidden');
        void galleryOverlay.offsetWidth; // Force reflow
        galleryOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Scroll to top of gallery overlay
        const artGalleryGrid = document.getElementById('art-gallery-grid');
        if (artGalleryGrid) {
            artGalleryGrid.scrollTop = 0;
        }

        // Ensure expanded view is hidden
        if (galleryExpanded) {
            galleryExpanded.classList.add('hidden');
        }

        // Fade in gallery title
        const galleryTitle = document.querySelector('.art-gallery-title');
        if (galleryTitle) {
            galleryTitle.classList.remove('fade-in');
            void galleryTitle.offsetWidth; // Force reflow
            galleryTitle.classList.add('fade-in');
        }

        // Trigger staggered fade-in animation for frames
        const frames = document.querySelectorAll('.gallery-frame-item');
        frames.forEach((frame) => {
            // Remove the class first in case gallery was opened before
            frame.classList.remove('fade-in');
        });

        // Force reflow
        void document.body.offsetWidth;

        // Add fade-in class to trigger animation
        frames.forEach((frame) => {
            frame.classList.add('fade-in');
        });
    }

    function closeGallery() {
        if (!galleryOverlay) return;

        galleryOverlay.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            galleryOverlay.classList.add('hidden');
            if (galleryExpanded) {
                galleryExpanded.classList.add('hidden');
            }
        }, 600);
    }

    function backToGalleryGrid() {
        if (galleryExpanded) {
            galleryExpanded.classList.add('hidden');
        }
    }

    // --- Event Listeners ---
    if (galleryCloseBtn) {
        galleryCloseBtn.addEventListener('click', closeGallery);
    }

    if (galleryPrevBtn) {
        galleryPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeImage('prev');
        });
    }

    if (galleryNextBtn) {
        galleryNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeImage('next');
        });
    }

    if (backToGalleryBtn) {
        backToGalleryBtn.addEventListener('click', backToGalleryGrid);
    }

    // Swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for swipe
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left - next image
            changeImage('next');
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right - previous image
            changeImage('prev');
        }
    }

    if (galleryExpanded) {
        galleryExpanded.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        galleryExpanded.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    // Initialize Gallery
    initGallery();

});
