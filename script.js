/* ============================================================
   HARINI S — PORTFOLIO JAVASCRIPT
   ============================================================
   This file handles three things:
   1. Scroll Reveal   — animates elements as they scroll into view
   2. Active Nav Link — highlights the current section in the nav
   3. Photo Upload    — lets you change your profile picture
   4. Contact Form    — shows a success state on submit
   ============================================================ */


/* ============================================================
   1. SCROLL REVEAL
   Every element with class "reveal" or "tl-item" starts hidden
   (defined in CSS). When it enters the viewport, we add the
   class "visible" which triggers the CSS transition.
   ============================================================ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Slight staggered delay so multiple cards don't all
        // pop in at exactly the same time
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 65);
      }
    });
  },
  { threshold: 0.1 } // trigger when 10% of the element is visible
);

// Watch all elements that should animate on scroll
document.querySelectorAll('.reveal, .tl-item').forEach(el => {
  revealObserver.observe(el);
});


/* ============================================================
   2. ACTIVE NAV LINK
   As the user scrolls, we check which section is currently in
   view and add the "active" class to the matching nav link.
   ============================================================ */

const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let currentSectionId = '';

  allSections.forEach(section => {
    // If we've scrolled past the top of this section (with a 130px offset
    // for the fixed nav bar), mark it as the current section
    if (window.scrollY >= section.offsetTop - 130) {
      currentSectionId = section.id;
    }
  });

  allNavLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === '#' + currentSectionId
    );
  });
});


/* ============================================================
   3. PHOTO UPLOAD
   When the user picks a file via the hidden <input type="file">,
   we read it as a data URL and set it as the <img> src.
   The placeholder (SVG icon) is hidden once a photo is loaded.
   ============================================================ */

const photoInput   = document.getElementById('photo-input');
const profileImg   = document.getElementById('profileImg');
const photoPlaceholder = document.getElementById('photoPlaceholder');

photoInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return; // no file selected, do nothing

  const reader = new FileReader();

  reader.onload = function (e) {
    // Set the image source to the selected file
    profileImg.src = e.target.result;
    profileImg.style.display = 'block';

    // Hide the placeholder SVG
    photoPlaceholder.style.display = 'none';
  };

  reader.readAsDataURL(file);
});


/* ============================================================
   4. CONTACT FORM
   On submit we prevent the default browser behaviour (page
   reload), show a success message on the button, then reset
   everything after 3 seconds.

   NOTE: This is a front-end-only demo. To actually send emails,
   connect this form to a service like Formspree, EmailJS,
   or your own backend.
   ============================================================ */

function handleForm(event) {
  event.preventDefault(); // stop the page from reloading

  const submitBtn = document.getElementById('submitBtn');

  // Show success state
  submitBtn.textContent = '✓ Message Sent!';
  submitBtn.style.background = '#1e6b4a'; // slightly darker green
  submitBtn.disabled = true;

  // Reset after 3 seconds
  setTimeout(() => {
    submitBtn.textContent = 'Send Message ✉️';
    submitBtn.style.background = '';
    submitBtn.disabled = false;
    event.target.reset(); // clear all form fields
  }, 3000);
}
