import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="contact-page container animate-fade">
      <div className="contact-header">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">Get in touch with the Elegant support team</p>
      </div>

      <div className="contact-split">
        {/* Left Side: Contact Information */}
        <div className="contact-info-panel">
          <h2>Get in Touch</h2>
          <p className="contact-intro">
            Have questions about our collections, customized orders, or sizing details? Fill out the form or reach out via our direct contact lines.
          </p>

          <div className="contact-details-list">
            <div className="contact-detail-item">
              <div className="contact-icon-wrapper">
                <MapPin size={20} />
              </div>
              <div className="contact-detail-text">
                <h3>Store Location</h3>
                <p>Gulberg III, Lahore, Pakistan</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-icon-wrapper">
                <Phone size={20} />
              </div>
              <div className="contact-detail-text">
                <h3>Phone & WhatsApp</h3>
                <p>+92 (300) 123-4567</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-icon-wrapper">
                <Mail size={20} />
              </div>
              <div className="contact-detail-text">
                <h3>Email Address</h3>
                <p>info@elegantfashion.com</p>
              </div>
            </div>
          </div>

          <div className="whatsapp-help-box">
            <MessageSquare size={24} className="wa-box-icon" />
            <div>
              <h4>Need Immediate Help?</h4>
              <p>Chat directly with our support reps on WhatsApp for quick ordering guidance.</p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="wa-box-link"
              >
                OPEN WHATSAPP CHAT
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-panel">
          <h2>Send a Message</h2>
          {submitted ? (
            <div className="contact-success-msg">
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out. A representative from our team will respond to your query within 24 hours.</p>
              <button className="reset-form-btn" onClick={() => setSubmitted(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="e.g. Ali Khan"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="e.g. ali@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. Custom watch order query"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="Tell us what you need help with..."
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                <Send size={16} /> SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
