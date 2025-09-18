"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { footerItems, navbarItems } from "../../constant";

export default function Menu() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const menu = root;
    const menuHeader = root.querySelector(".menu-header");
    const menuOverlay = root.querySelector(".menu-overlay");
    const menuItems = Array.from(root.querySelectorAll(".menu-nav li"));
    const menuFooter = root.querySelector(".menu-footer");
    const menuLogo = root.querySelector(".menu-logo img");
    const hamburgerMenu = root.querySelector(".menu-hamburger-icon");

    let isOpen = false;
    let lastScrollY = window.scrollY;
    let isMenuVisible = true;

    function initMenu() {
      // Simple initialization - just hide the overlay
      gsap.set(menuOverlay, { scaleY: 0, transformOrigin: "top center" });

      // Initialize menu position for scroll animations
      gsap.set(menu, { y: 0 });

      // Make sure menu items are visible (no complex text splitting)
      gsap.set(menuItems, { opacity: 1 });
      gsap.set(menuFooter, { opacity: 1 });
    }

    function openMenu() {
      isOpen = true;
      hamburgerMenu && hamburgerMenu.classList.add("open");
      menuLogo && menuLogo.classList.add("rotated");

      // Simple open animation - just scale the overlay
      gsap.to(menuOverlay, {
        duration: 0.3,
        scaleY: 1,
        ease: "power2.out",
      });
    }

    function closeMenu() {
      isOpen = false;
      hamburgerMenu && hamburgerMenu.classList.remove("open");
      menuLogo && menuLogo.classList.remove("rotated");

      // Simple close animation
      gsap.to(menuOverlay, {
        duration: 0.3,
        scaleY: 0,
        ease: "power2.in",
      });
    }

    function toggleMenu() {
      isOpen ? closeMenu() : openMenu();
    }

    function handleScroll() {
      const currentScrollY = window.scrollY;

      // Hide menu when scrolling down (after 100px)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        if (isOpen) closeMenu(); // Close menu if open
        if (isMenuVisible) {
          // Use GSAP for smooth animation
          gsap.to(menu, {
            y: -100,
            duration: 0.4,
            ease: "power2.out",
          });
          isMenuVisible = false;
        }
      }
      // Show menu when scrolling up
      else if (currentScrollY < lastScrollY) {
        if (!isMenuVisible) {
          // Use GSAP for smooth animation
          gsap.to(menu, {
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          });
          isMenuVisible = true;
        }
      }

      lastScrollY = currentScrollY;
    }

    function updateTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", { hour12: true });
      const timeEl = root.querySelector(".menu-time");
      if (timeEl) {
        timeEl.textContent = timeString;
      }
    }

    // Initialize menu
    initMenu();

    // Event listeners
    menuHeader && menuHeader.addEventListener("click", toggleMenu);
    menuItems.forEach((item) => {
      item.querySelector("a")?.addEventListener("click", () => {
        if (isOpen) closeMenu();
      });
    });
    window.addEventListener("scroll", handleScroll);

    // Update time
    updateTime();
    const timer = window.setInterval(updateTime, 1000);

    return () => {
      menuHeader && menuHeader.removeEventListener("click", toggleMenu);
      window.removeEventListener("scroll", handleScroll);
      window.clearInterval(timer);
    };
  }, []);

  // Keep the hover animation for menu links
  useEffect(() => {
    const links = rootRef.current?.querySelectorAll(".menu-nav a");

    links?.forEach((link) => {
      const handleMouseEnter = () => {
        gsap.to(link, { x: 5, duration: 0.5, ease: "power2.out" });
      };

      const handleMouseLeave = () => {
        gsap.to(link, { x: 0, duration: 0.5, ease: "power2.inOut" });
      };

      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);

      // Store handlers for cleanup
      link._mouseEnterHandler = handleMouseEnter;
      link._mouseLeaveHandler = handleMouseLeave;
    });

    return () => {
      links?.forEach((link) => {
        if (link._mouseEnterHandler) {
          link.removeEventListener("mouseenter", link._mouseEnterHandler);
        }
        if (link._mouseLeaveHandler) {
          link.removeEventListener("mouseleave", link._mouseLeaveHandler);
        }
      });
    };
  }, []);

  return (
    <nav ref={rootRef} className="menu">
      <div className="menu-header">
        <Link href="/" className="menu-logo">
          <Image src="/logo-white.png" alt="" width={40} height={40} />
        </Link>
        <button className="menu-toggle" aria-label="Toggle menu">
          <div className="menu menu-hamburger-icon">
            <span className="menu-item"></span>
            <span className="menu-item"></span>
          </div>
        </button>
      </div>

      <div className="menu-overlay">
        <nav className="menu-nav font-DurkBoldItalic">
          <ul>
            {navbarItems.map((it) => (
              <li key={it.id}>
                <Link href={it.href}>{it.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-footer">
          <div className="menu-social hover:text-primary">
            {footerItems.map((it) => (
              <Link key={it.id} href={it.href} target="_blank" rel="noreferrer">
                <span>&#9654;</span> {it.title}
              </Link>
            ))}
          </div>
          <div className="menu-time">00:00:00</div>
        </div>
      </div>
    </nav>
  );
}
