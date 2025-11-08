"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Instagram, Mail, Linkedin, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white rounded-sm py-10 flex flex-col justify-center items-center m-1 border-2 border-orange-300">
      <div className="container px-8 flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* About Section */}
        <div className="text-center flex flex-col items-center flex-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.png" alt="Amrita Logo" width={35} />
            <div className="flex flex-col items-start text-orange-700">
              <span className="text-lg font-bold tracking-widest leading-tight">Amrita</span>
              <span className="text-[10px] leading-tight tracking-wide">Interior & Design</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 max-w-xs text-center">
            Transforming homes and spaces with elegant, modern, and custom interior designs. 
            Explore our curated products and decor ideas to redefine your space.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center flex-1">
          <h3 className="font-medium mb-3 text-orange-600">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-orange-700 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/category" className="hover:text-orange-700 transition-colors">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-orange-700 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-700 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="text-center flex-1">
          <h3 className="font-medium mb-3 text-orange-600">Get in Touch</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <p className="flex justify-center items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Delhi, India</span>
            </p>
            <p className="flex justify-center items-center gap-2">
              <Phone className="w-4 h-4 text-orange-500" />
              <span>+91 9876543210</span>
            </p>
            <Link
              href="mailto:info@amritainterior.com"
              className="flex items-center justify-center gap-2 hover:text-orange-700 transition-colors"
            >
              <Mail className="h-4 w-4 text-orange-500" />
              <span>info@amritainterior.com</span>
            </Link>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-5 mt-3">
              <Link
                href="https://instagram.com/"
                className="text-gray-600 hover:text-orange-700 transition-colors"
                target="_blank"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/"
                className="text-gray-600 hover:text-orange-700 transition-colors"
                target="_blank"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/"
                className="text-gray-600 hover:text-orange-700 transition-colors"
                target="_blank"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Amrita Interior & Design. Developed by Divyanshu Sharma.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
