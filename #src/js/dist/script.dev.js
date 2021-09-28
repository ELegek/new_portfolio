"use strict";

document.addEventListener('DOMContentLoaded', function () {
  'use strict'; // ------------ navigation menu --------------------

  (function () {
    var hamburgerBtn = document.querySelector('.hamburger-btn'),
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
      setTimeout(function () {
        document.querySelector('.fade-out-effect').classList.remove('active');
      }, 300);
    } //  attach and event handler to document


    document.addEventListener('click', function (event) {
      if (event.target.classList.contains('link-item')) {
        // make sure event.target.hash has a value before overridding default behavior
        if (event.target.hash !== '') {
          event.preventDefault();
          var hash = event.target.hash; // deactivate existing active 'section'

          document.querySelector('.section.active').classList.add('hide');
          document.querySelector('.section.active').classList.remove('active'); // activate new 'section'

          document.querySelector(hash).classList.add('active');
          document.querySelector(hash).classList.remove('hide'); // deactivate existing active navigation menu 'link-item'

          navMenu.querySelector('.active').classList.add('outer-shadow', 'hover-in-shadow');
          navMenu.querySelector('.active').classList.remove('active', 'inner-shadow');

          if (navMenu.classList.contains('open')) {
            // activate new navigation menu 'link-item'
            event.target.classList.add('active', 'inner-shadow');
            event.target.classList.remove('outer-shadow', 'hover-in-shadow'); // hide navigation menu

            hideNavMenu();
          } else {
            var navItems = navMenu.querySelectorAll('.link-item');
            navItems.forEach(function (item) {
              if (hash === item.hash) {
                // activate new navigation menu 'link-item'
                item.classList.add('active', 'inner-shadow');
                item.classList.remove('outer-shadow', 'hover-in-shadow');
              }
            });
            fadeOutEffect();
          } // add hash (#) to url


          window.location.hash = hash;
        }
      }
    });
  })(); //------------- About section tabs -------------------


  (function () {
    var aboutSection = document.querySelector('.about-section');
    var tabsContainer = document.querySelector('.about-tabs');
    tabsContainer.addEventListener('click', function (event) {
      if (event.target.classList.contains('tab-item') && !event.target.classList.contains('active')) {
        var target = event.target.getAttribute('data-target');
        tabsContainer.querySelector('.active').classList.remove('outer-shadow', 'active');
        event.target.classList.add('active', 'outer-shadow');
        aboutSection.querySelector('.tab-content.active').classList.remove('active');
        aboutSection.querySelector(target).classList.add('active');
      }
    });
  })();

  function bodyScrollingToggle() {
    document.body.classList.toggle('hidden-scrolling');
  } // ------------ portfolio filter and popup ----------------


  (function () {
    var filterContainer = document.querySelector('.portfolio-filter');
    var portfolioItemsContainer = document.querySelector('.portfolio-items');
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    var popup = document.querySelector('.portfolio-popup');
    var prevBtn = popup.querySelector('.pp-prev');
    var nextBtn = popup.querySelector('.pp-next');
    var closeBtn = popup.querySelector('.pp-close');
    var projectDetailsContainer = popup.querySelector('.pp-details');
    var projectDetailsBtn = popup.querySelector('.pp-project-details-btn');
    var itemIndex, slideIndex, screenshots; // ----------- filter portfolio items -------------------

    filterContainer.addEventListener('click', function (event) {
      if (event.target.classList.contains('filter-item') && !event.target.classList.contains('active')) {
        filterContainer.querySelector('.active').classList.remove('outer-shadow', 'active');
        event.target.classList.add('active', 'outer-shadow');
        var target = event.target.getAttribute('data-target');
        portfolioItems.forEach(function (item) {
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
    portfolioItemsContainer.addEventListener('click', function (event) {
      if (event.target.closest('.portfolio-item-inner')) {
        var portfolioItem = event.target.closest('.portfolio-item-inner').parentElement; // get the portfolioItem index

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
    closeBtn.addEventListener('click', function () {
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
      var imgSrc = screenshots[slideIndex];
      var popupImg = popup.querySelector('.pp-img');
      popup.querySelector('.pp-loader').classList.add('active');
      popupImg.src = imgSrc;

      popupImg.onload = function () {
        popup.querySelector('.pp-loader').classList.remove('active');
      };

      popup.querySelector('.pp-counter').innerHTML = slideIndex + 1 + ' of ' + screenshots.length;
    } // next slide


    nextBtn.addEventListener('click', function () {
      if (slideIndex === screenshots.length - 1) {
        slideIndex = 0;
      } else {
        slideIndex++;
      }

      popupSlideshow();
    }); // prev slide

    prevBtn.addEventListener('click', function () {
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

      projectDetailsBtn.style.display = 'block'; // get the project details

      var details = portfolioItems[itemIndex].querySelector('.portfolio-item-details').innerHTML;
      popup.querySelector('.pp-project-details').innerHTML = details;
      var title = portfolioItems[itemIndex].querySelector('.portfolio-item-title').innerHTML;
      popup.querySelector('.pp-title h2').innerHTML = title;
      var category = portfolioItems[itemIndex].getAttribute('data-category');
      popup.querySelector('.pp-project-category').innerHTML = category.split('-').join(' ');
    }

    projectDetailsBtn.addEventListener('click', function () {
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
  })(); // testimonial slider


  (function () {
    var sliderContainer = document.querySelector('.testi-slider-container'),
        slides = sliderContainer.querySelectorAll('.testi-item'),
        slideWidth = sliderContainer.offsetWidth,
        prevBtn = document.querySelector('.testi-slider-nav .prev'),
        nextBtn = document.querySelector('.testi-slider-nav .next'),
        activeSlide = sliderContainer.querySelector('.testi-item.active');
    var slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide); // set width of all slide

    slides.forEach(function (slide) {
      slide.style.width = slideWidth + 'px';
    }); // set width of sliderContainer

    sliderContainer.style.width = slideWidth * slides.length + 'px';
    nextBtn.addEventListener('click', function () {
      if (slideIndex === slides.length - 1) {
        slideIndex = 0;
      } else {
        slideIndex++;
      }

      slider();
    });
    prevBtn.addEventListener('click', function () {
      if (slideIndex === 0) {
        slideIndex = slides.length - 1;
      } else {
        slideIndex--;
      }

      slider();
    });

    function slider() {
      sliderContainer.querySelector('.testi-item.active').classList.remove('active');
      slides[slideIndex].classList.add('active');
      sliderContainer.style.marginLeft = -(slideWidth * slideIndex) + 'px';
    }

    slider();
  })(); // ---------------- hide all section except active ----------------


  (function () {
    var section = document.querySelectorAll('.section');
    section.forEach(function (section) {
      if (!section.classList.contains('active')) {
        section.classList.add('hide');
      }
    });
  })(); // ----------------------- style-switcher -----------------------


  var styleSwitcherToggler = document.querySelector('.style-switcher-toggler');
  styleSwitcherToggler.addEventListener('click', function () {
    document.querySelector('.style-switcher').classList.toggle('open');
  }); // hide style-switcher on scroll

  window.addEventListener('scroll', function () {
    if (document.querySelector('.style-switcher').classList.contains('open')) {
      document.querySelector('.style-switcher').classList.remove('open');
    }
  }); // ------------------------ theme colors ---------------------------

  var colors = document.querySelectorAll('.color');
  colors.forEach(function (color) {
    color.addEventListener('click', function (event) {
      console.log(event.target.classList);
    });
  });
});