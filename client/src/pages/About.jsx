import React from 'react';
import { Mail, MessageCircle, Shield } from 'lucide-react';

export default function About() {
  const team = [
    {
      name: "Jaisheel",
      role: "Idea Owner & Admin",
      quote: "Creating a sanctuary for unfiltered daily banter, chaotic memes, and spontaneous road trips.",
      emoji: "👑",
      avatar: "",
      email: "jaisheel@mastimongsters.com"
    },
    {
      name: "Rajesh",
      role: "Architect",
      quote: "Designing and engineering the unified serverless architecture and automated CI/CD pipelines.",
      emoji: "🛠️",
      avatar: "",
      email: "rajesh@mastimongsters.com"
    }
  ];

  return (
    <div className="flex flex-col gap-20">
      
      {/* Editorial Origin Story */}
      <section className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 flex flex-col items-start gap-6">
          <div className="font-display font-semibold text-xs text-brand-pink uppercase tracking-widest bg-brand-pink/10 px-3 py-1 rounded-full">
            Founded June 2012
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-brand-dark tracking-tight leading-tight">
            From a Small Chat <br />
            to a <span className="text-brand-green">75+ Member Pack</span>
          </h2>
          <div className="flex flex-col gap-4 text-gray-500 font-body text-base leading-relaxed">
            <p>
              It started with a single notification. In June 2012, a few college friends noticed standard social network feeds were growing stagnant. They wanted a private sanctuary for unfiltered daily banter, sharing chaotic memes, and organising spontaneous weekend road trips. The <strong>Masti Mongsters</strong> WhatsApp group was created.
            </p>
            <p>
              What began with 5 members quickly ballooned. Inside jokes turned into epic meetups, road trips became annual tradition, and friends invited friends who shared the same high-energy vibe. The pack's core philosophy was established: bring positive energy, stay active, and respect the circle.
            </p>
            <p>
              Today, Masti Mongsters is a highly connected community of 75+ verified members spanning multiple careers, regions, and timezones. This dashboard serves as our digital headquarters.
            </p>
          </div>
        </div>

        {/* YouTube Logo Container */}
        <div className="flex-1 w-full lg:max-w-md flex justify-center">
          <div className="w-full aspect-video md:aspect-[4/3] rounded-3xl border border-gray-100 bg-brand-bg flex items-center justify-center p-8 relative overflow-hidden float-stagger-1">
            <img src="/youtube_logo.png" alt="YouTube Logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Admin Grid Directory */}
      <section>
        <h3 className="font-display font-extrabold text-3xl text-brand-dark text-center mb-12">
          Meet the <span className="text-brand-green">Team & Administration</span>
        </h3>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {team.map((member, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft flex flex-col items-center text-center relative overflow-hidden hover:border-gray-200 transition-colors max-w-sm w-full"
            >
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-full border border-gray-200 bg-brand-bg flex items-center justify-center overflow-hidden mb-4 relative">
                <span className="absolute -top-1 -right-1 p-1 bg-white border border-gray-100 rounded-full text-brand-green z-10">
                  <Shield size={12} fill="currentColor" />
                </span>
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{member.emoji}</span>
                )}
              </div>

              <h4 className="font-display font-bold text-lg text-brand-dark">{member.name}</h4>
              <div className="font-display text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">{member.role}</div>
              
              <p className="text-gray-500 font-body text-xs leading-relaxed italic mb-6">
                "{member.quote}"
              </p>

              {/* Communication Handshake Triggers */}
              <div className="flex gap-3 mt-auto w-full justify-center">
                <a 
                  href={`mailto:${member.email}`}
                  className="p-2 rounded-full border border-gray-100 hover:border-brand-green hover:text-brand-green transition-colors text-gray-400"
                  title="Send Email"
                >
                  <Mail size={16} />
                </a>
                <button 
                  onClick={() => alert(`Starting handshake chat with Admin ${member.name}. WhatsApp route active.`)}
                  className="p-2 rounded-full border border-gray-100 hover:border-brand-blue hover:text-brand-blue transition-colors text-gray-400"
                  title="WhatsApp Chat"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
