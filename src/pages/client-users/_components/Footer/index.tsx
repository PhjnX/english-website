import React from "react";
import { Layout } from "antd";
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => (
  <AntFooter className="bg-gray-100">
    <div className="container mx-auto py-8 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Brand Info */}
      <div>
        <h3 className="text-lg font-semibold mb-2">EnglishLearn</h3>
        <p className="text-sm text-gray-600">
          Learn English effectively with interactive lessons and engaging
          exercises.
        </p>
      </div>
      {/* Quick Links */}
      <div>
        <h4 className="font-medium mb-2">Quick Links</h4>
        <ul className="space-y-1">
          <li>
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
          </li>
          <li>
            <a href="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </a>
          </li>
          <li>
            <a href="/about" className="text-gray-700 hover:text-blue-600">
              About Us
            </a>
          </li>
          <li>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </a>
          </li>
        </ul>
      </div>
      {/* Social Media */}
      <div>
        <h4 className="font-medium mb-2">Follow Us</h4>
        <div className="flex space-x-4 text-2xl text-blue-600">
          <a href="https://facebook.com" aria-label="Facebook">
            <FacebookFilled />
          </a>
          <a href="https://twitter.com" aria-label="Twitter">
            <TwitterSquareFilled />
          </a>
          <a href="https://instagram.com" aria-label="Instagram">
            <InstagramFilled />
          </a>
        </div>
      </div>
      {/* Copyright */}
      <div className="col-span-full text-center text-sm text-gray-500 mt-6">
        © {new Date().getFullYear()} EnglishLearn. All rights reserved.
      </div>
    </div>
  </AntFooter>
);

export default Footer;
