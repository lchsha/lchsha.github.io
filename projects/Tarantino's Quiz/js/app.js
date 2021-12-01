const main = (document) => {
	const questionEl = document.getElementById('question');
	const aText = document.getElementById('a-text');
	const bText = document.getElementById('b-text');
	const cText = document.getElementById('c-text');
	const dText = document.getElementById('d-text');
	const answersEls = document.querySelectorAll('.answer');
	const submitBtn = document.getElementById('submit');
	const quizMain = document.querySelector('.quiz-main');
	const quizResults = document.getElementById('quiz-results');
	const quizTotal = document.getElementById('quiz-total');
	const refresh = document.getElementById('refresh');
	const quizPostersRow = document.querySelector('.quiz-posters__row');
	const moviePosters = quizPostersRow.querySelectorAll('img[data-adaptive]');
	const quizData = [
		{
			question: 'Какой фильм начинается с титра «Четвёртый фильм Квентина Тарантино»?',
			a: 'Хороший, Плохой, Злой',
			b: 'Джанго освобождённый',
			c: 'Убить Билла',
			d: 'Четыре комнаты',
			correct: 'c',
		},
		{
			question: '«У них там метрическая система. Они вообще там не понимают, что за хрен четверть фунта» из какого фильма эта цитата?',
			a: 'Криминальное чтиво',
			b: 'Грайндхаус',
			c: 'Джеки Браун',
			d: 'От заката до рассвета',
			correct: 'a',
		},
		{
			question: 'В каком фильме Квентин Тарантино хотел снять Леонардо ДиКаприо, но не сделал этого?',
			a: 'Джанго освобожденный',
			b: 'Четыре комнаты',
			c: 'Бесславные ублюдки',
			d: 'Однажды в голливуде',
			correct: 'c',
		},
		{
			question: 'Какую фразу произносят О-Рен Ишии и Невеста в «Доме голубых Листьев»?',
			a: '«Как и все американки, ты умеешь только еду в ресторане заказывать и сорить деньгами мужчин»',
			b: '«Посмотри на неё... Она просто окровавленный ангел...»',
			c: '«Эта женщина заслуживает право на месть. А мы заслуживаем смерти»',
			d: '«Глупый кролик... Допрыгался...»',
			correct: 'd',
		},
		{
			question: 'Майор Уоррен (Сэмюэл Л. Джексон) в фильме «Омерзительная восьмерка» хвастается:',
			a: 'Новой лошадью',
			b: 'Письмом Авраама Линкольна',
			c: 'Первой вынутой из него пулей',
			d: 'Своим прозвищем "Кровавый майор"',
			correct: 'b',
		},
		{
			question: 'Что используют вместо денег во время игры в покер белые мужчины ближе к концу фильма в «Джанго освобожденный»?',
			a: 'Алкоголь',
			b: 'Отрезанные уши рабов',
			c: 'Спички',
			d: 'Пули',
			correct: 'b',
		},
		{
			question: 'Чем грозил смертельный удар Пэй Мэя?',
			a: 'Остановкой сердца',
			b: 'Разрывом сердца',
			c: 'Обильным кровотечением',
			d: 'Открытый перелом',
			correct: 'b',
		},
		{
			question: 'Всем известно, что в фильмах Тарантино показ еды занимает особое место. А какая марка фастфуда появляется кадре чаще всего?',
			a: 'Big Kahuna burger',
			b: 'taco bell',
			c: "McDonsld's",
			d: 'Burger shot',
			correct: 'a',
		},
		{
			question: 'От чего умер охотник за головами Джон Рут (Курт Рассел) в фильме «Омерзительная восьмерка»?',
			a: 'От пули',
			b: 'От удушья',
			c: 'От ножевого ранения',
			d: 'От яда в кофе',
			correct: 'a',
		},
		{
			question: 'Что из этого не является именем героини Умы Турман в «Убить Билла»?',
			a: 'би-би',
			b: 'невеста',
			c: 'киддо',
			d: 'беатрикс',
			correct: 'b',
		},
		{
			question: '«Чем меньше необдуманных поступков, тем меньше вероятность выглядеть глупо» из какого фильма эта цитата?',
			a: 'Четыре комнаты',
			b: 'Бесславные ублюдки',
			c: 'Криминальное чтиво',
			d: 'Омерзительная восьмерка',
			correct: 'a',
		},
		{
			question: 'В «Бешеных псах» Квентин Тарантино впервые использовал знаменитый ракурс: герои смотрят сверху вниз в багажник машины. Что же они там увидели?',
			a: 'Много оружия',
			b: 'Труп героя самого Тарантино',
			c: 'Украденные драгоценности',
			d: 'Связанного полицейского',
			correct: 'd',
		},
		{
			question: 'Танец героев Джона Траволты и Умы Турман — одна из самых узнаваемых сцен «Криминального чтива». Все помнят, что герои участвовали в танцевальном конкурсе. Но вот получили они награду или нет?',
			a: 'Приз-то они получили. Но только они его не выиграли, а украли',
			b: 'Конечно. Ведь они так отлично танцевали. Да и кубок домой потом принесли',
			c: 'Никто не знает. Про это дальше не говорят',
			d: 'Нет. Они ж оба под наркотиками, какой приз',
			correct: 'a',
		},
		{
			question: 'В фильме «Бесславные ублюдки» к группе шпионов в таверне привязывается офицер гестапо, который предлагает сыграть в игру: каждый должен отгадать имя персонажа, которое написано на карточке. Карта с каким героем досталась самому гестаповцу?',
			a: 'Марко Поло',
			b: 'Кинг Конг',
			c: 'Гитлер',
			d: 'годзилла',
			correct: 'b',
		},
		{
			question: 'Этот знаменитый фильм не считается режиссёрской работой Квентина Тарантино. Формально картину снял Роберт Родригес. Но всё же мастер написал сценарий и даже сильно помогал коллеге на съёмках. Что же это за кино?',
			a: 'Отчаянный',
			b: 'Четыре комнаты',
			c: 'Джеки Браун',
			d: 'От заката до рассвета',
			correct: 'd',
		},
		{
			question: 'Идею и часть названия этого фильма Тарантино почерпнул из одной известной картины середины 60-х. Правда, он сильно изменил образ и мотивацию главного героя. Но зато оставил даже музыкальную тему в заставке. Что это за фильм?',
			a: 'Убить Билла',
			b: 'Джеки браун',
			c: 'Джанго освобожденный',
			d: 'Бесславные ублюдки',
			correct: 'c',
		},
		{
			question: 'Квентин Тарантино очень любит, когда в его фильмах герои обсуждают что-то совсем отвлечённое от сюжета: еду, музыку, путешествия. О чём говорят на первых же минутах «Бешеных псов»?',
			a: 'Выясняют, нужно ли платить чаевые',
			b: 'Обсуждают цену коктейлей в баре',
			c: 'Спорят о смысле песен Мадонны',
			d: 'Рассказывают о ресторанах McDonald’s во Франции',
			correct: 'c',
		},
		{
			question: 'Какой фильм стал полнометражным режиссерским дебютом Квентина Тарантино?',
			a: 'Бешеный псы',
			b: 'криминальное чтиво',
			c: 'джеки браун',
			d: 'прирожденные убийцы',
			correct: 'a',
		},
		{
			question: 'Кто из этих актеров снялся только в одном фильме Квентина Тарантино?',
			a: 'кристоф вальц',
			b: 'брэд питт',
			c: 'майкл мэдсен',
			d: 'джейми фокс',
			correct: 'd',
		},
		{
			question: 'За какой фильм Квентин Тарантино не получил номинацию на «Оскар» за лучший оригинальный сценарий?',
			a: 'бешенные псы',
			b: 'криминальное чтиво',
			c: 'джанго освобожденный',
			d: 'бесславные ублюдки',
			correct: 'a',
		},
	];

	const tarantinosRating = {
		7: 'Я недоволен тобой !',
		12: 'Пересмотри мои фильмы, паренёк !',
		18: 'А ты хорош, дружище !',
		20: 'Отличный результат, мать твою!'
	};

	let flag = true;
	let mainSrc = getSrcPosters([]);
	function getSrcPosters(arr) {
		moviePosters.forEach(img => {
			arr.push(img.getAttribute('src'));
		});
		return arr;
	};


	if (window.innerWidth < 992) {
		hiddenDesktopPosters();
		changeSrcPosters();
	} else {
		showDesktopPosters();
		regainPreviousSrc();
	}

	window.addEventListener('resize', () => {
		if (window.innerWidth < 992 && !flag) {
			hiddenDesktopPosters();
			changeSrcPosters();
			flag = true;
		} else if (window.innerWidth > 992 && flag) {
			showDesktopPosters();
			regainPreviousSrc();
			flag = false;
		}
	});

	function changeSrcPosters() {
		let posters = quizPostersRow.querySelectorAll('img[data-adaptive]');
		posters.forEach((poster, i) => {
			let src = poster.getAttribute('src');
			let newSrc = src.split('');
			newSrc.splice(-4, 0, '-', String(i + 1));
			newSrc = newSrc.join('');
			poster.setAttribute('src', newSrc);
		});
	}

	function regainPreviousSrc() {
		let posters = quizPostersRow.querySelectorAll('img[data-adaptive]');
		posters.forEach((poster, i) => {
			poster.setAttribute('src', mainSrc[i]);
		});
	}

	function hiddenDesktopPosters() {
		let posters = quizPostersRow.querySelectorAll('img');
		posters.forEach(img => {
			if (!img.dataset.adaptive) {
				img.style.display = 'none';
			}
		});
	}

	function showDesktopPosters() {
		let posters = quizPostersRow.querySelectorAll('img');
		posters.forEach(img => {
			if (!img.dataset.adaptive) {
				img.style.display = 'block';
			}
		});
	}

	let currentQuiz = 0;
	let score = 0;
	let numberAnswer;

	startQuiz();

	submitBtn.addEventListener('click', () => {
		let answer = getSelectedAnswer();
		if (answer) {
			if (answer == quizData[currentQuiz].correct) {
				score++;
			}
			currentQuiz++;
			if (currentQuiz < quizData.length) {
				startQuiz();
			} else {
				for (let key in tarantinosRating) {
					if (score <= +key) {
						numberAnswer = tarantinosRating[key];
						break;
					}
				}
				let quentinAnswer = document.createElement('div');
				quentinAnswer.innerHTML = numberAnswer;
				quizTotal.innerHTML = `<div>Ты ответил верно на ${score}/${quizData.length} вопросов</div>`;
				quizTotal.appendChild(quentinAnswer);
				quizMain.style.display = 'none';
				quizResults.style.display = 'block';
			}
			quizMain.classList.add('fade');
			setTimeout(() => {
				quizMain.classList.remove('fade');
			}, 500)
		}
	});

	function startQuiz() {
		deselectAnswer();
		questionEl.innerText = quizData[currentQuiz].question;
		aText.innerText = quizData[currentQuiz].a;
		bText.innerText = quizData[currentQuiz].b;
		cText.innerText = quizData[currentQuiz].c;
		dText.innerText = quizData[currentQuiz].d;
	}

	function getSelectedAnswer() {
		let answer = undefined;
		answersEls.forEach(answersEl => {
			if (answersEl.checked) {
				answer = answersEl.id;
			}
		});
		return answer;
	}

	function deselectAnswer() {
		answersEls.forEach(answersEl => {
			answersEl.checked = false;
		});
	}

	refresh.addEventListener('click', () => {
		document.location.reload();
	});
}
main(document);
