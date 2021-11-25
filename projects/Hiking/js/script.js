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


function ibg() {

	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}

ibg();

var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android()
			|| isMobile.BlackBerry()
			|| isMobile.iOS()
			|| isMobile.Opera()
			|| isMobile.Windows()
		);
	}
};

function removeClasses(arr, classes) {
	for (let i = 0; i < arr.length; i++) {
		arr[i].classList.remove(classes);
	}
}



const spollersArray = document.querySelectorAll('[data-spollers]');

if (spollersArray.length > 0) {
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});

	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);


			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});

			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});

	}


	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener('click', setSpollerAction);
			} else {
				spollersBlock.classList.remove('init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener('click', setSpollerAction);
			}
		});
	}

	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}

	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('.slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller].active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}

}

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('slide')) {
		target.classList.add('slide');
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('slide');
		}, duration);
	}
}

let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('slide')) {
		target.classList.add('slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
};



const body = document.querySelector('body');
const iconMenu = document.querySelector('.icon-menu');
const headerBody = document.querySelector('.header__body');
const menuOverlay = document.querySelector('.menu__overlay');
const header = document.querySelector('.header');
const menuLinks = header.querySelectorAll('.menu__link');

for (let i = 0; i < menuLinks.length; i++) {
	menuLinks[i].addEventListener('click', scrollToSection);
}

function scrollToSection(e) {
	if (window.innerWidth < 768) {
		iconMenu.classList.remove('active');
		body.classList.remove('lock');
		headerBody.classList.remove('active');
		menuOverlay.classList.remove('active');
	}
	e.preventDefault();
	let hrefClass = this.getAttribute('href').slice(1);
	let sectionElement = document.querySelector(('.' + hrefClass));
	let headerHeight = header.offsetHeight;
	let sectionElementPosition = sectionElement.getBoundingClientRect().top;
	let offsetPosition = sectionElementPosition - headerHeight;
	console.log(sectionElementPosition);
	window.scrollBy({
		top: offsetPosition,
		behavior: 'smooth'
	});
}

iconMenu.addEventListener('click', function () {
	iconMenu.classList.toggle('active');
	body.classList.toggle('lock');
	headerBody.classList.toggle('active');
	menuOverlay.classList.toggle('active');
});

window.addEventListener('scroll', function (e) {
	if (window.pageYOffset > 50) {
		header.classList.add('scroll');
	} else {
		header.classList.remove('scroll');
	}
});


const mountainsSlider = new Swiper('.slider-mountains__row', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	slidesPerView: 1,
	spaceBetween: 50,
	// If we need pagination
	pagination: {
		el: '.slider-mountains-control__dotts',
		clickable: true
	},

	// Navigation arrows
	navigation: {
		nextEl: '.slider-mountains-control__arrows-right',
		prevEl: '.slider-mountains-control__arrows-left',
	},

	// And if we need scrollbar
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});

const storeSlider = new Swiper('.store__slider-inner', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	slidesPerView: 'auto',
	spaceBetween: 140,
	// If we need pagination
	pagination: {
		el: '.controls-slider-store__dotts',
		clickable: true
	},
	breakpoints: {
		992: {
			direction: 'vertical',
			spaceBetween: 140,
		}
	},

	// Navigation arrows
	navigation: {
		nextEl: '.controls-slider-store__arrow_up',
		prevEl: '.controls-slider-store__arrow_down',
	},

	// And if we need scrollbar
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});



