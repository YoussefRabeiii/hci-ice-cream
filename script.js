let menu = document.querySelector('.bx-menu');
let navbar = document.querySelector('.navbar');

menu.addEventListener('click', function () {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('nav-toggle');
    closeNavPanels();
    closeCheckout();
});

window.addEventListener('scroll', () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('nav-toggle');
});
const header = document.querySelector('header');
window.onscroll = function () {
    if (document.documentElement.scrollTop > 5) {
        header.style.height = '70px';
    } else {
        header.style.height = '100px';
    }
};

const THEME_KEY = 'topglanceTheme';
const themeToggle = document.getElementById('themeToggle');

function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) localStorage.setItem(THEME_KEY, theme);
    const isDark = theme === 'dark';
    if (themeToggle) {
        themeToggle.setAttribute(
            'aria-label',
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
        );
        themeToggle.title = isDark ? 'Light mode' : 'Dark mode';
        themeToggle.setAttribute('aria-checked', isDark ? 'true' : 'false');
    }
}

applyTheme(getPreferredTheme(), false);
themeToggle?.addEventListener('click', () => {
    const next =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
});
const accordion = document.querySelectorAll('.contentBox');
for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener('click', function () {
        this.classList.toggle('active');
    });
}

/* —— Cart & profile (localStorage demo) —— */
const CART_KEY = 'topglanceCart';
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const cartClose = document.getElementById('cartClose');
const cartBadge = document.getElementById('cartBadge');
const cartLines = document.getElementById('cartLines');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const profileToggle = document.getElementById('profileToggle');
const profilePanel = document.getElementById('profilePanel');
const profileClose = document.getElementById('profileClose');
const fakeCardUse = document.getElementById('fakeCardUse');
const toastEl = document.getElementById('toast');
let toastTimer;

function loadCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
    syncBadge();
}

function syncBadge() {
    const n = loadCart().reduce((s, x) => s + x.qty, 0);
    cartBadge.textContent = String(n);
}

function addToCartFromButton(btn) {
    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));
    const image = btn.getAttribute('data-image') || '';
    if (!id || !name || Number.isNaN(price)) return;
    const cart = loadCart();
    const i = cart.findIndex((x) => x.id === id);
    if (i >= 0) cart[i].qty += 1;
    else cart.push({ id, name, price, image, qty: 1 });
    saveCart(cart);
    showToast('Added to cart: ' + name);
    cartPanel.hidden = false;
    cartToggle.setAttribute('aria-expanded', 'true');
    profilePanel.hidden = true;
    profileToggle.setAttribute('aria-expanded', 'false');
}

function setLineQty(id, qty) {
    const cart = loadCart();
    const i = cart.findIndex((x) => x.id === id);
    if (i < 0) return;
    if (qty < 1) cart.splice(i, 1);
    else cart[i].qty = qty;
    saveCart(cart);
}

function renderCart() {
    const cart = loadCart();
    cartLines.innerHTML = '';
    if (cart.length === 0) {
        cartEmpty.hidden = false;
        cartFooter.hidden = true;
        return;
    }
    cartEmpty.hidden = true;
    cartFooter.hidden = false;
    let total = 0;
    cart.forEach((line) => {
        const sub = line.price * line.qty;
        total += sub;
        const li = document.createElement('li');
        li.className = 'cart-line';
        const img = document.createElement('img');
        img.className = 'cart-line-thumb';
        img.src = line.image || 'images/product.png';
        img.alt = '';
        const body = document.createElement('div');
        body.className = 'cart-line-body';
        body.innerHTML =
            '<div class="cart-line-title"></div><div class="cart-line-meta"></div><div class="cart-line-actions"></div>';
        body.querySelector('.cart-line-title').textContent = line.name;
        body.querySelector('.cart-line-meta').textContent =
            '$' + line.price.toFixed(2) + ' × ' + line.qty + ' = $' + sub.toFixed(2);
        const actions = body.querySelector('.cart-line-actions');
        const minus = document.createElement('button');
        minus.type = 'button';
        minus.className = 'qty-btn';
        minus.setAttribute('aria-label', 'Decrease quantity');
        minus.textContent = '−';
        minus.addEventListener('click', () => setLineQty(line.id, line.qty - 1));
        const plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'qty-btn';
        plus.setAttribute('aria-label', 'Increase quantity');
        plus.textContent = '+';
        plus.addEventListener('click', () => setLineQty(line.id, line.qty + 1));
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'cart-remove';
        remove.textContent = 'Remove';
        remove.addEventListener('click', () => setLineQty(line.id, 0));
        actions.append(minus, plus, remove);
        li.append(img, body);
        cartLines.appendChild(li);
    });
    cartTotal.textContent = total.toFixed(2);
}

function closeNavPanels() {
    cartPanel.hidden = true;
    profilePanel.hidden = true;
    cartToggle.setAttribute('aria-expanded', 'false');
    profileToggle.setAttribute('aria-expanded', 'false');
}

function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    requestAnimationFrame(() => toastEl.classList.add('is-visible'));
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('is-visible');
        setTimeout(() => {
            toastEl.hidden = true;
        }, 400);
    }, 2600);
}

if (cartToggle && cartPanel) {
    cartToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!cartPanel.hidden) {
            closeNavPanels();
            return;
        }
        profilePanel.hidden = true;
        profileToggle.setAttribute('aria-expanded', 'false');
        cartPanel.hidden = false;
        cartToggle.setAttribute('aria-expanded', 'true');
    });
}
if (cartClose) cartClose.addEventListener('click', closeNavPanels);

if (profileToggle && profilePanel) {
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!profilePanel.hidden) {
            closeNavPanels();
            return;
        }
        cartPanel.hidden = true;
        cartToggle.setAttribute('aria-expanded', 'false');
        profilePanel.hidden = false;
        profileToggle.setAttribute('aria-expanded', 'true');
    });
}
if (profileClose) profileClose.addEventListener('click', closeNavPanels);

/* Clicks inside panels must not bubble to document: after Remove, the target node is
   detached so closest('.nav-action-wrap') fails and the panel would wrongly close. */
if (cartPanel) {
    cartPanel.addEventListener('click', (e) => e.stopPropagation());
}
if (profilePanel) {
    profilePanel.addEventListener('click', (e) => e.stopPropagation());
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.checkout-modal')) return;
    if (e.target.closest('.nav-action-wrap')) return;
    if (e.target.closest('.add-to-cart')) return;
    closeNavPanels();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (checkoutModal && !checkoutModal.hidden) closeCheckout();
        else closeNavPanels();
    }
});

document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => addToCartFromButton(btn));
});

if (fakeCardUse) {
    fakeCardUse.addEventListener('click', () => {
        showToast('Visa ending 4242 selected (demo checkout only)');
        const saved = document.getElementById('coPaySaved');
        if (saved) saved.checked = true;
        const neu = document.getElementById('coPayNew');
        if (neu) neu.checked = false;
        syncPaymentFields();
    });
}

/* —— Checkout modal (demo flow) —— */
const checkoutModal = document.getElementById('checkoutModal');
const checkoutBackdrop = document.getElementById('checkoutBackdrop');
const checkoutClose = document.getElementById('checkoutClose');
const checkoutProgress = document.getElementById('checkoutProgress');
const checkoutPrimary = document.getElementById('checkoutPrimary');
const checkoutBack = document.getElementById('checkoutBack');
const checkoutFoot = document.getElementById('checkoutFoot');
const checkoutPane1 = document.getElementById('checkoutPane1');
const checkoutPane2 = document.getElementById('checkoutPane2');
const checkoutPane3 = document.getElementById('checkoutPane3');
const checkoutPane4 = document.getElementById('checkoutPane4');
const coReviewShip = document.getElementById('coReviewShip');
const coReviewPay = document.getElementById('coReviewPay');
const coReviewLines = document.getElementById('coReviewLines');
const coReviewTotal = document.getElementById('coReviewTotal');
const coOrderId = document.getElementById('coOrderId');
const coNewCardFields = document.getElementById('coNewCardFields');
const coPaySaved = document.getElementById('coPaySaved');
const coPayNew = document.getElementById('coPayNew');

let checkoutStep = 1;

function syncPaymentFields() {
    if (!coNewCardFields || !coPayNew) return;
    coNewCardFields.hidden = !coPayNew.checked;
}

function clearCheckoutErrors() {
    document.querySelectorAll('.checkout-input-error').forEach((el) => el.classList.remove('checkout-input-error'));
    document.querySelectorAll('.checkout-error-msg').forEach((el) => el.remove());
}

function fieldError(input, msg) {
    if (!input) return;
    input.classList.add('checkout-input-error');
    const p = document.createElement('p');
    p.className = 'checkout-error-msg';
    p.textContent = msg;
    input.closest('.checkout-field')?.appendChild(p);
}

function validateShipping() {
    clearCheckoutErrors();
    const fullName = document.getElementById('coFullName');
    const email = document.getElementById('coEmail');
    const phone = document.getElementById('coPhone');
    const address = document.getElementById('coAddress');
    const city = document.getElementById('coCity');
    const zip = document.getElementById('coZip');
    let ok = true;
    if (!fullName.value.trim()) {
        fieldError(fullName, 'Please enter your name');
        ok = false;
    }
    const em = email.value.trim();
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        fieldError(email, 'Enter a valid email');
        ok = false;
    }
    if (!phone.value.trim()) {
        fieldError(phone, 'Please enter a phone number');
        ok = false;
    }
    if (!address.value.trim()) {
        fieldError(address, 'Please enter a street address');
        ok = false;
    }
    if (!city.value.trim()) {
        fieldError(city, 'Please enter a city');
        ok = false;
    }
    const z = zip.value.trim();
    if (!z || z.length < 4) {
        fieldError(zip, 'Enter a valid ZIP / postal code');
        ok = false;
    }
    return ok;
}

function cardDigitsOnly(v) {
    return v.replace(/\D/g, '');
}

function validatePayment() {
    clearCheckoutErrors();
    if (coPaySaved && coPaySaved.checked) return true;
    const name = document.getElementById('coCardName');
    const num = document.getElementById('coCardNumber');
    const exp = document.getElementById('coCardExp');
    const cvv = document.getElementById('coCardCvv');
    let ok = true;
    if (!name.value.trim()) {
        fieldError(name, 'Name on card is required');
        ok = false;
    }
    const digits = cardDigitsOnly(num.value);
    if (digits.length < 15) {
        fieldError(num, 'Enter a full card number (demo: any 16 digits)');
        ok = false;
    }
    const ex = exp.value.trim();
    if (!/^\d{2}\/\d{2}$/.test(ex)) {
        fieldError(exp, 'Use MM/YY format');
        ok = false;
    }
    const cv = cardDigitsOnly(cvv.value);
    if (cv.length < 3) {
        fieldError(cvv, 'Enter CVV (3–4 digits)');
        ok = false;
    }
    return ok;
}

function checkoutSubtotal() {
    return loadCart().reduce((s, x) => s + x.price * x.qty, 0);
}

function populateReview() {
    const fullName = document.getElementById('coFullName').value.trim();
    const email = document.getElementById('coEmail').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const address = document.getElementById('coAddress').value.trim();
    const city = document.getElementById('coCity').value.trim();
    const zip = document.getElementById('coZip').value.trim();
    coReviewShip.innerHTML =
        '<strong>Ship to</strong>' +
        fullName +
        '<br>' +
        address +
        ', ' +
        city +
        ' ' +
        zip +
        '<br>' +
        email +
        ' · ' +
        phone;
    let payHtml = '<strong>Payment</strong>';
    if (coPaySaved && coPaySaved.checked) {
        payHtml += '<br>Saved Visa ending in 4242';
    } else {
        payHtml +=
            '<br>Card ···· ' +
            cardDigitsOnly(document.getElementById('coCardNumber').value).slice(-4) +
            '<br>' +
            document.getElementById('coCardName').value.trim();
    }
    coReviewPay.innerHTML = payHtml;
    coReviewLines.innerHTML = '';
    loadCart().forEach((line) => {
        const row = document.createElement('div');
        row.className = 'checkout-review-line';
        const sub = line.price * line.qty;
        row.innerHTML =
            '<span>' +
            line.name +
            ' × ' +
            line.qty +
            '</span><span>$' +
            sub.toFixed(2) +
            '</span>';
        coReviewLines.appendChild(row);
    });
    coReviewTotal.textContent = checkoutSubtotal().toFixed(2);
}

function setProgressIndicators(step) {
    if (!checkoutProgress) return;
    const steps = checkoutProgress.querySelectorAll('.checkout-progress-step');
    steps.forEach((el) => {
        const ind = parseInt(el.getAttribute('data-ind'), 10);
        el.classList.remove('is-active', 'is-done');
        if (step <= 3) {
            if (ind < step) el.classList.add('is-done');
            else if (ind === step) el.classList.add('is-active');
        } else {
            el.classList.add('is-done');
        }
    });
}

function setCheckoutStep(step) {
    checkoutStep = step;
    clearCheckoutErrors();
    [checkoutPane1, checkoutPane2, checkoutPane3, checkoutPane4].forEach((pane, i) => {
        if (pane) pane.hidden = i + 1 !== step;
    });
    if (checkoutProgress) checkoutProgress.hidden = step === 4;
    setProgressIndicators(step);
    if (checkoutBack) checkoutBack.hidden = step === 1 || step === 4;
    if (checkoutPrimary) {
        checkoutPrimary.hidden = step === 4;
        if (step === 1) checkoutPrimary.textContent = 'Continue to payment';
        else if (step === 2) checkoutPrimary.textContent = 'Continue to review';
        else if (step === 3) checkoutPrimary.textContent = 'Place order';
    }
    if (checkoutFoot) checkoutFoot.hidden = step === 4;
}

function openCheckout() {
    if (!checkoutModal) return;
    const cart = loadCart();
    if (!cart.length) {
        showToast('Your cart is empty');
        return;
    }
    closeNavPanels();
    checkoutStep = 1;
    setCheckoutStep(1);
    checkoutModal.hidden = false;
    document.body.style.overflow = 'hidden';
    const t = document.getElementById('checkoutDialogTitle');
    if (t) t.textContent = 'Checkout';
}

function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.hidden = true;
    document.body.style.overflow = '';
    checkoutStep = 1;
    setCheckoutStep(1);
    clearCheckoutErrors();
}

function placeDemoOrder() {
    const id = 'TG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    if (coOrderId) coOrderId.textContent = id;
    saveCart([]);
    setCheckoutStep(4);
    showToast('Order placed (demo)');
}

if (coPaySaved) coPaySaved.addEventListener('change', syncPaymentFields);
if (coPayNew) coPayNew.addEventListener('change', syncPaymentFields);

if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckout);
if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
if (checkoutBack) {
    checkoutBack.addEventListener('click', () => {
        if (checkoutStep === 2) setCheckoutStep(1);
        else if (checkoutStep === 3) setCheckoutStep(2);
    });
}

if (checkoutPrimary) {
    checkoutPrimary.addEventListener('click', () => {
        if (checkoutStep === 1) {
            if (!validateShipping()) return;
            setCheckoutStep(2);
        } else if (checkoutStep === 2) {
            if (!validatePayment()) return;
            populateReview();
            setCheckoutStep(3);
        } else if (checkoutStep === 3) {
            placeDemoOrder();
        }
    });
}

const checkoutBtn = document.querySelector('.btn-checkout');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => openCheckout());
}

renderCart();
syncBadge();
