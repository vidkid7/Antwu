'use client';

import { L } from '@/components/language';
import type { Localized } from '@/lib/types';

export type FaqItem = { question: Localized; answer: Localized };

export const faqItems: FaqItem[] = [
  {
    question: { en: 'What does ANTWU do?', ne: 'अन्तुले के काम गर्छ?' },
    answer: {
      en: 'ANTWU brings together people working in Nepal’s transport sector to defend their economic, social and legal rights, improve working conditions and support worker welfare.',
      ne: 'अन्तुले नेपालका यातायात क्षेत्रमा काम गर्ने श्रमिकहरूलाई एकताबद्ध गर्दै आर्थिक, सामाजिक र कानूनी अधिकारको रक्षा, कामको अवस्था सुधार र श्रमिक कल्याणका लागि काम गर्छ।',
    },
  },
  {
    question: { en: 'How can I apply for membership?', ne: 'म सदस्यताका लागि कसरी आवेदन दिन सक्छु?' },
    answer: {
      en: 'Open the membership registration page, complete your personal and work details, then provide the requested identity and photo documents for the union office to review.',
      ne: 'सदस्यता दर्ता पृष्ठ खोल्नुहोस्, आफ्नो व्यक्तिगत तथा कामसम्बन्धी विवरण भर्नुहोस् र संघ कार्यालयको समीक्षाका लागि माग गरिएका परिचय तथा फोटोका कागजात पठाउनुहोस्।',
    },
  },
  {
    question: { en: 'Where can I find official documents?', ne: 'आधिकारिक कागजात कहाँ पाउन सक्छु?' },
    answer: {
      en: 'The Information library contains published documents, regulations, campaign material and statements. Each available file can be opened or downloaded from the Documents page.',
      ne: 'सूचना पुस्तकालयमा प्रकाशित कागजात, नियमावली, अभियान सामग्री र विज्ञप्तिहरू छन्। उपलब्ध फाइलहरू कागजात पृष्ठबाट खोल्न वा डाउनलोड गर्न सकिन्छ।',
    },
  },
  {
    question: { en: 'How can I contact the union office?', ne: 'संघ कार्यालयसँग कसरी सम्पर्क गर्ने?' },
    answer: {
      en: 'Use the Contact page to send a message, call the office or write to the published email address. The office team can help with enquiries, records and membership support.',
      ne: 'सम्पर्क पृष्ठबाट सन्देश पठाउनुहोस्, कार्यालयमा फोन गर्नुहोस् वा प्रकाशित इमेलमा लेख्नुहोस्। कार्यालयले सोधपुछ, अभिलेख र सदस्यता सहयोगमा सहायता गर्छ।',
    },
  },
  {
    question: { en: 'Is information available in Nepali?', ne: 'के जानकारी नेपालीमा उपलब्ध छ?' },
    answer: {
      en: 'Yes. Use the language switcher in the header to move between English and Nepali. Published stories, pages, navigation and forms include both language versions.',
      ne: 'छ। हेडरमा रहेको भाषा परिवर्तन बटन प्रयोग गरेर अंग्रेजी र नेपालीबीच जान सकिन्छ। प्रकाशित लेख, पृष्ठ, नेभिगेसन र फारमहरू दुवै भाषामा उपलब्ध छन्।',
    },
  },
  {
    question: { en: 'How does ANTWU support workers beyond advocacy?', ne: 'अधिकारको आवाज उठाउनुबाहेक अन्तुले कसरी सहयोग गर्छ?' },
    answer: {
      en: 'The union supports education, health and welfare, organises training and workshops, works with relevant organisations on policy and helps mediate workplace problems.',
      ne: 'संघले शिक्षा, स्वास्थ्य र कल्याणमा सहयोग गर्छ, प्रशिक्षण तथा कार्यशाला आयोजना गर्छ, नीतिका विषयमा सम्बन्धित संस्थासँग समन्वय गर्छ र कार्यस्थलका समस्या समाधानमा मध्यस्थता गर्न सहयोग गर्छ।',
    },
  },
];

export function FaqList({ limit }: { limit?: number }) {
  const items = typeof limit === 'number' ? faqItems.slice(0, limit) : faqItems;
  return <div className="faq-list">{items.map((item, index) => <details className="faq-item" key={item.question.en}>
    <summary>
      <span className="faq-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <span className="faq-question"><L value={item.question} /></span>
      <span className="faq-plus" aria-hidden="true">+</span>
    </summary>
    <div className="faq-answer"><p><L value={item.answer} /></p></div>
  </details>)}</div>;
}
