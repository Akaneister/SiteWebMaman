// ===========================
// Menu Toggle pour mobile
// ===========================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const navbar = document.getElementById('navbar');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Fermer le menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===========================
// Navbar au scroll
// ===========================
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 2px 20px rgba(139, 69, 19, 0.15)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 2px 10px rgba(139, 69, 19, 0.1)';
    }
});

// ===========================
// Smooth scroll avec offset pour la navbar
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Gestion du formulaire de contact
// ===========================
const contactForm = document.getElementById('contactForm');

function showNotification(message, type = 'info') {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification fixed top-[100px] right-5 text-white px-6 py-4 rounded-lg shadow-popup z-[10000] max-w-[300px] animate-slide-in ${
        type === 'success' ? 'bg-[#27ae60]' : type === 'error' ? 'bg-[#e74c3c]' : 'bg-[#3498db]'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('animate-slide-in');
        notification.classList.add('animate-slide-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

let formSubmitCount = 0;
let lastSubmitTime = 0;

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) {
            e.preventDefault();
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        // Protection anti-spam : limite de 3 soumissions par minute
        const currentTime = Date.now();
        if (currentTime - lastSubmitTime < 60000) {
            formSubmitCount++;
            if (formSubmitCount > 3) {
                e.preventDefault();
                showNotification('Trop de tentatives. Veuillez patienter une minute.', 'error');
                return;
            }
        } else {
            formSubmitCount = 1;
        }
        lastSubmitTime = currentTime;
    });
}

// ===========================
// Lien actif dans la navigation au scroll
// ===========================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + navbar.offsetHeight + 50;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
});
