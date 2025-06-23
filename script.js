// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Variables globales
    const loader = document.getElementById('loader');
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const backToTop = document.getElementById('backToTop');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Variable pour s'assurer que le loader ne se masque qu'une fois
    let loaderHidden = false;
    
    // Masquer le loader après le chargement
    function hideLoader() {
        if (loader && !loaderHidden) {
            loaderHidden = true;
            console.log('Masquage du loader...');
            loader.style.transition = 'opacity 0.5s ease-out';
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
                console.log('Loader masqué avec succès');
            }, 500);
        }
    }
    
    // Masquer le loader immédiatement après le DOM chargé (solution la plus rapide)
    setTimeout(hideLoader, 1000);
    
    // Solution principale : attendre le chargement complet
    window.addEventListener('load', function() {
        setTimeout(hideLoader, 500);
    });
    
    // Solution de secours absolue : forcer le masquage après 2 secondes maximum
    setTimeout(function() {
        if (!loaderHidden) {
            console.log('Loader forcé à se masquer après timeout de sécurité');
            hideLoader();
        }
    }, 2000);
    
    // Navigation sticky et scroll effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header sticky effect
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button
        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        // Animations on scroll
        animateOnScroll();
        
        lastScrollTop = scrollTop;
    });
    
    // Menu mobile toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
    
    // Fermer le menu mobile lors du clic sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
        });
    });
    
    // Smooth scrolling pour les liens d'ancrage
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + header.offsetHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Gallery filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentFilter = 'all';
    
    // Fonction pour appliquer le filtre
    function applyGalleryFilter(filterValue) {
        currentFilter = filterValue;
        
        galleryItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            // Ajouter un délai progressif pour l'animation
            setTimeout(() => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                    item.classList.add('visible');
                    item.setAttribute('data-filtered', 'show');
                } else {
                    if (itemCategory === filterValue) {
                        item.style.display = 'block';
                        item.classList.remove('hidden');
                        item.classList.add('visible');
                        item.setAttribute('data-filtered', 'show');
                    } else {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                        item.classList.remove('visible');
                        item.setAttribute('data-filtered', 'hide');
                    }
                }
            }, index * 100); // Délai progressif
        });
    }
    
    // Fonction pour maintenir le filtre actuel
    function maintainCurrentFilter() {
        if (currentFilter !== 'all') {
            applyGalleryFilter(currentFilter);
        }
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            applyGalleryFilter(filterValue);
        });
    });
    
    // Maintenir le filtre
    setInterval(maintainCurrentFilter, 3000);
    
    // Lightbox functionality
    window.openLightbox = function(imageSrc) {
        lightboxImg.src = imageSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animation d'entrée
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 10);
    };
    
    window.closeLightbox = function() {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    };
    
    // Close lightbox on click outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
    
    // Back to top functionality
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Form handling
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateForm(data)) {
                return;
            }
            
            // Show success message
            showNotification('Votre demande de rendez-vous a été envoyée avec succès! Nous vous contacterons bientôt pour confirmer votre rdv chez Khanya L Salon.', 'success');
            
            // Reset form
            this.reset();
            
            // Rediriger vers WhatsApp avec les détails de la réservation
            const message = `Bonjour Khanya L Salon,

Je souhaite prendre rendez-vous pour les services suivants :

👤 Nom : ${data.name}
📞 Téléphone : ${data.phone}
📧 Email : ${data.email}
💅 Service : ${getServiceName(data.service)}
📅 Date souhaitée : ${data.date}
🕐 Heure souhaitée : ${data.time}
${data.message ? '💬 Message : ' + data.message : ''}

Merci de me confirmer la disponibilité.`;
            
            setTimeout(() => {
                const whatsappUrl = `https://wa.me/237693632680?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }, 2000);
        });
    }
    
    function getServiceName(serviceValue) {
        const services = {
            'manucure': 'Manucure & Pédicure',
            'eyelash': 'Extensions de Cils (Eyelash)',
            'makeup': 'Maquillage Professionnel',
            'eyebrow': 'Épilation Sourcils (Eyebrow)',
            'combo': 'Pack Complet'
        };
        return services[serviceValue] || serviceValue;
    }
    
    // Form validation
    function validateForm(data) {
        const required = ['name', 'phone', 'email', 'service', 'date', 'time'];
        
        for (let field of required) {
            if (!data[field] || data[field].trim() === '') {
                showNotification(`Le champ ${getFieldLabel(field)} est requis.`, 'error');
                return false;
            }
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return false;
        }
        
        // Phone validation pour le Cameroun
        const phoneRegex = /^(\+237|237)?[679]\d{8}$/;
        const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            showNotification('Veuillez entrer un numéro de téléphone camerounais valide (ex: +237 6XX XXX XXX).', 'error');
            return false;
        }
        
        // Date validation (not in the past)
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Veuillez choisir une date future.', 'error');
            return false;
        }
        
        // Business hours validation
        const selectedTime = data.time;
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        
        const selectedDay = selectedDate.getDay();
        let isValidTime = false;
        
        if (selectedDay === 0) { // Dimanche
            isValidTime = timeInMinutes >= 10 * 60 && timeInMinutes < 17 * 60;
        } else { // Lundi à Samedi
            isValidTime = timeInMinutes >= 8 * 60 && timeInMinutes < 19 * 60;
        }
        
        if (!isValidTime) {
            const dayName = selectedDay === 0 ? 'dimanche' : 'en semaine';
            const hours = selectedDay === 0 ? '10h-17h' : '8h-19h';
            showNotification(`Les horaires d'ouverture ${dayName} sont de ${hours}.`, 'error');
            return false;
        }
        
        return true;
    }
    
    function getFieldLabel(field) {
        const labels = {
            'name': 'Nom complet',
            'phone': 'Téléphone',
            'email': 'Email',
            'service': 'Service souhaité',
            'date': 'Date',
            'time': 'Heure'
        };
        return labels[field] || field;
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#D4A574'};
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 450px;
            animation: slideInRight 0.4s ease-out;
            border: 2px solid rgba(255,255,255,0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 6 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.4s ease-out';
                setTimeout(() => notification.remove(), 400);
            }
        }, 6000);
        
        // Add animation styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    font-weight: 500;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 5px;
                    margin-left: auto;
                    border-radius: 50%;
                    transition: background 0.3s;
                }
                .notification-close:hover {
                    background: rgba(255,255,255,0.2);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Animations on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            // Ignorer les éléments de la galerie pour éviter les conflits
            if (element.classList.contains('gallery-item')) {
                return;
            }
            
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initialize animations
    function initializeAnimations() {
        // Add animation classes to elements
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.15}s`;
        });
        
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
            item.classList.add(index % 2 === 0 ? 'slide-left' : 'slide-right');
        });
        
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    // Testimonials slider (simple auto-rotation)
    function initializeTestimonialsSlider() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        if (testimonialCards.length <= 1) return;
        
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonialCards.forEach((card, i) => {
                if (i === index) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                } else {
                    card.style.opacity = '0.7';
                    card.style.transform = 'scale(0.95) translateY(10px)';
                }
            });
        }
        
        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            showTestimonial(currentIndex);
        }
        
        // Initialize
        showTestimonial(0);
        
        // Auto-rotate every 6 seconds
        setInterval(nextTestimonial, 6000);
    }
    
    // Parallax effect pour la section hero
    function initializeParallax() {
        const heroImage = document.querySelector('.hero-bg');
        if (!heroImage) return;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (heroImage) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Hover effects for service cards
    function initializeServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.02)';
                this.style.boxShadow = '0 25px 60px rgba(212, 165, 116, 0.25)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 15px 40px rgba(212, 165, 116, 0.15)';
            });
        });
    }
    
    // Initialize typing effect for hero title
    function initializeTypingEffect() {
        const titleMain = document.querySelector('.title-main');
        if (!titleMain) return;
        
        const text = titleMain.textContent;
        titleMain.textContent = '';
        titleMain.style.borderRight = '3px solid #D4A574';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                titleMain.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 150); // Plus lent pour plus d'élégance
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    titleMain.style.borderRight = 'none';
                }, 1500);
            }
        }
        
        // Start typing effect after loader disappears
        setTimeout(typeWriter, 2500);
    }
    
    // Date and time picker constraints
    function initializeDateTimePickers() {
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        
        if (dateInput) {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            
            // Set maximum date to 3 months from now
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        }
        
        if (timeInput) {
            // Set business hours (8:00 - 19:00 en semaine, 10:00 - 17:00 dimanche)
            timeInput.setAttribute('min', '08:00');
            timeInput.setAttribute('max', '19:00');
            timeInput.setAttribute('step', '1800'); // 30 minute intervals
        }
    }
    
    // Phone number formatting pour le Cameroun
    function initializePhoneFormatting() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Add country code if not present
            if (value.length > 0 && !value.startsWith('237')) {
                if (value.startsWith('6') || value.startsWith('7') || value.startsWith('9')) {
                    value = '237' + value;
                }
            }
            
            // Format the number pour le Cameroun
            if (value.length >= 3) {
                value = '+' + value.slice(0, 3) + ' ' + value.slice(3);
            }
            if (value.length >= 8) {
                value = value.slice(0, 8) + ' ' + value.slice(8);
            }
            if (value.length >= 12) {
                value = value.slice(0, 12) + ' ' + value.slice(12);
            }
            
            e.target.value = value;
        });
        
        // Placeholder avec exemple camerounais
        phoneInput.setAttribute('placeholder', '+237 6XX XXX XXX');
    }
    
    // Service card click to scroll to contact
    function initializeServiceCardClicks() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = '<i class="fas fa-calendar-alt"></i> Réserver Maintenant';
            button.style.marginTop = '20px';
            button.style.width = '100%';
            
            button.addEventListener('click', function() {
                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = contactSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Pre-fill service field
                    const serviceTitle = card.querySelector('h3').textContent;
                    const serviceSelect = document.getElementById('service');
                    if (serviceSelect) {
                        setTimeout(() => {
                            serviceSelect.focus();
                            // Try to match the service
                            for (let option of serviceSelect.options) {
                                if (option.text.toLowerCase().includes(serviceTitle.toLowerCase().split(' ')[0])) {
                                    serviceSelect.value = option.value;
                                    break;
                                }
                            }
                        }, 1000);
                    }
                }
            });
            
            card.querySelector('.service-content').appendChild(button);
        });
    }
    
    // Initialize gallery
    function initializeGallery() {
        // S'assurer que le bouton "Tout" est actif au démarrage
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
        
        // Appliquer le filtre initial avec animation
        setTimeout(() => {
            applyGalleryFilter('all');
        }, 500);
    }
    
    // Initialize all features
    function initialize() {
        initializeAnimations();
        initializeTestimonialsSlider();
        initializeParallax();
        initializeServiceCardEffects();
        initializeTypingEffect();
        initializeDateTimePickers();
        initializePhoneFormatting();
        initializeServiceCardClicks();
        initializeGallery();
        
        // Initial animation check
        animateOnScroll();
        updateActiveNavLink();
    }
    
    // Start initialization
    initialize();
    
    // WhatsApp direct link with pre-filled message pour Khanya L Salon
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = encodeURIComponent('Bonjour Khanya L Salon ! 🌟\n\nJe souhaite prendre rendez-vous pour vos services de beauté haut de gamme.\n\nPouvez-vous me donner plus d\'informations sur vos disponibilités pour :\n- Manucure/Pédicure 💅\n- Extensions de cils (Eyelash) 👁️\n- Maquillage professionnel 💄\n- Épilation sourcils (Eyebrow) ✨\n\nMerci beaucoup !');
            const whatsappUrl = `https://wa.me/237693632680?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Keyboard navigation for gallery
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
            const currentSrc = lightboxImg.src;
            const currentIndex = galleryImages.findIndex(img => img.src === currentSrc);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                lightboxImg.src = galleryImages[currentIndex - 1].src;
            } else if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) {
                lightboxImg.src = galleryImages[currentIndex + 1].src;
            }
        }
    });
    
    // Lazy loading for images
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (window.IntersectionObserver) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Call lazy loading if supported
    initializeLazyLoading();
    
    // Effet de particules dorées pour la section hero
    function createGoldenParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'golden-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #D4A574;
                border-radius: 50%;
                opacity: 0.6;
                animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                z-index: 1;
            `;
            
            hero.appendChild(particle);
        }
        
        // Add CSS animation if not exists
        if (!document.querySelector('#particles-styles')) {
            const style = document.createElement('style');
            style.id = 'particles-styles';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Créer les particules après un délai
    setTimeout(createGoldenParticles, 3000);
    
    // Ajouter des effets sonores visuels (sans son) pour les interactions
    function addVisualFeedback() {
        const buttons = document.querySelectorAll('.btn, .filter-btn, .gallery-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform += ' scale(0.95)';
                setTimeout(() => {
                    this.style.transform = this.style.transform.replace(' scale(0.95)', '');
                }, 150);
            });
        });
    }
    
    // Initialiser les effets visuels
    setTimeout(addVisualFeedback, 1000);
});

// Additional utility functions pour Khanya L Salon
function formatPhoneNumberCameroon(phoneNumber) {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a Cameroon number
    if (cleaned.startsWith('237')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)}${cleaned.slice(4, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    
    return phoneNumber;
}

function isBusinessHoursKhanyaL(date) {
    const hours = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Monday to Saturday, 8 AM to 7 PM
    return (day >= 1 && day <= 6 && hours >= 8 && hours < 19) || 
           (day === 0 && hours >= 10 && hours < 17); // Sunday 10 AM to 5 PM
}

function generateAvailableTimeSlotsKhanyaL(selectedDate) {
    const slots = [];
    const date = new Date(selectedDate);
    const day = date.getDay();
    
    let startHour, endHour;
    
    if (day === 0) { // Sunday
        startHour = 10;
        endHour = 17;
    } else { // Monday to Saturday
        startHour = 8;
        endHour = 19;
    }
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(timeString);
        }
    }
    
    return slots;
}

// Fonction pour afficher les prix des services
function displayServicePrices() {
    const servicePrices = {
        'manucure': 'À partir de 20,000 FCFA',
        'eyelash': 'À partir de 40,000 FCFA', 
        'makeup': 'À partir de 25,000 FCFA',
        'eyebrow': 'À partir de 15,000 FCFA',
        'combo': 'Pack spécial - Contactez-nous'
    };
    
    return servicePrices;
}

// Performance monitoring pour optimiser l'expérience utilisateur
function initializePerformanceMonitoring() {
    // Mesurer le temps de chargement
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Khanya L Salon - Temps de chargement: ${loadTime}ms`);
        
        // Si le chargement est lent, optimiser les animations
        if (loadTime > 3000) {
            document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
        }
    });
}

// Initialiser le monitoring
initializePerformanceMonitoring();
</rewritten_file>