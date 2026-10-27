/* =========================================================
   ARCLIFT - script.js
   Fitur interaktif:
   1. Menu hamburger (mobile)
   2. Countdown drop koleksi
   3. Filter produk berdasarkan kategori
   4. Tambah ke keranjang + notifikasi
   5. Accordion FAQ
   6. Validasi form newsletter
   7. Validasi & ringkasan form member (Bootstrap)
   ========================================================= */

// Jalankan semua kode setelah HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. MENU HAMBURGER ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", function () {
    // toggle() menambah kelas jika belum ada, menghapus jika sudah ada
    const isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // Tutup menu setelah salah satu link diklik
  const navLinks = mainNav.querySelectorAll("a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });


  /* ---------- 2. COUNTDOWN DROP ---------- */
  // Target: 7 hari dari saat halaman dibuka
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const countdownEl = document.getElementById("countdown");

  // Menambahkan angka 0 di depan jika < 10 (contoh: 5 -> "05")
  function pad(number) {
    return number < 10 ? "0" + number : String(number);
  }

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now; // selisih dalam milidetik

    if (diff <= 0) {
      clearInterval(timer);
      countdownEl.innerHTML = "<p><strong>DROP SUDAH DIBUKA!</strong></p>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCountdown();                              // tampilkan langsung
  const timer = setInterval(updateCountdown, 1000); // perbarui tiap 1 detik


  /* ---------- 3. FILTER PRODUK ---------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Pindahkan kelas "active" ke tombol yang diklik
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      const filter = button.dataset.filter; // ambil nilai data-filter

      productCards.forEach(function (card) {
        const category = card.dataset.category;
        if (filter === "semua" || filter === category) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });


  /* ---------- 4. KERANJANG + NOTIFIKASI ---------- */
  const addCartButtons = document.querySelectorAll(".add-cart");
  const cartCountEl = document.getElementById("cartCount");
  const cartBtn = document.getElementById("cartBtn");
  const notif = document.getElementById("notif");
  let cartItems = []; // menyimpan nama produk yang ditambahkan
  let notifTimeout;

  function showToast(message) {
    notif.textContent = message;
    notif.classList.add("show");
    clearTimeout(notifTimeout); // reset timer jika notif muncul lagi
    notifTimeout = setTimeout(function () {
      notif.classList.remove("show");
    }, 2500);
  }

  addCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productName = button.dataset.name;
      cartItems.push(productName);

      // Perbarui angka keranjang di header
      cartCountEl.textContent = cartItems.length;

      // Jalankan ulang animasi "bump"
      cartCountEl.classList.remove("bump");
      void cartCountEl.offsetWidth; // trik agar animasi bisa diulang
      cartCountEl.classList.add("bump");

      showToast(productName + " ditambahkan ke keranjang");
    });
  });

  // Klik tombol keranjang untuk melihat ringkasan isi
  cartBtn.addEventListener("click", function () {
    if (cartItems.length === 0) {
      showToast("Keranjang masih kosong");
    } else {
      showToast("Isi keranjang: " + cartItems.length + " produk");
    }
  });


  /* ---------- 5. ACCORDION FAQ ---------- */
  const accordionItems = document.querySelectorAll(".faq-item");

  accordionItems.forEach(function (item) {
    const header = item.querySelector(".faq-question");
    const body = item.querySelector(".faq-answer");

    header.addEventListener("click", function () {
      const isActive = item.classList.contains("active");

      // Tutup semua item lain terlebih dahulu
      accordionItems.forEach(function (otherItem) {
        otherItem.classList.remove("active");
        otherItem.querySelector(".faq-answer").style.maxHeight = null;
        otherItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      // Buka item yang diklik jika sebelumnya tertutup
      if (!isActive) {
        item.classList.add("active");
        body.style.maxHeight = body.scrollHeight + "px"; // tinggi sesuai isi
        header.setAttribute("aria-expanded", "true");
      }
    });
  });


  /* ---------- 6. VALIDASI FORM NEWSLETTER ---------- */
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("email");
  const formMessage = document.getElementById("formMessage");

  // Pola sederhana: teks@teks.teks
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // cegah halaman reload

    const email = emailInput.value.trim();

    if (email === "") {
      setFormMessage("Email tidak boleh kosong.", true);
    } else if (!emailPattern.test(email)) {
      setFormMessage("Format email tidak valid. Contoh: nama@email.com", true);
    } else {
      setFormMessage("Terima kasih! Kode diskon 10% dikirim ke " + email, false);
      form.reset();
    }
  });

  function setFormMessage(text, isError) {
    formMessage.textContent = text;
    formMessage.classList.toggle("error", isError);
    emailInput.classList.toggle("invalid", isError);
  }

  /* ---------- 7. FORM MEMBER (BOOTSTRAP) ---------- */
  const memberForm = document.getElementById("memberForm");
  const namaInput = document.getElementById("nama");
  const alamatInput = document.getElementById("alamat");
  const kotaSelect = document.getElementById("kota");
  const hobiCheckboxes = document.querySelectorAll('input[name="hobi"]');
  const hobiError = document.getElementById("hobiError");
  const memberResult = document.getElementById("memberResult");

  // Memberi tanda valid / tidak valid memakai kelas bawaan Bootstrap
  function setValid(element, isValid) {
    element.classList.toggle("is-invalid", !isValid);
    element.classList.toggle("is-valid", isValid);
  }

  // Mengambil daftar hobi yang dicentang
  function getHobiTerpilih() {
    const terpilih = [];
    hobiCheckboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        terpilih.push(checkbox.value);
      }
    });
    return terpilih;
  }

  // Menampilkan ringkasan data menggunakan createElement (manipulasi DOM)
  function tampilkanRingkasan(data) {
    memberResult.innerHTML = "";

    const judul = document.createElement("h3");
    judul.textContent = "Pendaftaran berhasil!";
    memberResult.appendChild(judul);

    const daftar = document.createElement("dl");
    const baris = [
      ["Nama", data.nama],
      ["Alamat", data.alamat],
      ["Kota", data.kota],
      ["Hobi", data.hobi.join(", ")]
    ];
    baris.forEach(function (item) {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = item[0];
      dd.textContent = item[1]; // textContent aman dari kode HTML berbahaya
      daftar.appendChild(dt);
      daftar.appendChild(dd);
    });
    memberResult.appendChild(daftar);
    memberResult.hidden = false;
  }

  memberForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = namaInput.value.trim();
    const alamat = alamatInput.value.trim();
    const kota = kotaSelect.value;
    const hobi = getHobiTerpilih();

    const namaValid = nama.length >= 3;
    const alamatValid = alamat !== "";
    const kotaValid = kota !== "";
    const hobiValid = hobi.length > 0;

    setValid(namaInput, namaValid);
    setValid(alamatInput, alamatValid);
    setValid(kotaSelect, kotaValid);
    hobiError.classList.toggle("d-block", !hobiValid);

    if (namaValid && alamatValid && kotaValid && hobiValid) {
      tampilkanRingkasan({ nama: nama, alamat: alamat, kota: kota, hobi: hobi });
      showToast("Terima kasih, " + nama + "! Kamu resmi jadi member.");

      // Kosongkan form dan hapus tanda hijau
      memberForm.reset();
      [namaInput, alamatInput, kotaSelect].forEach(function (el) {
        el.classList.remove("is-valid");
      });
    } else {
      memberResult.hidden = true;
    }
  });

  // Hapus tanda merah saat pengguna mulai memperbaiki isian
  [namaInput, alamatInput].forEach(function (el) {
    el.addEventListener("input", function () {
      el.classList.remove("is-invalid");
    });
  });
  kotaSelect.addEventListener("change", function () {
    kotaSelect.classList.remove("is-invalid");
  });
  hobiCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      if (getHobiTerpilih().length > 0) {
        hobiError.classList.remove("d-block");
      }
    });
  });

});
