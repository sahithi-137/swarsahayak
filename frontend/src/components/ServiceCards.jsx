import React from 'react';
import { getUIText } from '../config/ui_translations';

export default function ServiceCards({
  currentLanguage,
  selectedCategory,
  onSelectCategory,
  onTriggerQuickPrompt,
  simplifiedMode
}) {
  const ui = (key) => getUIText(currentLanguage.code, key);

  const services = [
    {
      id: 'government_schemes',
      key: 'govSchemes',
      title: ui('govSchemes'),
      subtitle: 'PM-KISAN, PM Awas, Van Dhan Yojana',
      badge: 'Direct Benefit (DBT)',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="21" x2="21" y2="21" />
          <line x1="6" y1="18" x2="6" y2="11" />
          <line x1="10" y1="18" x2="10" y2="11" />
          <line x1="14" y1="18" x2="14" y2="11" />
          <line x1="18" y1="18" x2="18" y2="11" />
          <polygon points="12 2 20 7 4 7" />
        </svg>
      ),
      sampleQuery: {
        hi: "प्रधानमंत्री किसान सम्मान निधि योजना के ₹6,000 कैसे मिलेंगे?",
        en: "How to get ₹6,000 per year under PM-KISAN scheme?",
        bho: "प्रधानमंत्री किसान सम्मान निधि योजना के ₹6,000 रुपिया कइसे मिली?",
        te: "పీఎం కిసాన్ పథకం ₹6,000 ఎలా పొందాలి?",
        or: "ପିଏମ୍-କିସାନ ଯୋଜନାର ₹୬,୦୦୦ କିପରି ମିଳିବ?",
        bn: "পিএম-কিসান প্রকল্পে ₹৬,০০০ কীভাবে পাওয়া যাবে?",
        sat: "ᱯᱤ.ᱮᱢ-ᱠᱤᱥᱟᱱ ᱡᱚᱡᱚᱱᱟ ᱛᱮ ₹6,000 ᱴᱟᱠᱟ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱧᱟᱢᱚᱜ-ᱟ?"
      }
    },
    {
      id: 'healthcare',
      key: 'healthcare',
      title: ui('healthcare'),
      subtitle: 'Ayushman Bharat, 108 Emergency, eSanjeevani',
      badge: 'Free ₹5 Lakh Treatment',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 5v4" />
          <path d="M10 7h4" />
        </svg>
      ),
      sampleQuery: {
        hi: "आयुष्मान भारत गोल्डन कार्ड से 5 लाख का मुफ्त इलाज कैसे पाएं?",
        en: "How to get free hospital treatment up to 5 lakh under Ayushman Bharat?",
        bho: "आयुष्मान भारत कार्ड से 5 लाख के मुफ्त इलाज कइसे पावल जाई?",
        te: "ఆయుష్మాన్ భారత్ 5 లక్షల ఉచిత వైద్యం ఎలా లభిస్తుంది?",
        or: "ଆୟୁଷ୍ମାନ ଭାରତ କାର୍ଡରେ ₹୫ ଲକ୍ଷ ମାଗଣା ଚିକିତ୍ସା କିପରି ମିଳିବ?",
        bn: "আয়ুষ্মান ভারত প্রকল্পে ₹৫ লক্ষ পর্যন্ত বিনামূল্যে চিকিৎসা কীভাবে পাব?",
        sat: "ᱟᱭᱩᱥᱢᱟᱱ ᱵᱷᱟᱨᱚᱛ ᱛᱮ ₹5 ᱞᱟᱠᱷ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱟᱱ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱧᱟᱢᱚᱜ-ᱟ?"
      }
    },
    {
      id: 'education',
      key: 'education',
      title: ui('education'),
      subtitle: 'Tribal Scholarships, EMRS Schools, DIKSHA',
      badge: 'Free Boarding & Aid',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      ),
      sampleQuery: {
        hi: "एकलव्य आवासीय विद्यालय (EMRS) और आदिवासी छात्रवृत्ति की जानकारी दें",
        en: "Information on Eklavya Model Residential Schools (EMRS) and tribal scholarships",
        bho: "एकलव्य आवासीय विद्यालय (EMRS) आ छात्रवृत्ति के जानकारी दीं",
        te: "ఏకలవ్య మోడల్ పాఠశాలలు మరియు గిరిజన స్కాలర్‌షిప్ వివరాలు",
        or: "ଏକଲବ୍ୟ ଆବାସିକ ବିଦ୍ୟାଳୟ (EMRS) ଓ ଆଦିବାସୀ ସ୍କଲାରସିପ୍ ବିଷୟରେ କୁହନ୍ତୁ",
        bn: "একব্য মডেল স্কুল ও উপজাতি স্কলারশিপ সম্পর্কে বলুন",
        sat: "ᱮᱠᱞᱚᱵᱽᱭᱚ ᱟᱥᱲᱟ (EMRS) ᱟᱨ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱠᱟᱛᱷᱟ ᱞᱟᱹᱭ ᱢᱮ"
      }
    },
    {
      id: 'safe_banking',
      key: 'safeBanking',
      title: ui('safeBanking'),
      subtitle: 'UPI/OTP Safety, AEPS Biometric, 1930 Helpline',
      badge: 'Cyber Crime 1930',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <circle cx="7" cy="15" r="1" />
        </svg>
      ),
      sampleQuery: {
        hi: "UPI पिन और बैंक खाते को ऑनलाइन धोखाधड़ी से कैसे सुरक्षित रखें?",
        en: "How to stay safe from UPI PIN fraud and bank scams?",
        bho: "UPI पिन आ बैंक खाता के धोखाधड़ी से कइसे बचाईं?",
        te: "యూపీఐ పిన్ మరియు బ్యాంక్ మోసాల నుండి ఎలా సురక్షితంగా ఉండాలి?",
        or: "UPI PIN ଓ ବ୍ୟାଙ୍କ ଠକେଇରୁ କିପରି ସୁରକ୍ଷିତ ରହିବେ?",
        bn: "UPI পিন ও অনলাইন প্রতারণা থেকে বাঁচার नियम কী?",
        sat: "UPI PIN ᱟᱨ ᱵᱮᱝᱠ ᱴᱟᱠᱟ ᱮᱲᱮ ᱠᱷᱚᱱ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱧᱪᱟᱣ ᱛᱟᱦᱮᱸᱱᱟ?"
      }
    }
  ];

  return (
    <div className={`services-section ${simplifiedMode ? 'simplified-cards' : ''}`}>
      <div className="section-header">
        <h3 className="section-title">{ui('categoriesTitle')}</h3>
        <span className="section-subtitle">
          {simplifiedMode ? 'सीधे पूछने के लिए किसी भी सेवा पर क्लिक करें' : 'Click a category to focus your inquiry or ask a sample question'}
        </span>
      </div>

      <div className="services-grid">
        {services.map((item) => {
          const isSelected = selectedCategory === item.id;
          const query = item.sampleQuery[currentLanguage.code] || item.sampleQuery['hi'] || item.sampleQuery['en'];

          return (
            <div
              key={item.id}
              id={`service-card-${item.id}`}
              className={`service-card ${isSelected ? 'active-card' : ''}`}
              onClick={() => {
                if (isSelected) {
                  onSelectCategory(null);
                } else {
                  onSelectCategory(item.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
            >
              <div className="card-top-row">
                <div className="card-icon-bubble">{item.icon}</div>
                <span className="card-tag">{item.badge}</span>
              </div>

              <div className="card-body">
                <h4 className="card-title">{item.title}</h4>
                <p className="card-desc">{item.subtitle}</p>
              </div>

              <div className="card-action-row">
                <button
                  type="button"
                  id={`ask-sample-${item.id}`}
                  className="ask-sample-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerQuickPrompt(query);
                  }}
                  title="Ask this question now"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>{simplifiedMode ? 'यह पूछें (Ask This)' : 'Ask Verified Info'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
