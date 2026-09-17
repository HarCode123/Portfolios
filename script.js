/* ============================================================
   HARINI S — PORTFOLIO JAVASCRIPT
   ============================================================
   This file handles:
   1. Scroll Reveal        — animates elements as they scroll into view
   2. Active Nav Link      — highlights the current section in the nav
   3. Photo Upload         — lets you change your profile picture
   4. Contact Form         — shows a success state on submit
   5. Hero Ambient Lighting — soft glow + cursor-follow light (hero only)
   6. Nav Scroll Blur      — deepens the nav bar's blur once you scroll
   7. Timeline Progress    — grows the vertical line + pulses each dot once
   8. Project Journey Road — draws the curved roadmap SVG + activates
                             milestone dots sequentially on scroll
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
        // pop in at exactly the same time — the delay grows with
        // each card's position in *this batch* of intersections,
        // which is what gives the "one after another" feel the
        // brief asks for rather than everything firing at once.
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 90); // slightly longer stagger than before — calmer, more deliberate reveal

        // Once revealed we don't need to keep watching this element —
        // unobserving keeps the IntersectionObserver's work light as
        // the page grows, and prevents any re-trigger on re-entry.
        revealObserver.unobserve(entry.target);
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
const navEl = document.querySelector('nav');

// A single scroll handler drives both the active-link check (existing
// behaviour) and the new nav-blur toggle (#6 below) — one listener
// instead of two keeps scroll performance the same as before.
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

  // --- 6. Nav scroll blur (see full explanation in section 6 below) ---
  // Kept inline here rather than a second listener since it needs the
  // same scrollY value we just read.
  if (navEl) {
    navEl.classList.toggle('nav-scrolled', window.scrollY > 40);
  }
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


/* ============================================================
   5. HERO AMBIENT LIGHTING
   Two purely decorative layers, injected here instead of in
   index.html so the markup stays untouched:
     a) a large blurred sage glow, fixed behind the hero content
     b) a low-opacity light that follows the cursor, but only
        while the pointer is inside the hero section
   Both are appended to #intro and styled entirely from style.css
   (.hero-ambient-glow / .hero-cursor-glow).
   ============================================================ */

const heroSection = document.getElementById('intro');

if (heroSection) {
  // (a) Static ambient glow — one element, no motion, just sets the mood
  const ambientGlow = document.createElement('div');
  ambientGlow.className = 'hero-ambient-glow';
  heroSection.appendChild(ambientGlow);

  // (b) Cursor-follow light
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'hero-cursor-glow';
  heroSection.appendChild(cursorGlow);

  // We update CSS custom properties (--mx/--my) rather than left/top,
  // so the browser only repaints the radial-gradient's position — no
  // layout or expensive reflow on every mousemove.
  heroSection.addEventListener('mousemove', (event) => {
    const bounds = heroSection.getBoundingClientRect();
    const xPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
    const yPercent = ((event.clientY - bounds.top) / bounds.height) * 100;

    cursorGlow.style.setProperty('--mx', xPercent + '%');
    cursorGlow.style.setProperty('--my', yPercent + '%');
  });

  // Fade the light in only once the cursor is actually over the hero,
  // and fade it out on leave — avoids a glow "stuck" at a stale spot.
  heroSection.addEventListener('mouseenter', () => {
    cursorGlow.classList.add('active');
  });

  heroSection.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });
}


/* ============================================================
   6. NAV SCROLL BLUR
   Toggling logic lives inside the scroll listener in section 2
   above (so we only read window.scrollY once per scroll event).
   This comment block exists just to document the CSS side:
   nav.nav-scrolled increases backdrop-filter blur/saturation and
   adds a faint shadow, purely via CSS transition — no animation
   loop needed here.
   ============================================================ */


/* ============================================================
   7. TIMELINE PROGRESS
   Two effects on the internship timeline, both scroll-driven:
     a) the vertical line "grows" as the timeline scrolls through
        view, via the --tl-progress CSS variable
     b) each dot pulses once (never loops) the moment its card
        is revealed
   ============================================================ */

const timelineEl = document.querySelector('.timeline');

if (timelineEl) {
  // (a) Growing line — recalculated on scroll using the timeline's
  // own position, so the line's growth is tied to how far the user
  // has scrolled through *this* section, not the whole page.
  const updateTimelineProgress = () => {
    const bounds = timelineEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // How far the timeline has scrolled from "just entered view"
    // (progress 0) to "fully scrolled past" (progress 1).
    const total = bounds.height + viewportHeight;
    const scrolled = viewportHeight - bounds.top;
    const progress = Math.min(Math.max(scrolled / total, 0), 1);

    timelineEl.style.setProperty('--tl-progress', progress.toFixed(3));
  };

  window.addEventListener('scroll', updateTimelineProgress);
  window.addEventListener('resize', updateTimelineProgress);
  updateTimelineProgress(); // set an initial value on load

  // (b) One-time dot pulse — reuses the same IntersectionObserver
  // pattern as the scroll-reveal above, but scoped to .tl-dot so it
  // doesn't interfere with the .visible reveal logic in section 1.
  const dotPulseObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const dot = entry.target.querySelector('.tl-dot');
          if (dot) dot.classList.add('pulse-once');
          dotPulseObserver.unobserve(entry.target); // pulses once, never again
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.tl-item').forEach(item => {
    dotPulseObserver.observe(item);
  });
}


/* ============================================================
   8. PROJECT JOURNEY ROAD
   Draws the winding S-shaped road behind the roadmap milestones.
   Rather than hand-authoring SVG path coordinates (which would
   break the moment a card's height changes), we measure every
   .rm-dot's real on-screen center and draw a smooth curve through
   those exact points. That's also what makes the road straighten
   out automatically on mobile: once the dots stack in one column
   (see the CSS media query), the same code just draws a near-
   vertical line through them — no separate mobile path needed.
   ============================================================ */

const roadmapTrack = document.getElementById('roadmapTrack');
const roadmapSvg = document.getElementById('roadmapRoad');
const roadmapTrackPath = document.getElementById('roadmapTrackPath');
const roadmapDrawPath = document.getElementById('roadmapDrawPath');
const roadmapDots = document.querySelectorAll('.rm-dot');

if (roadmapTrack && roadmapSvg && roadmapTrackPath && roadmapDrawPath && roadmapDots.length > 1) {

  // Builds a smooth curve through a list of {x, y} points using
  // cubic Bézier segments with control points pulled to the
  // midpoint height between each pair — this is what gives the
  // road its gentle S-bend as the dots alternate left and right,
  // instead of sharp zig-zag corners.
  function buildSmoothPath(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midY = (p0.y + p1.y) / 2;
      d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  // Re-measures the dots and redraws the road. Called on load and
  // on resize (debounced) since alternating sides / stacking only
  // resolve to real pixel positions once layout has settled.
  function drawRoad() {
    const trackRect = roadmapTrack.getBoundingClientRect();

    const points = Array.from(roadmapDots).map(dot => {
      const dotRect = dot.getBoundingClientRect();
      return {
        x: dotRect.left + dotRect.width / 2 - trackRect.left,
        y: dotRect.top + dotRect.height / 2 - trackRect.top
      };
    });

    roadmapSvg.setAttribute('viewBox', `0 0 ${trackRect.width} ${trackRect.height}`);

    const d = buildSmoothPath(points);
    roadmapTrackPath.setAttribute('d', d);
    roadmapDrawPath.setAttribute('d', d);

    const length = roadmapDrawPath.getTotalLength();
    roadmapDrawPath.style.strokeDasharray = length;
    updateRoadProgress(length);

    roadmapSvg.classList.add('rm-built');
  }

  // Reveals the drawn (gradient) path as the roadmap scrolls
  // through view — same progress math as the internship timeline's
  // growing line, applied to stroke-dashoffset instead of height.
  function updateRoadProgress(lengthArg) {
    const length = lengthArg || roadmapDrawPath.getTotalLength();
    const trackRect = roadmapTrack.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const total = trackRect.height + viewportHeight;
    const scrolled = viewportHeight - trackRect.top;
    const progress = Math.min(Math.max(scrolled / total, 0), 1);

    roadmapDrawPath.style.strokeDashoffset = length * (1 - progress);
  }

  window.addEventListener('scroll', () => updateRoadProgress());

  let roadResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(roadResizeTimer);
    roadResizeTimer = setTimeout(drawRoad, 150);
  });

  // Fonts and images finishing late can shift layout after our first
  // measurement, so we redraw once more on full load.
  window.addEventListener('load', drawRoad);
  drawRoad();

  // Milestone dots activate sequentially — each one lights up gold
  // the moment it scrolls into view, in natural top-to-bottom order.
  const dotActivateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rm-active');
          dotActivateObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  roadmapDots.forEach(dot => dotActivateObserver.observe(dot));
}
