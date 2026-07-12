import React, { useState, useEffect } from 'react';
import { Upload, X, Grid, Heart, MessageSquare, Plus } from 'lucide-react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadTag, setUploadTag] = useState('Meetup');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch photos from backend
  const fetchPhotos = () => {
    fetch('/api/gallery')
      .then(res => {
        if (!res.ok) throw new Error("Failed response status");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPhotos(data);
        } else {
          throw new Error("Invalid response format");
        }
      })
      .catch(err => {
        console.error("Failed fetching gallery:", err);
        // Fallback seed photos
        setPhotos([
          { id: 1, title: 'Pondicherry road Trip', tag: 'Meetup', date: 'Oct 2012', imageUrl: '/gallery/pondy.jpg' },
          { id: 2, title: 'Austin, Tx Meet up', tag: 'Admin', date: 'March 2015', imageUrl: '/gallery/austin.jpg' },
          { id: 3, title: 'The WhatsApp Admin Meet', tag: 'Screenshot', date: 'Apr 2025', bg: 'linear-gradient(135deg, #39ff14 0%, #00e5ff 100%)', symbol: 'bubble' },
          { id: 4, title: 'Late Night Chai Gathering', tag: 'Meetup', date: 'Jun 2025', bg: 'linear-gradient(135deg, #ffe600 0%, #ff007f 100%)', symbol: 'chai' }
        ]);
      });
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle uploading files
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
      alert("Please specify a title and select an image file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('tag', uploadTag);
    formData.append('media', uploadFile);

    fetch('/api/gallery/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error("Upload request failed");
        return res.json();
      })
      .then(newPhoto => {
        setPhotos(prev => [newPhoto, ...prev]);
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadFile(null);
        setUploading(false);
      })
      .catch(err => {
        console.error("Upload error:", err);
        alert("Could not upload. Seed model fallback active locally.");
        // Local failover mock add
        const failoverPhoto = {
          id: Date.now(),
          title: uploadTitle,
          tag: uploadTag,
          date: 'Just Now',
          bg: 'linear-gradient(135deg, #8a2be2 0%, #ff007f 100%)',
          symbol: 'custom-file'
        };
        setPhotos(prev => [failoverPhoto, ...prev]);
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadFile(null);
        setUploading(false);
      });
  };

  // Helper to render inline SVGs based on symbols
  const renderSvgSymbol = (symbol) => {
    switch (symbol) {
      case 'circle':
        return (
          <>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" stroke-width="2" opacity="0.3"/>
            <path d="M20,70 L40,40 L55,55 L80,25 L100,70 Z" fill="#fff" opacity="0.4"/>
            <circle cx="75" cy="35" r="5" fill="#ffe600"/>
          </>
        );
      case 'fire':
        return <text x="50%" y="55%" font-size="36" text-anchor="middle" dominant-baseline="middle">🔥</text>;
      case 'bubble':
        return (
          <>
            <rect x="25" y="20" width="50" height="60" rx="6" fill="none" stroke="#fff" stroke-width="2"/>
            <line x1="32" y1="35" x2="68" y2="35" stroke="#fff" stroke-width="2" opacity="0.6"/>
            <line x1="32" y1="48" x2="58" y2="48" stroke="#fff" stroke-width="2" opacity="0.6"/>
            <circle cx="35" cy="62" r="4" fill="#25D366"/>
          </>
        );
      case 'chai':
        return (
          <>
            <path d="M30,70 L70,70 A20,20 0 0,0 70,30 L30,30 Z" fill="none" stroke="#fff" stroke-width="2.5"/>
            <path d="M70,40 A8,8 0 0,1 70,60" fill="none" stroke="#fff" stroke-width="2.5"/>
            <path d="M40,22 Q45,12 43,5 M50,22 Q55,12 53,5" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
          </>
        );
      default:
        return <text x="50%" y="55%" font-size="32" text-anchor="middle" dominant-baseline="middle">📸</text>;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-4xl text-brand-dark">The Memory Wall</h2>
          <p className="text-gray-400 text-sm mt-1">A drifting collection of road trips, chats, meetups, and meme championships.</p>
        </div>
        
        {/* Upload Trigger Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-brand-pink hover:bg-brand-pink/95 text-white font-display font-bold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Photo
        </button>
      </div>

      {/* Grid Container */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group cursor-pointer bg-white border border-gray-100 rounded-2xl p-3 shadow-soft hover:shadow-md transition-shadow hover:scale-[1.01] hover:rotate-1 duration-300"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative mb-4 flex items-center justify-center border border-gray-50">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center relative transition-transform duration-500"
                  style={{ background: item.bg || 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
                >
                  <svg viewBox="0 0 100 100" className="w-1/3 h-1/3 text-white/80">
                    {renderSvgSymbol(item.symbol)}
                  </svg>
                </div>
              )}
              {/* Floating tag */}
              <span className="absolute top-3 left-3 bg-brand-dark/85 text-white text-[10px] font-display font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {item.tag}
              </span>
            </div>

            <div className="px-1 flex justify-between items-center">
              <div>
                <h4 className="font-display font-bold text-sm text-brand-dark">{item.title}</h4>
                <p className="text-[10px] text-gray-400 font-body mt-0.5">{item.date}</p>
              </div>
              <div className="flex items-center gap-1 text-gray-400 hover:text-brand-pink transition-colors">
                <Heart size={14} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox Modal Popup */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setLightboxItem(null)}
        >
          <button 
            className="absolute top-6 right-6 p-3 text-white/75 hover:text-white hover:rotate-90 transition-all focus:outline-none"
            onClick={() => setLightboxItem(null)}
          >
            <X size={28} />
          </button>
          
          <div 
            className="max-w-2xl w-full bg-white rounded-3xl p-4 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-brand-bg flex items-center justify-center">
              {lightboxItem.imageUrl ? (
                <img src={lightboxItem.imageUrl} alt={lightboxItem.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-12" style={{ background: lightboxItem.bg }}>
                  <svg viewBox="0 0 100 100" className="w-1/4 h-1/4 text-white">
                    {renderSvgSymbol(lightboxItem.symbol)}
                  </svg>
                </div>
              )}
            </div>
            
            <div className="px-2 py-1">
              <span className="text-[10px] font-display font-bold text-brand-pink uppercase tracking-widest bg-brand-pink/10 px-2 py-0.5 rounded-full">
                {lightboxItem.tag}
              </span>
              <h3 className="font-display font-bold text-xl text-brand-dark mt-2">{lightboxItem.title}</h3>
              <p className="text-xs text-gray-400 font-body mt-1">Uploaded in {lightboxItem.date}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowUploadModal(false)}
        >
          <div 
            className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-display font-extrabold text-xl text-brand-dark">Upload Community Image</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-brand-dark">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4 font-display">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Photo Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Goa Trip Bonfire"
                  className="bg-brand-bg border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category Tag</label>
                <select
                  value={uploadTag}
                  onChange={(e) => setUploadTag(e.target.value)}
                  className="bg-brand-bg border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green font-semibold"
                >
                  <option value="Meetup">Meetup Photo</option>
                  <option value="Meme">Meme Screenshot</option>
                  <option value="Screenshot">Chat Log</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Media File</label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="bg-brand-bg border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="bg-brand-green hover:bg-brand-green/95 disabled:bg-gray-200 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-4 text-sm"
              >
                {uploading ? 'Uploading...' : 'Submit Photo'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
