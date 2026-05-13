let navMenuToggle = document.getElementById("navMenuToggle");
let navbar = document.querySelector(".navbar");

function syncMobileNavExpanded() {
	if (!navMenuToggle || !navbar) return;
	const open = navbar.classList.contains("nav-toggle");
	navMenuToggle.setAttribute("aria-expanded", open ? "true" : "false");
	navMenuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navMenuToggle?.addEventListener("click", function () {
	navMenuToggle.classList.toggle("bx-x");
	navbar.classList.toggle("nav-toggle");
	syncMobileNavExpanded();
	closeNavPanels({ restoreFocus: false });
	closeCheckout();
});

navbar?.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => {
		navMenuToggle?.classList.remove("bx-x");
		navbar?.classList.remove("nav-toggle");
		syncMobileNavExpanded();
	});
});

window.addEventListener("scroll", () => {
	navMenuToggle?.classList.remove("bx-x");
	navbar?.classList.remove("nav-toggle");
	syncMobileNavExpanded();
	closeNavPanels({ restoreFocus: false });
});
syncMobileNavExpanded();
const header = document.querySelector("header");
window.onscroll = function () {
	if (document.documentElement.scrollTop > 5) {
		header.style.height = "70px";
	} else {
		header.style.height = "100px";
	}
};

const THEME_KEY = "topglanceTheme";
const themeToggle = document.getElementById("themeToggle");

function getPreferredTheme() {
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === "dark" || stored === "light") return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyTheme(theme, persist) {
	document.documentElement.setAttribute("data-theme", theme);
	if (persist) localStorage.setItem(THEME_KEY, theme);
	const isDark = theme === "dark";
	if (themeToggle) {
		themeToggle.setAttribute(
			"aria-label",
			isDark ? "Switch to light mode" : "Switch to dark mode",
		);
		themeToggle.title = isDark ? "Light mode" : "Dark mode";
		themeToggle.setAttribute("aria-checked", isDark ? "true" : "false");
	}
}

applyTheme(getPreferredTheme(), false);
themeToggle?.addEventListener("click", () => {
	const next =
		document.documentElement.getAttribute("data-theme") === "dark"
			? "light"
			: "dark";
	applyTheme(next, true);
});
function initAccordion() {
	document.querySelectorAll(".accordion .contentBox").forEach((box) => {
		const btn = box.querySelector(".accordion-trigger");
		const panel = box.querySelector(".accordion-panel");
		if (!btn || !panel) return;

		btn.addEventListener("click", () => {
			const willOpen = !box.classList.contains("active");
			document.querySelectorAll(".accordion .contentBox").forEach((other) => {
				if (other === box) return;
				other.classList.remove("active");
				const ob = other.querySelector(".accordion-trigger");
				const op = other.querySelector(".accordion-panel");
				ob?.setAttribute("aria-expanded", "false");
				op?.setAttribute("aria-hidden", "true");
			});
			box.classList.toggle("active", willOpen);
			btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
			panel.setAttribute("aria-hidden", willOpen ? "false" : "true");
		});
	});
}

initAccordion();

/* —— Cart & profile (localStorage demo) —— */
const CART_KEY = "topglanceCart";
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const cartBadge = document.getElementById("cartBadge");
const cartLines = document.getElementById("cartLines");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartTotal = document.getElementById("cartTotal");
const profileToggle = document.getElementById("profileToggle");
const profilePanel = document.getElementById("profilePanel");
const profileClose = document.getElementById("profileClose");
const fakeCardUse = document.getElementById("fakeCardUse");
const loginFlow = document.getElementById("loginFlow");
const loginStepEmail = document.getElementById("loginStepEmail");
const loginStepCode = document.getElementById("loginStepCode");
const loginEmail = document.getElementById("loginEmail");
const loginCode = document.getElementById("loginCode");
const loginContinue = document.getElementById("loginContinue");
const loginVerify = document.getElementById("loginVerify");
const loginBack = document.getElementById("loginBack");
const loginSignOut = document.getElementById("loginSignOut");
const profileSignedIn = document.getElementById("profileSignedIn");
const profileEmail = document.getElementById("profileEmail");
const savedCardBlock = document.getElementById("savedCardBlock");
const toastEl = document.getElementById("toast");
const checkoutAnnounceEl = document.getElementById("checkoutAnnounce");
let toastTimer;
let pendingLoginEmail = "demo@topglance.ice";

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
	if (cartBadge) cartBadge.textContent = String(n);
}

function addToCartFromButton(btn) {
	const id = btn.getAttribute("data-id");
	const name = btn.getAttribute("data-name");
	const price = parseFloat(btn.getAttribute("data-price"));
	const image = btn.getAttribute("data-image") || "";
	if (!id || !name || Number.isNaN(price)) return;
	const cart = loadCart();
	const i = cart.findIndex((x) => x.id === id);
	if (i >= 0) cart[i].qty += 1;
	else cart.push({ id, name, price, image, qty: 1 });
	saveCart(cart);
	showToast("Added to cart: " + name);
}

function initProductOptions() {
	const optionGroups = document.querySelectorAll(".product-options");
	optionGroups.forEach((group) => {
		const section = group.closest(".product-page");
		const priceEl = section?.querySelector(".product-price-row strong");
		const addBtns = section?.querySelectorAll(".add-to-cart") || [];
		const baseName = addBtns[0]?.getAttribute("data-name") || "";
		const baseId = addBtns[0]?.getAttribute("data-id") || "";

		group.querySelectorAll(".product-option").forEach((option) => {
			option.addEventListener("click", () => {
				const size = option.getAttribute("data-size") || option.textContent.trim();
				const price = option.getAttribute("data-price");
				if (!price) return;

				group.querySelectorAll(".product-option").forEach((other) => {
					const selected = other === option;
					other.classList.toggle("is-selected", selected);
					other.setAttribute("aria-pressed", selected ? "true" : "false");
				});

				if (priceEl) priceEl.textContent = "$" + Number(price).toFixed(2);
				addBtns.forEach((btn) => {
					btn.setAttribute("data-price", price);
					if (baseName) btn.setAttribute("data-name", baseName + " - " + size);
					if (baseId) btn.setAttribute("data-id", baseId + "-" + size.toLowerCase().replace(/\s+/g, "-"));
				});
			});
		});
	});
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
	if (!cartLines) return;
	cartLines.innerHTML = "";
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
		const li = document.createElement("li");
		li.className = "cart-line";
		const img = document.createElement("img");
		img.className = "cart-line-thumb";
		img.src = line.image || "images/product.png";
		img.alt = line.name;
		const body = document.createElement("div");
		body.className = "cart-line-body";
		body.innerHTML =
			'<div class="cart-line-title"></div><div class="cart-line-meta"></div><div class="cart-line-actions"></div>';
		body.querySelector(".cart-line-title").textContent = line.name;
		body.querySelector(".cart-line-meta").textContent =
			"$" + line.price.toFixed(2) + " × " + line.qty + " = $" + sub.toFixed(2);
		const actions = body.querySelector(".cart-line-actions");
		const minus = document.createElement("button");
		minus.type = "button";
		minus.className = "qty-btn";
		minus.setAttribute(
			"aria-label",
			"Decrease quantity of " + line.name + " in cart",
		);
		minus.textContent = "−";
		minus.addEventListener("click", () => setLineQty(line.id, line.qty - 1));
		const plus = document.createElement("button");
		plus.type = "button";
		plus.className = "qty-btn";
		plus.setAttribute(
			"aria-label",
			"Increase quantity of " + line.name + " in cart",
		);
		plus.textContent = "+";
		plus.addEventListener("click", () => setLineQty(line.id, line.qty + 1));
		const remove = document.createElement("button");
		remove.type = "button";
		remove.className = "cart-remove";
		remove.setAttribute("aria-label", "Remove " + line.name + " from cart");
		remove.textContent = "Remove";
		actions.append(minus, plus, remove);
		li.append(img, body);
		cartLines.appendChild(li);
	});
	if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

let navPanelPreviousFocus = null;

function closeNavPanels(options = {}) {
	const restore = options.restoreFocus === true;
	const ref = restore ? navPanelPreviousFocus : null;
	if (cartPanel) cartPanel.hidden = true;
	if (profilePanel) profilePanel.hidden = true;
	cartToggle?.setAttribute("aria-expanded", "false");
	profileToggle?.setAttribute("aria-expanded", "false");
	navPanelPreviousFocus = null;
	if (ref && typeof ref.focus === "function") {
		try {
			ref.focus();
		} catch (_) {}
	}
}

function showToast(msg) {
	if (!toastEl) return;
	toastEl.textContent = msg;
	toastEl.hidden = false;
	clearTimeout(toastTimer);
	requestAnimationFrame(() => toastEl.classList.add("is-visible"));
	toastTimer = setTimeout(() => {
		toastEl.classList.remove("is-visible");
		setTimeout(() => {
			toastEl.hidden = true;
		}, 400);
	}, 2600);
}

if (cartToggle && cartPanel) {
	cartToggle.addEventListener("click", (e) => {
		e.stopPropagation();
		if (!cartPanel.hidden) {
			closeNavPanels({ restoreFocus: true });
			return;
		}
		navPanelPreviousFocus = document.activeElement;
		if (profilePanel) profilePanel.hidden = true;
		profileToggle?.setAttribute("aria-expanded", "false");
		cartPanel.hidden = false;
		cartToggle.setAttribute("aria-expanded", "true");
		requestAnimationFrame(() => {
			const focusables = getFocusableElements(cartPanel);
			(focusables[0] || cartClose)?.focus?.();
		});
	});
}
if (cartClose)
	cartClose.addEventListener("click", () =>
		closeNavPanels({ restoreFocus: true }),
	);

if (profileToggle && profilePanel) {
	profileToggle.addEventListener("click", (e) => {
		e.stopPropagation();
		if (!profilePanel.hidden) {
			closeNavPanels({ restoreFocus: true });
			return;
		}
		navPanelPreviousFocus = document.activeElement;
		if (cartPanel) cartPanel.hidden = true;
		cartToggle?.setAttribute("aria-expanded", "false");
		profilePanel.hidden = false;
		profileToggle.setAttribute("aria-expanded", "true");
		requestAnimationFrame(() => {
			const focusables = getFocusableElements(profilePanel);
			(focusables[0] || profileClose)?.focus?.();
		});
	});
}
if (profileClose)
	profileClose.addEventListener("click", () =>
		closeNavPanels({ restoreFocus: true }),
	);

function setLoginError(input) {
	if (!input) return;
	input.classList.add("login-input-error");
	input.setAttribute("aria-invalid", "true");
}

function clearLoginError(input) {
	if (!input) return;
	input.classList.remove("login-input-error");
	input.removeAttribute("aria-invalid");
}

function showLoginStep(step) {
	if (!loginStepEmail || !loginStepCode) return;
	const verify = step === "code";
	loginStepEmail.hidden = verify;
	loginStepCode.hidden = !verify;
	requestAnimationFrame(() => {
		(verify ? loginCode : loginEmail)?.focus?.();
	});
}

function renderLoginState(isSignedIn) {
	if (loginFlow) loginFlow.hidden = isSignedIn;
	if (profileSignedIn) profileSignedIn.hidden = !isSignedIn;
	if (savedCardBlock) savedCardBlock.hidden = !isSignedIn;
	if (profileEmail) profileEmail.textContent = pendingLoginEmail;
	profileToggle?.setAttribute(
		"aria-label",
		isSignedIn ? "Account, signed in" : "Account login",
	);
}

renderLoginState(false);

loginContinue?.addEventListener("click", () => {
	const email = loginEmail?.value.trim() || "";
	clearLoginError(loginEmail);
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		setLoginError(loginEmail);
		showToast("Enter a valid email for the demo login");
		return;
	}
	pendingLoginEmail = email;
	showLoginStep("code");
	showToast("Fake verification code sent: 123456");
});

loginVerify?.addEventListener("click", () => {
	const code = loginCode?.value.trim() || "";
	clearLoginError(loginCode);
	if (code !== "123456") {
		setLoginError(loginCode);
		showToast("Use demo code 123456");
		return;
	}
	renderLoginState(true);
	showToast("Signed in with fake two-step verification");
});

loginBack?.addEventListener("click", () => {
	clearLoginError(loginCode);
	if (loginCode) loginCode.value = "";
	showLoginStep("email");
});

loginSignOut?.addEventListener("click", () => {
	renderLoginState(false);
	showLoginStep("email");
	if (loginCode) loginCode.value = "";
	showToast("Signed out of demo account");
});

loginEmail?.addEventListener("input", () => clearLoginError(loginEmail));
loginCode?.addEventListener("input", () => clearLoginError(loginCode));

/* Clicks inside panels must not bubble to document: after Remove, the target node is
   detached so closest('.nav-action-wrap') fails and the panel would wrongly close. */
if (cartPanel) {
	cartPanel.addEventListener("click", (e) => e.stopPropagation());
}
if (profilePanel) {
	profilePanel.addEventListener("click", (e) => e.stopPropagation());
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
	btn.addEventListener("click", () => addToCartFromButton(btn));
});

initProductOptions();

if (fakeCardUse) {
	fakeCardUse.addEventListener("click", () => {
		showToast("Visa ending 4242 selected (demo checkout only)");
		const saved = document.getElementById("coPaySaved");
		if (saved) saved.checked = true;
		const neu = document.getElementById("coPayNew");
		if (neu) neu.checked = false;
		syncPaymentFields();
	});
}

/* —— Checkout modal (demo flow) —— */
const checkoutModal = document.getElementById("checkoutModal");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutProgress = document.getElementById("checkoutProgress");
const checkoutPrimary = document.getElementById("checkoutPrimary");
const checkoutBack = document.getElementById("checkoutBack");
const checkoutFoot = document.getElementById("checkoutFoot");
const checkoutPane1 = document.getElementById("checkoutPane1");
const checkoutPane2 = document.getElementById("checkoutPane2");
const checkoutPane3 = document.getElementById("checkoutPane3");
const checkoutPane4 = document.getElementById("checkoutPane4");
const coReviewShip = document.getElementById("coReviewShip");
const coReviewPay = document.getElementById("coReviewPay");
const coReviewLines = document.getElementById("coReviewLines");
const coReviewTotal = document.getElementById("coReviewTotal");
const coOrderId = document.getElementById("coOrderId");
const coNewCardFields = document.getElementById("coNewCardFields");
const coPaySaved = document.getElementById("coPaySaved");
const coPayNew = document.getElementById("coPayNew");

let checkoutPreviousFocus = null;

function getFocusableElements(root) {
	const sel =
		'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
	return Array.from(root.querySelectorAll(sel)).filter((el) => {
		if (el.hasAttribute("disabled")) return false;
		if (el.closest("[hidden]")) return false;
		if (typeof el.checkVisibility === "function") {
			return el.checkVisibility({
				checkOpacity: true,
				checkVisibilityCSS: true,
			});
		}
		return el.getClientRects().length > 0;
	});
}

function checkoutFocusTrap(e) {
	if (!checkoutModal || checkoutModal.hidden || e.key !== "Tab") return;
	const dialog =
		checkoutModal.querySelector(".checkout-dialog-surface") || checkoutModal;
	const focusables = getFocusableElements(dialog);
	if (focusables.length === 0) return;
	const first = focusables[0];
	const last = focusables[focusables.length - 1];
	if (e.shiftKey) {
		if (document.activeElement === first) {
			e.preventDefault();
			last.focus();
		}
	} else if (document.activeElement === last) {
		e.preventDefault();
		first.focus();
	}
}

function trapNavPanelFocus(e) {
	if (e.key !== "Tab") return;
	let panel = null;
	if (cartPanel && !cartPanel.hidden) panel = cartPanel;
	else if (profilePanel && !profilePanel.hidden) panel = profilePanel;
	if (!panel) return;
	const focusables = getFocusableElements(panel);
	if (focusables.length === 0) return;
	const first = focusables[0];
	const last = focusables[focusables.length - 1];
	if (e.shiftKey) {
		if (document.activeElement === first) {
			e.preventDefault();
			last.focus();
		}
	} else if (document.activeElement === last) {
		e.preventDefault();
		first.focus();
	}
}

let checkoutStep = 1;

function syncPaymentFields() {
	if (!coNewCardFields || !coPayNew) return;
	coNewCardFields.hidden = !coPayNew.checked;
}

function clearCheckoutErrors() {
	document
		.querySelectorAll(".checkout-input-error")
		.forEach((el) => el.classList.remove("checkout-input-error"));
	document.querySelectorAll("#checkoutModal input").forEach((inp) => {
		inp.removeAttribute("aria-invalid");
		const d = inp.getAttribute("aria-describedby");
		if (!d) return;
		const kept = d.split(/\s+/).filter((id) => !id.startsWith("co-err-"));
		if (kept.length) inp.setAttribute("aria-describedby", kept.join(" "));
		else inp.removeAttribute("aria-describedby");
	});
	document.querySelectorAll(".checkout-error-msg").forEach((el) => el.remove());
}

function announceCheckout(msg) {
	if (!checkoutAnnounceEl || !msg) return;
	checkoutAnnounceEl.textContent = "";
	requestAnimationFrame(() => {
		checkoutAnnounceEl.textContent = msg;
	});
}

function fieldError(input, msg) {
	if (!input) return;
	input.classList.add("checkout-input-error");
	input.setAttribute("aria-invalid", "true");
	const errId =
		"co-err-" +
		(input.id || "anon") +
		"-" +
		String(Date.now() + Math.random()).replace(/\W/g, "").slice(-8);
	const p = document.createElement("p");
	p.id = errId;
	p.className = "checkout-error-msg";
	p.setAttribute("role", "alert");
	p.textContent = msg;
	const described = input.getAttribute("aria-describedby");
	if (described) {
		const ids = described
			.split(/\s+/)
			.filter((id) => !id.startsWith("co-err-"));
		ids.push(errId);
		input.setAttribute("aria-describedby", ids.join(" "));
	} else {
		input.setAttribute("aria-describedby", errId);
	}
	input.closest(".checkout-field")?.appendChild(p);
	announceCheckout(msg);
}

function validateShipping() {
	clearCheckoutErrors();
	const fullName = document.getElementById("coFullName");
	const email = document.getElementById("coEmail");
	const phone = document.getElementById("coPhone");
	const address = document.getElementById("coAddress");
	const city = document.getElementById("coCity");
	const zip = document.getElementById("coZip");
	let ok = true;
	let firstInvalid = null;
	if (!fullName.value.trim()) {
		fieldError(fullName, "Please enter your name");
		ok = false;
		if (!firstInvalid) firstInvalid = fullName;
	}
	const em = email.value.trim();
	if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
		fieldError(email, "Enter a valid email");
		ok = false;
		if (!firstInvalid) firstInvalid = email;
	}
	if (!phone.value.trim()) {
		fieldError(phone, "Please enter a phone number");
		ok = false;
		if (!firstInvalid) firstInvalid = phone;
	}
	if (!address.value.trim()) {
		fieldError(address, "Please enter a street address");
		ok = false;
		if (!firstInvalid) firstInvalid = address;
	}
	if (!city.value.trim()) {
		fieldError(city, "Please enter a city");
		ok = false;
		if (!firstInvalid) firstInvalid = city;
	}
	const z = zip.value.trim();
	if (!z || z.length < 4) {
		fieldError(zip, "Enter a valid ZIP / postal code");
		ok = false;
		if (!firstInvalid) firstInvalid = zip;
	}
	if (!ok && firstInvalid) firstInvalid.focus();
	return ok;
}

function cardDigitsOnly(v) {
	return v.replace(/\D/g, "");
}

function validatePayment() {
	clearCheckoutErrors();
	if (coPaySaved && coPaySaved.checked) return true;
	const name = document.getElementById("coCardName");
	const num = document.getElementById("coCardNumber");
	const exp = document.getElementById("coCardExp");
	const cvv = document.getElementById("coCardCvv");
	let ok = true;
	let firstInvalid = null;
	if (!name.value.trim()) {
		fieldError(name, "Name on card is required");
		ok = false;
		if (!firstInvalid) firstInvalid = name;
	}
	const digits = cardDigitsOnly(num.value);
	if (digits.length < 15) {
		fieldError(num, "Enter a full card number (demo: any 16 digits)");
		ok = false;
		if (!firstInvalid) firstInvalid = num;
	}
	const ex = exp.value.trim();
	if (!/^\d{2}\/\d{2}$/.test(ex)) {
		fieldError(exp, "Use MM/YY format");
		ok = false;
		if (!firstInvalid) firstInvalid = exp;
	}
	const cv = cardDigitsOnly(cvv.value);
	if (cv.length < 3) {
		fieldError(cvv, "Enter CVV (3–4 digits)");
		ok = false;
		if (!firstInvalid) firstInvalid = cvv;
	}
	if (!ok && firstInvalid) firstInvalid.focus();
	return ok;
}

function checkoutSubtotal() {
	return loadCart().reduce((s, x) => s + x.price * x.qty, 0);
}

function populateReview() {
	const fullName = document.getElementById("coFullName").value.trim();
	const email = document.getElementById("coEmail").value.trim();
	const phone = document.getElementById("coPhone").value.trim();
	const address = document.getElementById("coAddress").value.trim();
	const city = document.getElementById("coCity").value.trim();
	const zip = document.getElementById("coZip").value.trim();
	coReviewShip.innerHTML =
		"<strong>Ship to</strong>" +
		fullName +
		"<br>" +
		address +
		", " +
		city +
		" " +
		zip +
		"<br>" +
		email +
		" · " +
		phone;
	let payHtml = "<strong>Payment</strong>";
	if (coPaySaved && coPaySaved.checked) {
		payHtml += "<br>Saved Visa ending in 4242";
	} else {
		payHtml +=
			"<br>Card ···· " +
			cardDigitsOnly(document.getElementById("coCardNumber").value).slice(-4) +
			"<br>" +
			document.getElementById("coCardName").value.trim();
	}
	coReviewPay.innerHTML = payHtml;
	coReviewLines.innerHTML = "";
	loadCart().forEach((line) => {
		const row = document.createElement("div");
		row.className = "checkout-review-line";
		const sub = line.price * line.qty;
		row.innerHTML =
			"<span>" +
			line.name +
			" × " +
			line.qty +
			"</span><span>$" +
			sub.toFixed(2) +
			"</span>";
		coReviewLines.appendChild(row);
	});
	coReviewTotal.textContent = checkoutSubtotal().toFixed(2);
}

function setProgressIndicators(step) {
	if (!checkoutProgress) return;
	const steps = checkoutProgress.querySelectorAll(".checkout-progress-step");
	steps.forEach((el) => {
		const ind = parseInt(el.getAttribute("data-ind"), 10);
		el.classList.remove("is-active", "is-done");
		if (step <= 3) {
			if (ind < step) el.classList.add("is-done");
			else if (ind === step) el.classList.add("is-active");
		} else {
			el.classList.add("is-done");
		}
	});
}

function setCheckoutStep(step) {
	checkoutStep = step;
	clearCheckoutErrors();
	[checkoutPane1, checkoutPane2, checkoutPane3, checkoutPane4].forEach(
		(pane, i) => {
			if (pane) pane.hidden = i + 1 !== step;
		},
	);
	if (checkoutProgress) checkoutProgress.hidden = step === 4;
	setProgressIndicators(step);
	if (checkoutBack) checkoutBack.hidden = step === 1 || step === 4;
	if (checkoutPrimary) {
		checkoutPrimary.hidden = step === 4;
		if (step === 1) checkoutPrimary.textContent = "Continue to payment";
		else if (step === 2) checkoutPrimary.textContent = "Continue to review";
		else if (step === 3) checkoutPrimary.textContent = "Place order";
	}
	if (checkoutFoot) checkoutFoot.hidden = step === 4;
}

function openCheckout() {
	if (!checkoutModal) return;
	const cart = loadCart();
	if (!cart.length) {
		showToast("Your cart is empty");
		return;
	}
	const active = document.activeElement;
	if (cartPanel && !cartPanel.hidden && active && cartPanel.contains(active)) {
		checkoutPreviousFocus = cartToggle || active;
	} else {
		checkoutPreviousFocus = active;
	}
	closeNavPanels({ restoreFocus: false });
	checkoutStep = 1;
	setCheckoutStep(1);
	checkoutModal.hidden = false;
	document.body.style.overflow = "hidden";
	const t = document.getElementById("checkoutDialogTitle");
	if (t) t.textContent = "Checkout";
	requestAnimationFrame(() => {
		const dialog =
			checkoutModal.querySelector(".checkout-dialog-surface") || checkoutModal;
		const focusables = getFocusableElements(dialog);
		const nameField = document.getElementById("coFullName");
		if (nameField && focusables.includes(nameField)) nameField.focus();
		else if (focusables.length) focusables[0].focus();
	});
}

function closeCheckout() {
	if (!checkoutModal) return;
	checkoutModal.hidden = true;
	document.body.style.overflow = "";
	checkoutStep = 1;
	setCheckoutStep(1);
	clearCheckoutErrors();
	const ref = checkoutPreviousFocus;
	checkoutPreviousFocus = null;
	if (ref && typeof ref.focus === "function") {
		try {
			ref.focus();
		} catch (_) {}
	}
}

function placeDemoOrder() {
	const id =
		"TG-" +
		Date.now().toString(36).toUpperCase() +
		"-" +
		Math.random().toString(36).slice(2, 6).toUpperCase();
	if (coOrderId) coOrderId.textContent = id;
	saveCart([]);
	setCheckoutStep(4);
	showToast("Order placed (demo)");
	requestAnimationFrame(() => checkoutDoneSuccess?.focus());
}

if (coPaySaved) coPaySaved.addEventListener("change", syncPaymentFields);
if (coPayNew) coPayNew.addEventListener("change", syncPaymentFields);

if (checkoutBackdrop) checkoutBackdrop.addEventListener("click", closeCheckout);
if (checkoutClose) checkoutClose.addEventListener("click", closeCheckout);
if (checkoutBack) {
	checkoutBack.addEventListener("click", () => {
		if (checkoutStep === 2) setCheckoutStep(1);
		else if (checkoutStep === 3) setCheckoutStep(2);
	});
}

if (checkoutPrimary) {
	checkoutPrimary.addEventListener("click", () => {
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

const checkoutBtn = document.getElementById("cartCheckoutBtn");
const checkoutDoneSuccess = document.getElementById("checkoutDoneSuccess");
if (checkoutBtn) {
	checkoutBtn.addEventListener("click", () => openCheckout());
}
if (checkoutDoneSuccess) {
	checkoutDoneSuccess.addEventListener("click", () => closeCheckout());
}

document.addEventListener("click", (e) => {
	if (e.target.closest(".checkout-modal")) return;
	if (e.target.closest(".nav-action-wrap")) return;
	if (e.target.closest(".add-to-cart")) return;
	closeNavPanels({ restoreFocus: true });
});

document.addEventListener("keydown", (e) => {
	if (checkoutModal && !checkoutModal.hidden) checkoutFocusTrap(e);
	else trapNavPanelFocus(e);
	if (e.key === "Escape") {
		if (checkoutModal && !checkoutModal.hidden) closeCheckout();
		else closeNavPanels({ restoreFocus: true });
	}
});

renderCart();
syncBadge();
