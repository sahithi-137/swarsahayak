import React from 'react';
import { getUIText } from '../config/ui_translations';

export default function QuickPrompts({ currentLanguage, onSelectPrompt, simplifiedMode }) {
  const ui = (key) => getUIText(currentLanguage.code, key);

  const promptCatalog = {
    hi: [
      "पीएम किसान योजना के ₹6,000 कैसे मिलेंगे?",
      "आयुष्मान भारत 5 लाख का मुफ्त इलाज कैसे लें?",
      "एकलव्य स्कूल और आदिवासी छात्रवृत्ति की पात्रता",
      "UPI पिन और बैंक खाते को फ्रॉड से कैसे बचाएं?"
    ],
    en: [
      "How to receive ₹6,000 per year under PM-KISAN?",
      "How to access free hospital treatment up to ₹5 lakh under Ayushman Bharat?",
      "Eligibility for Eklavya Schools & Tribal Scholarships",
      "How to prevent UPI PIN scams and digital banking fraud?"
    ],
    te: [
      "పీఎం కిసాన్ పథకం ₹6,000 ఎలా పొందాలి?",
      "ఆయుష్మాన్ భారత్ 5 లక్షల ఉచిత వైద్యం కార్డు ఎలా పొందాలి?",
      "ఏకలవ్య పాఠశాలలు మరియు గిరిజన స్కాలర్‌షిప్ వివరాలు",
      "యూపీఐ పిన్ మోసాల నుండి బ్యాంకు ఖాతా ఎలా కాపాడుకోవాలి?"
    ],
    or: [
      "ପିଏମ୍-କିସାନ ଯୋଜନାର ₹୬,୦୦୦ କିପରି ମିଳିବ?",
      "ଆୟୁଷ୍ମାନ ଭାରତ କାର୍ଡରେ ₹୫ ଲକ୍ଷ ମାଗଣା ଚିକିତ୍ସା କିପରି ହେବ?",
      "ଏକଲବ୍ୟ ଆବାସିକ ବିଦ୍ୟାଳୟ (EMRS) ଓ ଆଦିବାସୀ ସ୍କଲାରସିପ୍",
      "UPI PIN ଓ ବ୍ୟାଙ୍କ ଠକେଇରୁ କିପରି ସୁରକ୍ଷିତ ରହିବେ?"
    ],
    bn: [
      "পিএম-কিসান প্রকল্পে ₹৬,০০০ কীভাবে পাওয়া যাবে?",
      "আয়ুষ্মান ভারত প্রকল্পে ₹৫ লক্ষ পর্যন্ত বিনামূল্যে চিকিৎসা কীভাবে পাব?",
      "একব্য মডেল স্কুল ও উপজাতি স্কলারশিপের যোগ্যতা কী?",
      "UPI পিন ও অনলাইন ব্যাঙ্ক প্রতারণা থেকে বাঁচার নিয়ম কী?"
    ],
    sat: [
      "ᱯᱤ.ᱮᱢ-ᱠᱤᱥᱟᱱ ᱡᱚᱡᱚᱱᱟ ᱛᱮ ₹6,000 ᱴᱟᱠᱟ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱧᱟᱢᱚᱜ-ᱟ?",
      "ᱟᱭᱩᱥᱢᱟᱱ ᱵᱷᱟᱨᱚᱛ ᱛᱮ ₹5 ᱞᱟᱠᱷ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱟᱱ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱧᱟᱢᱚᱜ-ᱟ?",
      "ᱮᱠᱞᱚᱵᱽᱭᱚ ᱟᱥᱲᱟ (EMRS) ᱟᱨ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ",
      "UPI PIN ᱟᱨ ᱵᱮᱝᱠ ᱴᱟᱠᱟ ᱮᱲᱮ ᱠᱷᱚᱱ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱧᱪᱟᱣ ᱛᱟᱦᱮᱸᱱᱟ?"
    ],
    bho: [
      "पीएम किसान योजना के ₹6,000 कइसे मिली?",
      "आयुष्मान भारत 5 लाख के मुफ्त इलाज कइसे लीं?",
      "एकलव्य स्कूल आ छात्रवृत्ति के पात्रता",
      "UPI पिन आ बैंक खाता के ठगी से कइसे बचाईं?"
    ]
  };

  const prompts = promptCatalog[currentLanguage.code] || promptCatalog['hi'] || promptCatalog['en'];

  return (
    <div className={`quick-prompts-container ${simplifiedMode ? 'simplified-prompts' : ''}`}>
      <div className="prompts-label-row">
        <span className="prompts-label">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          {ui('suggestedQueries')}:
        </span>
      </div>
      <div className="prompts-chips-wrapper">
        {prompts.map((text, i) => (
          <button
            key={i}
            id={`quick-prompt-${i}`}
            className="prompt-chip"
            onClick={() => onSelectPrompt(text)}
          >
            <span className="chip-arrow">›</span>
            <span className="chip-text">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
