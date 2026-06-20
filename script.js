// --- Mobile Hamburger Menu Logic (With 'X' Animation) ---
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
});

document.querySelectorAll(".nav-links li").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
    });
});

// --- Magnetic Button Animation Logic ---
const magneticBtn = document.querySelector('.magnetic-btn');

if (magneticBtn) {
    magneticBtn.addEventListener('mousemove', (e) => {
        const position = magneticBtn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        magneticBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    magneticBtn.addEventListener('mouseleave', () => {
        magneticBtn.style.transform = 'translate(0px, 0px)';
        magneticBtn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.3, 1)';
    });
    
    magneticBtn.addEventListener('mouseenter', () => {
        magneticBtn.style.transition = 'none';
    });
}

// --- Scroll Reveal Animation Logic (Intersection Observer) ---
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal-up, .reveal-wipe, .reveal-spread, .reveal-scale");

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" 
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
});