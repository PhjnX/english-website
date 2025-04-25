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
import logo from "../../../../assets/images/logo.png";

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => (
  <AntFooter className="bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-700">
      {/* Contact Section */}
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
            <span>Somewhere in the World</span>
          </div>
        </div>
      </div>

      {/* Home Links */}
      <div className="space-y-2 mt-5 ml-20">
        <h4 className="text-black text-base !font-bold">Home</h4>
        <p>Our target</p>
        <p>Benefits</p>
        <p>Our courses</p>
      </div>

      {/* About Links */}
      <div className="space-y-2 mt-5">
        <h4 className="text-black text-base !font-bold">About Us</h4>
        <p>Company</p>
        <p>Achievements</p>
        <p>Our Goals</p>
      </div>

      {/* Social Section */}
      <div className="space-y-2 mt-5">
        <h4 className="text-black text-base !font-bold">Social Profiles</h4>
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
      © 2025 VLearnReading. All rights reserved.
    </div>
  </AntFooter>
);

export default Footer;
