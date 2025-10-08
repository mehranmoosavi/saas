'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((starValue) => {
        return (
          <label key={starValue} className="cursor-pointer">
            {/* این input واقعی است که داده را برای فرم ارسال می‌کند */}
            <input
              type="radio"
              name="rating"
              value={starValue}
              onClick={() => setRating(starValue)}
              className="hidden" // این input را از دید کاربر مخفی می‌کنیم
            />
            <Star
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              className={`w-8 h-8 transition-colors ${
                starValue <= (hover || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </label>
        );
      })}
    </div>
  );
}