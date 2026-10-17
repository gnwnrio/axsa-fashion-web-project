const products = [
	{
		id: "the-heritage-knit-cardigan",
		name: "The Heritage Knit",
		price: 890000,
		priceLabel: "Rp 890.000",
		color: "Natural / 3 colours",
		image: "https://6ad33d4d2ff4c710e5e49d62.imgix.net/sandbox/The%20Heritage%20Knit.jpg?fit=crop&w=1000&q=85",
		alt: "An ivory oversized cable-knit cardigan with brown buttons",
		imageAlt: "https://6ad33d4d2ff4c710e5e49d62.imgix.net/sandbox/The%20Heritage%20Knit-2.jpg?fit=crop&w=1000&q=85",
	},
	{
		id: "the-classic-tweed-a-line-skirt",
		name: "The Classic Tweed A-Line",
		price: 1250000,
		priceLabel: "Rp 1.250.000",
		color: "Grey tweed / 2 colours",
		image: "https://6ad33d4d2ff4c710e5e49d62.imgix.net/sandbox/The%20Classic%20Tweed%20A-Line%20Skirt.jpg?fit=crop&w=1000&q=85",
		alt: "A grey tweed A-line skirt with a high-waisted design, featuring a button detail and soft box pleats",
		imageAlt: "https://6ad33d4d2ff4c710e5e49d62.imgix.net/sandbox/The%20Classic%20Tweed%20A-Line%20Skirt-2.jpg?fit=crop&w=1000&q=85",
	},
	{
		id: "the-boulevard-vest",
		name: "The Boulevard Vest",
		price: 450000,
		priceLabel: "Rp 450.000",
		color: "Chalk / 4 colours",
		image: "https://6ad33d4d2ff4c710e5e49d62.imgix.net/sandbox/The%20Boulevard%20Vest.jpg?fit=crop&w=1000&q=85",
		alt: "A relaxed-fit vest in a soft chalk colour",
		imageAlt: "https://6ad33d4d2ff4c710e5e49d62.imgix.net/sandbox/The%20Boulevard%20Vest-2.jpg?fit=crop&w=1000&q=85",
	},
	{
		id: "the-laze-buttoned-dress",
		name: "The Laze Buttoned Dress",
		price: 1850000,
		priceLabel: "Rp 1.850.000",
		color: "Oat / 2 colours",
		image: "https://6ad33d4d2ff4c710e5e49d62.imgix.net/sandbox/The%20Laze%20Buttoned%20Dress.jpg?fit=crop&w=1000&q=85",
		alt: "A relaxed-fit dress in a soft oat colour",
		imageAlt: "https://6ad33d4d2ff4c710e5e49d62.imgix.net/sandbox/The%20Laze%20Buttoned%20Dress-2.jpg?fit=crop&w=1000&q=85",
	},
];

const articles = [
	{
		category: "Wardrobe notes",
		title: "Building a Timeless Wardrobe",
		readTime: "5 min read",
		image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85",
		alt: "A considered edit of neutral everyday clothing",
	},
	{
		category: "Materials",
		title: "The Beauty of Natural Texture",
		readTime: "4 min read",
		image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1000&q=85",
		alt: "Close view of natural fabric, folds, and quiet material detail",
	},
	{
		category: "Personal style",
		title: "The Art of Wearing Neutrals",
		readTime: "6 min read",
		image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
		alt: "Editorial fashion portrait in understated neutral styling",
	},
];

const productGrid = document.querySelector("[data-product-grid]");
const journalGrid = document.querySelector("[data-journal-grid]");
const searchPanel = document.querySelector("[data-search-panel]");
const productPanel = document.querySelector("[data-product-panel]");
const overlay = document.querySelector("[data-overlay]");
let lastFocusedElement = null;

const openingIntro = document.querySelector("[data-opening-intro]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (openingIntro && !reducedMotion) {
	const openingWords = [...openingIntro.querySelectorAll(".opening-word")];
	let introFrame = 0;
	document.documentElement.classList.add("intro-enabled");
	openingIntro.setAttribute("aria-hidden", "false");
	if ("scrollRestoration" in history) history.scrollRestoration = "manual";
	window.scrollTo(0, 0);

	const smoothStep = (start, end, value) => {
		const position = Math.min(1, Math.max(0, (value - start) / (end - start)));
		return position * position * (3 - 2 * position);
	};

	const updateOpeningIntro = () => {
		const scrollDistance = openingIntro.offsetHeight - window.innerHeight;
		const progress = scrollDistance > 0
			? Math.min(1, Math.max(0, -openingIntro.getBoundingClientRect().top / scrollDistance))
			: 1;
		const opacityValues = [
			1 - smoothStep(.18, .34, progress),
			smoothStep(.24, .4, progress) * (1 - smoothStep(.48, .64, progress)),
			smoothStep(.56, .72, progress),
		];

		openingWords.forEach((word, index) => {
			const opacity = opacityValues[index];
			word.style.opacity = opacity.toFixed(3);
			word.style.transform = `translateY(${((1 - opacity) * 22).toFixed(1)}px)`;
		});
		document.documentElement.style.setProperty("--opening-content-reveal", smoothStep(.84, 1, progress).toFixed(3));
		introFrame = 0;
	};

	const scheduleOpeningUpdate = () => {
		if (!introFrame) introFrame = window.requestAnimationFrame(updateOpeningIntro);
	};

	updateOpeningIntro();
	window.addEventListener("scroll", scheduleOpeningUpdate, { passive: true });
	window.addEventListener("resize", scheduleOpeningUpdate);
} else if (openingIntro) {
	openingIntro.hidden = true;
	if (!window.location.hash) {
		if ("scrollRestoration" in history) history.scrollRestoration = "manual";
		window.scrollTo(0, 0);
	}
}

const renderProducts = () => {
	productGrid.innerHTML = products.map((product) => `
		<article class="product-card">
			<div class="product-media media-frame" data-fallback="${product.name}">
				<img class="product-image-main" src="${product.image}" alt="${product.alt}" loading="lazy">
				<img class="product-image-alt" src="${product.imageAlt}" alt="" aria-hidden="true" loading="lazy">
				<button class="product-view" type="button" data-view-product="${product.id}" aria-label="Preview ${product.name}">View piece &nbsp; ↗</button>
			</div>
			<div class="product-details"><h3>${product.name}</h3><p>${product.priceLabel}</p></div>
			<div class="product-meta"><span>AXSA essentials</span><span>${product.color}</span></div>
		</article>
	`).join("");
};

const renderArticles = () => {
	journalGrid.innerHTML = articles.map((article, index) => `
		<article class="journal-card">
			<a href="#newsletter" aria-label="Read ${article.title}">
				<div class="journal-image media-frame" data-fallback="AXSA Journal / 0${index + 1}"><img src="${article.image}" alt="${article.alt}" loading="lazy"></div>
				<div class="journal-meta"><span>${article.category}</span><span>${article.readTime}</span></div>
				<h3>${article.title}</h3>
			</a>
		</article>
	`).join("");
};

const setPanelState = (panel, isOpen) => {
	panel.classList.toggle("is-open", isOpen);
	panel.setAttribute("aria-hidden", String(!isOpen));
	panel.inert = !isOpen;
};

const openPanel = (panel) => {
	lastFocusedElement = document.activeElement;
	overlay.hidden = false;
	requestAnimationFrame(() => overlay.classList.add("is-visible"));
	document.body.classList.add("panel-open");
	setPanelState(panel, true);
	const focusTarget = panel.matches("[data-search-panel]")
		? panel.querySelector(".search-input")
		: panel.querySelector("button");
	focusTarget?.focus({ preventScroll: true });
};

const closePanels = () => {
	setPanelState(searchPanel, false);
	setPanelState(productPanel, false);
	overlay.classList.remove("is-visible");
	document.body.classList.remove("panel-open");
	window.setTimeout(() => { overlay.hidden = true; }, 260);
	lastFocusedElement?.focus({ preventScroll: true });
};

const showProductPreview = (id) => {
	const product = products.find((item) => item.id === id);
	if (!product) return;
	document.querySelector("[data-product-preview]").innerHTML = `
		<img class="preview-image" src="${product.image}" alt="${product.alt}">
		<div class="preview-copy"><p class="eyebrow">AXSA essentials</p><h3>${product.name}</h3><p class="preview-price">${product.priceLabel}</p><p class="preview-description">A thoughtful wardrobe essential, made to bring ease and intention to everyday dressing.</p><div class="preview-detail"><span>Colour</span><span>${product.color}</span></div><p class="preview-note">A considered look at the details and materials.</p></div>
	`;
	const image = document.querySelector(".preview-image");
	image.addEventListener("error", () => {
		image.hidden = true;
		image.parentElement.classList.add("image-failed");
	}, { once: true });
	document.querySelector("[data-product-panel]").setAttribute("aria-labelledby", "product-panel-title");
	document.querySelector("#product-panel-title").textContent = product.name;
	openPanel(productPanel);
};

const renderSearchResults = (query = "") => {
	const results = document.querySelector("[data-search-results]");
	const term = query.trim().toLowerCase();
	if (!term) {
		results.innerHTML = "<p>Explore our collection and journal.</p>";
		return;
	}
	const matchedProducts = products.filter((product) => `${product.name} ${product.color}`.toLowerCase().includes(term));
	const matchedArticles = articles.filter((article) => `${article.title} ${article.category}`.toLowerCase().includes(term));
	const entries = [
		...matchedProducts.map((product) => `<a class="search-result" href="#collection" data-search-destination="collection"><span>${product.name}</span><small>${product.priceLabel}</small></a>`),
		...matchedArticles.map((article) => `<a class="search-result" href="#journal" data-search-destination="journal"><span>${article.title}</span><small>${article.readTime}</small></a>`),
	];
	results.innerHTML = entries.length ? entries.join("") : "<p>No matches yet. Try another search.</p>";
};

renderProducts();
renderArticles();

for (const image of document.querySelectorAll("img")) {
	image.addEventListener("error", () => {
		const frame = image.closest(".media-frame");
		if (frame) frame.classList.add("image-failed");
		image.hidden = true;
	}, { once: true });
}

document.addEventListener("click", (event) => {
	const target = event.target.closest("button, a");
	if (!target) return;

	if (target.matches("[data-open-search]")) {
		renderSearchResults();
		openPanel(searchPanel);
	}
	if (target.matches("[data-close-panels]") || event.target === overlay) closePanels();

	if (target.matches("[data-view-product]")) showProductPreview(target.dataset.viewProduct);
	if (target.matches("[data-menu-toggle]")) {
		const menu = document.querySelector("[data-menu-toggle]");
		const nav = document.querySelector("[data-main-nav]") || document.querySelector(".main-nav");
		const isOpen = menu.getAttribute("aria-expanded") === "true";
		menu.setAttribute("aria-expanded", String(!isOpen));
		menu.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
		nav.classList.toggle("is-open", !isOpen);
	}
	if (target.matches(".main-nav a")) {
		document.querySelector("[data-menu-toggle]").setAttribute("aria-expanded", "false");
		document.querySelector("[data-menu-toggle]").setAttribute("aria-label", "Open navigation");
		document.querySelector(".main-nav").classList.remove("is-open");
	}
	if (target.matches("[data-search-destination]")) closePanels();
});

document.querySelector("[data-search-panel]").addEventListener("input", (event) => {
	if (event.target.matches(".search-input")) renderSearchResults(event.target.value);
});

document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
	event.preventDefault();
	renderSearchResults(event.currentTarget.elements["site-search"].value);
});

document.querySelector("[data-newsletter-form]").addEventListener("submit", (event) => {
	event.preventDefault();
	const form = event.currentTarget;
	const emailInput = form.elements.email;
	const feedback = document.querySelector("[data-newsletter-feedback]");
	const email = emailInput.value.trim();
	feedback.dataset.state = "";
	if (!email || !emailInput.validity.valid) {
		feedback.dataset.state = "error";
		feedback.textContent = "Please enter a valid email address.";
		emailInput.focus();
		return;
	}
	feedback.textContent = "Thank you. Your subscription is confirmed in this local preview.";
	form.reset();
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closePanels();
		const menu = document.querySelector("[data-menu-toggle]");
		menu.setAttribute("aria-expanded", "false");
		menu.setAttribute("aria-label", "Open navigation");
		document.querySelector(".main-nav").classList.remove("is-open");
	}
});