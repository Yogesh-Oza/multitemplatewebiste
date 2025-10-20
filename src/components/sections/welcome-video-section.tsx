'use client';

import { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface WelcomeVideoData {
  videoUrl?: string;
  title?: string;
  description?: string;
  isActive: boolean;
}

export function WelcomeVideoSection() {
  const [videoData, setVideoData] = useState<WelcomeVideoData>({
    isActive: false
  });

  useEffect(() => {
    fetchWelcomeVideo();
  }, []);

  const fetchWelcomeVideo = async () => {
    try {
      const response = await fetch('/api/homepage-settings');
      if (response.ok) {
        const data = await response.json();
        if (data?.welcomeVideo) {
          setVideoData({
            videoUrl: data.welcomeVideo.url,
            title: data.welcomeVideo.title || 'गावाचे स्वागत व्हिडिओ',
            description: data.welcomeVideo.description || 'सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप',
            isActive: true
          });
        } else {
          // Use demo video as fallback
          setVideoData({
            videoUrl: 'https://www.youtube.com/watch?v=9W5Vw34xayM',
            title: 'गावाचे स्वागत व्हिडिओ',
            description: 'सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप',
            isActive: true
          });
        }
      } else {
        // Use demo video as fallback
        setVideoData({
          videoUrl: 'https://www.youtube.com/watch?v=9W5Vw34xayM',
          title: 'गावाचे स्वागत व्हिडिओ',
          description: 'सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप',
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error fetching welcome video:', error);
      // Use demo video as fallback
      setVideoData({
        videoUrl: 'https://www.youtube.com/watch?v=9W5Vw34xayM',
        title: 'गावाचे स्वागत व्हिडिओ',
        description: 'सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप',
        isActive: true
      });
    }
  };

  if (!videoData.isActive || !videoData.videoUrl) {
    return null;
  }

  const getVideoEmbedUrl = (url: string) => {
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtu.be/') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`;
    }
    // Handle Vimeo URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&controls=1`;
    }
    return url;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {videoData.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {videoData.description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={getVideoEmbedUrl(videoData.videoUrl)}
              title={videoData.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="mt-6 text-center">
            <a
              href={videoData.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              पूर्ण व्हिडिओ पहा
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
