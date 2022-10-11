let notyf = new Notyf({
  ripple: false,
  duration: 3000,
});

const path = document.location.pathname;

// Navigation
const mobileNavBtn = document.querySelector(".open-mobile-nav");
const backdrop = document.querySelector(".backdrop");
const mobileNav = document.querySelector(".mobile-nav");

mobileNavBtn.addEventListener("click", () => {
  backdrop.classList.toggle("opened");
  mobileNav.classList.toggle("opened");
});

backdrop.addEventListener("click", () => {
  backdrop.classList.toggle("opened");
  mobileNav.classList.toggle("opened");
});

// Add To Cart

if (path.match(/(\/|\/product-details\/?.*)/gi)) {
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

  [].forEach.call(addToCartBtns, (addToCartBtn) => {
    addToCartBtn.addEventListener("click", () => {
      notyf.success({
        message: "Added to the cart successfully!",
        dismissible: 1,
      });
    });
  });
}

// Quantity Handlers
if (path.match(/(\/cart\/?.*|\/product-details\/?.*)/gi)) {
  const incrementBtns = document.querySelectorAll(".increment");
  const decrementBtns = document.querySelectorAll(".decrement");
  const quantityInputs = document.querySelectorAll("input.quantity");

  [].forEach.call(incrementBtns, (increment, i) => {
    increment.addEventListener("click", (e) => {
      let value = +quantityInputs[i].value;
      quantityInputs[i].value = ++value;
    });
  });

  [].forEach.call(decrementBtns, (decrement, i) => {
    decrement.addEventListener("click", () => {
      let value = +quantityInputs[i].value;

      if (!(value <= 1)) {
        quantityInputs[i].value = --value;
      }
    });
  });
}

// Remove Product from Cart
if (path.match(/(\/cart\/?.*)/gi)) {
  const removeBtns = document.querySelectorAll(".remove-btn");

  [].forEach.call(removeBtns, (removeBtn) => {
    removeBtn.addEventListener("click", (e) => {
      notyf.success({
        message: "Product Removed Successfully!",
        dismissible: 1,
      });
      console.log(removeBtn.dataset.productid);
    });
  });
}

if (path.match(/(\/add-product\/?.*)/gi)) {
  // Image Upload
  const imageInput = document.querySelector("input#image");
  const imageLabel = document.querySelector(".image-input");

  function cancel(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  function appendImagePreview(img) {
    imageLabel.innerHTML = `
    <img class="preview-image" src="${URL.createObjectURL(img)}" alt="" />
    <p>${img.name}</p>
  `;
  }

  imageLabel.addEventListener("dragenter", cancel, false);
  imageLabel.addEventListener("dragover", cancel, false);

  imageLabel.addEventListener("drop", (e) => {
    e.preventDefault();

    const dt = new DataTransfer();

    dt.items.add(e.dataTransfer.files[0]);

    e.dataTransfer.dropEffect = "copy";

    e.dataTransfer.effectAllowed = "copy";

    if (dt.files[0].type.match(/image\/.+/gi)) {
      imageInput.files = dt.files;
      appendImagePreview(dt.files[0]);
    } else {
      notyf.error({
        message: "Only Images Allowed!",
        dismissible: 1,
      });
    }
  });

  imageInput.addEventListener("change", () => {
    if (!imageInput.files[0].type.match(/image\/.+/gi)) {
      notyf.error({
        message: "Only Images Allowed!",
        dismissible: 1,
      });

      imageLabel.innerHTML = `
    <svg
      width="30px"
      height="24px"
      viewBox="0 0 24 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.569 2.398H7.829v1.586h13.74c.47 0 .826.5.826 1.094v9.853l-2.791-3.17a2.13 2.13 0 00-.74-.55 2.214 2.214 0 00-.912-.196 2.215 2.215 0 00-.912.191 2.131 2.131 0 00-.74.546l-2.93 3.385-2.973-3.36a2.147 2.147 0 00-.741-.545 2.228 2.228 0 00-1.824.007c-.286.13-.538.319-.739.553l-2.931 3.432V7.653H2.51v9.894c.023.153.06.304.108.452v.127l.041.095c.057.142.126.28.207.412l.099.15c.074.107.157.207.247.302l.124.119c.13.118.275.222.43.309h.024c.36.214.775.327 1.198.325h16.515c.36-.004.716-.085 1.039-.24.323-.153.606-.375.827-.648a2.78 2.78 0 00.504-.888c.066-.217.108-.44.124-.666V5.078a2.497 2.497 0 00-.652-1.81 2.706 2.706 0 00-1.776-.87z"
      ></path>
      <path
        d="M12.552 9.199c.912 0 1.651-.71 1.651-1.585 0-.876-.74-1.586-1.651-1.586-.912 0-1.652.71-1.652 1.586 0 .875.74 1.585 1.652 1.585zM3.303 6.408h.826V3.997h2.477v-.793-.793H4.129V0h-.826c-.219 0-.85.002-.826 0v2.411H0v1.586h2.477v2.41h.826z"
      ></path>
    </svg>
    <p>Click to add an asset or drag and drop one in this area</p>`;

      imageInput.files = new DataTransfer().files;

      return;
    }

    appendImagePreview(imageInput.files[0]);
  });

  // Add Product Form
  const addProductForm = document.querySelector(".add-product__form");

  addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch("/add-product", {
      method: "POST",
      body: new FormData(addProductForm),
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        if (res.ok) {
          notyf.success({
            message: "Product Added Successfully",
            dismissible: 1,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// Login Form

if (path.match(/(\/login\/?.*)/gi)) {
  const authFrom = document.querySelector(".auth-form.login");
  const revealPassword = document.querySelector(".reveal-password");

  authFrom.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  revealPassword.addEventListener("click", (e) => {
    e.preventDefault();
    const icon = revealPassword.firstElementChild;

    if (authFrom.password.type === "password") {
      authFrom.password.type = "text";
    } else {
      authFrom.password.type = "password";
    }

    if (icon.classList.contains("gg-eye-alt")) {
      icon.classList.remove("gg-eye-alt");
      icon.classList.add("gg-eye");
    } else {
      icon.classList.remove("gg-eye");
      icon.classList.add("gg-eye-alt");
    }
  });
}
