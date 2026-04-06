"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Subtitle } from "../SectionSubtitle";

const faqs = [
  {
    id: "faq-1",
    question: "When should students start SAT preparation?",
    answer:
      "We recommend starting at least 3–4 months before the target exam date. This allows enough time to cover all sections thoroughly and complete practice tests. Students preparing for competitive scores may benefit from starting even earlier.",
  },
  {
    id: "faq-2",
    question: "How are classes structured?",
    answer:
      "Classes follow a structured weekly schedule covering all SAT sections. Each session includes concept review, guided practice, and targeted feedback to ensure steady progress.",
  },
  {
    id: "faq-3",
    question: "Do you offer private tutoring?",
    answer:
      "Yes, we offer 1:1 tutoring sessions tailored to each student's specific strengths and weaknesses. These sessions are flexible and can be scheduled based on availability.",
  },
  {
    id: "faq-4",
    question: "How do students track progress?",
    answer:
      "Students receive consistent feedback through practice tests, score reports, and instructor evaluations. Parents are also kept informed of their child's progress throughout the program.",
  },
];

function FAQAccordion() {
  const [openItem, setOpenItem] = useState("faq-1");

  return (
    <Accordion
      type="single"
      collapsible
      value={openItem}
      onValueChange={setOpenItem}
      className="flex flex-col gap-3"
    >
      {faqs.map((faq) => {
        const isOpen = openItem === faq.id;
        return (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border border-gray-200 rounded-2xl px-5 py-1 bg-white data-[state=open]:shadow-sm"
          >
            <AccordionTrigger className="flex items-center justify-between gap-4 py-4 text-sm font-semibold text-[#0d1b2a] hover:no-underline [&>svg]:hidden">
              <span className="text-left">{faq.question}</span>
              <span className="shrink-0 text-gray-500">
                {isOpen ? <X size={18} /> : <Plus size={18} />}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default function FAQSection() {
  return (
    <section className="bg-[#f5f7fa] py-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="h2">Frequently Asked Questions</h2>
          <Subtitle className="">
            Answers to common SAT preparation questions
          </Subtitle>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left card */}
          <div className="bg-primary rounded-2xl p-6 flex flex-col gap-5 w-full h-full lg:w-1/3 shrink-0">
            <img
              src="https://i.pravatar.cc/150?img=60"
              alt="Support"
              className="w-16 h-16 rounded-xl object-cover"
            />
            <h3 className="text-white text-2xl font-medium leading-snug">
              Didn't get the answer you were looking for?
            </h3>
            <button
              type="button"
              className="w-full bg-white text-primary font-semibold text-sm rounded-xl py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              Start Live Chat
            </button>
            <p className="text-white/70 text-xs text-center leading-relaxed">
              We will be happy to answer! It should take between 1 to 2 working
              days.
            </p>
          </div>

          {/* Right accordion */}
          <div className="flex-1 w-full">
            <FAQAccordion />
          </div>
        </div>
      </div>
    </section>
  );
}
