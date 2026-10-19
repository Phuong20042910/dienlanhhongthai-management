import React, { useEffect } from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ServicesSection } from '../components/landing/ServicesSection';
import { PricingSection } from '../components/landing/PricingSection';
import { ProcessSection } from '../components/landing/ProcessSection';
import { QuickBookingSection } from '../components/landing/QuickBookingSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Đặt tiêu đề SEO cho trang chủ
    document.title = 'Điện Lạnh Hồng Thái - Dịch Vụ Sửa Chữa & Bảo Dưỡng Tận Nơi Uy Tín';
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Thanh điều hướng */}
      <LandingNavbar />

      <main>
        {/* 2. Banner chính (Hero Section) */}
        <HeroSection />

        {/* 3. Dịch vụ tiêu biểu */}
        <ServicesSection />

        {/* 4. Bảng giá niêm yết minh bạch */}
        <PricingSection />

        {/* 5. Quy trình 4 bước chuyên nghiệp */}
        <ProcessSection />

        {/* 6. Form đặt lịch hẹn trực tiếp */}
        <QuickBookingSection />

        {/* 7. Đánh giá khách hàng thực tế */}
        <TestimonialsSection />
      </main>

      {/* 8. Chân trang thông tin & liên hệ */}
      <LandingFooter />
    </div>
  );
};
