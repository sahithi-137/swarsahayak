import React from 'react';

export default function PrivacyNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <div className="modal-content privacy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2 id="privacy-title" className="modal-title">
              Privacy Notice & Community Trust Guarantee
            </h2>
            <p className="modal-subtitle">
              SwarSahayak is designed for the safety of rural and tribal communities across India.
            </p>
          </div>
          <button id="close-privacy-modal-btn" className="modal-close-button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="privacy-modal-body">
          <div className="guarantee-card">
            <div className="guarantee-icon">🛡️</div>
            <div className="guarantee-content">
              <h4>Zero Credential Collection</h4>
              <p>
                SwarSahayak <strong>never</strong> asks for or stores your Aadhaar number, bank account password, ATM PIN, UPI PIN, or OTPs. If any caller asks for these claiming to represent SwarSahayak or government schemes, refuse and report to <strong>1930</strong>.
              </p>
            </div>
          </div>

          <div className="guarantee-card">
            <div className="guarantee-icon">🎙️</div>
            <div className="guarantee-content">
              <h4>No Persistent Voice Recordings</h4>
              <p>
                Microphone audio is processed strictly for real-time speech recognition in your browser or through verified speech adapters. We do not store raw microphone audio files or biometric voiceprints.
              </p>
            </div>
          </div>

          <div className="guarantee-card">
            <div className="guarantee-icon">🏥</div>
            <div className="guarantee-content">
              <h4>Healthcare Disclaimer</h4>
              <p>
                SwarSahayak provides general public health education and directory information (e.g. Ayushman Bharat, 108 Emergency ambulance, and immunization). It <strong>does not</strong> diagnose diseases or replace professional consultation with a qualified medical doctor at your nearest Primary Health Centre (PHC).
              </p>
            </div>
          </div>

          <div className="guarantee-card">
            <div className="guarantee-icon">🏛️</div>
            <div className="guarantee-content">
              <h4>Verified Official Sources Only</h4>
              <p>
                All welfare scheme criteria, eligibility rules, and application links are sourced directly from official Government of India portals (e.g., pmkisan.gov.in, pmayg.nic.in, scholarships.gov.in, cybercrime.gov.in).
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button id="privacy-agree-btn" className="action-btn-primary" onClick={onClose}>
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
