"use client"

import { useState } from "react"
import { BiPlus } from "react-icons/bi"

const FAQItem = ({ item }: { item: any }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-gray-200 ">
      <button className="w-full py-6 flex items-center justify-between text-left" onClick={() => setIsOpen(!isOpen)}>
        <span
          className="text-[16px] font-medium text-gray-900"
          style={{ fontSize: "clamp(12px, 1vw,16px)", fontWeight: 700 }}
        >
          {item.question}
        </span>
        <BiPlus
          className={`w-[21px] h-[21px] text-gray-400 transform transition-transform duration-300 ml-1 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 mb-6" : "max-h-0"}`}
      >
        <p className="text-gray-600" style={{ fontSize: "clamp(14px, 1vw, 16px)" }}>
          {item.answer}
        </p>
      </div>
    </div>
  )
}

const FAQ = ({ data }: { data: any }) => {
  if (!data?.faqs) {
    return <div className="text-center py-8">No FAQs available at the moment.</div>
  }

  return (
    <div className="mx-auto px-4 py-12 max-w-[1440px]">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 md:mb-8" style={{ fontSize: "clamp(20px, 2vw, 30px)" }}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-1">
        {data?.faqs.length > 0 ? (
          data?.faqs.map((item: any, index: number) => <FAQItem key={index} item={item} />)
        ) : (
          <div className="text-center text-gray-500">No FAQs available at the moment.</div>
        )}
      </div>
      <div className="custom-class mt-8 text-[17.23px] font-medium leading-[27px] tracking-[0.8%] font-montserrat">
        {data?.description ? (
          <>
            <p dangerouslySetInnerHTML={{ __html: data?.description }} />
          </>
        ) : (
          "no description"
        )}
      </div>
    </div>
  )
}

export default FAQ
