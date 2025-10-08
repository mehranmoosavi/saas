'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sliderImages = [
  // '3cop'
  '/images/slider/slide-1.jpg',
  '/images/slider/slide-2.jpg',
  '/images/slider/slide-3.jpg',
  // '1cop'
];

const slides = [sliderImages[sliderImages.length - 1], ...sliderImages, sliderImages[0]];

export default function CustomSlider() {

  const [currentIndex, setCurrentIndex] = useState(1); // ۱. از اسلاید ۱ واقعی شروع می‌کنیم
  const [transitionEnabled, setTransitionEnabled] = useState(true);
//   const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex + 1); // چون یک اسلاید کلون شده در ابتدا داریم
  };


  // افکت برای پرش‌های جادویی
  useEffect(() => {
    if (currentIndex === slides.length - 1) { // اگر به آخرین اسلاید (کپی ۱) رسیدیم
    //   transitionTimeoutRef.current = 
      setTimeout(() => {
        setTransitionEnabled(false); // انیمیشن را غیرفعال کن
        setCurrentIndex(1); // به اسلاید ۱ واقعی پرش کن
      }, 500); // ۵۰۰ میلی‌ثانیه زمان انیمیشن
    }

    if (currentIndex === 0) { // اگر به اولین اسلاید (کپی ۳) رسیدیم
      // console.log
    //   transitionTimeoutRef.current =
       setTimeout(() => {
        setTransitionEnabled(false); // انیمیشن را غیرفعال کن
        setCurrentIndex(slides.length - 2); // به اسلاید ۳ واقعی پرش کن
      }, 500);
    }
  }, [currentIndex]);

  // افکتی برای فعال کردن مجدد انیمیشن
  useEffect(() => {
    if (!transitionEnabled) {
      // یک لحظه بعد، انیمیشن را دوباره فعال کن
      requestAnimationFrame(() => setTransitionEnabled(true));
    // setTransitionEnabled(true)
    }
  }, [transitionEnabled]);

   useEffect(() => {

    // تایمر را فقط زمانی اجرا کن که انیمیشن فعال باشد
    if (transitionEnabled) {
console.log(currentIndex)

      const timer = setInterval(() => {
        goToNext();
      }, 3000); // هر ۵ ثانیه

      // پاک‌سازی تایمر هنگام unmount شدن کامپوننت
      return () => clearInterval(timer);
    // }
  }}, [transitionEnabled,currentIndex]);    



  return (
     <div className="w-full max-w-4xl mx-auto">
      {/* ۱. یک کانتینر Flexbox برای قرار دادن فلش‌ها و اسلایدر در کنار هم */}
      <div className="flex items-center justify-center gap-x-4">
        
        {/* دکمه قبلی */}
        <button 
        title='a'
          onClick={goToPrevious} 
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={30} className="text-gray-700" />
        </button>

        {/* کانتینر اصلی اسلایدر */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden flex-1">
          <div 
            className="w-full h-full flex"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {slides.map((src, index) => (
              <div key={index} className="min-w-full h-full relative">
                <Image src={src} alt={`Slide ${index}`} layout="fill" objectFit="cover" />
              </div>
            ))}
          </div>
        </div>

        {/* دکمه بعدی */}
        <button 
        title='a'
          onClick={goToNext}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={30} className="text-gray-700" />
        </button>
      </div>
      
      {/* نقاط دایره‌ای (Pagination) */}
      <div className="flex justify-center mt-4">
        {sliderImages.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`h-3 w-3 rounded-full mx-1.5 cursor-pointer transition-colors duration-300 ${
              // مقایسه صحیح برای هایلایت کردن نقطه فعال
              currentIndex === slideIndex + 1 || (currentIndex === 0 && slideIndex === sliderImages.length - 1) || (currentIndex === slides.length - 1 && slideIndex === 0)
                ? 'bg-blue-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}