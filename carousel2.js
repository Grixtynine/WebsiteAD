const imagesList1 = [
{"src":"images/1.jpg","link":"https://google.com","alt":"","name":"image 1"},
{"src":"images/2.jpg","link":"https://youtube.com","alt":"","name":"image 2"},
{"src":"images/3.jpg","link":"https://bing.com","alt":"","name":"image 3"},
{"src":"images/8.png","link":"https://yahoo.com","alt":"","name":"image 4"}
];

function simpleSlider2(selector, imagesList, options = {}) {
const slider = typeof selector === "string"
? document.querySelector(selector)
: selector;

if (!slider || !Array.isArray(imagesList) || imagesList.length === 0) {
    console.warn("simpleSlider2: Invalid slider element or empty images list.");
    return null;
}

const {
    startIndex = 0,
    animationClass = "fade-animation",
    autoplay = false,
    autoplayDelay = 3000,
    pauseOnHover = true
} = options;

const track = slider.querySelector(".slider-track");
const dotsContainer = slider.querySelector(".slide-dots");
const prevBtn = slider.querySelector(".slide-prev");
const nextBtn = slider.querySelector(".slide-next");

if (!track || !dotsContainer || !prevBtn || !nextBtn) {
    console.warn("simpleSlider2: Required carousel elements not found.");
    return null;
}

let index = startIndex;
const total = imagesList.length;
let autoplayTimer = null;

track.innerHTML = imagesList.map(img => `
    <a ${img.link ? `href="${img.link}" target="_blank"` : ""} class="slide ${animationClass}">
        <img src="${img.src}" alt="${img.alt || ""}">
    </a>
`).join("");

dotsContainer.innerHTML = imagesList.map((_, i) => `
    <a href="#" class="slide-dot" data-id="${i}"></a>
`).join("");

const slides = slider.querySelectorAll(".slide");
const dots = slider.querySelectorAll(".slide-dot");

const showSlide = (i) => {
    index = (i + total) % total;

    slides.forEach((slide, idx) => {
        slide.style.display = idx === index ? "flex" : "none";
        dots[idx].classList.toggle("dot-active", idx === index);
    });
};

const startAutoplay = () => {
    if (!autoplay || autoplayTimer) return;

    autoplayTimer = setInterval(() => {
        showSlide(index + 1);
    }, autoplayDelay);
};

const stopAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
};

prevBtn.addEventListener("click", e => {
    e.preventDefault();
    showSlide(index - 1);
});

nextBtn.addEventListener("click", e => {
    e.preventDefault();
    showSlide(index + 1);
});

dotsContainer.addEventListener("click", e => {
    const dot = e.target.closest(".slide-dot");

    if (!dot) return;

    e.preventDefault();
    showSlide(Number(dot.dataset.id));
});

if (pauseOnHover && autoplay) {
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
}

showSlide(index);
startAutoplay();

return {
    next: () => showSlide(index + 1),
    prev: () => showSlide(index - 1),
    goTo: (i) => showSlide(i),
    play: startAutoplay,
    pause: stopAutoplay,
    getIndex: () => index
};

}

const slider2 = simpleSlider2("#hcg-slider-2", imagesList1, {
autoplay: false,
autoplayDelay: 2000,
pauseOnHover: true
});