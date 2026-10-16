/**
 * SwarSahayak Translation Service
 * Manages translation between user dialects, standard Indian languages, and verified knowledge bases.
 * Ensures strict linguistic fidelity, preserving authentic regional idioms and preventing hallucinations.
 */

import { UI_TRANSLATIONS, getUIText } from '../config/ui_translations';

class TranslationService {
  /**
   * Get localized UI string for a given key and language code
   */
  getUI(langCode, key) {
    return getUIText(langCode, key);
  }

  /**
   * Check if verified translation exists for a specific knowledge item
   * @param {Object} knowledgeItem
   * @param {string} langCode
   * @returns {boolean}
   */
  hasVerifiedAnswer(knowledgeItem, langCode) {
    if (!knowledgeItem || !knowledgeItem.answers) return false;
    return Boolean(knowledgeItem.answers[langCode.toLowerCase()]);
  }

  /**
   * Get localized answer with truthful provenance
   * Returns: { text, isVerified, fallbackApplied, fallbackNote }
   */
  getAnswerWithProvenance(knowledgeItem, targetLangCode, langName = '') {
    if (!knowledgeItem || !knowledgeItem.answers) {
      return {
        text: '',
        isVerified: false,
        fallbackApplied: false,
        fallbackNote: null
      };
    }

    const code = targetLangCode.toLowerCase();
    const answers = knowledgeItem.answers;

    if (answers[code]) {
      return {
        text: answers[code],
        isVerified: true,
        fallbackApplied: false,
        fallbackNote: null
      };
    }

    // Honest fallback priority: Hindi -> English -> first available
    if (answers['hi']) {
      return {
        text: answers['hi'],
        isVerified: true,
        fallbackApplied: true,
        fallbackNote: `Verified community answer is currently in preparation for ${langName || code}. Displaying verified Hindi text to maintain factual accuracy.`
      };
    }

    if (answers['en']) {
      return {
        text: answers['en'],
        isVerified: true,
        fallbackApplied: true,
        fallbackNote: `Verified content not yet available in ${langName || code}. Displaying verified English text.`
      };
    }

    const firstKey = Object.keys(answers)[0];
    return {
      text: answers[firstKey],
      isVerified: true,
      fallbackApplied: true,
      fallbackNote: `Displaying available verified text.`
    };
  }
}

export const translationService = new TranslationService();
export default translationService;
