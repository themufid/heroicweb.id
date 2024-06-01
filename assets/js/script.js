// Function to set the theme and update UI
function setTheme(theme) {
  document.body.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);
  var switchThemeBtn = document.getElementById("switchTheme");
  if (switchThemeBtn) {
    switchThemeBtn.innerHTML =
      theme === "dark"
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-stars-fill"></i>';
  }
  //console.log(`Switched to ${theme} theme`);
}

var currentTheme = localStorage.getItem("theme") || "dark";
setTheme(currentTheme);

// Event listener for the switch theme button
var switchThemeBtn = document.getElementById("switchTheme");
if (switchThemeBtn) {
  switchThemeBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(currentTheme);
  });
}

//AOS Initiliaze
AOS.init();

// Fixed Header & back to top button on Scroll
window.addEventListener("scroll", () => {
  // fixed header
  const header = document.getElementById("header");
  if (window.scrollY > 30 && !header.classList.contains("fixed-top")) {
    header.classList.add("fixed-top");
    document
      .getElementById("offcanvasNavbar")
      .classList.add("fixedHeaderNavbar");
  } else if (window.scrollY <= 30 && header.classList.contains("fixed-top")) {
    header.classList.remove("fixed-top");
    document
      .getElementById("offcanvasNavbar")
      .classList.remove("fixedHeaderNavbar");
  }

  //backtotop
  const backToTopButton = document.getElementById("backToTopButton");
  if (window.scrollY > 400 && backToTopButton.style.display === "none") {
    backToTopButton.style.display = "block";
  } else if (
    window.scrollY <= 400 &&
    backToTopButton.style.display === "block"
  ) {
    backToTopButton.style.display = "none";
  }
});

//jumping to top function
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//Testimonial Slider
$(document).ready(function () {
  $("#testimonial-slider").owlCarousel({
    items: 3,
    nav: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1170: {
        items: 3,
      },
    },
  });
});

// TIME
function updateClock() {
  var now = new Date();

  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  var timeString = hours + ":" + minutes + ":" + seconds; // 24-hour format
  // var timeString = hours % 12 || 12 + ':' + minutes + ':' + seconds + (hours >= 12 ? ' PM' : ' AM'); // 12-hour format

  document.getElementById("current-time").textContent = timeString;
}

updateClock();

setInterval(updateClock, 1000);

// Search
function toggleSearchContainer() {
  var searchContainer = document.querySelector('.search-container');
  if (searchContainer.style.display === 'none' || searchContainer.style.display === '') {
      searchContainer.style.display = 'block';
  } else {
      searchContainer.style.display = 'none';
  }
}

// Contact Email
document.addEventListener("DOMContentLoaded", function() {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      const emailContent = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

      window.location.href = `mailto:almufid.business@gmail.com?subject=Message from ${name}&body=${encodeURIComponent(emailContent)}`;
  });
});

// AI Tools (img generator)
const url = "https://api.openai.com/v1/images/generations";
  const text = document.getElementById("text");
  const image = document.getElementById("image");
  const btn = document.getElementById("btn");
  const sizeSelect = document.getElementById("sizeSelect");
  const numImagesSelect = document.getElementById("numImagesSelect");
  const loadingSpinner = document.getElementById("loading");
  const apiDiv = document.getElementsByClassName("apiDiv");
  const apiInput = document.getElementById("api");

  const sizeOptions = ["256", "512", "1024", "1280", "2560", "3840", "5120", "7680"];
  const optionsFragment = document.createDocumentFragment();

  sizeOptions.forEach((size) => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = size;
    optionsFragment.appendChild(option);
  });

  sizeSelect.appendChild(optionsFragment);

  for (let i = 1; i <= 10; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    numImagesSelect.appendChild(option);
  }

  let imageSizes = sizeSelect.value;
  let numImages = parseInt(numImagesSelect.value);
  let apiKey = "";

  function generateImage() {
    if (apiKey === "") {
      apiKey = apiInput.value.trim() || api;
      if (apiKey === "") {
        alert("Please enter your OpenAI API key");
        return;
      }
      apiDiv[0].classList.add("hidden");
      apiDiv[1].classList.add("hidden");
    }
    if (text.value === "") {
      alert("Please enter a value");
      return;
    }

    loadingSpinner.classList.remove("hidden");
    btn.disabled = true;

    const data = {
      prompt: text.value,
      n: numImages,
      size: `${imageSizes}x${imageSizes}`,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        loadingSpinner.classList.add("hidden");
        btn.disabled = false;

        data.data.forEach((item) => {
          const img = document.createElement("img");
          img.src = item.url;
          img.alt = "image";
          img.classList.add(
            "w-full",
            "h-auto",
            "rounded-lg",
            "shadow-lg",
            "hover:shadow-2xl",
            "transition",
            "duration-500",
            "ease-in-out",
            "transform",
            "hover:-translate-y-1",
            "hover:scale-103"
          );

          image.appendChild(img);

          // Double-click event listener
          img.addEventListener("dblclick", () => {
            downloadImage(item.url);
          });
        });
      })
      .catch((err) => {
        console.log(err);
        loadingSpinner.classList.add("hidden");
        btn.disabled = false;
        alert("Something went wrong. Please try again.");
      });
  }

  const checkAuthor = document.getElementById("checkAuthor");
  if (checkAuthor.children[0].children[0].textContent !== "@sauravhathi") {
    window.location.href = "https://github.com/sauravhathi";
  }

  text.addEventListener("input", function () {
    if (text.value === "") {
      btn.classList.remove("bg-slate-900", "text-slate-50");
      text.classList.add("border-r-2", "border-gray-200");
    } else {
      text.classList.remove("border-r-2", "border-gray-200");
      btn.classList.add("bg-slate-900", "text-slate-50");
    }
  });

  sizeSelect.addEventListener("change", function () {
    imageSizes = sizeSelect.value;
  });

  numImagesSelect.addEventListener("change", function () {
    numImages = parseInt(numImagesSelect.value);
  });

  btn.addEventListener("click", generateImage);

  function downloadImage(url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = document.getElementById("text").value.split(" ").join("_") + ".png";
    link.target = "_blank";
    link.click();
  }

  // AI Tools (qrcode generator)
  const container = document.querySelector(".container");
qrInput = container.querySelector(".form input");
generateBtn = container.querySelector(".form button");
qrImg = container.querySelector(".qr-code img");

let preValue;

generateBtn.addEventListener("click", () => {
    let qrValue = qrInput.value.trim();
    if (!qrValue || preValue === qrValue) return;
    preValue = qrValue;
    generateBtn.innerText = "Generating QR Code...";
    qrImg.src = ` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrValue}`;

    qrImg.addEventListener("load", () => {
        container.classList.add("active");
        generateBtn.innerText = "Generate QR Code";
    });
});

qrInput.addEventListener("keyup", () => {
    if (!qrInput.value.trim()) {
        container.classList.remove("active");
        preValue = "";
    }
});
