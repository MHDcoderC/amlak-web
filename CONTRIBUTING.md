# 🤝 راهنمای مشارکت

## 📋 فهرست مطالب
- [مقدمه](#مقدمه)
- [نحوه مشارکت](#نحوه-مشارکت)
- [استانداردهای کد](#استانداردهای-کد)
- [فرآیند توسعه](#فرآیند-توسعه)
- [گزارش باگ](#گزارش-باگ)
- [درخواست ویژگی](#درخواست-ویژگی)
- [سوالات متداول](#سوالات-متداول)

---

## 🎯 مقدمه

از مشارکت شما در پروژه **Amlak Web** بسیار خوشحالیم! این راهنما به شما کمک می‌کند تا به بهترین شکل در توسعه این پروژه مشارکت کنید.

### 🎁 انواع مشارکت
- 🐛 گزارش باگ
- 💡 پیشنهاد ویژگی جدید
- 📝 بهبود مستندات
- 🔧 رفع مشکل
- ✨ افزودن ویژگی جدید
- 🎨 بهبود رابط کاربری

---

## 🚀 نحوه مشارکت

### 1. Fork کردن پروژه
```bash
# پروژه را Fork کنید
# سپس کلون کنید
git clone https://github.com/MHDcoderC/amlak-web.git
cd amlak-web

# Remote اصلی را اضافه کنید
git remote add upstream https://github.com/MHDcoderC/amlak-web.git
```

### 2. ایجاد شاخه جدید
```bash
# شاخه جدید برای ویژگی خود ایجاد کنید
git checkout -b feature/amazing-feature

# یا برای رفع باگ
git checkout -b fix/bug-description
```

### 3. توسعه و تست
```bash
# نصب وابستگی‌ها
npm run install:all

# اجرای تست‌ها
npm test

# اجرای development server
npm run dev
```

### 4. Commit کردن تغییرات
```bash
# تغییرات را اضافه کنید
git add .

# Commit با پیام مناسب
git commit -m "feat: add new property search feature

- Add advanced search functionality
- Implement price range filter
- Add location-based search
- Update documentation

Closes #123"
```

### 5. Push و Pull Request
```bash
# Push به شاخه خود
git push origin feature/amazing-feature

# سپس Pull Request ایجاد کنید
```

---

## 📝 استانداردهای کد

### 🎨 فرمت کد
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Line length**: Max 80 characters
- **File naming**: kebab-case for files, PascalCase for components

### 📋 مثال کد تمیز
```javascript
// ✅ خوب
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property, onFavorite }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onFavorite(property.id);
    } catch (error) {
      console.error('Error favoriting property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="property-card">
      <img src={property.image} alt={property.title} />
      <h3>{property.title}</h3>
      <p>{property.price}</p>
      <button 
        onClick={handleClick}
        disabled={isLoading}
        className="favorite-btn"
      >
        {isLoading ? 'Loading...' : 'Favorite'}
      </button>
    </div>
  );
};

export default PropertyCard;
```

### 🚫 کد بد
```javascript
// ❌ بد
import React from 'react'
import {useNavigate} from 'react-router-dom'

const PropertyCard=({property,onFavorite})=>{
const [isLoading,setIsLoading]=React.useState(false)
const navigate=useNavigate()

const handleClick=async()=>{
setIsLoading(true)
try{
await onFavorite(property.id)
}catch(error){
console.error('Error favoriting property:',error)
}finally{
setIsLoading(false)
}
}

return <div className="property-card"><img src={property.image} alt={property.title}/><h3>{property.title}</h3><p>{property.price}</p><button onClick={handleClick} disabled={isLoading} className="favorite-btn">{isLoading?'Loading...':'Favorite'}</button></div>
}

export default PropertyCard
```

---

## 🔄 فرآیند توسعه

### 📋 مراحل توسعه
1. **بررسی Issues**: ابتدا Issues موجود را بررسی کنید
2. **انتخاب Task**: یک Issue مناسب انتخاب کنید
3. **برنامه‌ریزی**: راه‌حل خود را برنامه‌ریزی کنید
4. **توسعه**: کد را بنویسید
5. **تست**: تست‌های مناسب بنویسید
6. **مستندسازی**: مستندات را به‌روزرسانی کنید
7. **Review**: کد خود را بررسی کنید
8. **Submit**: Pull Request ارسال کنید

### 🧪 تست‌نویسی
```javascript
// مثال تست کامپوننت
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from './PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: 1,
    title: 'Test Property',
    price: '1000000',
    image: 'test.jpg'
  };

  const mockOnFavorite = jest.fn();

  test('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} onFavorite={mockOnFavorite} />);
    
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('1000000')).toBeInTheDocument();
    expect(screen.getByAltText('Test Property')).toBeInTheDocument();
  });

  test('calls onFavorite when button is clicked', () => {
    render(<PropertyCard property={mockProperty} onFavorite={mockOnFavorite} />);
    
    fireEvent.click(screen.getByText('Favorite'));
    expect(mockOnFavorite).toHaveBeenCalledWith(1);
  });
});
```

---

## 🐛 گزارش باگ

### 📋 قالب گزارش باگ
```markdown
## 🐛 شرح باگ
توضیح کوتاه و واضح از مشکل

## 🔄 مراحل بازتولید
1. به صفحه '...' بروید
2. روی '...' کلیک کنید
3. به پایین اسکرول کنید
4. خطا را مشاهده کنید

## ✅ رفتار مورد انتظار
توضیح آنچه باید اتفاق بیفتد

## 📱 اطلاعات سیستم
- مرورگر: Chrome 120.0.6099.109
- سیستم عامل: Windows 11
- نسخه: 1.0.0

## 📸 اسکرین‌شات
در صورت امکان، اسکرین‌شات اضافه کنید

## 📝 لاگ‌ها
```
Error: Cannot read property 'title' of undefined
    at PropertyCard (PropertyCard.jsx:15)
    at render (App.jsx:25)
```

## 🔧 راه‌حل موقت
اگر راه‌حل موقتی دارید، اینجا بنویسید
```

---

## 💡 درخواست ویژگی

### 📋 قالب درخواست ویژگی
```markdown
## 🎯 مشکل/نیاز
توضیح مشکل یا نیاز که این ویژگی حل می‌کند

## 💡 راه‌حل پیشنهادی
توضیح راه‌حل یا ویژگی مورد نظر

## 🔄 راه‌حل‌های جایگزین
راه‌حل‌های دیگری که بررسی کرده‌اید

## 📊 تأثیر
تأثیر این ویژگی بر کاربران و سیستم

## 🎨 نمونه‌های مشابه
مثال‌هایی از سایت‌های دیگر که این ویژگی را دارند
```

---

## ❓ سوالات متداول

### 🤔 سوالات عمومی

**Q: چگونه می‌توانم شروع کنم؟**
A: ابتدا Issues را بررسی کنید و یک Issue با برچسب "good first issue" انتخاب کنید.

**Q: آیا باید تجربه React داشته باشم؟**
A: بله، آشنایی با React.js ضروری است.

**Q: چگونه می‌توانم با تیم در ارتباط باشم؟**
A: از طریق Issues، Discussions یا ایمیل با ما در ارتباط باشید.

**Q: آیا می‌توانم ویژگی جدیدی پیشنهاد دهم؟**
A: بله! از طریق Issues یا Discussions ایده خود را مطرح کنید.

### 🔧 سوالات فنی

**Q: چگونه تست‌ها را اجرا کنم؟**
A: `npm test` را اجرا کنید.

**Q: چگونه development server را راه‌اندازی کنم؟**
A: `npm run dev` را اجرا کنید.

**Q: آیا باید ESLint را نصب کنم؟**
A: بله، برای بررسی کد از ESLint استفاده می‌کنیم.

---

## 🏆 راهنمای Pull Request

### ✅ چک‌لیست قبل از ارسال
- [ ] کد تمیز و قابل خواندن است
- [ ] تست‌های مناسب نوشته شده
- [ ] مستندات به‌روزرسانی شده
- [ ] ESLint خطا ندارد
- [ ] تست‌ها موفق هستند
- [ ] پیام commit مناسب است
- [ ] تغییرات کوچک و متمرکز هستند

### 📝 قالب Pull Request
```markdown
## 📋 خلاصه تغییرات
توضیح کوتاه از تغییرات انجام شده

## 🔗 مرتبط با Issue
Closes #123

## 🧪 تست‌ها
- [ ] تست‌های جدید اضافه شده
- [ ] تست‌های موجود همچنان موفق هستند
- [ ] تست‌های دستی انجام شده

## 📸 اسکرین‌شات
در صورت تغییر UI، اسکرین‌شات اضافه کنید

## 📝 نوع تغییر
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🔍 بررسی‌های انجام شده
- [ ] کد خود را بررسی کرده‌ام
- [ ] مستندات را به‌روزرسانی کرده‌ام
- [ ] تست‌ها را اجرا کرده‌ام
```

---

## 🎉 تشکر

از مشارکت شما در بهبود پروژه **Amlak Web** بسیار سپاسگزاریم! 🙏

### 📞 تماس
- **توسعه‌دهنده**: محمد سجادی (mmcode)
- **GitHub**: [@MHDcoderC](https://github.com/MHDcoderC)
- **ایمیل**: contributors@amlak-web.com
- **Discord**: [Join our community](https://discord.gg/amlak-web)
- **Twitter**: [@amlak_web](https://twitter.com/amlak_web)

---

**یادآوری**: این راهنما به طور منظم به‌روزرسانی می‌شود. لطفاً آخرین نسخه را بررسی کنید.
