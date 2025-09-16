// components/landingSections/FAQ.client.tsx
"use client";

import { useEffect } from "react";

export default function FAQClient() {
  useEffect(() => {
    const section = document.getElementById("faq-section");
    if (!section) return;

    const buttons = Array.from(section.querySelectorAll<HTMLButtonElement>("button[data-faq-button]"));
    const answers = Array.from(section.querySelectorAll<HTMLElement>("[data-faq-answer]"));

    const toggleAnswer = (btn: HTMLButtonElement, ans: HTMLElement) => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        // close
        btn.setAttribute("aria-expanded", "false");
        ans.style.maxHeight = "0px";
        // rotate icon back (svg is last child of button)
        const svg = btn.querySelector<HTMLElement>("svg");
        if (svg) svg.style.transform = "";
      } else {
        // open
        btn.setAttribute("aria-expanded", "true");
        // set to scrollHeight so transition runs (content may include images)
        ans.style.maxHeight = `${ans.scrollHeight}px`;
        const svg = btn.querySelector<HTMLElement>("svg");
        if (svg) svg.style.transform = "rotate(45deg)";
      }
    };

    // click handlers
    const handlers: Array<() => void> = [];

    buttons.forEach((btn) => {
      const idx = btn.getAttribute("data-index");
      const ans = answers.find((a) => a.getAttribute("data-index") === idx);
      if (!ans) return;

      // click
      const onClick = () => toggleAnswer(btn, ans);
      btn.addEventListener("click", onClick);
      handlers.push(() => btn.removeEventListener("click", onClick));

      // keyboard support for Enter/Space
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === " " || ev.key === "Enter") {
          ev.preventDefault();
          toggleAnswer(btn, ans);
        }
      };
      btn.addEventListener("keydown", onKey);
      handlers.push(() => btn.removeEventListener("keydown", onKey));
    });

    // If images or fonts load and change layout, re-calc max-heights for open items
    const resizeObserver = new ResizeObserver(() => {
      answers.forEach((ans) => {
        const idx = ans.getAttribute("data-index");
        const btn = section.querySelector<HTMLButtonElement>(`button[data-index="${idx}"]`);
        if (!btn) return;
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          ans.style.maxHeight = `${ans.scrollHeight}px`;
        }
      });
    });
    answers.forEach((a) => resizeObserver.observe(a));

    return () => {
      handlers.forEach((u) => u());
      resizeObserver.disconnect();
    };
  }, []);

  return null;
}
