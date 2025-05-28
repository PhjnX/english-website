// src/components/_components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

import siteLogoImage from "../../../../assets/images/logo.png";

const ReadifyFooterLogoAndText: React.FC = () => (
  <Link to="/" className="inline-flex items-center mb-4 group">
    <motion.img
      src={siteLogoImage}
      alt="Readify Logo"
      className="h-10 w-10 md:h-12 md:w-12 rounded-md mr-3 \
                 border-2 border-purple-400/50 group-hover:border-purple-300 transition-colors duration-300"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 150 }}
      whileHover={{ rotate: -5, scale: 1.1 }}
    />
    <motion.span
      className="text-3xl font-extrabold font-be-vietnam-pro group-hover:opacity-80 transition-opacity"
      style={{ fontFamily: "Be Vietnam Pro", fontWeight: 800 }}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <span className="text-white">Read</span>
      <span className="text-purple-300">ify</span>
    </motion.span>
  </Link>
);

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <li>
    <Link
      to={to}
      className="text-purple-200 hover:text-white hover:underline transition-colors duration-200 text-sm md:text-base"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon: React.FC<{
  href: string;
  icon: React.ElementType;
  label: string;
}> = ({ href, icon: Icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-purple-300 hover:text-white transition-colors duration-200 text-xl"
    whileHover={{ scale: 1.25, y: -3 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
  >
    <Icon />
  </motion.a>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerColumnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.2, // Tăng nhẹ delay để xuất hiện sau đường kẻ
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-purple-800 via-indigo-800 to-purple-900 text-purple-200 pt-12 md:pt-16 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hiệu ứng đường kẻ gradient chạy ngang RÕ RÀNG HƠN */}
      <div className="h-[10px] w-full absolute top-0 left-0 right-0 overflow-hidden">
        {" "}
        {/* Tăng chiều cao lên 3px */}
        <motion.div
          className="h-full w-full"
          style={{
            // Gradient tạo một "vệt sáng" rõ nét ở giữa và mờ dần ra hai bên
            backgroundImage: `linear-gradient(to right, 
                                    rgba(168, 85, 247, 0),      /* Purple-500 transparent */
                                    rgba(192, 132, 252, 0.1),   /* Purple-400 very transparent */
                                    rgba(216, 180, 254, 0.8),   /* Purple-300 more opaque */
                                    rgba(233, 213, 255, 1),     /* Purple-200 (almost white) fully opaque - CORE GLOW */
                                    rgba(216, 180, 254, 0.8),   /* Purple-300 */
                                    rgba(192, 132, 252, 0.1),   /* Purple-400 */
                                    rgba(168, 85, 247, 0)       /* Purple-500 transparent */
                                )`,
            backgroundSize: "400% 100%", // Gradient rộng hơn để "vệt sáng" di chuyển rõ ràng
          }}
          animate={{
            backgroundPositionX: ["150%", "-150%"], // Di chuyển từ phải qua trái hoàn toàn rồi lặp lại
          }}
          transition={{
            duration: 6, // Tăng tốc độ chạy của gradient
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 pb-10 md:pb-12">
          {/* Cột 1: Logo và Copyright */}
          <motion.div
            variants={footerColumnVariants}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <ReadifyFooterLogoAndText />
            <p className="text-sm text-purple-300/80 !mb-4 font-inter leading-relaxed">
              Nền tảng hàng đầu giúp bạn chinh phục IELTS Reading với lộ trình
              chuyên biệt và tài liệu chất lượng.
            </p>
            <p className="text-xs text-purple-400/70 font-inter">
              © {currentYear} Readify. Bảo lưu mọi quyền.
            </p>
          </motion.div>

          {/* Cột 2: Về Readify */}
          <motion.div
            variants={footerColumnVariants}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h5
              className="text-lg font-semibold text-white !mb-5 font-be-vietnam-pro"
              style={{ fontFamily: "Be Vietnam Pro", fontWeight: 700 }}
            >
              Về Readify
            </h5>
            <ul className="space-y-3">
              <FooterLink to="/about">Giới thiệu</FooterLink>
              <FooterLink to="/features">Tính năng</FooterLink>
              <FooterLink to="/blog">Blog Chia Sẻ</FooterLink>
            </ul>
          </motion.div>

          {/* Cột 3: Hỗ Trợ */}
          <motion.div
            variants={footerColumnVariants}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h5
              className="text-lg font-semibold text-white !mb-5 font-be-vietnam-pro"
              style={{ fontFamily: "Be Vietnam Pro", fontWeight: 700 }}
            >
              Hỗ Trợ
            </h5>
            <ul className="space-y-3">
              <FooterLink to="/faq">Câu hỏi thường gặp</FooterLink>
              <FooterLink to="/contact">Liên hệ chúng tôi</FooterLink>
              <FooterLink to="/privacy-policy">Chính sách bảo mật</FooterLink>
              <FooterLink to="/terms-of-service">Điều khoản sử dụng</FooterLink>
            </ul>
          </motion.div>

          {/* Cột 4: Kết nối */}
          <motion.div
            variants={footerColumnVariants}
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h5
              className="text-lg font-semibold text-white !mb-5 font-be-vietnam-pro"
              style={{ fontFamily: "Be Vietnam Pro", fontWeight: 700 }}
            >
              Kết Nối Với Readify
            </h5>
            <div className="flex space-x-5 mt-1">
              <SocialIcon
                href="https://facebook.com"
                icon={FaFacebookF}
                label="Facebook Readify"
              />
              <SocialIcon
                href="https://youtube.com"
                icon={FaYoutube}
                label="Youtube Readify"
              />
              <SocialIcon
                href="https://instagram.com"
                icon={FaInstagram}
                label="Instagram Readify"
              />
              <SocialIcon
                href="https://linkedin.com"
                icon={FaLinkedinIn}
                label="LinkedIn Readify"
              />
            </div>
            <p className="!mt-6 text-sm text-purple-300/80 font-inter">
              Email:{" "}
              <a
                href="mailto:support@readify.com"
                className="hover:text-white hover:underline"
              >
                support@readify.com
              </a>
            </p>
          </motion.div>
        </div>

        <div className="border-t border-purple-700/50 py-6 text-center">
          <p className="text-sm text-purple-300/90 font-inter">
            Thiết kế và phát triển bởi{" "}
            <span className="font-semibold text-white">Readify Team</span> with
            ❤️
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
