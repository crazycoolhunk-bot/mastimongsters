import React, { useState, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Search, Loader2 } from 'lucide-react';

const MEMBER_NAMES = [
  "Ajay Kumar Reddy",
  "Anil kumar Kalva",
  "Anil Reddy",
  "Anudeep",
  "Arun Kotturu",
  "BBSR",
  "Bipin ChandraPal Reddy",
  "Chakri",
  "Chintu",
  "Cnu Nano",
  "Dabba Pavan",
  "Daddy",
  "Dr. Karthik Reddy",
  "Dr. KiMO",
  "Durga",
  "Dwarak Nath",
  "Easwar",
  "Jai",
  "Joy Raghu",
  "KCR",
  "Keerthi",
  "Kittu",
  "KK",
  "KN Reddy",
  "Koushik",
  "Kumaraswamy",
  "Mahesh Kumar",
  "Mahi",
  "Munna",
  "Naga Srinivas",
  "Nikhil",
  "Nikhil Reddy",
  "Nishanth",
  "OmPrakash Artham",
  "Pavan Bangalore",
  "Pavan BJP",
  "Pavan Dabba",
  "Pavan K",
  "Prashanth I'Patnam",
  "Prashanth Reddy",
  "Raj Reddy",
  "Rajesh Somberi",
  "Rajnikar Reddy",
  "Rajshekar Patnaik",
  "Rama Rao",
  "Ramcharan Advocate",
  "Ranjith Reddy",
  "Ravikanth",
  "RaviKrishna",
  "RaviTej Sharma",
  "Reddy Saab",
  "SaiKanth",
  "Sairam",
  "Sandy Bhai",
  "Santosh Kumar",
  "Sashi Wines",
  "Shailender Reddy",
  "Sharath",
  "ShyamSunder",
  "Srikanth Maruthi",
  "Srikumar Tyres",
  "SS Sandeep",
  "Subbu Darling",
  "Sudha Reddy",
  "Uday Chicken",
  "Ujjwal",
  "Umesh Goud",
  "Varun Kulkarni",
  "Varun Reddy",
  "Videep Reddy",
  "Vijay Steel Plant",
  "Vikram Bilaji",
  "Vinay TCS",
  "VinayKanth",
  "Vinod RCI",
  "VishnuPrasad"
];

const TAGLINES = [
  'Always typing... usually spelling something wrong.',
  'Send memes, not paragraph messages.',
  'Here for the weekend road trips and pizza.',
  'Only replies in voice notes. Listen at 2x speed.',
  'Reacted with 👍 to over 5,000 messages.',
  'Spams custom stickers at 2:00 AM.',
  'Who is making Sunday lunch plans? Count me in.',
  'Reads everything but too lazy to send a reply.',
  'Midnight snack advisor and professional sleeper.',
  'Will show up exactly 2 hours late to meetups.',
  'Ask me about my sticker collection.',
  'Legend has it they once left the group chat and returned.',
  'Silent reader. Undercover agent.',
  'The official DJ of the roadtrip playlist.',
  'Keyboard warrior but silent in person.',
  'Group chat is my full time job.',
  'Usually on silent mode. Call if emergency.',
  'Will suggest a meetup and then cancel last minute.',
  'Meme archiver since 2021.'
];

const EMOJIS = ['🐯', '🦁', '🦊', '🐱', '🐼', '🐨', '🐻', '🐹', '🐰', '🐸', '🐙', '🐒', '🦄', '🧙‍♂️', '🕶️', '🚀', '🎸', '🍕', '🍔', '🥤', '👽', '👾', '🤠'];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)',
  'linear-gradient(135deg, #ff007f 0%, #ffe600 100%)',
  'linear-gradient(135deg, #00e5ff 0%, #ff007f 100%)',
  'linear-gradient(135deg, #ffe600 0%, #39ff14 100%)',
  'linear-gradient(135deg, #8a2be2 0%, #ff007f 100%)'
];

export default function Members() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Grid sizing state
  const [columnCount, setColumnCount] = useState(4);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  const containerRef = useRef(null);

  // Recalculate columns based on container width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 640) setColumnCount(1);      // Mobile
      else if (width < 1024) setColumnCount(2); // Tablet
      else if (width < 1280) setColumnCount(3); // Small Desktop
      else setColumnCount(4);                   // Large Desktop
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch members list
  useEffect(() => {
    setLoading(true);
    // Fetch from express API server
    fetch(`/api/members?search=${encodeURIComponent(search)}&role=${roleFilter}`)
      .then(res => res.json())
      .then(data => {
        // Apply local sort
        const sorted = sortData(data, sortOrder);
        setMembers(sorted);
        setFilteredMembers(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed fetching members:", err);
        // Failover mock data seeder
        generateMockData();
      });
  }, [search, roleFilter, sortOrder]);

  const generateMockData = () => {
    const mock = MEMBER_NAMES.map((name, i) => {
      const isJai = name === 'Jai';
      
      let role = 'active';
      if (isJai) {
        role = 'admin';
      } else {
        if (i % 7 === 0) role = 'classic';
        else if (i % 5 === 0) role = 'lurker';
      }

      let status = 'offline';
      if (isJai) {
        status = 'legendary';
      } else {
        if (i % 9 === 0) status = 'legendary';
        else if (i % 3 === 0) status = 'online';
      }

      return {
        id: i + 1,
        name,
        role,
        status,
        tagline: TAGLINES[i % TAGLINES.length],
        emoji: EMOJIS[i % EMOJIS.length],
        gradient: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
        avatar: isJai ? '/avatars/jai.jpg' : (name === 'Ajay Kumar Reddy' ? '/avatars/ajay.jpg' : null)
      };
    });

    // Apply filtering & sorting
    let results = mock;
    if (search) {
      results = results.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (roleFilter !== 'all') {
      results = results.filter(m => m.role === roleFilter);
    }
    
    results = sortData(results, sortOrder);
    setMembers(results);
    setFilteredMembers(results);
    setLoading(false);
  };

  const sortData = (data, order) => {
    return [...data].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (order === 'asc') return nameA < nameB ? -1 : 1;
      return nameA > nameB ? -1 : 1;
    });
  };

  // Split filtered list into rows of columnCount size
  const chunkMembers = () => {
    const chunks = [];
    for (let i = 0; i < filteredMembers.length; i += columnCount) {
      chunks.push(filteredMembers.slice(i, i + columnCount));
    }
    return chunks;
  };

  const memberRows = chunkMembers();

  // Custom row component for react-window list
  const Row = ({ index, style }) => {
    const rowItems = memberRows[index];
    
    return (
      <div style={style} className="flex gap-6 justify-start px-2 py-3 w-full">
        {rowItems.map(member => {
          const roleLabel = member.role === 'admin' ? 'Admin' : (member.role === 'active' ? 'Active' : (member.role === 'classic' ? 'Classic' : 'Lurker'));
          const roleClass = member.role === 'admin' ? 'bg-brand-pink/10 text-brand-pink' : (member.role === 'active' ? 'bg-brand-green/10 text-brand-green' : (member.role === 'classic' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-yellow/10 text-brand-yellow'));
          const borderClass = member.status === 'online' ? 'border-brand-green ring-2 ring-brand-green/10' : (member.status === 'legendary' ? 'border-brand-pink ring-2 ring-brand-pink/10' : 'border-gray-100');

          return (
            <div 
              key={member.id} 
              className={`flex-1 min-w-0 bg-white border rounded-2xl p-5 shadow-soft flex flex-col items-center text-center ${borderClass} hover:border-gray-300 transition-colors`}
            >
              {/* Avatar circle */}
              <div 
                className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center overflow-hidden mb-3 shadow-inner"
                style={{ background: member.avatar ? 'none' : (member.gradient || 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)') }}
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{member.emoji || '🐯'}</span>
                )}
              </div>

              <h4 className="font-display font-bold text-sm text-brand-dark truncate w-full">{member.name}</h4>
              <span className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5 ${roleClass}`}>
                {roleLabel}
              </span>
              
              <p className="text-gray-400 font-body text-[11px] leading-relaxed mt-3 truncate w-full italic">
                "{member.tagline}"
              </p>
            </div>
          );
        })}
        {/* Pad remaining empty slots to keep layout balanced */}
        {rowItems.length < columnCount && Array.from({ length: columnCount - rowItems.length }).map((_, idx) => (
          <div key={`empty-${idx}`} className="flex-1 opacity-0 pointer-events-none" />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display font-extrabold text-4xl text-brand-dark">The Pack Directory</h2>
        <p className="text-gray-400 text-sm mt-1">Search, filter, and browse the 75+ verified members of Masti Mongsters.</p>
      </div>

      {/* Directory filter options */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-brand-bg p-4 rounded-2xl border border-gray-100">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mongsters..."
            className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-brand-dark font-body focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap justify-center">
          {['all', 'admin', 'active', 'classic', 'lurker'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`font-display font-bold text-xs px-4.5 py-2 rounded-full transition-all ${
                roleFilter === role ? 'bg-brand-dark text-white' : 'bg-white border border-gray-200 text-gray-400 hover:text-brand-dark'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}s
            </button>
          ))}
        </div>

        {/* Sorting Toggles */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-display font-bold">Sort Name:</span>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-display font-bold text-brand-dark focus:outline-none"
          >
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
          </select>
        </div>

      </section>

      {/* Virtualized Grid Listing */}
      <section className="bg-white border border-gray-100 rounded-3xl p-4 shadow-soft min-h-[500px]" ref={containerRef}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <Loader2 size={32} className="animate-spin text-brand-green mb-2" />
            <span className="font-display text-sm font-semibold">Loading verified members...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-gray-400 font-display">
            No pack members match your selection.
          </div>
        ) : (
          <div className="w-full" style={{ height: '520px' }}>
            <List
              height={520}
              itemCount={memberRows.length}
              itemSize={200} // Row height matching layout cards padding
              width="100%"
            >
              {Row}
            </List>
          </div>
        )}
      </section>

    </div>
  );
}
