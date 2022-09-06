/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

					//added
					const FULL_DASH_ARRAY = 283;
					const WARNING_THRESHOLD = 10;
					const ALERT_THRESHOLD = 5;
					
					const COLOR_CODES = {
					  info: {
						color: "gray"
					  },
					  warning: {
						color: "gray",
						threshold: WARNING_THRESHOLD
					  },
					  alert: {
						color: "gray",
						threshold: ALERT_THRESHOLD
					  }
					};
					
					const TIME_LIMIT = 20;
					let timePassed = 0;
					let timeLeft = TIME_LIMIT;
					let timerInterval = null;
					let remainingPathColor = COLOR_CODES.info.color;
					
					document.getElementById("app").innerHTML = `
					<div class="base-timer">
					  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
						<g class="base-timer__circle">
						  <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
						  <path
							id="base-timer-path-remaining"
							stroke-dasharray="283"
							class="base-timer__path-remaining ${remainingPathColor}"
							d="
							  M 50, 50
							  m -45, 0
							  a 45,45 0 1,0 90,0
							  a 45,45 0 1,0 -90,0
							"
						  ></path>
						</g>
					  </svg>
					  <span id="base-timer-label" class="base-timer__label">${formatTime(
						timeLeft
					  )}</span>
					</div>
					`;
					
					startTimer();
					
					function onTimesUp() {
					  //clearInterval(timerInterval);
					  const radioButtons = document.querySelectorAll('input[name="answer"]');
					  for (const radioButton of radioButtons) {
						if (radioButton.checked) {
							document.getElementById("submit").click();
						} else {
							document.getElementById("a").checked = true;
							document.getElementById("submit").click();
						}
					}
					}
					
					function startTimer() {
					  timerInterval = setInterval(() => {
						timePassed = timePassed += 1;
						timeLeft = TIME_LIMIT - timePassed;
						document.getElementById("base-timer-label").innerHTML = formatTime(
						  timeLeft
						);
						setCircleDasharray();
						setRemainingPathColor(timeLeft);
					
						if (timeLeft === 0) {
						  onTimesUp();
						}
					  }, 1000);
					}
					
					function formatTime(time) {
					  const minutes = Math.floor(time / 60);
					  let seconds = time % 60;
					
					  if (seconds < 10) {
						seconds = `0${seconds}`;
					  }
					
					  return `${minutes}:${seconds}`;
					}
					
					function setRemainingPathColor(timeLeft) {
					  const { alert, warning, info } = COLOR_CODES;
					  if (timeLeft <= alert.threshold) {
						document
						  .getElementById("base-timer-path-remaining")
						  .classList.remove(warning.color);
						document
						  .getElementById("base-timer-path-remaining")
						  .classList.add(alert.color);
					  } else if (timeLeft <= warning.threshold) {
						document
						  .getElementById("base-timer-path-remaining")
						  .classList.remove(info.color);
						document
						  .getElementById("base-timer-path-remaining")
						  .classList.add(warning.color);
					  }
					}
					
					function calculateTimeFraction() {
					  const rawTimeFraction = timeLeft / TIME_LIMIT;
					  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
					}
					
					function setCircleDasharray() {
					  const circleDasharray = `${(
						calculateTimeFraction() * FULL_DASH_ARRAY
					  ).toFixed(0)} 283`;
					  document
						.getElementById("base-timer-path-remaining")
						.setAttribute("stroke-dasharray", circleDasharray);
					}

					//Quiz
					const quizData = [
						{
						  question: "Which language runs in a web browser?",
						  a: "Java",
						  b: "C",
						  c: "Python",
						  d: "JavaScript",
						  correct: "d"
						},
						{
						  question: "What does CSS stand for?",
						  a: "Central Style Sheets",
						  b: "Cascading Style Sheets",
						  c: "Cascading Simple Sheets",
						  d: "Cars SUVs Sailboats",
						  correct: "b"
						},
						{
						  question: "What does HTML stand for?",
						  a: "Hypertext Markup Language",
						  b: "Hypertext Markdown Language",
						  c: "Hyperloop Machine Language",
						  d: "Helicopters Terminals Motorboats Lamborginis",
						  correct: "a"
						},
						{
						  question: "What year was JavaScript launched?",
						  a: "1996",
						  b: "1995",
						  c: "1994",
						  d: "none of the above",
						  correct: "b"
						},
						{
						  question: "Is javaScript is programming language?",
						  a: "Yes",
						  b: "No",
						  c: "Not sure",
						  d: "none of the above",
						  correct: "a"
						},
						{
						  question: "How we can alert hello world?",
						  a: "alertbox('hello world')",
						  b: "alert('hello world')",
						  c: "myalert('hello world')",
						  d: "none of the above",
						  correct: "b"
						},
						{
						  question: "HTML is used for?",
						  a: "Build the Website/App",
						  b: "Programming",
						  c: "Hacking",
						  d: "none of the above",
						  correct: "a"
						},
						{
						  question: "Best place to add script tag in HTML?",
						  a: "Head",
						  b: "Body",
						  c: "Bottom of the HTML",
						  d: "Both A and B",
						  correct: "d"
						},
						{
						  question: "Coding is?",
						  a: "Art",
						  b: "Science",
						  c: "Headache",
						  d: "Both A and B",
						  correct: "d"
						},
						{
						  question: "Who's your Saylani",
						  a: "Sir Kashif suleman",
						  b: "Sir Rizwan",
						  c: "None of Them",
						  d: "Both A and B",
						  correct: "a"
						}
					  ];
					  
					  const quiz = document.getElementById("quiz");
					  const answerElements = document.querySelectorAll(".answer");
					  const questionElement = document.getElementById("question");
					  const a_text = document.getElementById("a_text");
					  const b_text = document.getElementById("b_text");
					  const c_text = document.getElementById("c_text");
					  const d_text = document.getElementById("d_text");
					  const submitButton = document.getElementById("submit");
					  
					  let currentQuiz = 0;
					  let score = 0;
					  
					  const deselectAnswers = () => {
						answerElements.forEach((answer) => (answer.checked = false));
					  };
					  
					  const getSelected = () => {
						let answer;
						answerElements.forEach((answerElement) => {
						  if (answerElement.checked) answer = answerElement.id;
						});
						return answer;
					  };
					  
					  const loadQuiz = () => {
						deselectAnswers();
						const currentQuizData = quizData[currentQuiz];
						questionElement.innerText = currentQuizData.question;
						a_text.innerText = currentQuizData.a;
						b_text.innerText = currentQuizData.b;
						c_text.innerText = currentQuizData.c;
						d_text.innerText = currentQuizData.d;
					  };
					  
					  loadQuiz();
					  
					  submitButton.addEventListener("click", () => {
						const answer = getSelected();
						if (answer) {
						  if (answer === quizData[currentQuiz].correct) score++;
						  currentQuiz++;
						  if (currentQuiz < quizData.length) loadQuiz();
						  else {
							quiz.innerHTML = `
								  <h2>You answered ${score}/${quizData.length} questions correctly</h2>
								  <button onclick="history.go(0)" style="margin: auto; display: flex;">Play Again</button>
							  `;
						  }
						}
						timeLeft = 20;
						timePassed = 0;
					  });

})(jQuery);
