document.addEventListener('DOMContentLoaded', function () {
  // ------------ Dining Areas Cards ------------
  const diningAreas = [
    { name: "Multi-Location Restaurants", icon: "fa-location-dot", color: "#6a5acd" },
    { name: "Neighborhood Spots", icon: "fa-tree", color: "#27ae60" },
    { name: "Fast Casual Restaurants", icon: "fa-burger", color: "#e67e22" },
    { name: "Fine Dining", icon: "fa-star", color: "#f1c40f" },
    { name: "Bars", icon: "fa-martini-glass", color: "#9b59b6" },
    { name: "Pizzerias", icon: "fa-pizza-slice", color: "#e74c3c" },
    { name: "Wineries", icon: "fa-wine-glass", color: "#8e44ad" },
    { name: "Breweries", icon: "fa-beer-mug-empty", color: "#f39c12" },
    { name: "Private Chefs", icon: "fa-user", color: "#34495e" },
    { name: "Hospitality Groups", icon: "fa-hotel", color: "#2980b9" },
    { name: "Clubs & Nightlife", icon: "fa-music", color: "#e84393" },
    { name: "Ghost Kitchens", icon: "fa-ghost", color: "#7f8c8d" },
    { name: "Hotel Restaurants", icon: "fa-bell-concierge", color: "#16a085" },
    { name: "Food Trucks", icon: "fa-truck", color: "#d35400" },
    { name: "Food Halls", icon: "fa-store", color: "#2c3e50" },
    { name: "New Restaurant Openings", icon: "fa-utensils", color: "#2ecc71" },
    { name: "Bakeries", icon: "fa-bread-slice", color: "#d35400" },
    { name: "Coffee Shops", icon: "fa-mug-hot", color: "#6f4e37" }
  ];

  const grid = document.getElementById('dining-grid');
  if (grid) {
    diningAreas.forEach(area => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="icon"><i class="fas ${area.icon}" style="color: ${area.color};"></i></div><div>${area.name}</div>`;
      card.onclick = () => {
        localStorage.setItem('dineArea', area.name);
        showToast(`Selected: ${area.name}`);
      };
      grid.appendChild(card);
    });
  }

  // ------------ Continue Button Logic ------------
  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      const selectedArea = localStorage.getItem('dineArea');
      if (selectedArea) {
        continueBtn.disabled = true;
        document.querySelector('.btn-text').style.display = 'none';
        document.querySelector('.spinner').style.display = 'inline-block';
        setTimeout(() => {
          window.location.href = 'booking-slot.html';
        }, 1200);
      } else {
        alert("Please select a dining area first.");
      }
    });
  }

  // ------------ Set Today's Date for Booking ------------
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  // ------------ Confirmation Page Fill ------------
  if (window.location.pathname.includes('confirmation.html')) {
    const slot = JSON.parse(localStorage.getItem("dineSlot"));
    const area = localStorage.getItem("dineArea");
    const user = JSON.parse(localStorage.getItem("userData"));

    document.getElementById("userName").textContent = user?.name || "Guest";
    document.getElementById("userEmail").textContent = user?.email || "Not provided";
    document.getElementById("bookingDate").textContent = slot?.date || "N/A";
    document.getElementById("bookingTime").textContent = slot?.time || "N/A";
    document.getElementById("diningArea").textContent = area || "N/A";
  }

  // ------------ Arrow Reveal "Why Dine" Section ------------
  const arrowBtn = document.getElementById("revealWhyDine");
  if (arrowBtn) {
    arrowBtn.addEventListener('click', () => {
      const whySection = document.getElementById("whyDineSection");
      if (whySection) {
        whySection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

// ------------ Show Toast Notification ------------
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `${message}<span class="close-btn" onclick="hideToast()">×</span>`;
  toast.classList.add('visible');
  setTimeout(hideToast, 3000);
}
function hideToast() {
  const toast = document.getElementById('toast');
  if (toast) toast.classList.remove('visible');
}

// ------------ Submit Slot & Redirect ------------
function submitSlot() {
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  if (!date || !time) {
    alert("Please select both date and time.");
    return;
  }
  localStorage.setItem("dineSlot", JSON.stringify({ date, time }));
  alert(`Slot confirmed for ${date} at ${time}`);
  window.location.href = "confirmation.html";
}

// ------------ Download Booking PDF ------------
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const name = document.getElementById("userName").textContent;
  const email = document.getElementById("userEmail").textContent;
  const date = document.getElementById("bookingDate").textContent;
  const time = document.getElementById("bookingTime").textContent;
  const area = document.getElementById("diningArea").textContent;

  doc.setFontSize(16);
  doc.text("Booking Confirmation Receipt", 20, 20);
  doc.setFontSize(12);
  doc.text(`Name: ${name}`, 20, 40);
  doc.text(`Email: ${email}`, 20, 50);
  doc.text(`Date: ${date}`, 20, 60);
  doc.text(`Time: ${time}`, 20, 70);
  doc.text(`Dining Area: ${area}`, 20, 80);

  doc.save("booking_receipt.pdf");
}
const details = JSON.parse(localStorage.getItem('bookingDetails') || '{}');

if (!details.name || !details.email || !details.phone) {
  alert("Missing user details. Please start from the beginning.");
  window.location.href = "details.html";
  return;
}

const bookingData = {
  ...details,
  date,
  time,
  city: localStorage.getItem('dineCity'),
  restaurant: localStorage.getItem('dineRestaurant'),
  area: localStorage.getItem('dineArea')
};

sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
window.location.href = 'confirmation.html';
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  const isVisible = section.style.display === 'block';
  section.style.display = isVisible ? 'none' : 'block';
}
function goToSignin() {
  window.location.href = "signin.html"; // or "/signin" for MERN route
}

