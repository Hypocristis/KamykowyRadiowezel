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
				document.getElementById('kontynuuj').onclick = function () {
					if (document.getElementById('imie').value != 'John' && document.getElementById('nazwisko').value != 'Snurr' && document.getElementById('mail').value != 'john.snurr@gmail.com' && document.getElementById('imie').value != '' && document.getElementById('nazwisko').value != '' && document.getElementById('mail').value != '') {
						let formularz = document.forms['formDanychUcznia'];
						var zmiennaUcznia = (formularz['imie'].value + ' ' + formularz['nazwisko'].value + ' ' + formularz['rok'].value + ' ' + formularz['literka'].value + ' ' + formularz['mail'].value);
						document.getElementById('daneUcznia').style.display = "none";
						document.getElementById('filmTestowy').style.display = "block";

						document.getElementById("x").checked = true; //pierwsze usuniecie radia

						var videoTime = 488; //488

						var interval = setInterval(function () {
							var remainingMinutes = Math.floor(videoTime / 60);
							var remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
							document.getElementById('timePlaceholder').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
							videoTime = videoTime - 1;

							if (videoTime === -1) {
								clearInterval(interval);
								document.getElementById('filmTestowy').style.display = "none";
								document.getElementById('testTeoretyczny').style.display = "block";
								question1();
							}
						}, 1000);

						function question1() {
							videoTime = 20; //10
							
							document.getElementById("question").innerHTML = "Gdzie najlepiej umie??ci?? mikrofony, aby unikn???? sprz????enia zwrotnego?";
							document.getElementById("a_text").innerHTML = "Z przodu g??o??nika.";
							document.getElementById("b_text").innerHTML = "Z ty??u g??o??nika.";
							document.getElementById("c_text").innerHTML = "Po??o??enie mikrofonu nie wp??ywa na sprz????enie zwrotne.";
							document.getElementById("d_text").innerHTML = "Skierowane prosto w membran?? g??o??nika.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question2();
								}
							}, 1000);
						}

						function question2() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Jak nale??y zabezpieczy?? kable przed potkni??ciem?";
							document.getElementById("a_text").innerHTML = "Przyklei?? je ta??m?? typu gaffer do pod??ogi.";
							document.getElementById("b_text").innerHTML = "Uk??ada?? je blisko dolnej kraw??dzi ??ciany.";
							document.getElementById("c_text").innerHTML = "Zwin???? spiralnie wszystkie kable (zasilanie i sygna??).";
							document.getElementById("d_text").innerHTML = "Zawiesi?? je na wysoko??ci wzroku.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question3();
								}
							}, 1000);
						}

						function question3() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Czy od????czenie zasilacza jest r??wnoznaczne z wy????czeniem go?";
							document.getElementById("a_text").innerHTML = "Tak. Od????czenie zasilacza pe??ni t?? sam?? rol?? co wbudowany prze????cznik on/off.";
							document.getElementById("b_text").innerHTML = "Tak. Korzystamy z takiej opcji, gdy przypadkowo w????czymy muzyk??.";
							document.getElementById("c_text").innerHTML = "Tak. Jedyna r????nica to brak animacji wy????czania.";
							document.getElementById("d_text").innerHTML = "Nie.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question4();
								}
							}, 1000);
						}

						function question4() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Czy mikrofon pojemno??ciowy (condenser mic) potrzebuje dodatkowego zasilania?";
							document.getElementById("a_text").innerHTML = "Tak, potrzebuje dodatkowego zasilania +48V DC.";
							document.getElementById("b_text").innerHTML = "Nie, mikser zawsze zasila wszystkie mikrofony.";
							document.getElementById("c_text").innerHTML = "Tak, potrzebuje dodatkowego zasilania 12V.";
							document.getElementById("d_text").innerHTML = "Nie, tylko mikrofony dynamiczne potrzebuj?? dodatkowego zasilania.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question5();
								}
							}, 1000);
						}

						function question5() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Do czego s??u??y pokr??t??o pre-amp gain?";
							document.getElementById("a_text").innerHTML = "Do wzmacniania sygna??u wchodz??cego do konsoli.";
							document.getElementById("b_text").innerHTML = "Do wzmacniania sygna??u wychodz??cego z konsoli.";
							document.getElementById("c_text").innerHTML = "Do zmiany cz??stotliwo??ci d??wi??ku na danym kanale.";
							document.getElementById("d_text").innerHTML = "Nic nie robi.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question6();
								}
							}, 1000);
						}

						function question6() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Co nale??y zrobi??, je??eli pojawi si?? efekt sprz????enia zwrotnego?";
							document.getElementById("a_text").innerHTML = "Natychmiast wy????czy?? zasilacz!";
							document.getElementById("b_text").innerHTML = "Natychmiast wy????czy?? mikser!";
							document.getElementById("c_text").innerHTML = "Natychmiast wyciszy?? kana?? mikrofonu!";
							document.getElementById("d_text").innerHTML = "Natychmiast zmniejszy?? poziom basu na mikserze.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question7();
								}
							}, 1000);
						}

						function question7() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Do czego mo??e s??u??y?? wyj??cie AUX z konsoli?";
							document.getElementById("a_text").innerHTML = "Do zmiany cyfrowych efekt??w na analogowej konsoli.";
							document.getElementById("b_text").innerHTML = "Do puszczania muzyki z g????wnych g??o??nik??w.";
							document.getElementById("c_text").innerHTML = "Do pod????czenia g??o??nik??w lub s??uchawek ods??uchowych.";
							document.getElementById("d_text").innerHTML = "Nie ma takiego wyj??cia.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question8();
								}
							}, 1000);
						}

						function question8() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Czy kable DMX / XLR mog?? by?? u??ywane zamiennie?";
							document.getElementById("a_text").innerHTML = "Nie, taka zamiana nie zadzia??a.";
							document.getElementById("b_text").innerHTML = "Tak, s?? one identyczne.";
							document.getElementById("c_text").innerHTML = "Nie, wtyczka nie b??dzie pasowa??.";
							document.getElementById("d_text").innerHTML = "Tak, ale nie jest to zalecane.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question9();
								}
							}, 1000);
						}

						function question9() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Jakie s?? odpowiedzialno??ci cz??onk??w zespo??u radiow??z??a?";
							document.getElementById("a_text").innerHTML = "Muzyka na przerwach, organizacja techniczna wydarze??, o??wietlenie.";
							document.getElementById("b_text").innerHTML = "Muzyka na przerwach, organizacja techniczna wydarze??.";
							document.getElementById("c_text").innerHTML = "Muzyka na przerwach.";
							document.getElementById("d_text").innerHTML = "Nie maj?? obowi??zk??w, licz?? si?? tylko ch??ci.";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									document.getElementById("x").checked = true;
									question10();
								}
							}, 1000);
						}

						function question10() {
							videoTime = 20;
							document.getElementById("question").innerHTML = "Czy cz??onkowie radiow??z??a mog?? by?? poproszeni o prac?? poza godzinami nauki?";
							document.getElementById("a_text").innerHTML = "Nie, pracuj?? tylko na przerwach.";
							document.getElementById("b_text").innerHTML = "Nie, pracuj?? tylko od 8 do 16.";
							document.getElementById("c_text").innerHTML = "Tak, pracuj?? zawsze, kiedy jest taka potrzeba.";
							document.getElementById("d_text").innerHTML = "Tak, pracuj?? zawsze, kiedy jest taka potrzeba, nawet w wakacje!";

							var interval = setInterval(function () {
								remainingMinutes = Math.floor(videoTime / 60);
								remainingSeconds = Math.floor(videoTime - remainingMinutes * 60);
								document.getElementById('timePlaceholder2').setAttribute('value', remainingMinutes + ' min ' + remainingSeconds + " s");
								videoTime = videoTime - 1;

								if (videoTime === -1) {
									clearInterval(interval);
									const answers = document.querySelectorAll('input[name="answer"]')
									for (const answer of answers) {
										if (answer.checked) {
											zmiennaUcznia = (zmiennaUcznia + ' ' + answer.id);
										}  
									}
									
									/*alert(zmiennaUcznia);*/

									let zmiennaUczniaArr = '';
									for (let i = 0; i < zmiennaUcznia.length; i++) {
										let znak = zmiennaUcznia.charCodeAt(i);
										znak = String(znak).padStart(3,'0');
										zmiennaUczniaArr = zmiennaUczniaArr + znak;
									}
									/*alert(zmiennaUczniaArr);*/
									
									document.getElementById('testTeoretyczny').style.display = "none";
									document.getElementById('przeniesienieDanych').style.display = "block";
									document.getElementById('szyfr').value = zmiennaUczniaArr;
								}
							}, 1000);
						}
					} else {
						alert('Wpisz poprawne dane kontaktowe.');
					}
				};
				
				var form = document.getElementById("formDanychUcznia");
				function handleForm(event) { event.preventDefault(); }
				form.addEventListener('submit', handleForm);	
})(jQuery);
