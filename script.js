// Simple button interaction
document.getElementById("contactBtn").addEventListener("click", () => {
    alert("Thank you for reaching out! I will contact you soon.");
});

// Smooth scrolling
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
    });
});
document.querySelectorAll(".media-links a").forEach(icon => {
    icon.addEventListener("mouseover", () => {
        icon.style.opacity = "0.7";
    });
    icon.addEventListener("mouseout", () => {
        icon.style.opacity = "1";
    });
});

// Soft section reveal on scroll
// Each .section fades in and shifts up slightly the first time it enters
// the viewport, then stays visible (no re-triggering on scroll back up).
const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    }
);

document.querySelectorAll(".section").forEach(section => {
    sectionObserver.observe(section);
});
