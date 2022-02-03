@@include('functions.js');


const headerMenuBtn = document.querySelector('.header__menu-btn');
const headerNav = document.querySelector('.header__nav');
const overlay = document.querySelector('.overlay');
const headerSearch = document.querySelector('.header__search');


window.onload = function () {
	window.setTimeout(function () {
		document.body.classList.add('loaded');
	}, 500);
}


headerMenuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);

document.addEventListener('click', toggleSearch);
window.addEventListener('resize', removeClassesOnResize);

function toggleMenu() {
	headerMenuBtn.classList.toggle('active');
	headerNav.classList.toggle('active');
	overlay.classList.toggle('active');
}

function closeMenu() {
	headerMenuBtn.classList.remove('active');
	headerNav.classList.remove('active');
	overlay.classList.remove('active');
}

function toggleSearch(e) {
	if (e.target.closest('.header__fakesearch')) {
		headerSearch.classList.toggle('active');
	} else if (headerSearch.classList.contains('active') && !e.target.closest('.header__search')) {
		headerSearch.classList.remove('active');
	} else {
		return;
	}
}

function removeClassesOnResize() {
	if (document.documentElement.clientWidth > 1100) {
		headerMenuBtn.classList.remove('active');
		headerNav.classList.remove('active');
		overlay.classList.remove('active');
		headerSearch.classList.remove('active');
	}
}

const swiper = new Swiper('.slider-about__body', {
	slidesPerView: 1,
	spaceBetween: 50,
	pagination: {
		el: '.slider-about__pagination',
		clickable: true
	},
	navigation: {
		nextEl: '.slider-about__arrow-next',
		prevEl: '.slider-about__arrow-prev',
	},
	scrollbar: {
		el: '',
	},
});



