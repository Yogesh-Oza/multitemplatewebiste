'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setGalleryItems(
            (data as GalleryItem[]).filter((i) => i.isActive).sort((a, b) => a.order - b.order)
          );
        }
      } catch (e) {
        console.error('Error fetching gallery items:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryItems();
  }, []);

  const photoItems = useMemo(() => galleryItems.filter((i) => i.type === 'photo'), [galleryItems]);
  const videoItems = useMemo(() => galleryItems.filter((i) => i.type === 'video'), [galleryItems]);
  const counts = useMemo(() => ({ photos: photoItems.length, videos: videoItems.length, total: galleryItems.length }), [photoItems.length, videoItems.length, galleryItems.length]);

  return (
    <main className="min-h-screen bg-white">
      {/* Page header */}
      <header className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">गॅलरी</h1>
          <p className="mt-2 max-w-3xl text-slate-700">ग्रामपंचायतीचे कार्यक्रम, विकासकामे आणि संस्कृतीचे निवडक क्षण</p>
          {/* Tricolor accent */}
          <div className="mt-4 flex h-1 w-40 overflow-hidden rounded">
            <span className="h-full w-1/3" style={{ backgroundColor: '#FF9933' }} aria-hidden="true" />
            <span className="h-full w-1/3 bg-white" aria-hidden="true" />
            <span className="h-full w-1/3" style={{ backgroundColor: '#138808' }} aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* Controls */}
      <section aria-label="Gallery controls" className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* Stat chips */}
          <div className="flex flex-wrap items-center gap-2 py-3 text-xs sm:text-sm text-slate-700">
            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 font-medium text-blue-700">एकूण: {counts.total}</span>
            <span className="rounded border border-[\#FF9933] bg-orange-50 px-2 py-1 font-medium text-[\#B45309]">फोटो: {counts.photos}</span>
            <span className="rounded border border-[\#138808] bg-green-50 px-2 py-1 font-medium text-green-700">व्हिडिओ: {counts.videos}</span>
          </div>
          <div role="tablist" aria-label="Gallery type" className="flex gap-2 pb-4 -mt-1 overflow-x-auto">
            {(
              [
                { key: 'photo', label: 'फोटो' },
                { key: 'video', label: 'व्हिडिओ' },
              ] as const
            ).map((t) => (
            <button 
                key={t.key}
                role="tab"
                aria-selected={activeTab === t.key}
                aria-controls={`${t.key}-panel`}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  activeTab === t.key
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-700 hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => setActiveTab(t.key as 'photo' | 'video')}
              >
                {t.label}
            </button>
            ))}
          </div>
        </div>
      </section>

      {/* Photo grid */}
      <section
        id="photo-panel"
        role="tabpanel"
        aria-labelledby="photo"
        hidden={activeTab !== 'photo'}
        className="container mx-auto px-4 py-6 sm:py-8"
      >
        {loading ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="list-none">
                <div className="animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="h-48 w-full rounded-t-lg bg-gray-100" />
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : photoItems.length === 0 ? (
          <p className="text-center text-slate-600">फोटो उपलब्ध नाहीत.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {photoItems.map((item, idx) => (
              <li key={item.id} className="list-none">
                <motion.figure
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.02 }}
                  className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm ring-0 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-700"
                  tabIndex={0}
                  onClick={() => setSelectedImage(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedImage(item);
                  }}
                >
                  <Image
                              src={item.mediaUrl}
                    alt={item.title || 'गॅलरी फोटो'}
                    width={800}
                    height={600}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <figcaption className="border-t border-gray-100 p-3">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      {item.description ? (
                        <p className="text-xs text-slate-600 line-clamp-1 mr-2">{item.description}</p>
                      ) : <span aria-hidden className="text-xs text-slate-400">&nbsp;</span>}
                      {item.category ? (
                        <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{item.category}</span>
                      ) : null}
                    </div>
                  </figcaption>
                  {/* saffron focus bar */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-[\#FF9933] transition-transform duration-200 group-hover:scale-x-100"
                  />
                </motion.figure>
              </li>
            ))}
          </ul>
        )}
            </section>

      {/* Video grid */}
      <section
        id="video-panel"
        role="tabpanel"
        aria-labelledby="video"
        hidden={activeTab !== 'video'}
        className="container mx-auto px-4 py-6 sm:py-8"
      >
        {loading ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="list-none">
                <div className="animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="h-48 w-full rounded-t-lg bg-gray-100" />
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : videoItems.length === 0 ? (
          <p className="text-center text-slate-600">व्हिडिओ उपलब्ध नाहीत.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {videoItems.map((item, idx) => (
              <li key={item.id} className="list-none">
                <motion.figure
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.02 }}
                  className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm ring-0 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-700"
                  tabIndex={0}
                  onClick={() => setSelectedVideo(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedVideo(item);
                  }}
                >
                  <video
                    className="h-48 w-full rounded-t-lg object-cover"
                    src={item.mediaUrl}
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <figcaption className="border-t border-gray-100 p-3">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      {item.description ? (
                        <p className="text-xs text-slate-600 line-clamp-1 mr-2">{item.description}</p>
                      ) : <span aria-hidden className="text-xs text-slate-400">&nbsp;</span>}
                      {item.category ? (
                        <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{item.category}</span>
                      ) : null}
                    </div>
                  </figcaption>
                  {/* green focus bar */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-[\#138808] transition-transform duration-200 group-hover:scale-x-100"
                  />
                </motion.figure>
              </li>
            ))}
          </ul>
        )}
            </section>

      {/* Image Dialog */}
      {selectedImage && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title || 'Image preview'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 overflow-x-hidden overflow-y-auto overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ y: 12, scale: 0.98, opacity: 0.9 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-auto rounded-md bg-white p-2 sm:p-3 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close image preview"
              onClick={() => setSelectedImage(null)}
              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-black/80 text-white shadow hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              ×
            </button>
            <Image
              src={selectedImage.mediaUrl}
              alt={selectedImage.title || 'गॅलरी फोटो'}
              width={1600}
              height={900}
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="mx-auto h-auto w-full max-h-[80vh] rounded object-contain"
            />
            {selectedImage.description ? (
              <p className="mt-2 text-center text-sm text-slate-700">{selectedImage.description}</p>
            ) : null}
          </motion.div>
        </motion.div>
      )}

      {/* Video Dialog */}
      {selectedVideo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title || 'Video preview'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 overflow-x-hidden overflow-y-auto overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ y: 12, scale: 0.98, opacity: 0.9 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-5xl rounded-md bg-black p-2 sm:p-3 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close video preview"
              onClick={() => setSelectedVideo(null)}
              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/90 text-slate-800 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              ×
            </button>
            <video className="aspect-video w-full rounded bg-black" src={selectedVideo.mediaUrl} controls autoPlay />
            {selectedVideo.description ? (
              <p className="mt-2 text-center text-sm text-white/90">{selectedVideo.description}</p>
            ) : null}
          </motion.div>
        </motion.div>
      )}
      </main>
  );
}
