class Gallery {
	constructor(element) {
		this.galleryElem = element;
		this.galleryItems = [...element.querySelectorAll('.gallery__link')];
		this.maxLength = this.galleryItems.length;
		this.showCount = 3;
		this.arrCoords = [];
		this.scale = 1;

		this.showGallery = this.showGallery.bind(this);
		this.distributeElementsToArrs = this.distributeElementsToArrs.bind(this);
		this.slidePrevImage = this.slidePrevImage.bind(this);
		this.slideNextImage = this.slideNextImage.bind(this);
		this.setModalStyles = this.setModalStyles.bind(this);
		this.closeGallery = this.closeGallery.bind(this);

		this.createModal();
		this.events();
	}

	// Создаем модальное окно
	createModal() {
		this.modalGallery = document.createElement('div');
		this.modalGallery.className = 'gallery-modal modal';

		this.modalGallery.innerHTML = `
			<div class="modal__controls controls-modal">
				<button class="controls-modal__close">
				</button>
				<div class="controls-modal__nav">
					<button class="controls-modal__btn controls-modal__btn-next"></button>
					<div class="controls-modal__counter">
						<span id="mc-current">1</span>/<span id="mc-length">20</span>
					</div>
					<button class="controls-modal__btn controls-modal__btn-prev"></button>
				</div>
			</div>
			<div class="modal__list">
				${this.galleryItems.map((item) => `
						<img src="${item.getAttribute('data-src')}" alt="${item.getAttribute('data-alt')}" class="modal__img">
					`).join('')}
			</div>
		`;
		document.body.appendChild(this.modalGallery);

		// Получем нужные переменные 
		this.modalImages = this.modalGallery.querySelectorAll('.modal__img');
		this.modalControls = this.modalGallery.querySelector('.modal__controls');
		this.modalControlsButtons = this.modalControls.querySelectorAll('.controls-modal__btn');
		this.modalContolsPrev = this.modalControls.querySelector('.controls-modal__btn-prev');
		this.modalContolsNext = this.modalControls.querySelector('.controls-modal__btn-next');
		this.modalControlsClose = this.modalControls.querySelector('.controls-modal__close');
	}

	// Обработчики событий
	events() {
		this.galleryElem.addEventListener('click', this.showGallery);

		this.modalControlsClose.addEventListener('click', this.closeGallery);

		let handlerSlideNext = debounce(this.slideNextImage, 500);
		let handlerSlidePrev = debounce(this.slidePrevImage, 500);
		this.modalContolsPrev.addEventListener('click', handlerSlidePrev);
		this.modalContolsNext.addEventListener('click', handlerSlideNext);

		let handlerResize = throttle(this.setModalStyles, 300);
		window.addEventListener('resize', handlerResize);
	}

	// Показываем галерею
	showGallery(e) {
		e.preventDefault();

		// Снимаем обработчик события с основных картинок, чтобы после анимации не было возможности открыть галерею сразу

		this.galleryElem.removeEventListener('click', this.showGallery);

		// Если окно меньше 992px, видимых картинок будет по одной сверху и снизу
		if (window.innerWidth < 992) {
			this.showCount = 1;
		} else {
			this.showCount = 3;
		}

		let galleryLink = e.target.closest('a');
		if (!galleryLink) return;

		// Запускаем функции дублицирующие размеры и позиции основных картинок
		this.setSizesImages();
		this.setPositionsImages();

		// Получем текущий индекс выбранной картинки
		this.currentIndex = this.galleryItems.indexOf(galleryLink);

		// Добавляем класс 'open' для модального окна
		this.modalGallery.classList.add('open');
		this.modalControls.classList.add('open');

		this.mcCurrent = this.modalControls.querySelector('#mc-current');
		this.mcLength = this.modalControls.querySelector('#mc-length');

		// Записываем номер текущей выбранной картинки и общее количество картинок
		this.mcCurrent.innerHTML = this.currentIndex + 1;
		this.mcLength.innerHTML = this.maxLength;

		// Запускаем основную функцию после анимации
		fadeIn(this.modalGallery, this.distributeElementsToArrs);
		fadeIn(this.modalControls);
	}

	// Дублируем размеры изображений 
	setSizesImages() {
		this.galleryItems.forEach((item, i) => {
			let coords = item.getBoundingClientRect();
			this.modalImages[i].style.width = `${coords.width}px`;
			this.modalImages[i].style.height = `${coords.height}px`;
		});
	}

	// Дублируем позиции изображений и записываем их в массив для последующей обратной анимации
	setPositionsImages() {
		this.galleryItems.forEach((item, i) => {
			let coords = item.getBoundingClientRect();
			this.setPositionStyles(this.modalImages[i], coords.x, coords.y);
			this.arrCoords.push([coords.x, coords.y]);
		});
	}

	// Применяем размеры и позиции на изображения в модальном окне
	setPositionStyles(elem, x, y) {
		elem.style.transform = `translate3d(${x}px,${y}px,0)`;
	}

	// Распределяем картинки по массивам
	distributeElementsToArrs() {
		this.arrHiddenImagesTop = [];
		this.arrVisibleImagesTop = [];
		this.arrCurrentImage = [];
		this.arrVisibleImagesBottom = [];
		this.arrHiddenImagesBottom = [];

		// Проверка: если текущий элемент первый или последний в списке, блокируем соответствующую кнопку
		if (this.currentIndex <= 0) {
			this.disabledSlideButton(this.modalContolsPrev);
		} else if (this.currentIndex >= this.maxLength - 1) {
			this.disabledSlideButton(this.modalContolsNext);
		} else {
			this.modalControlsButtons.forEach(btn => {
				this.enabledSlideButton(btn);
			});
		}

		this.modalImages.forEach((item, index) => {
			if (index + this.showCount < this.currentIndex) {
				this.arrHiddenImagesTop.unshift(item);
			} else if (index < this.currentIndex) {
				this.arrVisibleImagesTop.unshift(item);
			} else if (index === this.currentIndex) {
				this.arrCurrentImage.push(item);
			} else if (index <= this.currentIndex + this.showCount) {
				this.arrVisibleImagesBottom.push(item);
			} else {
				this.arrHiddenImagesBottom.push(item);
			}
		});

		this.setModalStyles();
	}

	// Передаем всем картинкам параметры для последующего перемещения по координатам
	setModalStyles() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const itemWidth = this.modalImages[0].offsetWidth;
		const itemHeight = this.modalImages[0].offsetHeight;

		if (windowWidth < 650) {
			this.scale = 0.5;
		} else {
			this.scale = 1;
		}

		if (this.modalGallery.classList.contains('open')) {
			this.arrHiddenImagesTop.forEach((item) => {
				this.setModalImagesStyle(item, {
					top: -1.5 * windowHeight,
					left: 0.25 * windowWidth,
					opacity: 0.1,
					zIndex: 1,
					scale: 0.3
				});
			});

			this.setModalImagesStyle(this.arrVisibleImagesTop[0], {
				top: 0.01 * windowHeight,
				left: 0.75 * windowWidth - (itemWidth / 2),
				opacity: 0.5,
				zIndex: 1,
				scale: this.scale - 0.2// 1
			});

			this.setModalImagesStyle(this.arrVisibleImagesTop[1], {
				top: 0.01 * windowHeight,
				left: 0.48 * windowWidth - (itemWidth / 2),
				opacity: 0.5,
				zIndex: 1,
				scale: this.scale - 0.4 // 0.8
			});

			this.setModalImagesStyle(this.arrVisibleImagesTop[2], {
				top: 0.01 * windowHeight,
				left: 0.25 * windowWidth - (itemWidth / 2),
				opacity: 0.5,
				zIndex: 1,
				scale: this.scale - 0.5 // 0.8
			});

			this.setModalImagesStyle(this.arrCurrentImage[0], {
				top: (windowHeight / 2) - (itemHeight / 2),
				left: (windowWidth / 2) - (itemWidth / 2),
				opacity: 1,
				zIndex: 100,
				scale: this.scale + 0.5
			});


			this.setModalImagesStyle(this.arrVisibleImagesBottom[0], {
				top: 0.99 * windowHeight - itemHeight,
				left: 0.25 * windowWidth - (itemWidth / 2),
				opacity: 0.5,
				zIndex: 1,
				scale: this.scale - 0.2 // 1
			});

			this.setModalImagesStyle(this.arrVisibleImagesBottom[1], {
				top: 0.99 * windowHeight - itemHeight,
				left: 0.52 * windowWidth - (itemWidth / 2),
				opacity: 0.5,
				zIndex: 1,
				scale: this.scale - 0.4// 0.8
			});

			this.setModalImagesStyle(this.arrVisibleImagesBottom[2], {
				top: 0.99 * windowHeight - itemHeight,
				left: 0.75 * windowWidth - (itemWidth / 2),
				opacity: 0.5,
				zIndex: 1,
				scale: this.scale - 0.5 // 0.7
			});

			this.arrHiddenImagesBottom.forEach((item, i) => {
				this.setModalImagesStyle(item, {
					top: 1.5 * windowHeight,
					left: 0.75 * windowWidth,
					opacity: 0.1,
					zIndex: 1,
					scale: 0.3
				});
			});
		}
	}

	// Переещаем элемент по указанным координатам
	setModalImagesStyle(element, { top, left, opacity, scale, zIndex }) {
		if (!element) return;
		element.style.transition = `all .7s`;
		element.style.opacity = `${opacity}`;
		element.style.zIndex = `${zIndex}`;
		element.style.transform = `translate3d(${left}px,${top}px,0) scale(${scale})`;
	}

	// Показать предыдущую картинку
	slidePrevImage() {
		this.currentIndex <= 0 ? this.currentIndex = 0 : this.currentIndex--;
		this.mcCurrent.innerHTML = this.currentIndex + 1;
		this.distributeElementsToArrs();
	}
	// Показать следующую картинку
	slideNextImage() {
		this.currentIndex >= this.maxLength - 1 ? this.currentIndex = this.maxLength - 1 : this.currentIndex++;
		this.mcCurrent.innerHTML = this.currentIndex + 1;
		this.distributeElementsToArrs();
	}


	// Частично скрыть кнопку
	disabledSlideButton(element) {
		element.disabled = true;
		element.style.opacity = 0.2;
		element.style.pointerEvents = 'none';
	}

	// Показать кнопку
	enabledSlideButton(element) {
		element.disabled = false;
		element.style.opacity = 1;
		element.style.pointerEvents = '';
	}


	// Закрыть галерею  
	closeGallery() {
		// Переместить картинки на свои прежние позиции
		this.modalImages.forEach((item, i) => {
			this.setPositionStyles(item, this.arrCoords[i][0], this.arrCoords[i][1]);
		});

		// Вернуть исходные стили кнопкам
		this.modalControlsButtons.forEach(btn => {
			this.enabledSlideButton(btn);
		});

		fadeOut(this.modalGallery, () => {
			this.modalGallery.classList.remove('open');
			this.modalControls.classList.remove('open');
			this.arrCoords = [];
			this.galleryElem.addEventListener('click', this.showGallery); // Вернуть обработчик на основные картинки
		});
	}

}



// Вспомогательные функции

function fadeIn(element, cb) {
	func();
	function func() {
		let opacity = Number(element.style.opacity);
		element.style.visibility = 'visible';
		if (opacity < 1) {
			opacity = opacity + 0.1;
			element.style.opacity = opacity;
			window.requestAnimationFrame(func);
			return;
		}
		if (cb) {
			cb();
		}
	}
}

function debounce(f, ms) {
	let flag = false;
	return function (...args) {
		if (flag) return;
		f.apply(this, args);
		flag = true;
		setTimeout(() => flag = false, ms);
	};
}

function throttle(f, ms) {
	let flag = false;
	let savedArgs;
	let savedThis;
	function wrapper(...args) {
		if (flag) {
			savedArgs = args;
			savedThis = this;
			return;
		}
		f.apply(this, args);
		flag = true;
		setTimeout(() => {
			flag = false;
			if (savedArgs) {
				f.apply(savedThis, savedArgs);
				savedArgs = null;
				savedThis = null;
			}
		}, ms);
	}

	return wrapper;
}

function fadeOut(element, cb) {
	func();
	function func() {
		let opacity = Number(element.style.opacity);
		element.style.visibility = 'hidden';
		if (opacity > 0) {
			opacity = opacity - 0.02;
			element.style.opacity = opacity;
			window.requestAnimationFrame(func);
			return;
		}
		if (cb) {
			cb();
		}
	}
}

// Инициализация галереи
let gallery = new Gallery(document.querySelector('.gallery'));

