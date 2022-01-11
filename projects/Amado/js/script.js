function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});


;


// Функции ресайза и скролла
(function (window, document) {
	let footerNav = document.querySelector('.footer__nav');
	let scrollUp = document.querySelector('[data-scroll-up]');
	let fixedImages = document.querySelectorAll('.fixedimages-img');

	window.addEventListener('resize', function () {
		if (window.innerWidth > 991.99) {
			footerNav.classList.remove('show');
			footerNav.removeAttribute('style');
		}
		for (let i = 0; i < fixedImages.length; i++) {
			fixedImages[i].style.maxHeight = document.documentElement.clientHeight + 'px';
		}
	});

	window.addEventListener('scroll', function () {
		if (window.pageYOffset > 295) {
			scrollUp.classList.add('active');
		} else {
			scrollUp.classList.remove('active');
		}
	});

	scrollUp.addEventListener('click', function () {
		window.scrollTo(0, 0);
	});
})(window, document);

// Функции поиска
(function (document) {
	let searchPage = document.querySelector('.search-page');
	let mainContent = document.querySelector('.page__maincontent');
	let searchLink = document.querySelector('[data-search-link]');
	let closeSearchEl = document.querySelector('[data-close-search');
	searchLink.addEventListener('click', showSearch);
	closeSearchEl.addEventListener('click', closeSearch);

	// Показать поиск
	function showSearch(e) {
		e.preventDefault();
		if (searchPage.classList.contains('search-open') && mainContent.classList.contains('search-open')) {
			closeSearch(e);
		} else {
			searchPage.classList.add('search-open');
			mainContent.classList.add('search-open');
		}
	}
	// Закрыть поиск
	function closeSearch(e) {
		e.preventDefault();
		searchPage.classList.remove('search-open');
		mainContent.classList.remove('search-open');
	}
})(document);

// Функции сайдбара
(function (document) {
	let sidebar = document.querySelector('.sidebar');
	let iconMenu = document.querySelector('.icon-menu');
	let btnCloseMenu = document.querySelector('[data-close-icon-menu');

	if (iconMenu && btnCloseMenu) {
		iconMenu.addEventListener('click', toggleSidebar);
		btnCloseMenu.addEventListener('click', toggleSidebar);
		// Открыть/закрыть сайдбар
		function toggleSidebar() {
			if (sidebar.classList.contains('active')) {
				sidebar.classList.remove('active');
				iconMenu.classList.remove('active');
			} else {
				sidebar.classList.add('active');
				iconMenu.classList.add('active');
			}
		}
	}
})(document);

// Выпадающий footer на мобильном разрешении
(function () {
	let footerMenuBtn = document.querySelector('[data-footer-menu]');
	let footerNav = document.querySelector('.footer__nav');

	footerMenuBtn.addEventListener('click', function (event) {
		event.preventDefault();

		if (!footerNav.classList.contains('show')) {
			footerNav.classList.add('show');
			footerNav.style.height = 'auto';
			let height = footerNav.clientHeight;
			footerNav.style.height = '0px';
			setTimeout(() => {
				footerNav.style.height = height + 'px';
			}, 0)
		} else {
			footerNav.style.height = '0px';
			footerNav.addEventListener('transitionend', function (params) {
				footerNav.classList.remove('show');
			}, {
				once: true
			});
		}
	});
})(document);

// Функции для ползунка shop
(function (document) {
	let sliderSlicks = document.querySelectorAll('[data-slider]');
	if (sliderSlicks) {
		let priceMin = document.getElementById('range-price-min');
		let priceMax = document.getElementById('range-price-max');

		sliderSlicks.forEach(e => {
			e.addEventListener('pointerdown', moveRange);
		});

		let leftSlickX;
		let rightSlickX;
		function moveRange(e) {
			let slickL = document.querySelector('[data-slider="left"]');
			let slickR = document.querySelector('[data-slider="right"]');
			let slickLine = document.querySelector('[data-slider="line"]');
			let min = +priceMin.dataset.value;
			let max = +priceMax.dataset.value;

			let target = e.target;
			let coords = getCoords(target);
			let parent = target.parentNode;
			let shiftX = e.clientX - coords.left;

			leftSlickX = slickL.getBoundingClientRect().left - parent.getBoundingClientRect().left;
			rightSlickX = slickR.getBoundingClientRect().left - parent.getBoundingClientRect().left;

			let diffWidthLine = rightSlickX - leftSlickX;

			slickLine.style.width = diffWidthLine + 'px';
			slickLine.style.left = leftSlickX + 'px';

			document.addEventListener('pointermove', onMouseMove);

			function onMouseMove(e) {
				e.preventDefault();

				let newX = e.clientX - parent.getBoundingClientRect().left - shiftX;

				if (newX < 0) {
					newX = 0;
				}
				if (newX > parent.offsetWidth - coords.width) {
					newX = parent.offsetWidth - coords.width;
				}
				if (newX > rightSlickX && target.dataset.slider === 'left') {
					newX = rightSlickX;
					slickL.style.zIndex = 10;
					slickR.style.zIndex = 1;
				}
				if (newX < leftSlickX && target.dataset.slider === 'right') {
					newX = leftSlickX;
					slickL.style.zIndex = 10;
					slickR.style.zIndex = 1;
				}

				target.style.left = newX + 'px';

				let leftPercent = newX / (parent.offsetWidth - target.offsetWidth) * 100;
				let rangeLeft = Math.round(leftPercent * max / 100);
				let rightPercent = newX / (parent.offsetWidth - target.offsetWidth) * 100;
				let rangeRight = Math.round(rightPercent * max / 100);

				if (target.dataset.slider === 'left') {
					let dynamicWidth = rightSlickX - newX;
					slickLine.style.width = dynamicWidth + 'px';
					slickLine.style.left = newX + 'px';
					priceMin.innerHTML = rangeLeft;
				}
				if (target.dataset.slider === 'right') {
					let dynamicWidth = newX - leftSlickX;
					slickLine.style.width = dynamicWidth + 'px';
					slickLine.style.left = leftSlickX + 'px';
					priceMax.innerHTML = rangeRight;
				}

				e.target.ondragstart = function () {
					return false;
				}

			}

			document.addEventListener('pointerup', onMouseUp);

			function onMouseUp(e) {
				if (target.dataset.slider === 'left') {
					slickL.style.zIndex = 10;
					slickR.style.zIndex = 1;
				}
				if (target.dataset.slider === 'right') {
					slickL.style.zIndex = 1;
					slickR.style.zIndex = 10;
				}

				document.removeEventListener('pointermove', onMouseMove);
				document.removeEventListener('pointerup', onMouseUp);
			}
		}

		function getCoords(element) {
			let coords = element.getBoundingClientRect();

			return {
				top: coords.top + window.pageYOffset,
				left: coords.left + window.pageXOffset,
				leftX: coords.left,
				right: coords.left + window.pageXOffset + coords.width,
				bottom: coords.top + window.pageYOffset + coords.height,
				width: coords.width
			};
		}
	}
})(document);

// Кастомный селект Shop
(function (document) {
	let selects = document.querySelectorAll('[data-select-shop]');
	for (let i = 0; i < selects.length; i++) {
		let select = selects[i];
		let options = select.querySelectorAll('option');

		let cSelect = document.createElement('div');
		let cSelectList = document.createElement('div');
		let cSelectCurrent = document.createElement('div');

		cSelect.className = 'custom-select';
		cSelectList.className = 'custom-select__list custom-scrollbar';
		cSelectCurrent.className = 'custom-select__current';

		cSelect.append(cSelectCurrent, cSelectList);

		select.after(cSelect);

		let createCustomDom = (x, y) => {
			let selectItems = '';
			for (let i = 0; i < options.length; i++) {
				selectItems += `<div class="custom-select__item" data-value="${+options[i].value}">${options[i].text} </div>`;
			}
			cSelectList.innerHTML = selectItems;
			x(), y();
		}

		let toggleClass = () => { cSelect.classList.toggle('custom-select--show') }

		let currentTextValue = () => cSelectCurrent.textContent = cSelectList.children[0].textContent;

		let currentValue = () => {
			let items = cSelectList.children
			for (let el = 0; el < items.length; el++) {
				let selectValue = items[el].getAttribute('data-value');
				let selectText = items[el].textContent;
				items[el].addEventListener('click', () => {
					cSelect.classList.remove('custom-select--show');
					cSelectCurrent.textContent = selectText;
					select.value = selectValue;
				})
			}
		}


		const desctopFn = () => {
			cSelectCurrent.addEventListener('click', toggleClass);
		}

		const mobileFn = () => {
			cSelectCurrent.addEventListener('click', toggleClass);
			for (let j = 0; j < selects.length; j++) {
				let mobileSelect = selects[j];
				mobileSelect.addEventListener('change', () => {
					mobileSelect.nextElementSibling.querySelector('.custom-select__current').textContent = mobileSelect.value
				})
			}
		}

		createCustomDom(currentTextValue, currentValue);

		document.addEventListener('mouseup', (e) => {
			if (!cSelect.contains(e.target)) cSelect.classList.remove('custom-select--show');
		});

		detectmob(mobileFn, desctopFn);

		function detectmob(x, y) {
			if (navigator.userAgent.match(/Android/i)
				|| navigator.userAgent.match(/webOS/i)
				|| navigator.userAgent.match(/iPhone/i)
				|| navigator.userAgent.match(/iPad/i)
				|| navigator.userAgent.match(/iPod/i)
				|| navigator.userAgent.match(/BlackBerry/i)
				|| navigator.userAgent.match(/Windows Phone/i)
			) {
				x();
			}
			else {
				y();
			}
		}
	}

})(document);

// Checkout
(function (document) {
	let totalBtn = document.querySelector('.total-checkout__btn');
	if (totalBtn) {
		totalBtn.addEventListener('click', function (e) {
			e.preventDefault();
		});
	}

})(document);

// Кастомный селект Checkout
(function (document) {
	let select = document.querySelector('[data-select-checkout]');
	if (select) {
		let options = select.querySelectorAll('option');

		let cSelect = document.createElement('div');
		let cSelectList = document.createElement('div');
		let cSelectCurrent = document.createElement('div');

		cSelect.className = 'custom-select-checkout__select';
		cSelectList.className = 'custom-select-checkout__list';
		cSelectCurrent.className = 'custom-select-checkout__current';

		cSelect.append(cSelectCurrent, cSelectList);
		select.after(cSelect);

		let createCustomDom = (func1, func2) => {
			let selectItems = '';
			for (let i = 0; i < options.length; i++) {
				selectItems += `<div class="custom-select-checkout__item" data-value="${options[i].value}">${options[i].text}</div>`;
			}
			cSelectList.innerHTML = selectItems;
			func1();
			func2();
		}

		let toggleSelect = () => {
			cSelect.classList.toggle('custom-select-checkout__select--show');
		};

		let currentTextValue = () => {
			cSelectCurrent.textContent = cSelectList.children[0].textContent;
			cSelectList.children[0].classList.add('selected');
		};

		let currentValue = () => {
			let items = cSelectList.children;
			for (let i = 0; i < items.length; i++) {
				let selectValue = items[i].dataset.value;
				let selectText = items[i].innerHTML;
				items[i].addEventListener('click', function () {
					for (let j = 0; j < items.length; j++) {
						items[j].classList.remove('selected');
					}
					select.value = selectValue;
					this.classList.add('selected');
					cSelectCurrent.innerHTML = selectText;
					toggleSelect();
				});
			}
		};

		createCustomDom(currentTextValue, currentValue);

		cSelectCurrent.addEventListener('click', toggleSelect);
	}
})(document);

// Функции карусели и галереи Product
(function (document) {
	let fixedImages = document.querySelectorAll('.fixedimages-img');
	let carouselList = document.querySelector('.carousel-product__list');
	let carouselItems = document.querySelectorAll('.carousel-product__item');
	let carouselImages = document.querySelectorAll('.carousel-product__image');
	let paginationItems = document.querySelectorAll('.carousel-product__pagination-item');
	let fixedImagesElem = document.getElementById('fixedimages');
	if (carouselList && carouselItems && carouselImages && paginationItems && fixedImagesElem && fixedImages) {
		let size = carouselList.offsetWidth;
		let length = carouselItems.length;
		let index = 1;
		let indexPag = 0;

		document.addEventListener('click', showGalleryProductSlide);
		document.addEventListener('keyup', showGalleryProductSlide);

		function showGalleryProductSlide(e) {
			if (e.target.closest('.carousel-product__image')) {
				e.preventDefault();
				document.body.classList.add('lock');
				let target = e.target.closest('.carousel-product__image');
				let index = +target.getAttribute('data-item');
				fixedImagesElem.classList.add('active');
				fixedImages.forEach(item => {
					item.classList.remove('active');
				});
				if (e.code === 'Escape') {
					fixedImagesElem.classList.remove('active');
					document.body.classList.remove('lock');
				}
				fixedImages[index].classList.add('active');
			} else if (!e.target.closest('.fixedimages-img')) {
				fixedImagesElem.classList.remove('active');
				document.body.classList.remove('lock');
			}
		}

		paginationItems.forEach((item, i) => {
			item.addEventListener('click', function () {
				showClickSlide(i);
			});
		});

		carouselList.style.transform = `translateX(-${index * size}px)`;
		paginationItems[indexPag].classList.add('active');
		window.addEventListener('resize', function () {
			size = carouselList.offsetWidth;
			carouselList.style.transform = `translateX(-${index * size}px)`;
		});

		function showClickSlide(i) {
			paginationItems.forEach(item => item.classList.remove('active'));
			paginationItems[i].classList.add('active');
			index = i + 1;
			indexPag = i;
			carouselList.style.transition = 'transform 0.3s ease-in-out';
			carouselList.style.transform = `translateX(-${index * size}px)`;
		}

		function autoSlide() {
			carouselList.style.transition = 'transform 0.3s ease-in-out';
			paginationItems.forEach(item => item.classList.remove('active'));
			indexPag >= 3 ? indexPag = 0 : indexPag++;
			paginationItems[indexPag].classList.add('active');
			index >= length - 1 ? index = 0 : index++;
			carouselList.style.transform = `translateX(-${index * size}px)`;
		}

		function jump() {
			carouselList.addEventListener('transitionend', function () {
				carouselItems[index].id === "firstClone" ? index = 1 : index;
				carouselList.style.transition = '';
				carouselList.style.transform = `translate(-${index * size}px,0)`;
			});
		}

		intervalId = setInterval(() => {
			autoSlide();
			jump();
		}, 15000)
	}


})(document);

// Функция счетчика Product
(function (document) {
	let counterInput = document.querySelector('[data-counter-input]');
	let counterUp = document.querySelector('[data-counter="up"]');
	let counterDown = document.querySelector('[data-counter="down"]');

	if (counterUp && counterDown) {
		counterUp.addEventListener('click', counterQuantityProduct);
		counterDown.addEventListener('click', counterQuantityProduct);

		function counterQuantityProduct() {
			let btn = this;
			let num = +counterInput.value;
			if (btn.getAttribute('data-counter') === 'up') {
				counterInput.value = ++num;
			} else {
				num <= 1 ? counterInput.value = 1 : counterInput.value = --num;
			}
		}
	}
})(document);


// Счетчики количества товаров Cart
(function (document) {
	let cellCartMinus = document.querySelectorAll('.cell-quantity__minus');
	let cellCartPlus = document.querySelectorAll('.cell-quantity__plus');

	if (cellCartMinus && cellCartPlus) {
		cellCartMinus.forEach(minus => {
			minus.addEventListener('click', counterCartGoods);
		});
		cellCartPlus.forEach(plus => {
			plus.addEventListener('click', counterCartGoods);
		});

		function counterCartGoods(e) {
			e.preventDefault();
			let btn = this;
			let input = btn.parentNode.querySelector('.cell-quantity__input');
			let num = +input.value;
			if (btn.getAttribute('data-cart-quantity') === 'plus') {
				input.value = ++num;
			} else {
				num <= 1 ? input.value = 1 : input.value = --num;
			}
		}
	}
})(document);










