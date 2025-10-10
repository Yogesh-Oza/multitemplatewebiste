'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  category?: string;
  isActive: boolean;
  order: number;
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setGalleryItems(data.filter((item: GalleryItem) => item.isActive));
        }
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const photoItems = galleryItems.filter(item => item.type === 'photo');
  const videoItems = galleryItems.filter(item => item.type === 'video');

  const openImagePopup = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const openVideoPopup = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const closePopups = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        :root {
          --brand-purple: #8660D0;
          --brand-light-purple: #C1C8E4;
          --brand-sky-blue: #5AB9EA;
          --brand-light-blue: #84CEEB;
          --brand-blue: #5680E9;
        }

        .gallery-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 5px;
        }

        .tab-button {
          padding: 12px 20px;
          cursor: pointer;
          border: none;
          background-color: transparent;
          font-size: 1.1rem;
          font-weight: 500;
          color: #495057;
          transition: color 0.3s, border-bottom 0.3s;
          border-bottom: 3px solid transparent;
        }

        .tab-button.active {
          color: var(--brand-purple);
          font-weight: 700;
          border-bottom: 3px solid var(--brand-purple);
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
          animation: fadeIn 0.5s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .hero-section {
          background: linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-blue) 50%, var(--brand-sky-blue) 100%);
          color: white;
          min-height: 30vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          animation: slideUp 1s ease-out;
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          opacity: 0.95;
          animation: slideUp 1s ease-out 0.2s both;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gallery-section {
          background: linear-gradient(to bottom, #f9fafb 0%, white 100%);
        }

        .gallery-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.5s ease;
          position: relative;
          margin-bottom: 2rem;
        }

        .gallery-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .gallery-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-card:hover .gallery-image {
          transform: scale(1.1);
        }

        .gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
          opacity: 0;
          transition: all 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
        }

        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }

        .overlay-content {
          color: white;
          transform: translateY(20px);
          transition: transform 0.3s ease;
        }

        .gallery-card:hover .overlay-content {
          transform: translateY(0);
        }

        .overlay-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .overlay-description {
          font-size: 0.9rem;
          opacity: 0.9;
          line-height: 1.4;
        }

        .image-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 15px;
          animation: fadeIn 0.3s ease-out;
        }

        .image-popup-content {
          position: relative;
          background-color: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          max-width: 95vw;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: scaleUp 0.3s ease-out;
        }

        .popup-image {
          max-width: 100%;
          max-height: calc(95vh - 70px);
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .popup-caption {
          text-align: center;
          margin-top: 10px;
          font-size: 1.1em;
          color: #333;
          font-weight: 500;
        }

        .popup-close-btn {
          position: absolute;
          top: -15px;
          right: -15px;
          background-color: #fff;
          color: #333;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          font-size: 24px;
          line-height: 36px;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: background-color 0.2s, color 0.2s;
        }

        .popup-close-btn:hover {
          background-color: var(--brand-purple);
          color: white;
        }

        .thumbnail-card {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          cursor: pointer;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(44, 62, 80, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .thumbnail-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(44, 62, 80, 0.15);
        }

        .thumbnail-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .thumbnail-card:hover .thumbnail-overlay {
          opacity: 1;
        }

        .video-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          animation: fadeIn 0.3s ease-out;
        }

        .video-popup-content {
          position: relative;
          background-color: #000;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          width: 90%;
          max-width: 900px;
          aspect-ratio: 16 / 9;
          display: flex;
          flex-direction: column;
          animation: scaleUp 0.3s ease-out;
        }

        .popup-video {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }

        .video-popup-close-btn {
          position: absolute;
          top: -15px;
          right: -15px;
          background-color: #fff;
          color: #333;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          font-size: 24px;
          line-height: 36px;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: background-color 0.2s, color 0.2s;
          z-index: 1051;
        }

        .video-popup-close-btn:hover {
          background-color: var(--brand-purple);
          color: white;
        }

        @keyframes scaleUp {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <main>
        {/* Hero Section */}
        <section className="hero-section" style={{ marginTop: '50px' }}>
          <div className="container">
            <div className="hero-content text-center">
              <h1 className="hero-title">
                गावाची गॅलरी
              </h1>
              <p className="hero-subtitle">
                प्रगती,संस्कृती आणि एकतेचे क्षण टिपणारी गॅलरी
              </p>
            </div>
          </div>
        </section>

        <div className="container mt-4">
          {/* Gallery Tabs */}
          <div className="gallery-tabs">
            <button 
              className={`tab-button ${activeTab === 'photo' ? 'active' : ''}`}
              onClick={() => setActiveTab('photo')}
            >
              फोटो गॅलरी
            </button>
            <button 
              className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              व्हिडिओ गॅलरी
            </button>
          </div>

          {/* Photo Gallery Content */}
          <div id="photo-gallery-content" className={`tab-content ${activeTab === 'photo' ? 'active' : ''}`}>
            <section className="gallery-section">
              <div className="container">
                <div className="row justify-content-center" id="galleryGrid">
                  {photoItems.length === 0 ? (
                    <div className="no-results text-center">
                      <div className="no-results-icon">📸</div>
                      <p className="fs-5">
                        कोणत्याही प्रकारच्या प्रतिमा आढळल्या नाहीत.
                      </p>
                    </div>
                  ) : (
                    <div className="row">
                      {photoItems.map((item) => (
                        <div key={item.id} className="col-md-4 col-lg-3 mb-4">
                          <div 
                            className="gallery-card"
                            onClick={() => openImagePopup(item.mediaUrl)}
                          >
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="gallery-image"
                            />
                            <div className="gallery-overlay">
                              <div className="overlay-content">
                                <h3 className="overlay-title">{item.title}</h3>
                                <p className="overlay-description">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Video Gallery Content */}
          <div id="video-gallery-content" className={`tab-content ${activeTab === 'video' ? 'active' : ''}`}>
            <section className="video-gallery-section" id="videoGallery">
              <div className="container">
                {videoItems.length === 0 ? (
                  <div className="no-results text-center">
                    <div className="no-results-icon">📹</div>
                    <p className="fs-5">
                      कोणतेही व्हिडिओ आढळले नाहीत.
                    </p>
                  </div>
                ) : (
                  <div className="row">
                    {videoItems.map((item) => (
                      <div key={item.id} className="col-md-4 col-lg-3 mb-4">
                        <div 
                          className="thumbnail-card"
                          onClick={() => openVideoPopup(item.mediaUrl)}
                        >
                          <video>
                            <source src={item.mediaUrl} type="video/mp4" />
                          </video>
                          <div className="thumbnail-overlay">
                            <div className="text-center text-white">
                              <h5>{item.title}</h5>
                              <p className="mb-0">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Image Popup */}
        {selectedImage && (
          <div className="image-popup-overlay" onClick={closePopups}>
            <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
              <button className="popup-close-btn" onClick={closePopups}>×</button>
              <img src={selectedImage} alt="Gallery Image" className="popup-image" />
            </div>
          </div>
        )}

        {/* Video Popup */}
        {selectedVideo && (
          <div className="video-popup-overlay" onClick={closePopups}>
            <div className="video-popup-content" onClick={(e) => e.stopPropagation()}>
              <button className="video-popup-close-btn" onClick={closePopups}>×</button>
              <video className="popup-video" controls autoPlay>
                <source src={selectedVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
