import React from "react";
import logo from "../../../../assets/images/logo.png";
import {
  FacebookFilled,
  TwitterOutlined,
  LinkedinFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const Footer: React.FC = () => (
  <footer className="w-full bg-gradient-to-r from-[#f5e9e2] via-[#fff4e6] to-[#e3f2fd] border-t border-[#ffe0b2]/40 shadow-inner pt-10 pb-4 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      {/* Liên hệ */}
      <div className="space-y-4 flex flex-col items-start">
        <img
          src={logo}
          alt="Logo"
          className="h-14 rounded-full shadow border-2 border-[#ffe0b2]/60 bg-white p-1"
        />
        <div className="ml-2 space-y-2">
          <div className="flex items-center gap-2 text-[#a0522d]">
            <MailOutlined />
            <span className="font-semibold">VLearnReading@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0522d]">
            <PhoneOutlined />
            <span className="font-semibold">+0123456789</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0522d]">
            <EnvironmentOutlined />
            <span className="font-semibold">TP. Hồ Chí Minh, Việt Nam</span>
          </div>
        </div>
      </div>
      {/* Trang chung */}
      <div className="space-y-2 mt-2">
        <h4 className="text-lg font-bold text-[#d32f2f] mb-2">Trang chủ</h4>
        <div className="flex flex-col gap-4">
          <a
            href="#target"
            className="hover:text-[#ffb300] transition font-semibold text-[#7B4230]"
          >
            Mục tiêu
          </a>
          <a
            href="#benefits"
            className="hover:text-[#ffb300] transition font-semibold text-[#7B4230]"
          >
            Lợi ích
          </a>
          <a
            href="#courses"
            className="hover:text-[#ffb300] transition font-semibold text-[#7B4230]"
          >
            Các khóa học
          </a>
        </div>
      </div>
      {/* Về chúng tôi */}
      <div className="space-y-2 mt-2">
        <h4 className="text-lg font-bold text-[#d32f2f] mb-2">Về chúng tôi</h4>
        <div className="flex flex-col gap-4">
          <a
            href="#company"
            className="hover:text-[#ffb300] transition font-semibold text-[#7B4230]"
          >
            Công ty
          </a>
          <a
            href="#achievements"
            className="hover:text-[#ffb300] transition font-semibold text-[#7B4230]"
          >
            Thành tựu
          </a>
          <a
            href="#mission"
            className="hover:text-[#ffb300] transition font-semibold text-[#7B4230]"
          >
            Mục tiêu của chúng tôi
          </a>
        </div>
      </div>
      {/* Mạng xã hội */}
      <div className="space-y-2 mt-2">
        <h4 className="text-lg font-bold text-[#d32f2f] mb-2">Mạng xã hội</h4>
        <div className="flex gap-4 text-2xl">
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            className="hover:text-[#ffb300] transition drop-shadow-lg"
          >
            <FacebookFilled />
          </a>
          <a
            href="https://twitter.com"
            aria-label="Twitter"
            className="hover:text-[#ffb300] transition drop-shadow-lg"
          >
            <TwitterOutlined />
          </a>
          <a
            href="https://linkedin.com"
            aria-label="LinkedIn"
            className="hover:text-[#ffb300] transition drop-shadow-lg"
          >
            <LinkedinFilled />
          </a>
        </div>
      </div>
    </div>
    <div className="text-center text-[#7B4230]/70 text-xs mt-8 font-semibold">
      © 2025 VLearnReading. Bảo lưu mọi quyền.
    </div>
  </footer>
);

export default Footer;
