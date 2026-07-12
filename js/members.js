/**
 * Members Directory Dataset Generator & Search Controller
 * Seed 90+ individual member profiles and handle filters,
 * lazy layout rendering, and physics state management.
 */

// Dataset generators
const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Arjun', 'Aditi', 'Abhishek', 'Aisha', 'Akash', 'Anu', 'Amit', 'Amrita',
  'Kabir', 'Kiara', 'Kunal', 'Kriti', 'Karan', 'Kavya', 'Krrish', 'Karishma', 'Ketan', 'Komal',
  'Dev', 'Diya', 'Divya', 'Deepak', 'Deepika', 'Daksh', 'Dolly', 'Darshan', 'Dipti', 'Dhiraj',
  'Rohan', 'Riya', 'Rohit', 'Rimi', 'Rahul', 'Ritu', 'Rajesh', 'Rashmi', 'Raman', 'Rupa',
  'Siddharth', 'Simran', 'Sunny', 'Sonia', 'Sanjay', 'Sneha', 'Saurabh', 'Swati', 'Sameer', 'Shruti',
  'Yash', 'Yukta', 'Yuvraj', 'Yamini', 'Yusuf', 'Yashasvi', 'Yatin', 'Yogesh', 'Yashoda', 'Yashwant',
  'Vivaan', 'Vidya', 'Varun', 'Vandana', 'Vijay', 'Vaishnali', 'Vikram', 'Vimala', 'Vinay', 'Vineeta',
  'Ishaan', 'Isha', 'Inder', 'Indu', 'Imran', 'Ipshita', 'Irfan', 'Ishwari', 'Ila', 'Inayat',
  'Meera', 'Manish', 'Mona', 'Mohit', 'Maya', 'Mayank', 'Mridula', 'Mukund', 'Mamta', 'Manoj'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Mehta', 'Joshi', 'Singh', 'Sen', 'Das', 'Roy',
  'Kapoor', 'Khanna', 'Malhotra', 'Bose', 'Chatterjee', 'Reddy', 'Nair', 'Pillai', 'Rao', 'Kumar',
  'Iyer', 'Srinivasan', 'Rangan', 'Babu', 'Chawla', 'Bansal', 'Garg', 'Goel', 'Mittal', 'Agrawal'
];

const ROLES = [
  { key: 'admin', label: 'Admin', class: 'r-admin' },
  { key: 'active', label: 'Active Member', class: 'r-active' },
  { key: 'classic', label: 'Classic Mongster', class: 'r-classic' },
  { key: 'lurker', label: 'Lurker', class: 'r-lurker' }
];

const STATUSES = ['online', 'legendary', 'offline'];

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

const EMOJIS = [
  '🐯', '🦁', '🦊', '🐱', '🐼', '🐨', '🐻', '🐹', '🐰', '🐸',
  '🐙', '🐒', '🦄', '🦅', '🦉', '🦖', '🐢', '🐬', '🐠', '🦈',
  '🦋', '🐝', '🦕', '🦥', '🦦', '🦒', '🐆', '🦓', '🐘', '🦏',
  '🦛', '🧙‍♂️', '🕶️', '🚀', '🎭', '🎸', '🍕', '🍔', '🌮', '🍩',
  '🍺', '🥤', '👽', '🤖', '👾', '🤠', '🤡', '🥑', '🥞', '🌶️'
];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)',
  'linear-gradient(135deg, #ff007f 0%, #ffe600 100%)',
  'linear-gradient(135deg, #00e5ff 0%, #ff007f 100%)',
  'linear-gradient(135deg, #ffe600 0%, #39ff14 100%)',
  'linear-gradient(135deg, #8a2be2 0%, #ff007f 100%)',
  'linear-gradient(135deg, #ff4500 0%, #ffe600 100%)',
  'linear-gradient(135deg, #00ced1 0%, #00e5ff 100%)'
];

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

function generateMembers() {
  const members = [];

  MEMBER_NAMES.forEach((name, i) => {
    const isJai = name === 'Jai';
    
    // Distribute roles: Jai is Admin, others are classic (15%), lurker (20%), or active (65%)
    let role = 'active';
    if (isJai) {
      role = 'admin';
    } else {
      if (i % 7 === 0) role = 'classic';
      else if (i % 5 === 0) role = 'lurker';
    }

    // Status: Jai is legendary, others offline (60%), online (30%), legendary (10%)
    let status = 'offline';
    if (isJai) {
      status = 'legendary';
    } else {
      if (i % 9 === 0) status = 'legendary';
      else if (i % 3 === 0) status = 'online';
    }

    const tagline = TAGLINES[i % TAGLINES.length];
    const emoji = EMOJIS[i % EMOJIS.length];
    const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
    const avatar = isJai ? 'assets/avatars/jai.jpg' : (name === 'Ajay Kumar Reddy' ? 'assets/avatars/ajay.jpg' : null);

    members.push({
      id: i + 1,
      name,
      role,
      status,
      tagline,
      emoji,
      gradient,
      avatar
    });
  });

  return members;
}

// Controller logic
class MembersDirectory {
  constructor() {
    this.members = generateMembers();
    this.filteredMembers = [...this.members];
    
    this.currentSearch = '';
    this.currentFilter = 'all';
    
    this.grid = document.querySelector('.members-grid-container');
    this.stats = document.querySelector('.directory-stats');
    this.searchInput = document.querySelector('.search-input');
    
    this.initEvents();
    this.render();
  }

  initEvents() {
    // Search listener
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value.toLowerCase().trim();
        this.filterAndRender();
      });
    }

    // Filter listener
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.filterAndRender();
      });
    });
  }

  filterAndRender() {
    // 1. Filter elements
    this.filteredMembers = this.members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(this.currentSearch) || 
                            m.tagline.toLowerCase().includes(this.currentSearch);
      
      const matchesFilter = this.currentFilter === 'all' || m.role === this.currentFilter;
      
      return matchesSearch && matchesFilter;
    });

    // 2. Render filtered list
    this.render();
  }

  render() {
    if (!this.grid) return;

    // Unregister existing elements from physics to release references
    const cards = this.grid.querySelectorAll('.member-card-wrapper');
    cards.forEach(card => {
      const innerCard = card.querySelector('.member-card');
      window.AntiGravity.unregister(innerCard);
    });

    this.grid.innerHTML = '';

    // Update stats counter
    if (this.stats) {
      this.stats.innerText = `Showing ${this.filteredMembers.length} of ${this.members.length} members`;
    }

    if (this.filteredMembers.length === 0) {
      this.grid.innerHTML = `<div class="no-results">No mongsters found matching "${this.currentSearch}"</div>`;
      return;
    }

    // Create cards fragment (efficient layout inserts)
    const fragment = document.createDocumentFragment();

    this.filteredMembers.forEach(member => {
      const wrapper = document.createElement('div');
      wrapper.className = 'member-card-wrapper';
      
      const roleData = ROLES.find(r => r.key === member.role);
      const borderClass = member.status === 'online' ? 'status-online' : (member.status === 'legendary' ? 'status-legendary' : '');

      const avatarHTML = member.avatar 
        ? `<img src="${member.avatar}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
        : `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
             <text x="50%" y="60%" font-size="44" text-anchor="middle" dominant-baseline="middle">${member.emoji}</text>
           </svg>`;
      const avatarBg = member.avatar ? 'transparent' : member.gradient;

      wrapper.innerHTML = `
        <div class="member-card ${borderClass}" data-id="${member.id}">
          <div class="member-avatar-wrapper" style="background: ${avatarBg}; overflow: hidden;">
            ${avatarHTML}
          </div>
          <h3 class="member-title">${member.name}</h3>
          <span class="member-role-badge ${roleData.class}">${roleData.label}</span>
          <p class="member-tagline">"${member.tagline}"</p>
        </div>
      `;
      
      fragment.appendChild(wrapper);
    });

    this.grid.appendChild(fragment);

    // Register active cards in Anti Gravity engine
    const activeCards = this.grid.querySelectorAll('.member-card');
    
    // Determine float boundaries (smaller radius if many cards to keep layouts clean)
    const radius = this.filteredMembers.length > 30 ? 15 : 25;

    activeCards.forEach((card, idx) => {
      // Lazy float register (adds stagger animation effect on search)
      setTimeout(() => {
        window.AntiGravity.register(card, {
          mode: 'local',
          driftRadius: radius,
          speed: 0.12 + Math.random() * 0.15,
          repulsionStrength: 0.35
        });
      }, idx * 6); // staggered initialization saves CPU load spikes on page draw
    });
  }
}

// Instantiate directory controller once page binds
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.members-grid-container')) {
    window.MembersPortal = new MembersDirectory();
  }
});
