document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	// ------------ navigation menu --------------------

	(() => {

		const hamburgerBtn = document.querySelector('.hamburger-btn'),
			navMenu = document.querySelector('.nav-menu'),
			closeNavBtn = navMenu.querySelector('.close-nav-menu');

		hamburgerBtn.addEventListener('click', showNavMenu);
		closeNavBtn.addEventListener('click', hideNavMenu);


		function showNavMenu() {
			navMenu.classList.add('open');
			bodyScrollingToggle();
		}

		function hideNavMenu() {
			navMenu.classList.remove('open');
			fadeOutEffect();
			bodyScrollingToggle();
		}

		function fadeOutEffect() {
			document.querySelector('.fade-out-effect').classList.add('active');
			setTimeout(() => {
				document.querySelector('.fade-out-effect').classList.remove('active');
			}, 300);
		}

		//  attach and event handler to document
		document.addEventListener('click', (event) => {
			if (event.target.classList.contains('link-item')) {
				// make sure event.target.hash has a value before overridding default behavior
				if (event.target.hash !== '') {

					event.preventDefault();
					const hash = event.target.hash;
					// deactivate existing active 'section'
					document.querySelector('.section.active').classList.add('hide');
					document.querySelector('.section.active').classList.remove('active');
					// activate new 'section'
					document.querySelector(hash).classList.add('active');
					document.querySelector(hash).classList.remove('hide');
					// deactivate existing active navigation menu 'link-item'
					navMenu.querySelector('.active').classList.add('outer-shadow', 'hover-in-shadow');
					navMenu.querySelector('.active').classList.remove('active', 'inner-shadow');

					if (navMenu.classList.contains('open')) {
						// activate new navigation menu 'link-item'
						event.target.classList.add('active', 'inner-shadow');
						event.target.classList.remove('outer-shadow', 'hover-in-shadow');
						// hide navigation menu
						hideNavMenu();

					} else {
						let navItems = navMenu.querySelectorAll('.link-item');
						navItems.forEach((item) => {
							if (hash === item.hash) {
								// activate new navigation menu 'link-item'
								item.classList.add('active', 'inner-shadow');
								item.classList.remove('outer-shadow', 'hover-in-shadow');
							}
						});

						fadeOutEffect();
					}


					// add hash (#) to url
					window.location.hash = hash;
				}
			}
		});



	})();


	//------------- About section tabs -------------------

	(() => {
		const aboutSection = document.querySelector('.about-section');
		const tabsContainer = document.querySelector('.about-tabs');

		tabsContainer.addEventListener('click', (event) => {
			if (event.target.classList.contains('tab-item') && !event.target.classList.contains('active')) {
				const target = event.target.getAttribute('data-target');

				tabsContainer.querySelector('.active').classList.remove('outer-shadow', 'active');

				event.target.classList.add('active', 'outer-shadow');

				aboutSection.querySelector('.tab-content.active').classList.remove('active');
				aboutSection.querySelector(target).classList.add('active');
			}
		});
	})();

	function bodyScrollingToggle() {
		document.body.classList.toggle('hidden-scrolling');
	}


	// ------------ portfolio filter and popup ----------------
	(() => {
		const filterContainer = document.querySelector('.portfolio-filter');
		const portfolioItemsContainer = document.querySelector('.portfolio-items');
		const portfolioItems = document.querySelectorAll('.portfolio-item');
		const popup = document.querySelector('.portfolio-popup');
		const prevBtn = popup.querySelector('.pp-prev');
		const nextBtn = popup.querySelector('.pp-next');
		const closeBtn = popup.querySelector('.pp-close');
		const projectDetailsContainer = popup.querySelector('.pp-details');
		const projectDetailsBtn = popup.querySelector('.pp-project-details-btn');

		let itemIndex, slideIndex, screenshots;

		// ----------- filter portfolio items -------------------
		filterContainer.addEventListener('click', (event) => {
			if (event.target.classList.contains('filter-item') && !event.target.classList.contains('active')) {
				filterContainer.querySelector('.active').classList.remove('outer-shadow', 'active');

				event.target.classList.add('active', 'outer-shadow');
				const target = event.target.getAttribute('data-target');
				portfolioItems.forEach((item) => {
					if (target == item.getAttribute('data-category') || target === 'all') {
						item.classList.remove('hide');
						item.classList.add('show');
					} else {
						item.classList.remove('show');
						item.classList.add('hide');
					}
				});
			}
		});

		portfolioItemsContainer.addEventListener('click', (event) => {
			if (event.target.closest('.portfolio-item-inner')) {
				const portfolioItem = event.target.closest('.portfolio-item-inner').parentElement;
				// get the portfolioItem index
				itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
				screenshots = portfolioItems[itemIndex].querySelector('.portfolio-item-img img').getAttribute('data-screenshots');
				screenshots = screenshots.split(',');
				if (screenshots.length === 1) {
					prevBtn.style.display = 'none';
					nextBtn.style.display = 'none';
				} else {
					prevBtn.style.display = 'block';
					nextBtn.style.display = 'block';
				}
				slideIndex = 0;
				popupToggle();
				popupSlideshow();
				popupDetails();
			}
		});

		closeBtn.addEventListener('click', () => {
			popupToggle();
			if (projectDetailsContainer.classList.contains('active')) {
				popupDetailsToggle();
			}
		});

		function popupToggle() {
			popup.classList.toggle('open');
			bodyScrollingToggle();
		}

		function popupSlideshow() {
			const imgSrc = screenshots[slideIndex];
			const popupImg = popup.querySelector('.pp-img');
			popup.querySelector('.pp-loader').classList.add('active');
			popupImg.src = imgSrc;
			popupImg.onload = () => {
				popup.querySelector('.pp-loader').classList.remove('active');
			}

			popup.querySelector('.pp-counter').innerHTML = (slideIndex + 1) + ' of ' + screenshots.length;
		}

		// next slide
		nextBtn.addEventListener('click', () => {
			if (slideIndex === screenshots.length - 1) {
				slideIndex = 0;
			} else {
				slideIndex++;
			}
			popupSlideshow();
		});

		// prev slide
		prevBtn.addEventListener('click', () => {
			if (slideIndex === 0) {
				slideIndex = screenshots.length - 1;
			} else {
				slideIndex--;
			}
			popupSlideshow();
		});

		function popupDetails() {
			// if portfolio-item-details nox exists
			if (!portfolioItems[itemIndex].querySelector('.portfolio-item-details')) {
				projectDetailsBtn.style.display = 'none';
				return;
			}
			projectDetailsBtn.style.display = 'block';
			// get the project details
			const details = portfolioItems[itemIndex].querySelector('.portfolio-item-details').innerHTML;
			popup.querySelector('.pp-project-details').innerHTML = details;
			const title = portfolioItems[itemIndex].querySelector('.portfolio-item-title').innerHTML;
			popup.querySelector('.pp-title h2').innerHTML = title;
			const category = portfolioItems[itemIndex].getAttribute('data-category');
			popup.querySelector('.pp-project-category').innerHTML = category.split('-').join(' ');
		}

		projectDetailsBtn.addEventListener('click', () => {
			popupDetailsToggle();
		});

		function popupDetailsToggle() {
			if (projectDetailsContainer.classList.contains('active')) {
				projectDetailsBtn.querySelector('i').classList.remove('fa-minus');
				projectDetailsBtn.querySelector('i').classList.add('fa-plus');
				projectDetailsContainer.classList.remove('active');
				projectDetailsContainer.style.maxHeight = 0 + 'px';
			} else {
				projectDetailsBtn.querySelector('i').classList.remove('fa-plus');
				projectDetailsBtn.querySelector('i').classList.add('fa-minus');
				projectDetailsContainer.classList.add('active');
				projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + 'px';
				popup.scroll(0, projectDetailsContainer.offsetTop);
			}

		}

	})();



	// ---------------- hide all section except active ----------------
	(() => {

		const section = document.querySelectorAll('.section');
		section.forEach((section) => {
			if (!section.classList.contains('active')) {
				section.classList.add('hide');
			}
		});

	})();

	// ----------------------- style-switcher -----------------------

	const styleSwitcherToggler = document.querySelector('.style-switcher-toggler');

	styleSwitcherToggler.addEventListener('click', () => {
		document.querySelector('.style-switcher').classList.toggle('open');
	});

	// hide style-switcher on scroll

	window.addEventListener('scroll', () => {
		if (document.querySelector('.style-switcher').classList.contains('open')) {
			document.querySelector('.style-switcher').classList.remove('open');
		}
	});

	// ------------------------ theme colors ---------------------------

	const colors = document.querySelectorAll('.color');

	colors.forEach((color) => {
		color.addEventListener('click', (event) => {
			if (event.target.classList.contains('color-1')) {
				document.documentElement.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5');
				document.documentElement.classList.add('color-1');
			} else if (event.target.classList.contains('color-2')) {
				document.documentElement.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5');
				document.documentElement.classList.add('color-2');
			} else if (event.target.classList.contains('color-3')) {
				document.documentElement.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5');
				document.documentElement.classList.add('color-3');
			} else if (event.target.classList.contains('color-4')) {
				document.documentElement.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5');
				document.documentElement.classList.add('color-4');
			} else if (event.target.classList.contains('color-5')) {
				document.documentElement.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5');
				document.documentElement.classList.add('color-5');
			}
		});
	});

	// --------------------- theme ligth and dark mode ---------------------

	const dayNight = document.querySelector('.day-night');

	dayNight.addEventListener('click', () => {
		dayNight.querySelector('i').classList.toggle('fa-sun');
		dayNight.querySelector('i').classList.toggle('fa-moon');
		document.body.classList.toggle('dark');
	});

	window.addEventListener('load', () => {
		if (document.body.classList.contains('dark')) {
			dayNight.querySelector('i').classList.add('fa-sun');
		} else {
			dayNight.querySelector('i').classList.add('fa-moon');
		}
	})


	window.addEventListener('load', () => {
		// preloader
		document.querySelector('.preloader').classList.add('fade-out');
		setTimeout(() => {
			document.querySelector('.preloader').style.display = 'none';
		}, 600)
	});

});