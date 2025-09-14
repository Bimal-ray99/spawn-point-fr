"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/all";
import { footerItems, navbarItems } from "../../constant";

gsap.registerPlugin(SplitText);

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
    let isAnimating = false;

    const wordSplits = [];
    const footerCharSplits = [];

    function scrambleText(elements, duration = 0.4) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      elements.forEach((el) => {
        const node = el;
        const original = node.textContent || "";
        let iterations = 0;
        const maxIterations = Math.floor(Math.random() * 6) + 3;

        gsap.set(node, { opacity: 1 });
        const id = window.setInterval(() => {
          node.textContent = chars[Math.floor(Math.random() * chars.length)];
          iterations++;
          if (iterations >= maxIterations) {
            window.clearInterval(id);
            node.textContent = original;
          }
        }, 25);

        window.setTimeout(() => {
          window.clearInterval(id);
          node.textContent = original;
        }, duration * 1000);
      });
    }

    function initMenu() {
      gsap.set(menuOverlay, { scaleY: 0, transformOrigin: "top center" });

      // split each nav link into words (masking-ish)
      menuItems.forEach((item) => {
        const link = item.querySelector("a");
        if (link) {
          const split = new SplitText(link, {
            type: "words",
            wordsClass: "split-word",
          });
          wordSplits.push(split);
          gsap.set(split.words, { yPercent: 120 });
        }
      });

      // footer lines to chars
      const footerEls = root.querySelectorAll(
        ".menu-social a, .menu-social span, .menu-time"
      );
      footerEls.forEach((el) => {
        const split = new SplitText(el, { type: "chars" });
        footerCharSplits.push(split);
        gsap.set(split.chars, { opacity: 0 });
        if (el.classList.contains("menu-time")) gsap.set(el, { opacity: 0 });
      });

      gsap.set(menuItems, { opacity: 1 });
      gsap.set(menuFooter, { opacity: 1, y: 20 });
    }

    function openMenu() {
      isOpen = true;
      isAnimating = true;
      hamburgerMenu && hamburgerMenu.classList.add("open");
      menuLogo && menuLogo.classList.add("rotated");

      const tl = gsap.timeline({ onComplete: () => (isAnimating = false) });

      tl.to(menuOverlay, { duration: 0.5, scaleY: 1, ease: "power3.out" });

      const allWords = wordSplits.flatMap((s) => s.words || []);
      tl.to(
        allWords,
        { duration: 0.75, yPercent: 0, stagger: 0.05, ease: "power4.out" },
        "-=0.3"
      );

      tl.to(
        menuFooter,
        {
          duration: 0.3,
          y: 0,
          ease: "power2.out",
          onComplete: () => {
            const timeEl = root.querySelector(".menu-time");
            if (timeEl) gsap.set(timeEl, { opacity: 1 });
            const allFooterChars = footerCharSplits.flatMap(
              (s) => s.chars || []
            );
            allFooterChars.forEach((ch, i) =>
              window.setTimeout(() => scrambleText([ch], 0.4), i * 30)
            );
          },
        },
        "-=1"
      );
    }

    function closeMenu() {
      isOpen = false;
      isAnimating = true;
      hamburgerMenu && hamburgerMenu.classList.remove("open");
      menuLogo && menuLogo.classList.remove("rotated");

      const tl = gsap.timeline({ onComplete: () => (isAnimating = false) });
      const allWords = wordSplits.flatMap((s) => s.words || []);

      tl.to(menuFooter, {
        duration: 0.3,
        y: 20,
        ease: "power2.in",
        onStart: () => {
          const timeEl = root.querySelector(".menu-time");
          if (timeEl) gsap.set(timeEl, { opacity: 0 });
          const allFooterChars = footerCharSplits.flatMap((s) => s.chars || []);
          gsap.set(allFooterChars, { opacity: 0 });
        },
      });

      tl.to(
        allWords,
        { duration: 0.25, yPercent: 120, stagger: -0.025, ease: "power2.in" },
        "-=0.25"
      );

      tl.to(
        menuOverlay,
        { duration: 0.5, scaleY: 0, ease: "power3.inOut" },
        "-=0.2"
      );
    }

    function toggleMenu() {
      if (isAnimating) return;
      isOpen ? closeMenu() : openMenu();
    }

    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        if (isOpen) closeMenu();
        if (isMenuVisible) {
          menu.classList.add("hidden");
          isMenuVisible = false;
        }
      } else if (currentScrollY < lastScrollY) {
        if (!isMenuVisible) {
          menu.classList.remove("hidden");
          isMenuVisible = true;
        }
      }
      lastScrollY = currentScrollY;
    }

    function updateTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", { hour12: true });
      const timeEl = root.querySelector(".menu-time");
      if (!timeEl) return;

      if (!isOpen) {
        timeEl.textContent = `${timeString}`;
        return;
      }

      const split = footerCharSplits.find((s) => s.element === timeEl);
      if (!split || !split.chars) {
        timeEl.textContent = `${timeString}`;
        return;
      }

      const newText = `${timeString} `;
      const chars = split.chars;
      if (chars.length !== newText.length) {
        timeEl.textContent = newText;
        return;
      }
      newText.split("").forEach((c, i) => (chars[i].textContent = c));
    }

    // init + listeners
    initMenu();
    menuHeader && menuHeader.addEventListener("click", toggleMenu);
    menuItems.forEach((item) => {
      item.querySelector("a")?.addEventListener("click", () => {
        if (isOpen) closeMenu();
      });
    });
    window.addEventListener("scroll", handleScroll);
    updateTime();
    const timer = window.setInterval(updateTime, 1000);

    return () => {
      menuHeader && menuHeader.removeEventListener("click", toggleMenu);
      window.removeEventListener("scroll", handleScroll);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const links = rootRef.current?.querySelectorAll(".menu-nav a");

    links?.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link, { x: 5, duration: 0.2, ease: "power2.out" });
      });

      link.addEventListener("mouseleave", () => {
        gsap.to(link, { x: 0, duration: 0.2, ease: "power2.inOut" });
      });
    });

    return () => {
      links?.forEach((link) => {
        link.removeEventListener("mouseenter", () => {});
        link.removeEventListener("mouseleave", () => {});
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
        <nav className="menu-nav">
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
