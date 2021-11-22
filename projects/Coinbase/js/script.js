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



const spollersArray = document.querySelectorAll('[data-spollers');

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


let body = document.querySelector('body');
let header = document.querySelector('.header');
let sell = document.querySelector('.sell');
let headerBody = document.querySelector('.header__body');
let iconMenu = document.querySelector('.icon-menu');
let headerMenu = document.querySelector('.header__menu');


let itemBlog = document.querySelectorAll('.item-blog');
let reviewsContent = document.querySelector('.reviews__content');


let reviewsList = document.querySelector('.reviews__list');
let reviewsItems = document.querySelectorAll('.reviews__item');

let resizeTimer;

window.addEventListener("resize", () => {
	document.body.classList.add("resize-animation-stopper");
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(() => {
		document.body.classList.remove("resize-animation-stopper");
	}, 400);

	if (isMobile.any() && window.innerWidth < 992) {
		reviewsItems.forEach(e => e.classList.remove('active'));
	}
});




document.querySelectorAll('.menu__link').forEach(link => {

	link.addEventListener('click', function (e) {
		e.preventDefault();

		let href = this.getAttribute('href').substring(1);


		let scrollTarget = document.querySelector('.' + href);

		let topOffset = document.querySelector('.header').offsetHeight;

		let elementPosition = scrollTarget.getBoundingClientRect().top;

		let offsetPosition = elementPosition - topOffset;

		window.scrollBy({
			top: offsetPosition,
			behavior: 'smooth'
		});
	});
});


document.addEventListener('click', function (event) {
	let target = event.target;
	if (window.screen.width > 900) {
		if (target.closest('.header__sell')) {
			sell.classList.add('active');
		}
		if (!target.closest('.header__sell') || target.classList.contains('sell-dropdown__btc') || target.classList.contains('sell-dropdown__card')) {
			sell.classList.remove('active');
		}
		event.preventDefault();
	}
});

document.addEventListener('keyup', function (event) {
	if (event.key == 'Escape') {
		sell.classList.remove('active');
	}
});


iconMenu.addEventListener('click', function () {
	this.classList.toggle('opened');
	headerMenu.classList.toggle('opened');
	headerBody.classList.toggle('opened');
	body.classList.toggle('lock');
});

(function (col) {
	for (let i = 0; i < col.length; i++) {
		col[i].addEventListener('click', function () {
			col.forEach(e => e.classList.remove('active'));
			this.classList.add('active');
		});
	}
}(itemBlog));

reviewsContent.addEventListener('click', function (event) {
	if (isMobile.any()) {
		if (window.innerWidth > 992) {
			if (!event.target.closest('.reviews__item')) return;
			if (!event.target.classList.contains('reviews__item')) return;

			let item = event.target;
			let items = this.querySelectorAll('.reviews__item');
			items.forEach(e => e.classList.remove('active'));
			item.classList.toggle('active');
		}
	}
	if (window.innerWidth > (992 + 17)) {
		if (!event.target.closest('.reviews__item')) return;
		if (!event.target.classList.contains('reviews__item')) return;

		let item = event.target;
		let items = this.querySelectorAll('.reviews__item');
		items.forEach(e => e.classList.remove('active'));
		item.classList.toggle('active');
	}
});


const swiper = new Swiper('.reviews__mobile', {
	loop: true,
	slidesPerView: 2.5,
	spaceBetween: 20,
	freeMode: true,
	breakpoints: {
		300: {
			slidesPerView: 1,
		},
		320: {
			slidesPerView: 1.1,
			spaceBetween: 15,
		},
		480: {
			slidesPerView: 1.5,
		},
		// when window width is >= 640px
		768: {
			slidesPerView: 2.5,
		}
	},
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});







