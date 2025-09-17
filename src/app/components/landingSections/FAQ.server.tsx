// components/landingSections/FAQ.server.tsx
import React from "react";
import { API_URL } from "../utils/BASE_URL";
import { removeNofollow } from "@/app/components/utils/removeNofollow"; // <- new util

type FAQItem = {
  question?: string;
  answer?: string;
};

async function fetchLandingFallback() {
  try {
    const res = await fetch(`${API_URL}/landings/1`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("FAQ fetch fallback error:", err);
    return null;
  }
}

export default async function FAQ({ data }: { data?: any }) {
  const source = data ?? (await fetchLandingFallback());
  const faqs: FAQItem[] = Array.isArray(source?.faqs) ? source.faqs : [];
  const descriptionHtml = source?.description ?? "";

  // Pre-process: remove nofollow from answers + description
  const processedFaqs = faqs.map((item) => ({
    ...item,
    safeAnswerHtml: removeNofollow(item.answer ?? ""),
  }));
  const safeDescriptionHtml = removeNofollow(descriptionHtml ?? "");

  return (
    <section id="faq-section" className="mx-auto px-4 py-12 max-w-[1440px]" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 mb-6" style={{ fontSize: "clamp(20px, 2vw, 30px)" }}>
        Frequently Asked Questions
      </h2>

      <div className="space-y-1" role="list">
        {processedFaqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No FAQs available at the moment.</div>
        ) : (
          processedFaqs.map((item, index) => (
            <div key={index} className="border-b border-gray-200" role="listitem">
              <div className="w-full py-4">
                <button
                  type="button"
                  data-faq-button
                  data-index={index}
                  aria-expanded="false"
                  aria-controls={`faq-answer-${index}`}
                  className="w-full text-left flex items-center justify-between py-4 focus:outline-none"
                >
                  <span className="text-[16px] font-medium text-gray-900" style={{ fontSize: "clamp(12px, 1vw, 16px)", fontWeight: 700 }}>
                    {item.question ?? "Untitled question"}
                  </span>

                  <svg
                    className="w-5 h-5 text-gray-400 transform transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  data-faq-answer
                  data-index={index}
                  className="overflow-hidden transition-[max-height] duration-300 ease-in-out max-h-0"
                >
                  <div className="py-2 text-gray-600" dangerouslySetInnerHTML={{ __html: item.safeAnswerHtml }} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="custom-class mt-8 text-[17.23px] font-medium leading-[27px] tracking-[0.8%] font-montserrat">
        {safeDescriptionHtml ? <div dangerouslySetInnerHTML={{ __html: safeDescriptionHtml }} /> : "no description"}
      </div>
    </section>
  );
}
