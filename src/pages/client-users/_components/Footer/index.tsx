import React from "react";
import { Layout } from "antd";
import {
  FacebookFilled,
  TwitterOutlined,
  LinkedinFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import logo from "../../../../assets/images/logo.jpg";

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => (
  <AntFooter className="bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-700">
      {/* Phần Liên hệ */}
      <div className="space-y-4">
        <div>
          <img src={logo} alt="Logo" className="h-20" />
        </div>
        <div className="ml-12">
          <div className="flex items-center gap-2 mb-2">
            <MailOutlined />
            <span>VLearnReading@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <PhoneOutlined />
            <span>+0123456789</span>
          </div>
          <div className="flex items-center gap-2">
            <EnvironmentOutlined />
            <span>TP. Hồ Chí Minh, Việt Nam</span>
          </div>
        </div>
      </div>

      {/* Liên kết Trang chung */}
      <div className="space-y-2 mt-5 ml-20">
        <h4 className="text-black text-base !font-bold">Trang chủ</h4>
        <p>Mục tiêu</p>
        <p>Lợi ích</p>
        <p>Các khóa học</p>
      </div>

      {/* Liên kết Về chúng tôi */}
      <div className="space-y-2 mt-5">
        <h4 className="text-black text-base !font-bold">Về chúng tôi</h4>
        <p>Công ty</p>
        <p>Thành tựu</p>
        <p>Mục tiêu của chúng tôi</p>
      </div>

      {/* Mạng xã hội */}
      <div className="space-y-2 mt-5">
        <h4 className="text-black text-base !font-bold">Mạng xã hội</h4>
        <div className="flex gap-3 text-xl">
          <a href="https://facebook.com" aria-label="Facebook">
            <FacebookFilled />
          </a>
          <a href="https://twitter.com" aria-label="Twitter">
            <TwitterOutlined />
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn">
            <LinkedinFilled />
          </a>
        </div>
      </div>
    </div>

    <div className="text-center text-gray-500 text-xs mt-4 pb-2">
      © 2025 VLearnReading. Bảo lưu mọi quyền.
    </div>
  </AntFooter>
);

export default Footer;
