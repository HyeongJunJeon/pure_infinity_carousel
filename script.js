// 슬라이드 관련 기본 설정
const slideWrap = document.querySelector(".slide-wrapper");
const slideContainer = document.querySelector(".slides");
const slidesLength = document.querySelectorAll(".slide").length;
let slideWidth = slideWrap.offsetWidth;
let currentSlide = 0;
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const indicators = document.querySelectorAll(".indicator li a");
const autoSlideController = document.querySelector(".auto-slide-controller");
const slideSpeedInput = document.querySelector(".slide-speed");
const slideIntervalInput = document.querySelector(".slide-interval");
let slideSpeed = parseInt(slideSpeedInput.value, 10);
let slideIntervalTime = parseInt(slideIntervalInput.value, 10);
//터치관련 position 값
let startPos = 0;
let endPos = 0;

// 슬라이드 이동 함수
const goToSlide = (index) => {
  currentSlide = index;
  slideContainer.style.transition = `transform ${slideSpeed / 1000}s ease`;
  slideContainer.style.transform = `translateX(-${
    slideWidth * (currentSlide + 1)
  }px)`;
  updateIndicators();
  resetAutoSlideInterval();
};

// 인디케이터 업데이트 함수
const updateIndicators = () => {
  const indicator = document.querySelectorAll(".indicator li");
  indicator.forEach((ind, i) => {
    ind.classList.toggle("act", i === currentSlide % slidesLength);
  });
};

// 슬라이드 전환 완료 후 위치 조정 함수
const handleTransitionEnd = () => {
  if (currentSlide >= slidesLength) {
    slideContainer.style.transition = "none";
    currentSlide = 0;
    slideContainer.style.transform = `translateX(-${slideWidth}px)`;
  } else if (currentSlide < 0) {
    slideContainer.style.transition = "none";
    currentSlide = slidesLength - 1;
    slideContainer.style.transform = `translateX(-${
      slideWidth * slidesLength
    }px)`;
  }
};

const throttle = (cb, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      cb.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 이전 및 다음 버튼 클릭 이벤트 추가 함수
const addEventArrowBtns = () => {
  nextBtn.addEventListener(
    "click",
    throttle((event) => {
      event.preventDefault();
      goToSlide(currentSlide + 1);
    }, 500)
  );

  prevBtn.addEventListener(
    "click",
    throttle((event) => {
      event.preventDefault();
      goToSlide(currentSlide - 1);
    }, 500)
  );
};

// 인디케이터 클릭 이벤트 추가 함수
const addEventIndicators = () => {
  indicators.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      goToSlide(index);
    });
  });
};

// 자동 슬라이드 기능
const autoSlide = () => {
  goToSlide(currentSlide + 1);
};

// 자동 슬라이드 타이머 초기화 함수
const resetAutoSlideInterval = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
  }
  autoSlideInterval = setInterval(autoSlide, slideIntervalTime);
};

// 자동 슬라이드 제어 버튼 이벤트 추가 함수
const addEventAutoSlideController = () => {
  autoSlideController.addEventListener("click", () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
      autoSlideController.textContent = "play";
    } else {
      resetAutoSlideInterval();
      autoSlideController.textContent = "pause";
    }
  });
};

// 슬라이드 clone
const cloneSlides = () => {
  const firstSlide = slideContainer.firstElementChild.cloneNode(true);
  const lastSlide = slideContainer.lastElementChild.cloneNode(true);
  slideContainer.appendChild(firstSlide);
  slideContainer.insertBefore(lastSlide, slideContainer.firstElementChild);
};

// 슬라이드 초기 설정 함수
const initializeSlides = () => {
  cloneSlides();
  slideContainer.style.transform = `translateX(-${slideWidth}px)`;
};

// 창 크기 변경 시 슬라이드 폭 업데이트 및 위치 조정 함수
const updateSlideWidth = () => {
  slideWidth = slideWrap.offsetWidth;
  slideContainer.style.transition = "none";
  goToSlide(currentSlide);
};

// 전환 속도 및 간격 업데이트 함수
const addEventSpeedAndIntervalInputs = () => {
  slideSpeedInput.addEventListener("input", () => {
    slideSpeed = parseInt(slideSpeedInput.value, 10);
  });

  slideIntervalInput.addEventListener("input", () => {
    //최소 1000ms 강제
    slideIntervalTime = Math.max(parseInt(slideIntervalInput.value, 10), 1000);
    resetAutoSlideInterval();
  });
};

//터치 이벤트 등록 함수
const addEventTouchGesture = () => {
  slideContainer.addEventListener("touchstart", (event) => {
    startPos = event.touches[0].pageX;
  });

  slideContainer.addEventListener("touchmove", (event) => {
    endPos = event.touches[0].pageX;
  });

  slideContainer.addEventListener("touchend", () => {
    handleSwipe();
  });
};

// 스와이프 처리 함수
const handleSwipe = () => {
  if (startPos === 0 || endPos === 0) return;

  if (startPos > endPos) {
    goToSlide(currentSlide + 1);
  } else if (startPos < endPos) {
    goToSlide(currentSlide - 1);
  }

  startPos = 0;
  endPos = 0;

  // 무한 스와이프 처리
  slideContainer.addEventListener("transitionend", handleTransitionEnd);
};

// 초기화 함수
const initializeCarousel = () => {
  initializeSlides();
  addEventArrowBtns();
  addEventIndicators();
  addEventAutoSlideController();
  addEventTouchGesture();
  window.addEventListener("resize", updateSlideWidth);
  slideContainer.addEventListener("transitionend", handleTransitionEnd);
  addEventSpeedAndIntervalInputs();
};

// 자동 슬라이드 시작
let autoSlideInterval = setInterval(autoSlide, slideIntervalTime);

// 초기화 함수 호출
initializeCarousel();
