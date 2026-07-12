import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Sparkles, MessageCircle, AlertOctagon, HelpCircle } from 'lucide-react';

export default function Rules() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const rulesList = [
    {
      icon: <Users className="text-brand-pink" size={20} />,
      title: "No Generic Forward Spam",
      content: "Avoid sending circular forwarded messages, promotional advertisements, good morning cards, or chain links. Shared elements should be authentic, self-made memes, or specific to the community conversation."
    },
    {
      icon: <Sparkles className="text-brand-green" size={20} />,
      title: "Active Dialogue Participation",
      content: "Lurking is okay, but try to participate. Make sure to vote on scheduling polls and react to meetup timelines. If you plan a long digital detox, send a quick message beforehand."
    },
    {
      icon: <MessageCircle className="text-brand-blue" size={20} />,
      title: "Meetup RSVP Integrity",
      content: "We plan real-world meetups to build bonds. If you RSVP 'Yes' to an event, make every effort to attend. Avoid cancellation within 24 hours of events unless it is an absolute emergency."
    },
    {
      icon: <AlertOctagon className="text-brand-pink" size={20} />,
      title: "Strict Screen Capture / Privacy Policy",
      content: "What is shared in the Masti Mongsters WhatsApp ecosystem stays inside. Do not take screen captures of private discussions, photos, or member numbers to share with external entities without explicit group permission."
    },
    {
      icon: <HelpCircle className="text-brand-yellow" size={20} />,
      title: "Admins Executive Decisions",
      content: "Group administrators reserve the authority to warn, mute, or remove accounts that persistently trigger toxic arguments or forward spam. Respect admin adjustments; they maintain community balance."
    }
  ];

  return (
    <div className="flex flex-col gap-16 max-w-3xl mx-auto">
      
      {/* Page Title */}
      <div className="text-center">
        <h2 className="font-display font-extrabold text-4xl text-brand-dark">Community Guidelines</h2>
        <p className="text-gray-400 text-sm mt-2">Every active pack has its core pillars. Read the guidelines governing our 75+ members.</p>
      </div>

      {/* Core Pillars Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-soft flex flex-col items-center text-center hover:border-brand-blue transition-colors">
          <span className="text-4xl mb-4">🤝</span>
          <h3 className="font-display font-bold text-lg text-brand-dark">Respect the Pack</h3>
          <p className="text-gray-400 font-body text-xs mt-3 leading-relaxed">
            Treat every mongster like family. No personal offenses, political spam, or sensitive exposures. Resolve disagreements offline via direct messages.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-soft flex flex-col items-center text-center hover:border-brand-pink transition-colors">
          <span className="text-4xl mb-4">⚡</span>
          <h3 className="font-display font-bold text-lg text-brand-dark">Keep the Masti Alive</h3>
          <p className="text-gray-400 font-body text-xs mt-3 leading-relaxed">
            Community requires participation. Share custom stickers, start funny debates, schedule road trips, and support fellow members. Quiet chat streams lead to dead groups.
          </p>
        </div>

      </section>

      {/* Accordion Rules Container */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display font-bold text-xl text-brand-dark mb-4">Standard Guidelines</h3>
        
        {rulesList.map((rule, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden transition-all hover:border-gray-200"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-brand-bg text-gray-500">
                    {rule.icon}
                  </div>
                  <span className="font-display font-bold text-brand-dark text-sm sm:text-base">{rule.title}</span>
                </div>
                <div className="text-gray-400">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-6 pb-6 pt-1 border-t border-gray-50 animate-slide-down">
                  <p className="text-gray-500 font-body text-xs sm:text-sm leading-relaxed pl-14">
                    {rule.content}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </section>

    </div>
  );
}
