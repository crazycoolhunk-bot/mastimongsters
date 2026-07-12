import React, { useState, useEffect } from 'react';
import { Pin, Calendar, ArrowRight, Activity, Smile, MessageCircle } from 'lucide-react';

export default function Home({ navigate }) {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'pinned'
  const [count, setCount] = useState(0);

  // Fetch announcements from server
  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data))
      .catch(err => {
        console.error("Failed fetching announcements:", err);
        // Fallback seed data in case API server isn't run yet
        setAnnouncements([
          { id: 1, title: 'Summer Meetup RSVP Open', content: 'Our annual Summer Mongsters Bash is scheduled for July 12th. Check the polling links and RSVP by Sunday!', isPinned: true, date: '2026-05-22' },
          { id: 2, title: 'No Chain Message Rule Reminder', content: 'Avoid forwarding external commercial links and good morning images to prevent notification fatigue. Banter stays in-house!', isPinned: false, date: '2026-05-18' }
        ]);
      });
  }, []);

  // Animating the live counter on mount
  useEffect(() => {
    let start = 0;
    const end = 76;
    const duration = 1200;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, []);

  // Filter announcements list
  const filteredAnnouncements = announcements.filter(item => {
    if (filter === 'pinned') return item.isPinned;
    return true;
  });

  return (
    <div className="flex flex-col gap-16">
      
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-8">
        <div className="flex-1 flex flex-col items-start gap-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-bg border border-gray-100 rounded-full text-brand-green font-display font-semibold text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            V2.0 React Edition
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-brand-dark leading-tight tracking-tight">
            The Hub for <br className="hidden md:inline" />
            <span className="text-brand-pink">Masti</span> & <span className="text-brand-blue">Mongsters</span>
          </h1>
          <p className="text-gray-500 font-body text-lg leading-relaxed">
            Welcome to the official portal of the Masti Mongsters community. What started as a WhatsApp chat group is now a weightless digital space for all 75+ verified members. Search profiles, explore the photo wall, and keep the pack vibe alive.
          </p>
          <div className="flex gap-4 flex-wrap w-full sm:w-auto">
            <button 
              onClick={() => navigate('members')}
              className="bg-brand-dark hover:bg-brand-dark/95 text-white font-display font-bold px-8 py-3.5 rounded-full transition-all shadow-sm flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Meet the Pack
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('gallery')}
              className="bg-white border border-gray-200 hover:border-brand-blue text-brand-dark hover:text-brand-blue font-display font-bold px-8 py-3.5 rounded-full transition-all w-full sm:w-auto text-center"
            >
              View Gallery
            </button>
          </div>
        </div>

        {/* Central Logo Graphic */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full max-w-[380px] aspect-square rounded-3xl bg-brand-bg border border-gray-100 flex items-center justify-center p-8 shadow-soft float-weightless">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/5 to-brand-blue/5 rounded-3xl -z-10" />
            <img src="/logo.png" alt="Masti Mongsters Circle Emblem" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Real-time metrics bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          onClick={() => navigate('members')}
          className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center gap-6 shadow-soft hover:border-brand-green transition-all hover:scale-[1.01] active:scale-95 duration-200 cursor-pointer"
        >
          <div className="p-4 rounded-xl bg-brand-bg text-brand-green">
            <MessageCircle size={28} />
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl text-brand-dark">{count}+</div>
            <div className="text-xs uppercase font-display font-bold text-gray-400 tracking-wider">Verified Members</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center gap-6 shadow-soft hover:border-brand-pink transition-colors">
          <div className="p-4 rounded-xl bg-brand-bg text-brand-pink">
            <Calendar size={28} />
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl text-brand-dark">14</div>
            <div className="text-xs uppercase font-display font-bold text-gray-400 tracking-wider">Meetups Hosted</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center gap-6 shadow-soft hover:border-brand-blue transition-colors">
          <div className="p-4 rounded-xl bg-brand-bg text-brand-blue">
            <Activity size={28} />
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl text-brand-dark">100%</div>
            <div className="text-xs uppercase font-display font-bold text-gray-400 tracking-wider">Masti Percentage</div>
          </div>
        </div>

      </section>

      {/* Dynamic Announcement Hub */}
      <section className="bg-brand-bg border border-gray-100 rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="font-display font-extrabold text-3xl text-brand-dark">Announcement Hub</h2>
            <p className="text-gray-400 text-sm mt-1">Official pins and community update history.</p>
          </div>
          
          {/* Reactive Tab Toggles */}
          <div className="bg-white border border-gray-200 p-1 rounded-full flex gap-1 self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`font-display font-bold text-xs px-4 py-2 rounded-full transition-all ${
                filter === 'all' ? 'bg-brand-dark text-white' : 'text-gray-400 hover:text-brand-dark'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilter('pinned')}
              className={`font-display font-bold text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                filter === 'pinned' ? 'bg-brand-green text-white' : 'text-gray-400 hover:text-brand-dark'
              }`}
            >
              <Pin size={12} />
              Pinned
            </button>
          </div>
        </div>

        {/* Announcements List Container */}
        <div className="flex flex-col gap-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-display">No announcements pinned.</div>
          ) : (
            filteredAnnouncements.map(ann => (
              <div 
                key={ann.id} 
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-soft flex gap-4 items-start relative hover:border-gray-200 transition-colors"
              >
                {ann.isPinned && (
                  <span className="p-1.5 rounded-lg bg-brand-green/10 text-brand-green">
                    <Pin size={16} fill="currentColor" />
                  </span>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4 mb-2 flex-wrap">
                    <h3 className="font-display font-bold text-lg text-brand-dark">{ann.title}</h3>
                    <span className="text-xs text-gray-400 bg-brand-bg px-2.5 py-1 rounded-md font-body">{ann.date}</span>
                  </div>
                  <p className="text-gray-500 font-body text-sm leading-relaxed">{ann.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
