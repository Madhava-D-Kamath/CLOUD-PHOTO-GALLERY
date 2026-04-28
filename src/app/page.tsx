'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Search, Upload, LayoutGrid, Heart, MoreHorizontal, Maximize2, Shield, Cloud, Trash2 } from 'lucide-react';
import styles from './page.module.css';

const MOCK_PHOTOS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', title: 'Mountain Peaks', category: 'Nature' },
  { id: 2, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800', title: 'Misty Forest', category: 'Nature' },
  { id: 3, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800', title: 'Sunlight Path', category: 'Nature' },
  { id: 4, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800', title: 'Azure Lake', category: 'Nature' },
  { id: 5, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800', title: 'Sunset Valley', category: 'Travel' },
  { id: 6, url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800', title: 'Coastal Cliffs', category: 'Travel' },
  { id: 7, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800', title: 'Yosemite Glow', category: 'Nature' },
  { id: 8, url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800', title: 'Urban Night', category: 'Architecture' },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(MOCK_PHOTOS.map(p => ({ ...p, liked: false })));
  }, []);

  const filteredPhotos = photos.filter(photo => {
    const matchesTab = activeTab === 'All' || photo.category === activeTab;
    const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          photo.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleLike = (id: number) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  };

  const deletePhoto = (id: number) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        const newPhoto = {
          id: Date.now(),
          url: url,
          title: file.name.split('.')[0] || 'Uploaded Photo',
          category: activeTab === 'All' ? 'Nature' : activeTab,
          liked: false
        };
        setPhotos(prev => [newPhoto, ...prev]);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 800);
    }
  };

  return (
    <div className={styles.container}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Fullscreen Modal */}
      {selectedPhoto && (
        <div className={styles.modal} onClick={() => setSelectedPhoto(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setSelectedPhoto(null)}>
              <MoreHorizontal size={24} style={{ transform: 'rotate(45deg)' }} />
            </button>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} className={styles.modalImage} />
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Camera size={28} color="var(--primary)" />
          <span>CloudGallery</span>
        </div>
        
        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.active}`}><LayoutGrid size={20} /> Photos</button>
          <button className={styles.navItem}><Heart size={20} /> Favorites</button>
          <button className={styles.navItem}><Cloud size={20} /> Cloud Sync</button>
          <button className={styles.navItem}><Shield size={20} /> Private</button>
        </nav>

        <div className={styles.storage}>
          <div className={styles.storageHeader}>
            <span>Storage Used</span>
            <span>{Math.round((photos.length / 20) * 100)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(photos.length / 20) * 100}%` }}></div>
          </div>
          <p>{photos.length} photos stored</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search your gallery..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.headerActions}>
            <button 
              className={styles.uploadBtn} 
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              <Upload size={18} className={isUploading ? styles.spin : ''} />
              <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
            </button>
            <div className={styles.avatar}></div>
          </div>
        </header>

        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <h1>My Gallery</h1>
            <div className={styles.tabs}>
              {['All', 'Nature', 'Travel', 'Architecture'].map(tab => (
                <button 
                  key={tab} 
                  className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.grid}>
            {filteredPhotos.map((photo, i) => (
              <PhotoCard 
                key={photo.id} 
                photo={photo} 
                index={i} 
                onLike={() => toggleLike(photo.id)}
                onDelete={() => deletePhoto(photo.id)}
                onMaximize={() => setSelectedPhoto(photo)}
              />
            ))}
            {filteredPhotos.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
                <p>No photos found matching your search or category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function PhotoCard({ photo, index, onLike, onDelete, onMaximize }: any) {
  const [loaded, setLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`${styles.card} animate-fade-in`} style={{ animationDelay: `${index * 0.05}s` }}>
      <div className={styles.imageWrapper}>
        <div className={styles.loader} style={{ display: loaded ? 'none' : 'flex' }}>
          <div className={styles.spinner}></div>
        </div>
        <img 
          src={photo.url} 
          alt={photo.title} 
          className={loaded ? styles.visible : styles.hidden}
          onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className={styles.overlay}>
          <div className={styles.overlayTop}>
            <button 
              className={`${styles.overlayIcon} ${photo.liked ? styles.liked : ''}`}
              onClick={(e) => { e.stopPropagation(); onLike(); }}
            >
              <Heart size={16} fill={photo.liked ? "var(--accent)" : "none"} />
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                className={styles.overlayIcon}
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              >
                <MoreHorizontal size={16} />
              </button>
              {showMenu && (
                <div className={styles.moreMenu} onMouseLeave={() => setShowMenu(false)}>
                  <button className={styles.menuItem} onClick={() => { onMaximize(); setShowMenu(false); }}>
                    <Maximize2 size={14} /> Full View
                  </button>
                  <button className={`${styles.menuItem} ${styles.deleteItem}`} onClick={() => { onDelete(); setShowMenu(false); }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.overlayBottom}>
            <h3>{photo.title}</h3>
            <button className={styles.maximize} onClick={onMaximize}><Maximize2 size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
