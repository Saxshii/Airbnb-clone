(() => {
  'use strict'
  
  const forms = document.querySelectorAll('.needs-validation')

  
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Wishlist heart toggle
document.addEventListener("click", function(e) {
    const btn = e.target.closest(".wishlist-btn");
    if (btn) {
        e.preventDefault();
        const icon = btn.querySelector("i");
        icon.classList.toggle("fa-regular");
        icon.classList.toggle("fa-solid");
        icon.style.color = icon.classList.contains("fa-solid") ? "#fe424d" : "white";
    }
});

// Wishlist functionality
function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
}
function saveWishlist(list) {
    localStorage.setItem("wishlist", JSON.stringify(list));
}
function updateHearts() {
    const wishlist = getWishlist();
    document.querySelectorAll(".wishlist-btn").forEach(btn => {
        const id = btn.dataset.id;
        const icon = btn.querySelector("i");
        if (wishlist.includes(id)) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            icon.style.color = "#fe424d";
        }
    });
}
document.addEventListener("click", function(e) {
    const btn = e.target.closest(".wishlist-btn");
    if (btn) {
        e.preventDefault();
        const id = btn.dataset.id;
        const icon = btn.querySelector("i");
        let wishlist = getWishlist();
        if (wishlist.includes(id)) {
            wishlist = wishlist.filter(i => i !== id);
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
            icon.style.color = "white";
        } else {
            wishlist.push(id);
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            icon.style.color = "#fe424d";
        }
        saveWishlist(wishlist);
    }
});
document.addEventListener("DOMContentLoaded", updateHearts);