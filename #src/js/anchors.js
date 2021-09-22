	// Anchors =================================================

	const menuLinks = document.querySelectorAll('.nav__link[data-goto]');
	if (menuLinks.length > 0) {
		menuLinks.forEach(menuLink => {
			menuLink.addEventListener('click', onMenuLinkClick);
		});

		function onMenuLinkClick(e) {
			const menuLink = e.target;
			if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
				const gotoBlock = document.querySelector(menuLink.dataset.goto);
				const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

				if (header.classList.contains('active')) {
					header.classList.remove('active');
					menu.classList.remove('open');
					overlay.classList.remove('open');
				}

				window.scrollTo({
					top: gotoBlockValue,
					behavior: 'smooth',
				});
				e.preventDefault();
			}
		}
	}