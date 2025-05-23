'use client';

import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import Link from 'next/link';
import { usePathname } from 'next/navigation';  // Import usePathname

import "../../css/nav.css";

export default function AdminNavPage() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarHidden, setSidebarHidden] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const pathname = usePathname(); // Sử dụng usePathname để lấy đường dẫn

  // Khai báo useRef cho notification và profile
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Cập nhật activeMenu khi URL thay đổi
  useEffect(() => {
    const path = pathname.split('/').pop();
    setActiveMenu(path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard');
  }, [pathname]);

  // Cập nhật class dark cho body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Đóng menu khi click ngoài các phần tử này
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        notificationRef.current &&
        !notificationRef.current.contains(target) &&
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);
  
  const menuItems = ['Dashboard', 'Category', 'Product', 'User', 'Feedback', 'Voucher', 'Blog', 'Stock'];
  
  return (
    <div className="admin-layout">
      <section id="sidebar" className={isSidebarHidden ? 'hide' : ''}>
        <Link href="#" className="brand">
          <i className="bx bxs-smile bx-lg" />
          <span className="text">AURA</span>
        </Link>
        <ul className="side-menu top">
          {menuItems.map(item => (
            <li key={item} className={activeMenu === item ? 'active' : ''}>
              <Link href={`/admin/${item.toLowerCase()}`} onClick={() => setActiveMenu(item)}>
                <i className={`bx bx-sm ${
                  item === 'Dashboard' ? 'bxs-dashboard' :
                  item === 'Category' ? 'bxs-category' :
                  item === 'Product' ? 'bxs-shopping-bag-alt' :
                  item === 'User' ? 'bxs-user' :
                  item === 'Feedback' ? 'bxs-comment-detail' :
                  item === 'Voucher' ? 'bxs-gift' :
                  item === 'Blog' ? 'bxs-book-content' :
                  item === 'Stock' ? 'bxs-store-alt' :
                  'bxs-group'
                }`} />
                <span className="text">{item}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="side-menu bottom">
          <li>
            <Link href="#">
              <i className="bx bxs-cog bx-sm bx-spin-hover" />
              <span className="text">Settings</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="logout">
              <i className="bx bx-power-off bx-sm bx-burst-hover" />
              <span className="text">Logout</span>
            </Link>
          </li>
        </ul>
      </section>

      <section id="content">
        <nav>
          <i className="bx bx-menu bx-sm" onClick={() => setSidebarHidden(prev => !prev)} />
          <Link href="#" className="nav-link">Categories</Link>
          <form action="#">
            <div className={`form-input ${isSearchVisible ? 'show' : ''}`}>
              <input type="search" placeholder="Search..." />
              <button
                type="submit"
                className="search-btn"
                onClick={(e) => {
                  if (window.innerWidth < 768) {
                    e.preventDefault();
                    setSearchVisible(prev => !prev);
                  }
                }}
              >
                <i className={`bx ${isSearchVisible ? 'bx-x' : 'bx-search'}`} />
              </button>
            </div>
          </form>

          <input
            type="checkbox"
            className="checkbox"
            id="switch-mode"
            hidden
            checked={isDarkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          <label className="swith-lm" htmlFor="switch-mode">
            <i className="bx bxs-moon" />
            <i className="bx bx-sun" />
            <div className="ball" />
          </label>

          <div ref={notificationRef}>
            <a
              href="#"
              className="notification"
              onClick={(e) => {
                e.preventDefault();
                setNotificationOpen(prev => !prev);
                setProfileOpen(false);
              }}
            >
              <i className="bx bxs-bell bx-tada-hover" />
              <span className="num">8</span>
            </a>
            {isNotificationOpen && (
              <div className="notification-menu">
                <ul>
                  <li>New message from John</li>
                  <li>Your order has been shipped</li>
                  <li>New comment on your post</li>
                  <li>Update available for your app</li>
                  <li>Reminder: Meeting at 3PM</li>
                </ul>
              </div>
            )}
          </div>

          <div ref={profileRef}>
            <a
              href="#"
              className="profile"
              onClick={(e) => {
                e.preventDefault();
                setProfileOpen(prev => !prev);
                setNotificationOpen(false);
              }}
            >
              {/* <Image
                src="https://placehold.co/600x400/png"
                alt="Profile"
                width={40}
                height={40}
              /> */}
            </a>
            {isProfileOpen && (
              <div className="profile-menu">
                <ul>
                  <li><Link href="#">My Profile</Link></li>
                  <li><Link href="#">Settings</Link></li>
                  <li><Link href="#">Log Out</Link></li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </section>
    </div>
  );
}
