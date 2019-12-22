(function(){ "use strict";

/*=========================================================================
	Sticky Header
=========================================================================*/ 
		var header = document.getElementById("header");

		window.addEventListener('scroll', function() {
			var yOffset = 0;
			var triggerPoint = 80;

			yOffset = window.scrollY;

      if (header.classList){
        if (yOffset >= triggerPoint) {
          header.classList.add("navbar-fixed-top");
        } else {
          header.classList.remove("navbar-fixed-top");
        }
      }
		});

/*=========================================================================
	LAZY LOAD
=========================================================================*/ 
  var myLazyLoad = new LazyLoad({
    elements_selector: ".lazy"
  });

/*=========================================================================
    ScreenShot Carousel
=========================================================================*/       
  var mySwiper = new Swiper('.screenshots', {
      direction:'horizontal',
      speed: 1000,
      loop: true,
      preloadImages: true,
      watchSlidesVisibility: true,
      centeredSlides: true,
      spaceBetween: 5,
      slidesPerView: 4,
      grabCursor: true,
      pagination: {
        el: '.screen-pagination',
        clickable: true
      },
      keyboard: true,
      breakpoints: {
        // when window width is <= 375px
        375: {
          slidesPerView: 2
        },
        // when window width is <= 640px
        640: {
          slidesPerView: 2
        }
      },
      on: {
        init: function() {
          myLazyLoad.update()
        },
        slideChange: function() {
          myLazyLoad.update()
        }
      }
  });            

/*=========================================================================
    ScreenShot Carousel (for Ulangi Sheets
=========================================================================*/       
  var mySwiper = new Swiper('.screenshots-ulangi-sheets', {
      direction:'horizontal',
      speed: 1000,
      loop: true,
      preloadImages: true,
      watchSlidesVisibility: true,
      centeredSlides: true,
      spaceBetween: 5,
      slidesPerView: 2,
      grabCursor: true,
      pagination: {
        el: '.screen-pagination',
        clickable: true
      },
      breakpoints: {
        980: {
          slidesPerView: 1
        }
      },
      keyboard: true,
      on: {
        init: function() {
          myLazyLoad.update()
        },
        slideChange: function() {
          myLazyLoad.update()
        }
      }
  });            

/*=========================================================================
	Initialize smoothscroll plugin
=========================================================================*/
	smoothScroll.init({
		offset: 60
	});
	 
/*=========================================================================
	WOW Active
=========================================================================*/ 
  new WOW().init()

})();
