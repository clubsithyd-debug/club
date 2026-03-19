import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSending(true);

    const serviceId = "service_dt1zonl";
    const templateId = "template_ajzrxrg";
    const publicKey = "c3vecK0SfFsvMh65n";

    const templateParams = {
      name: formData.name, // Added for compatibility
      from_name: formData.name,
      email: formData.email, // Added for compatibility
      from_email: formData.email,
      reply_to: formData.email,
      to_name: "GitHub Club - SIT Hyderabad",
      to_email: "githubclub.sithyd@gmail.com", // Added destination email
      message: formData.message,
      subject: formData.subject || "General Inquiry",
      reason: formData.subject || "General Inquiry", // Mapping subject to reason
      page_url: window.location.href // Added page URL
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSending(false);
      })
      .catch((err) => {
        console.error('FAILED...', err);
        alert("Failed to send message. Please try again.");
        setIsSending(false);
      });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 px-6 md:px-16 lg:px-24 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-white">Contact Us</h1>
        <p className="text-ghmuted mb-12">
          Have a question or want to collaborate? Send us a message and we'll get back to you soon.
        </p>

        {submitted ? (
          <div className="bg-ghgreen/10 border border-ghgreen text-ghgreen p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
            <p>Thank you for reaching out. We will get back to you shortly.</p>
            <button onClick={() => setSubmitted(false)} className="mt-6 font-mono text-sm underline interactive">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="w-full p-3 bg-ghpanel border border-ghborder rounded-lg text-white focus:border-ghgreen outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="w-full p-3 bg-ghpanel border border-ghborder rounded-lg text-white focus:border-ghgreen outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 bg-ghpanel border border-ghborder rounded-lg text-white focus:border-ghgreen outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full p-3 bg-ghpanel border border-ghborder rounded-lg text-white focus:border-ghgreen outline-none transition-colors resize-y"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSending}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
