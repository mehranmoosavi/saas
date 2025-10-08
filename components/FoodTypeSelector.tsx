'use client';

// مقادیر enum را برای استفاده در کلاینت وارد می‌کنیم
import { FoodType } from '@prisma/client';

// یک تایپ برای پراپ‌های ورودی تعریف می‌کنیم
interface FoodTypeSelectorProps {
  onSelectType: (type: FoodType) => void;
  selectedType: FoodType | null;
}

// آرایه‌ای از انواع غذا برای نمایش دکمه‌ها
const foodTypes = [
  FoodType.PERSIAN, 
  FoodType.JAPANESE, 
  FoodType.FAST_FOOD, 
  FoodType.DRINKING
];

export default function FoodTypeSelector({ selectedType,onSelectType, }: FoodTypeSelectorProps) {
  return (
    <div className="flex space-x-4 p-4 bg-gray-100 rounded-lg">
      {foodTypes.map((type) => (
        <button
          key={type}
          onClick={() => onSelectType(type)}
          className={`px-4 py-2 rounded-md font-semibold transition-colors
            ${selectedType === type
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {/* نمایش نام فارسی برای هر تایپ */}
          {type === 'PERSIAN' && 'ایرانی'}
          {type === 'JAPANESE' && 'ژاپنی'}
          {type === 'FAST_FOOD' && 'فست فود'}
          {type === 'DRINKING' && 'نوشیدنی'}
        </button>
      ))}
    </div>
  );
}