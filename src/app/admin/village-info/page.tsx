'use client';

import { useState, useEffect } from 'react';
import { VillageInfoForm } from '@/components/admin/village-info-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Upload, 
  Trash2, 
  Eye, 
  Camera,
  Plus,
  Edit,
  Save,
  X,
  Crown,
  TrendingUp,
  Newspaper,
  MessageSquare,
  QrCode as QrCodeIcon,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  History,
  Globe,
  BookOpen,
  Users,
  Facebook,
  Twitter,
  Instagram,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface HeroImage {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface HomepageSettings {
  id?: string;
  mainHeading: string;
  subtitle: string;
  isActive: boolean;
}

interface Leader {
  id?: string;
  name: string;
  role: string;
  roleEn: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface ProgressMetric {
  id?: string;
  key: string;
  label: string;
  labelEn: string;
  value: number;
  unit: string;
  target: number;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

interface NewsItem {
  id?: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  category: string;
  categoryColor: string;
  isUrgent: boolean;
  order: number;
  isActive: boolean;
}

interface DailyMessage {
  id?: string;
  message: string;
  authorTitle: string;
  date: string;
  category: string;
  icon: string;
  color: string;
  isActive: boolean;
}

interface QRCodeSettings {
  id?: string;
  propertyTaxQrData: string;
  waterTaxQrData: string;
  propertyTaxInstruction: string;
  waterTaxInstruction: string;
  isActive: boolean;
}

interface Announcement {
  id?: string;
  title: string;
  date: string;
  description: string;
  fullDescription?: string;
  image: string;
  category: string;
  priority: string;
  status: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface HistoryCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  gradient: string;
  icon: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  side: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CulturalHeritage {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  category: string;
}

interface SocialMediaLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterContent {
  id?: string;
  description: string;
  socialMedia: SocialMediaLink[];
  officeName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  footerSatyamevJayateLogoUrl?: string;
  footerDigitalIndiaLogoUrl?: string;
  footerGovDeptText?: string;
  footerOwnershipText?: string;
}

export default function VillageInfoPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  // Leaders state
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [isUploadingLeaderImage, setIsUploadingLeaderImage] = useState(false);

  // Progress Metrics state
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [editingMetric, setEditingMetric] = useState<ProgressMetric | null>(null);

  // News Items state
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isUploadingNewsImage, setIsUploadingNewsImage] = useState(false);

  // Daily Message state
  const [dailyMessage, setDailyMessage] = useState<DailyMessage | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(true);
  const [editingMessage, setEditingMessage] = useState<DailyMessage | null>(null);

  // QR Code Settings state
  const [qrSettings, setQrSettings] = useState<QRCodeSettings | null>(null);
  const [isLoadingQrSettings, setIsLoadingQrSettings] = useState(true);
  const [isSavingQrSettings, setIsSavingQrSettings] = useState(false);

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isUploadingAnnouncementImage, setIsUploadingAnnouncementImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // History state
  const [historyCards, setHistoryCards] = useState<HistoryCard[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [editingCard, setEditingCard] = useState<HistoryCard | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'cards' | 'timeline'>('cards');

  // Cultural Heritage state
  const [heritage, setHeritage] = useState<CulturalHeritage[]>([]);
  const [isLoadingHeritage, setIsLoadingHeritage] = useState(true);
  const [editingHeritage, setEditingHeritage] = useState<CulturalHeritage | null>(null);
  const [isAddingHeritage, setIsAddingHeritage] = useState(false);
  const [isUploadingHeritageImage, setIsUploadingHeritageImage] = useState(false);

  // Footer Content state
  const [footerContent, setFooterContent] = useState<FooterContent>({
    description: 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख. सर्वांसाठी विकास आणि समृद्धी.',
    socialMedia: [
      { platform: 'facebook', url: '', icon: 'Facebook' },
      { platform: 'twitter', url: '', icon: 'Twitter' },
      { platform: 'instagram', url: '', icon: 'Instagram' },
      { platform: 'youtube', url: '', icon: 'Youtube' }
    ],
    officeName: 'ग्रामपंचायत कार्यालय',
    address: 'गाव, तालुका, जिल्हा\nमहाराष्ट्र, भारत',
    phone: '+91 12345 67890',
    email: 'info@grampanchayat.com',
    website: 'mahagp.in'
  });
  const [isLoadingFooter, setIsLoadingFooter] = useState(true);
  const [isSavingFooter, setIsSavingFooter] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState({
    satyamev: false,
    digitalIndia: false,
  });

  // Fetch images from API
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/hero-images');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('प्रतिमा लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch homepage settings
  const fetchHomepageSettings = async () => {
    try {
      const response = await fetch('/api/homepage-settings');
      if (response.ok) {
        const data = await response.json();
        setHomepageSettings(data);
      }
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
    }
  };

  // Fetch leaders from API
  const fetchLeaders = async () => {
    try {
      const response = await fetch('/api/leaders');
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
      toast.error('नेते लोड करताना त्रुटी');
    } finally {
      setIsLoadingLeaders(false);
    }
  };

  // Fetch progress metrics
  const fetchProgressMetrics = async () => {
    try {
      const response = await fetch('/api/progress-metrics');
      if (response.ok) {
        const data = await response.json();
        setProgressMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching progress metrics:', error);
      toast.error('मेट्रिक्स लोड करताना त्रुटी');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Fetch news items
  const fetchNewsItems = async () => {
    try {
      const response = await fetch('/api/news-items');
      if (response.ok) {
        const data = await response.json();
        setNewsItems(data);
      }
    } catch (error) {
      console.error('Error fetching news items:', error);
      toast.error('बातम्या लोड करताना त्रुटी');
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Fetch daily message
  const fetchDailyMessage = async () => {
    try {
      const response = await fetch('/api/daily-messages');
      if (response.ok) {
        const data = await response.json();
        setDailyMessage(data);
      }
    } catch (error) {
      console.error('Error fetching daily message:', error);
      toast.error('संदेश लोड करताना त्रुटी');
    } finally {
      setIsLoadingMessage(false);
    }
  };

  // Fetch QR code settings
  const fetchQrSettings = async () => {
    try {
      const response = await fetch('/api/qr-code-settings');
      if (response.ok) {
        const data = await response.json();
        setQrSettings(data);
      }
    } catch (error) {
      console.error('Error fetching QR settings:', error);
      toast.error('QR सेटिंग्स लोड करताना त्रुटी');
    } finally {
      setIsLoadingQrSettings(false);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('सूचना लोड करताना त्रुटी');
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  // Fetch history cards
  const fetchHistoryCards = async () => {
    try {
      const response = await fetch('/api/history-cards');
      if (response.ok) {
        const data = await response.json();
        setHistoryCards(data);
      }
    } catch (error) {
      console.error('Error fetching history cards:', error);
      toast.error('इतिहास कार्ड लोड करताना त्रुटी');
    }
  };

  // Fetch timeline items
  const fetchTimelineItems = async () => {
    try {
      const response = await fetch('/api/timeline-items');
      if (response.ok) {
        const data = await response.json();
        setTimelineItems(data);
      }
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      toast.error('टाइमलाइन आयटम लोड करताना त्रुटी');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Fetch cultural heritage
  const fetchHeritage = async () => {
    try {
      const response = await fetch('/api/cultural-heritage');
      if (response.ok) {
        const data = await response.json();
        setHeritage(data);
      }
    } catch (error) {
      console.error('Error fetching cultural heritage:', error);
      toast.error('सांस्कृतिक वारसा लोड करताना त्रुटी');
    } finally {
      setIsLoadingHeritage(false);
    }
  };

  // Fetch footer content
  const fetchFooterContent = async () => {
    try {
      const response = await fetch('/api/admin/footer-content');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setFooterContent({
            description: data.description || footerContent.description,
            socialMedia: data.socialMedia || footerContent.socialMedia,
            officeName: data.officeName || footerContent.officeName,
            address: data.address || footerContent.address,
            phone: data.phone || footerContent.phone,
            email: data.email || footerContent.email,
            website: data.website || footerContent.website,
            footerSatyamevJayateLogoUrl: data.footerSatyamevJayateLogoUrl,
            footerDigitalIndiaLogoUrl: data.footerDigitalIndiaLogoUrl,
            footerGovDeptText: data.footerGovDeptText,
            footerOwnershipText: data.footerOwnershipText
          });
        }
      }
    } catch (error) {
      console.error('Error fetching footer content:', error);
      toast.error('फुटर सामग्री लोड करताना त्रुटी');
    } finally {
      setIsLoadingFooter(false);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchHomepageSettings();
    fetchLeaders();
    fetchProgressMetrics();
    fetchNewsItems();
    fetchDailyMessage();
    fetchQrSettings();
    fetchAnnouncements();
    fetchHistoryCards();
    fetchTimelineItems();
    fetchHeritage();
    fetchFooterContent();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('कृपया प्रतिमा फाइल निवडा');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('फाइल आकार 10MB पेक्षा कमी असावा');
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload file to Vercel Blob
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();
      
      // Save to database
      const saveResponse = await fetch('/api/hero-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          title: file.name.split('.')[0],
          description: '',
          isActive: true,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Save to database failed');
      }

      const newImage = await saveResponse.json();
      setImages(prev => [newImage, ...prev]);
      toast.success('प्रतिमा यशस्वीरित्या अपलोड केली');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('अपलोड करताना त्रुटी');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/hero-images?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        toast.success('प्रतिमा हटवली');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('हटवताना त्रुटी');
    }
  };

  const handleToggleActive = async (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) return;

    try {
      const response = await fetch('/api/hero-images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          imageUrl: image.imageUrl,
          title: image.title,
          description: image.description,
          isActive: !image.isActive,
        }),
      });

      if (response.ok) {
        setImages(prev => prev.map(img => 
          img.id === id ? { ...img, isActive: !img.isActive } : img
        ));
        toast.success('प्रतिमा स्थिती अपडेट केली');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('अपडेट करताना त्रुटी');
    }
  };

  const handleSaveSettings = async () => {
    if (!homepageSettings) return;
    
    setIsSavingSettings(true);
    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homepageSettings),
      });

      if (response.ok) {
        toast.success('होमपेज सेटिंग्स सेव्ह केल्या');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('सेटिंग्स सेव्ह करताना त्रुटी');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // History handlers
  const iconOptions = [
    { value: 'BookOpen', label: 'पुस्तक (BookOpen)' },
    { value: 'Users', label: 'लोक (Users)' },
    { value: 'TrendingUp', label: 'वाढ (TrendingUp)' },
    { value: 'History', label: 'इतिहास (History)' },
    { value: 'Globe', label: 'जग (Globe)' }
  ];

  const gradientOptions = [
    { value: 'from-amber-500 to-orange-600', label: 'नारंगी (Amber-Orange)' },
    { value: 'from-emerald-500 to-teal-600', label: 'हिरवा (Emerald-Teal)' },
    { value: 'from-blue-500 to-indigo-600', label: 'निळा (Blue-Indigo)' },
    { value: 'from-purple-500 to-pink-600', label: 'जांभळा (Purple-Pink)' },
    { value: 'from-red-500 to-rose-600', label: 'लाल (Red-Rose)' }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="h-12 w-12 mx-auto" />;
      case 'Users': return <Users className="h-12 w-12 mx-auto" />;
      case 'TrendingUp': return <TrendingUp className="h-12 w-12 mx-auto" />;
      case 'History': return <History className="h-12 w-12 mx-auto" />;
      case 'Globe': return <Globe className="h-12 w-12 mx-auto" />;
      default: return <BookOpen className="h-12 w-12 mx-auto" />;
    }
  };

  const handleSaveCard = async () => {
    if (!editingCard) return;

    try {
      if (isAddingCard) {
        const response = await fetch('/api/history-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCard),
        });

        if (response.ok) {
          toast.success('नवीन कार्ड जोडले');
          fetchHistoryCards();
        } else {
          throw new Error('Failed to create card');
        }
      } else {
        const response = await fetch('/api/history-cards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCard),
        });

        if (response.ok) {
          toast.success('कार्ड अपडेट केले');
          fetchHistoryCards();
        } else {
          throw new Error('Failed to update card');
        }
      }

      setEditingCard(null);
      setIsAddingCard(false);
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('कार्ड सेव्ह करताना त्रुटी');
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('हे कार्ड हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/history-cards?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('कार्ड हटवले');
        fetchHistoryCards();
      } else {
        throw new Error('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('कार्ड हटवताना त्रुटी');
    }
  };

  const handleSaveTimeline = async () => {
    if (!editingTimeline) return;

    try {
      const url = isAddingTimeline ? '/api/timeline-items' : `/api/timeline-items/${editingTimeline.id}`;
      const method = isAddingTimeline ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTimeline)
      });

      if (response.ok) {
        toast.success(isAddingTimeline ? 'टाइमलाइन आयटम जोडले गेले' : 'टाइमलाइन आयटम अपडेट केले गेले');
        fetchTimelineItems();
        setEditingTimeline(null);
        setIsAddingTimeline(false);
      } else {
        const errorData = await response.json();
        toast.error(`त्रुटी: ${errorData.error || 'अपयशी'}`);
      }
    } catch (error) {
      toast.error('टाइमलाइन आयटम सेव्ह करताना त्रुटी');
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm('हे टाइमलाइन आयटम हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/timeline-items/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('टाइमलाइन आयटम हटवले गेले');
        fetchTimelineItems();
      } else {
        const errorData = await response.json();
        toast.error(`त्रुटी: ${errorData.error || 'अपयशी'}`);
      }
    } catch (error) {
      toast.error('टाइमलाइन आयटम हटवताना त्रुटी');
    }
  };

  // Footer handlers
  const handleSaveFooter = async () => {
    setIsSavingFooter(true);
    try {
      const response = await fetch('/api/admin/footer-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerContent),
      });

      if (response.ok) {
        toast.success('फुटर सामग्री सेव्ह केली');
      } else {
        toast.error('फुटर सामग्री सेव्ह करताना त्रुटी');
      }
    } catch (error) {
      console.error('Error saving footer content:', error);
      toast.error('फुटर सामग्री सेव्ह करताना त्रुटी');
    } finally {
      setIsSavingFooter(false);
    }
  };

  const handleSocialMediaChange = (index: number, field: keyof SocialMediaLink, value: string) => {
    const updatedSocialMedia = [...footerContent.socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [field]: value
    };
    setFooterContent({
      ...footerContent,
      socialMedia: updatedSocialMedia
    });
  };

  const addSocialMediaLink = () => {
    setFooterContent({
      ...footerContent,
      socialMedia: [
        ...footerContent.socialMedia,
        { platform: '', url: '', icon: '' }
      ]
    });
  };

  const removeSocialMediaLink = (index: number) => {
    const updatedSocialMedia = footerContent.socialMedia.filter((_, i) => i !== index);
    setFooterContent({
      ...footerContent,
      socialMedia: updatedSocialMedia
    });
  };

  const handleFooterFileUpload = async (file: File, type: 'satyamev' | 'digitalIndia') => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('कृपया फक्त प्रतिमा फाइल निवडा');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('फाइल आकार 5MB पेक्षा कमी असावा');
      return;
    }

    setUploadingFooter(prev => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const fieldName = type === 'satyamev' ? 'footerSatyamevJayateLogoUrl' : 'footerDigitalIndiaLogoUrl';
        setFooterContent(prev => ({ ...prev, [fieldName]: result.imageUrl || result.url }));
        toast.success(`${type === 'satyamev' ? 'Satyamev Jayate' : 'Digital India'} लोगो अपलोड झाले`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'अपलोड अयशस्वी');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'अपलोड अयशस्वी');
    } finally {
      setUploadingFooter(prev => ({ ...prev, [type]: false }));
    }
  };

  // Cultural Heritage handlers
  const handleSaveHeritage = async () => {
    if (!editingHeritage) return;

    try {
      if (isAddingHeritage) {
        const response = await fetch('/api/cultural-heritage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingHeritage),
        });

        if (response.ok) {
          toast.success('नवीन आयटम जोडले');
          fetchHeritage();
        } else {
          throw new Error('Failed to create heritage item');
        }
      } else {
        const response = await fetch(`/api/cultural-heritage/${editingHeritage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingHeritage),
        });

        if (response.ok) {
          toast.success('आयटम अपडेट केले');
          fetchHeritage();
        } else {
          throw new Error('Failed to update heritage item');
        }
      }

      setEditingHeritage(null);
      setIsAddingHeritage(false);
    } catch (error) {
      console.error('Error saving heritage item:', error);
      toast.error('आयटम सेव्ह करताना त्रुटी');
    }
  };

  const handleDeleteHeritage = async (id: string) => {
    if (!confirm('हे आयटम हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/cultural-heritage/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('आयटम हटवले');
        fetchHeritage();
      } else {
        throw new Error('Failed to delete heritage item');
      }
    } catch (error) {
      console.error('Error deleting heritage item:', error);
      toast.error('आयटम हटवताना त्रुटी');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Homepage</h1>
        <p className="text-gray-600 mt-2">गावाची मुख्य माहिती, आकडेवारी आणि होमपेज व्यवस्थापन</p>
      </div>

      {/* Hero Images Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">मुख्य प्रतिमा</h2>
            <p className="text-gray-600 mt-1">होमपेज मुख्य प्रतिमा व्यवस्थापन</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {images.filter(img => img.isActive).length} सक्रिय
            </Badge>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {images.length} एकूण
            </Badge>
          </div>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>नवीन प्रतिमा अपलोड करा</span>
            </CardTitle>
            <CardDescription>
              होमपेज स्लाइडरसाठी नवीन प्रतिमा जोडा. JPG, PNG, WebP स्वरूपातील प्रतिमा स्वीकारल्या जातात.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                disabled={isUploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                <div className="p-4 bg-blue-100 rounded-full">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isUploading ? 'अपलोड होत आहे...' : 'प्रतिमा अपलोड करा'}
                  </p>
                  <p className="text-sm text-gray-500">
                    क्लिक करा किंवा प्रतिमा ड्रॅग करा
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Homepage Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="h-5 w-5 mr-2" />
              होमपेज मुख्य प्रतिमा व्यवस्थापन
            </CardTitle>
            <CardDescription>
              होमपेजवरील मुख्य शीर्षक आणि उपशीर्षक व्यवस्थापन
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {homepageSettings && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mainHeading">मुख्य शीर्षक</Label>
                    <Input
                      id="mainHeading"
                      value={homepageSettings.mainHeading}
                      onChange={(e) => setHomepageSettings(prev => prev ? { ...prev, mainHeading: e.target.value } : null)}
                      placeholder="आमच्या गावात स्वागत आहे"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">उपशीर्षक</Label>
                    <Input
                      id="subtitle"
                      value={homepageSettings.subtitle}
                      onChange={(e) => setHomepageSettings(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                      placeholder="एकत्रित विकास, सामाजिक न्याय आणि सुशासनाच्या मार्गावर प्रगतीशील गाव"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSavingSettings ? 'सेव्ह होत आहे...' : 'सेटिंग्स सेव्ह करा'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Images Grid */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">प्रतिमा सूची</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">लोड होत आहे...</span>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">अजून कोणतीही प्रतिमा नाही</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative">
                    <img
                      src={image.imageUrl}
                      alt={image.title || 'Hero Image'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={image.isActive ? "default" : "secondary"}
                        className={image.isActive ? "bg-green-500" : "bg-gray-500"}
                      >
                        {image.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{image.title || 'प्रतिमा'}</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      जोडले: {new Date(image.createdAt).toLocaleDateString('mr-IN')}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(image.id)}
                        className="flex-1"
                      >
                        {image.isActive ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>सूचना</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">प्रतिमा आकार</h4>
                <p className="text-sm text-blue-700">
                  शिफारस केलेला आकार: 1920x1080px (16:9 गुणोत्तर)
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">फाइल स्वरूप</h4>
                <p className="text-sm text-green-700">
                  JPG, PNG, WebP स्वरूपातील प्रतिमा स्वीकारल्या जातात
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">सक्रिय प्रतिमा</h4>
                <p className="text-sm text-purple-700">
                  फक्त सक्रिय प्रतिमा होमपेजवर दिसतील
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">कमाल संख्या</h4>
                <p className="text-sm text-orange-700">
                  कमाल 10 प्रतिमा जोडू शकता
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaders Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">आपले नेते व पदसोपान रचना</h2>
            <p className="text-gray-600 mt-1">मा. मुख्यमंत्री, मा. उपमुख्यमंत्री, मंत्रीमंडळ आणि संबंधित विभागीय अधिकारी</p>
          </div>
          <Button
            onClick={() => setEditingLeader({
              name: '',
              role: '',
              roleEn: '',
              imageUrl: '',
              order: leaders.length,
              isActive: true
            })}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            नवीन नेता जोडा
          </Button>
        </div>

        {/* Add/Edit Leader Form */}
        {editingLeader && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  {editingLeader.id ? 'नेता संपादित करा' : 'नवीन नेता जोडा'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingLeader(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leaderName">नाव</Label>
                  <Input
                    id="leaderName"
                    value={editingLeader.name}
                    onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                    placeholder="Shri. Devendra Fadnavis"
                  />
                </div>
                <div>
                  <Label htmlFor="leaderRole">पद (मराठी)</Label>
                  <Input
                    id="leaderRole"
                    value={editingLeader.role}
                    onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                    placeholder="मा. मुख्यमंत्री"
                  />
                </div>
                <div>
                  <Label htmlFor="leaderRoleEn">पद (इंग्रजी)</Label>
                  <Input
                    id="leaderRoleEn"
                    value={editingLeader.roleEn}
                    onChange={(e) => setEditingLeader({ ...editingLeader, roleEn: e.target.value })}
                    placeholder="Hon'ble Chief Minister"
                  />
                </div>
                <div>
                  <Label htmlFor="leaderOrder">क्रम</Label>
                  <Input
                    id="leaderOrder"
                    type="number"
                    value={editingLeader.order}
                    onChange={(e) => setEditingLeader({ ...editingLeader, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>प्रतिमा</Label>
                <div className="mt-2">
                  <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">प्रतिमा अपलोड करा</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setIsUploadingLeaderImage(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          const uploadResponse = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });

                          if (uploadResponse.ok) {
                            const uploadData = await uploadResponse.json();
                            setEditingLeader({ ...editingLeader, imageUrl: uploadData.imageUrl || uploadData.url });
                            toast.success('प्रतिमा अपलोड केली');
                          } else {
                            toast.error('प्रतिमा अपलोड करताना त्रुटी');
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('प्रतिमा अपलोड करताना त्रुटी');
                        } finally {
                          setIsUploadingLeaderImage(false);
                        }
                      }}
                      disabled={isUploadingLeaderImage}
                    />
                  </label>
                  {editingLeader.imageUrl && (
                    <div className="mt-2">
                      <img src={editingLeader.imageUrl} alt="Preview" className="h-20 w-20 rounded object-cover border" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingLeader.isActive}
                    onChange={(e) => setEditingLeader({ ...editingLeader, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">सक्रिय</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingLeader(null)}
                >
                  रद्द करा
                </Button>
                <Button
                  onClick={async () => {
                    if (!editingLeader.name || !editingLeader.role || !editingLeader.roleEn || !editingLeader.imageUrl) {
                      toast.error('कृपया सर्व फील्ड भरा');
                      return;
                    }

                    try {
                      const url = editingLeader.id ? '/api/leaders' : '/api/leaders';
                      const method = editingLeader.id ? 'PUT' : 'POST';
                      
                      const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editingLeader),
                      });

                      if (response.ok) {
                        toast.success(editingLeader.id ? 'नेता अपडेट केला' : 'नेता जोडला');
                        setEditingLeader(null);
                        fetchLeaders();
                      } else {
                        throw new Error('Failed to save leader');
                      }
                    } catch (error) {
                      console.error('Error saving leader:', error);
                      toast.error('नेता सेव्ह करताना त्रुटी');
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaders Grid */}
        <div>
          {isLoadingLeaders ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">लोड होत आहे...</span>
            </div>
          ) : leaders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">अजून कोणतेही नेते जोडलेले नाहीत</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaders.map((leader) => (
                <Card key={leader.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      {leader.imageUrl ? (
                        <img
                          src={leader.imageUrl}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Crown className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={leader.isActive ? "default" : "secondary"}
                        className={leader.isActive ? "bg-green-500" : "bg-gray-500"}
                      >
                        {leader.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-700 text-sm mb-1">{leader.role}</h4>
                    <h3 className="font-bold text-gray-900 mb-1">{leader.name}</h3>
                    <p className="text-xs text-gray-500 mb-4">{leader.roleEn}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingLeader(leader)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        संपादित
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={async () => {
                          if (!confirm('तुम्हाला खात्री आहे की तुम्ही हा नेता हटवू इच्छिता?')) return;
                          
                          try {
                            const response = await fetch(`/api/leaders/${leader.id}`, {
                              method: 'DELETE',
                            });

                            if (response.ok) {
                              toast.success('नेता हटवला');
                              fetchLeaders();
                            } else {
                              throw new Error('Delete failed');
                            }
                          } catch (error) {
                            console.error('Delete error:', error);
                            toast.error('हटवताना त्रुटी');
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Metrics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">प्रगती मीटर</h2>
            <p className="text-gray-600 mt-1">समृद्ध पंचायत योजना प्रगती, स्वच्छता टक्केवारी, नळजोडणी कव्हरेज इत्यादी</p>
          </div>
          <Button
            onClick={() => setEditingMetric({
              key: '',
              label: '',
              labelEn: '',
              value: 0,
              unit: '%',
              target: 100,
              icon: 'TrendingUp',
              color: 'blue',
              order: progressMetrics.length,
              isActive: true
            })}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            नवीन मेट्रिक जोडा
          </Button>
        </div>

        {/* Add/Edit Metric Form */}
        {editingMetric && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  {editingMetric.id ? 'मेट्रिक संपादित करा' : 'नवीन मेट्रिक जोडा'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMetric(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metricKey">Key</Label>
                  <Input
                    id="metricKey"
                    value={editingMetric.key}
                    onChange={(e) => setEditingMetric({ ...editingMetric, key: e.target.value })}
                    placeholder="sanitation"
                  />
                </div>
                <div>
                  <Label htmlFor="metricLabel">लेबल (मराठी)</Label>
                  <Input
                    id="metricLabel"
                    value={editingMetric.label}
                    onChange={(e) => setEditingMetric({ ...editingMetric, label: e.target.value })}
                    placeholder="स्वच्छता कव्हरेज"
                  />
                </div>
                <div>
                  <Label htmlFor="metricLabelEn">लेबल (इंग्रजी)</Label>
                  <Input
                    id="metricLabelEn"
                    value={editingMetric.labelEn}
                    onChange={(e) => setEditingMetric({ ...editingMetric, labelEn: e.target.value })}
                    placeholder="Sanitation Coverage"
                  />
                </div>
                <div>
                  <Label htmlFor="metricValue">मूल्य</Label>
                  <Input
                    id="metricValue"
                    type="number"
                    value={editingMetric.value}
                    onChange={(e) => setEditingMetric({ ...editingMetric, value: parseFloat(e.target.value) || 0 })}
                    placeholder="85"
                  />
                </div>
                <div>
                  <Label htmlFor="metricUnit">युनिट</Label>
                  <Input
                    id="metricUnit"
                    value={editingMetric.unit}
                    onChange={(e) => setEditingMetric({ ...editingMetric, unit: e.target.value })}
                    placeholder="%, झाडे"
                  />
                </div>
                <div>
                  <Label htmlFor="metricTarget">लक्ष्य</Label>
                  <Input
                    id="metricTarget"
                    type="number"
                    value={editingMetric.target}
                    onChange={(e) => setEditingMetric({ ...editingMetric, target: parseFloat(e.target.value) || 0 })}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="metricIcon">Icon</Label>
                  <Input
                    id="metricIcon"
                    value={editingMetric.icon}
                    onChange={(e) => setEditingMetric({ ...editingMetric, icon: e.target.value })}
                    placeholder="CheckCircle, Zap, Droplets, TreePine"
                  />
                </div>
                <div>
                  <Label htmlFor="metricColor">रंग</Label>
                  <Input
                    id="metricColor"
                    value={editingMetric.color}
                    onChange={(e) => setEditingMetric({ ...editingMetric, color: e.target.value })}
                    placeholder="green, blue, yellow"
                  />
                </div>
                <div>
                  <Label htmlFor="metricOrder">क्रम</Label>
                  <Input
                    id="metricOrder"
                    type="number"
                    value={editingMetric.order}
                    onChange={(e) => setEditingMetric({ ...editingMetric, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingMetric.isActive}
                    onChange={(e) => setEditingMetric({ ...editingMetric, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">सक्रिय</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingMetric(null)}
                >
                  रद्द करा
                </Button>
                <Button
                  onClick={async () => {
                    if (!editingMetric.key || !editingMetric.label || !editingMetric.labelEn) {
                      toast.error('कृपया सर्व फील्ड भरा');
                      return;
                    }

                    try {
                      const url = '/api/progress-metrics';
                      const method = editingMetric.id ? 'PUT' : 'POST';
                      
                      const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editingMetric),
                      });

                      if (response.ok) {
                        toast.success(editingMetric.id ? 'मेट्रिक अपडेट केला' : 'मेट्रिक जोडला');
                        setEditingMetric(null);
                        fetchProgressMetrics();
                      } else {
                        throw new Error('Failed to save metric');
                      }
                    } catch (error) {
                      console.error('Error saving metric:', error);
                      toast.error('मेट्रिक सेव्ह करताना त्रुटी');
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics Grid */}
        <div>
          {isLoadingMetrics ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">लोड होत आहे...</span>
            </div>
          ) : progressMetrics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">अजून कोणतेही मेट्रिक्स जोडलेले नाहीत</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {progressMetrics.map((metric) => (
                <Card key={metric.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={metric.isActive ? "default" : "secondary"}
                        className={metric.isActive ? "bg-green-500" : "bg-gray-500"}
                      >
                        {metric.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </Badge>
                      <span className="text-xs text-gray-500">क्रम: {metric.order}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{metric.label}</h4>
                    <p className="text-sm text-gray-500 mb-2">{metric.labelEn}</p>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {metric.value}{metric.unit}
                    </div>
                    <p className="text-xs text-gray-500 mb-4">लक्ष्य: {metric.target}{metric.unit}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingMetric(metric)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        संपादित
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={async () => {
                          if (!confirm('तुम्हाला खात्री आहे की तुम्ही हा मेट्रिक हटवू इच्छिता?')) return;
                          
                          try {
                            const response = await fetch(`/api/progress-metrics/${metric.id}`, {
                              method: 'DELETE',
                            });

                            if (response.ok) {
                              toast.success('मेट्रिक हटवला');
                              fetchProgressMetrics();
                            } else {
                              throw new Error('Delete failed');
                            }
                          } catch (error) {
                            console.error('Delete error:', error);
                            toast.error('हटवताना त्रुटी');
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* News Items Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">ताज्या बातम्या व अद्यतन</h2>
            <p className="text-gray-600 mt-1">गावातील महत्त्वाच्या सूचना, उपलब्धी आणि विकासाच्या नवीनतम बातम्या</p>
          </div>
          <Button
            onClick={() => setEditingNews({
              title: '',
              description: '',
              date: new Date().toLocaleDateString('mr-IN'),
              imageUrl: '',
              category: '',
              categoryColor: 'bg-blue-500',
              isUrgent: false,
              order: newsItems.length,
              isActive: true
            })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            नवीन बातमी जोडा
          </Button>
        </div>

        {/* Add/Edit News Form */}
        {editingNews && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Newspaper className="h-5 w-5 mr-2" />
                  {editingNews.id ? 'बातमी संपादित करा' : 'नवीन बातमी जोडा'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingNews(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="newsTitle">शीर्षक</Label>
                  <Input
                    id="newsTitle"
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                    placeholder="नवीन पाणी पुरवठा योजना यशस्वी"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="newsDescription">वर्णन</Label>
                  <textarea
                    id="newsDescription"
                    value={editingNews.description}
                    onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })}
                    placeholder="गावातील सर्व भागांमध्ये २४ तास पाणी पुरवठा..."
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="newsDate">दिनांक</Label>
                  <Input
                    id="newsDate"
                    value={editingNews.date}
                    onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                    placeholder="२३ मार्च २०२४"
                  />
                </div>
                <div>
                  <Label htmlFor="newsCategory">श्रेणी</Label>
                  <Input
                    id="newsCategory"
                    value={editingNews.category}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                    placeholder="पायाभूत सुविधा"
                  />
                </div>
                <div>
                  <Label htmlFor="newsCategoryColor">श्रेणी रंग</Label>
                  <Input
                    id="newsCategoryColor"
                    value={editingNews.categoryColor}
                    onChange={(e) => setEditingNews({ ...editingNews, categoryColor: e.target.value })}
                    placeholder="bg-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="newsOrder">क्रम</Label>
                  <Input
                    id="newsOrder"
                    type="number"
                    value={editingNews.order}
                    onChange={(e) => setEditingNews({ ...editingNews, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>प्रतिमा</Label>
                <div className="mt-2">
                  <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">प्रतिमा अपलोड करा</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setIsUploadingNewsImage(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          const uploadResponse = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });

                          if (uploadResponse.ok) {
                            const uploadData = await uploadResponse.json();
                            setEditingNews({ ...editingNews, imageUrl: uploadData.imageUrl || uploadData.url });
                            toast.success('प्रतिमा अपलोड केली');
                          } else {
                            toast.error('प्रतिमा अपलोड करताना त्रुटी');
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('प्रतिमा अपलोड करताना त्रुटी');
                        } finally {
                          setIsUploadingNewsImage(false);
                        }
                      }}
                      disabled={isUploadingNewsImage}
                    />
                  </label>
                  {editingNews.imageUrl && (
                    <div className="mt-2">
                      <img src={editingNews.imageUrl} alt="Preview" className="h-20 w-20 rounded object-cover border" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingNews.isUrgent}
                    onChange={(e) => setEditingNews({ ...editingNews, isUrgent: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">तातडीचे</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingNews.isActive}
                    onChange={(e) => setEditingNews({ ...editingNews, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">सक्रिय</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingNews(null)}
                >
                  रद्द करा
                </Button>
                <Button
                  onClick={async () => {
                    if (!editingNews.title || !editingNews.description || !editingNews.imageUrl) {
                      toast.error('कृपया सर्व फील्ड भरा');
                      return;
                    }

                    try {
                      const url = '/api/news-items';
                      const method = editingNews.id ? 'PUT' : 'POST';
                      
                      const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editingNews),
                      });

                      if (response.ok) {
                        toast.success(editingNews.id ? 'बातमी अपडेट केली' : 'बातमी जोडली');
                        setEditingNews(null);
                        fetchNewsItems();
                      } else {
                        throw new Error('Failed to save news');
                      }
                    } catch (error) {
                      console.error('Error saving news:', error);
                      toast.error('बातमी सेव्ह करताना त्रुटी');
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* News Grid */}
        <div>
          {isLoadingNews ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">लोड होत आहे...</span>
            </div>
          ) : newsItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">अजून कोणतीही बातमी नाही</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Newspaper className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={item.isActive ? "default" : "secondary"}
                        className={item.isActive ? "bg-green-500" : "bg-gray-500"}
                      >
                        {item.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </Badge>
                    </div>
                    {item.isUrgent && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500">तातडीचे</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h4>
                    <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingNews(item)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        संपादित
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={async () => {
                          if (!confirm('तुम्हाला खात्री आहे की तुम्ही ही बातमी हटवू इच्छिता?')) return;
                          
                          try {
                            const response = await fetch(`/api/news-items/${item.id}`, {
                              method: 'DELETE',
                            });

                            if (response.ok) {
                              toast.success('बातमी हटवली');
                              fetchNewsItems();
                            } else {
                              throw new Error('Delete failed');
                            }
                          } catch (error) {
                            console.error('Delete error:', error);
                            toast.error('हटवताना त्रुटी');
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Message Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">आजचा सुविचार / पंचायत संदेश</h2>
            <p className="text-gray-600 mt-1">ग्रामपंचायत नेतृत्वाकडून नागरिकांसाठी प्रेरणादायी संदेश</p>
          </div>
          <Button
            onClick={() => setEditingMessage(dailyMessage || {
              message: '',
              authorTitle: 'सरपंच',
              date: new Date().toLocaleDateString('mr-IN'),
              category: 'governance',
              icon: 'User',
              color: 'from-blue-500 to-indigo-600',
              isActive: true
            })}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {dailyMessage ? 'संदेश संपादित करा' : 'नवीन संदेश जोडा'}
          </Button>
        </div>

        {/* Current Message Display */}
        {dailyMessage && !editingMessage && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-lg text-gray-800 mb-4 italic">"{dailyMessage.message}"</p>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">{dailyMessage.authorTitle}</span>
                    <span className="text-sm text-gray-500">{dailyMessage.date}</span>
                  </div>
                </div>
                <Badge 
                  variant={dailyMessage.isActive ? "default" : "secondary"}
                  className={dailyMessage.isActive ? "bg-green-500" : "bg-gray-500"}
                >
                  {dailyMessage.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Message Form */}
        {editingMessage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  {editingMessage.id ? 'संदेश संपादित करा' : 'नवीन संदेश जोडा'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMessage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="messageText">संदेश</Label>
                <textarea
                  id="messageText"
                  value={editingMessage.message}
                  onChange={(e) => setEditingMessage({ ...editingMessage, message: e.target.value })}
                  placeholder="एकत्रित विकास, सामाजिक न्याय..."
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="messageAuthor">लेखक पद</Label>
                  <Input
                    id="messageAuthor"
                    value={editingMessage.authorTitle}
                    onChange={(e) => setEditingMessage({ ...editingMessage, authorTitle: e.target.value })}
                    placeholder="सरपंच"
                  />
                </div>
                <div>
                  <Label htmlFor="messageDate">दिनांक</Label>
                  <Input
                    id="messageDate"
                    value={editingMessage.date}
                    onChange={(e) => setEditingMessage({ ...editingMessage, date: e.target.value })}
                    placeholder={new Date().toLocaleDateString('mr-IN')}
                  />
                </div>
                <div>
                  <Label htmlFor="messageCategory">श्रेणी</Label>
                  <Input
                    id="messageCategory"
                    value={editingMessage.category}
                    onChange={(e) => setEditingMessage({ ...editingMessage, category: e.target.value })}
                    placeholder="governance"
                  />
                </div>
                <div>
                  <Label htmlFor="messageIcon">Icon</Label>
                  <Input
                    id="messageIcon"
                    value={editingMessage.icon}
                    onChange={(e) => setEditingMessage({ ...editingMessage, icon: e.target.value })}
                    placeholder="User, Lightbulb, Heart"
                  />
                </div>
                <div>
                  <Label htmlFor="messageColor">रंग</Label>
                  <Input
                    id="messageColor"
                    value={editingMessage.color}
                    onChange={(e) => setEditingMessage({ ...editingMessage, color: e.target.value })}
                    placeholder="from-blue-500 to-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingMessage.isActive}
                    onChange={(e) => setEditingMessage({ ...editingMessage, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">सक्रिय</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingMessage(null)}
                >
                  रद्द करा
                </Button>
                <Button
                  onClick={async () => {
                    if (!editingMessage.message || !editingMessage.authorTitle) {
                      toast.error('कृपया सर्व फील्ड भरा');
                      return;
                    }

                    try {
                      const url = '/api/daily-messages';
                      const method = editingMessage.id ? 'PUT' : 'POST';
                      
                      const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editingMessage),
                      });

                      if (response.ok) {
                        toast.success(editingMessage.id ? 'संदेश अपडेट केला' : 'संदेश जोडला');
                        setEditingMessage(null);
                        fetchDailyMessage();
                      } else {
                        throw new Error('Failed to save message');
                      }
                    } catch (error) {
                      console.error('Error saving message:', error);
                      toast.error('संदेश सेव्ह करताना त्रुटी');
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* QR Code Settings Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">QR कोड सेटिंग्स</h2>
          <p className="text-gray-600 mt-1">QR कोडद्वारे कर भरण्यासाठी सेटिंग्स</p>
        </div>

        {isLoadingQrSettings ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-2 text-gray-600">लोड होत आहे...</span>
          </div>
        ) : qrSettings ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCodeIcon className="h-5 w-5 mr-2" />
                QR कोड सेटिंग्स
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="propertyTaxQrData">मालमत्ता कर QR Data</Label>
                  <Input
                    id="propertyTaxQrData"
                    value={qrSettings.propertyTaxQrData}
                    onChange={(e) => setQrSettings({ ...qrSettings, propertyTaxQrData: e.target.value })}
                    placeholder="upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Property Tax"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="propertyTaxInstruction">मालमत्ता कर सूचना</Label>
                  <textarea
                    id="propertyTaxInstruction"
                    value={qrSettings.propertyTaxInstruction}
                    onChange={(e) => setQrSettings({ ...qrSettings, propertyTaxInstruction: e.target.value })}
                    className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="waterTaxQrData">पाणी कर QR Data</Label>
                  <Input
                    id="waterTaxQrData"
                    value={qrSettings.waterTaxQrData}
                    onChange={(e) => setQrSettings({ ...qrSettings, waterTaxQrData: e.target.value })}
                    placeholder="upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Water Tax"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="waterTaxInstruction">पाणी कर सूचना</Label>
                  <textarea
                    id="waterTaxInstruction"
                    value={qrSettings.waterTaxInstruction}
                    onChange={(e) => setQrSettings({ ...qrSettings, waterTaxInstruction: e.target.value })}
                    className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    if (!qrSettings.propertyTaxQrData || !qrSettings.waterTaxQrData) {
                      toast.error('कृपया सर्व फील्ड भरा');
                      return;
                    }

                    setIsSavingQrSettings(true);
                    try {
                      const response = await fetch('/api/qr-code-settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(qrSettings),
                      });

                      if (response.ok) {
                        toast.success('QR सेटिंग्स सेव्ह केल्या');
                        fetchQrSettings();
                      } else {
                        throw new Error('Failed to save settings');
                      }
                    } catch (error) {
                      console.error('Error saving QR settings:', error);
                      toast.error('सेटिंग्स सेव्ह करताना त्रुटी');
                    } finally {
                      setIsSavingQrSettings(false);
                    }
                  }}
                  disabled={isSavingQrSettings}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSavingQrSettings ? 'सेव्ह होत आहे...' : 'सेटिंग्स सेव्ह करा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <QrCodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">QR सेटिंग्स लोड करताना त्रुटी</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Announcements Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">सूचना व्यवस्थापन</h2>
            <p className="text-gray-600 mt-1">सूचना आणि जाहीराती व्यवस्थापन</p>
          </div>
          <Button
            onClick={() => setEditingAnnouncement({
              title: '',
              date: '',
              description: '',
              fullDescription: '',
              image: '',
              category: '',
              priority: 'medium',
              status: 'active',
              isActive: true,
              order: announcements.length
            })}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            नवीन सूचना
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchAnnouncements">शोधा</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="searchAnnouncements"
                    placeholder="सूचना शोधा..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="filterStatus">स्थिती</Label>
                <select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">सर्व</option>
                  <option value="active">सक्रिय</option>
                  <option value="completed">पूर्ण</option>
                  <option value="upcoming">येत आहे</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  अधिक फिल्टर
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Announcement Form */}
        {editingAnnouncement && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {editingAnnouncement.id ? 'सूचना संपादित करा' : 'नवीन सूचना जोडा'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingAnnouncement(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="announcementTitle">शीर्षक</Label>
                  <Input
                    id="announcementTitle"
                    value={editingAnnouncement.title}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                    placeholder="सूचनेचे शीर्षक"
                  />
                </div>
                <div>
                  <Label htmlFor="announcementDate">तारीख</Label>
                  <Input
                    id="announcementDate"
                    value={editingAnnouncement.date}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                    placeholder="२३ मार्च २०२४"
                  />
                </div>
                <div>
                  <Label htmlFor="announcementCategory">श्रेणी</Label>
                  <Input
                    id="announcementCategory"
                    value={editingAnnouncement.category}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value })}
                    placeholder="पाणीपुरवठा"
                  />
                </div>
                <div>
                  <Label htmlFor="announcementPriority">प्राधान्य</Label>
                  <select
                    id="announcementPriority"
                    value={editingAnnouncement.priority}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">कमी</option>
                    <option value="medium">मध्यम</option>
                    <option value="high">उच्च</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="announcementStatus">स्थिती</Label>
                  <select
                    id="announcementStatus"
                    value={editingAnnouncement.status}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">सक्रिय</option>
                    <option value="completed">पूर्ण</option>
                    <option value="upcoming">येत आहे</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="announcementDescription">वर्णन</Label>
                  <textarea
                    id="announcementDescription"
                    value={editingAnnouncement.description}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
                    placeholder="सूचनेचे वर्णन"
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="announcementFullDescription">पूर्ण वर्णन</Label>
                  <textarea
                    id="announcementFullDescription"
                    value={editingAnnouncement.fullDescription || ''}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, fullDescription: e.target.value })}
                    placeholder="सूचनेचे पूर्ण वर्णन"
                    className="w-full min-h-[150px] px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <Label>प्रतिमा</Label>
                <div className="mt-2">
                  <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">प्रतिमा अपलोड करा</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setIsUploadingAnnouncementImage(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          const uploadResponse = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });

                          if (uploadResponse.ok) {
                            const uploadData = await uploadResponse.json();
                            setEditingAnnouncement({ ...editingAnnouncement, image: uploadData.imageUrl || uploadData.url });
                            toast.success('प्रतिमा अपलोड केली');
                          } else {
                            toast.error('प्रतिमा अपलोड करताना त्रुटी');
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('प्रतिमा अपलोड करताना त्रुटी');
                        } finally {
                          setIsUploadingAnnouncementImage(false);
                        }
                      }}
                      disabled={isUploadingAnnouncementImage}
                    />
                  </label>
                  {editingAnnouncement.image && (
                    <div className="mt-2">
                      <img src={editingAnnouncement.image} alt="Preview" className="h-20 w-20 rounded object-cover border" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingAnnouncement(null)}
                >
                  रद्द करा
                </Button>
                <Button
                  onClick={async () => {
                    if (!editingAnnouncement.title || !editingAnnouncement.description || !editingAnnouncement.image) {
                      toast.error('कृपया सर्व फील्ड भरा');
                      return;
                    }

                    try {
                      const url = editingAnnouncement.id 
                        ? `/api/admin/announcements/${editingAnnouncement.id}` 
                        : '/api/admin/announcements';
                      const method = editingAnnouncement.id ? 'PUT' : 'POST';
                      
                      const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          title: editingAnnouncement.title,
                          date: editingAnnouncement.date,
                          description: editingAnnouncement.description,
                          fullDescription: editingAnnouncement.fullDescription,
                          image: editingAnnouncement.image,
                          category: editingAnnouncement.category,
                          priority: editingAnnouncement.priority,
                          status: editingAnnouncement.status,
                          order: editingAnnouncement.order || 0,
                        }),
                      });

                      if (response.ok) {
                        toast.success(editingAnnouncement.id ? 'सूचना अपडेट केली' : 'सूचना जोडली');
                        setEditingAnnouncement(null);
                        fetchAnnouncements();
                      } else {
                        throw new Error('Failed to save announcement');
                      }
                    } catch (error) {
                      console.error('Error saving announcement:', error);
                      toast.error('सूचना सेव्ह करताना त्रुटी');
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements Grid */}
        <div>
          {isLoadingAnnouncements ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">लोड होत आहे...</span>
            </div>
          ) : (() => {
            const filteredAnnouncements = announcements.filter(announcement => {
              const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
              return matchesSearch && matchesStatus;
            });

            return filteredAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">कोणतीही सूचना सापडली नाही</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        {announcement.image ? (
                          <img
                            src={announcement.image}
                            alt={announcement.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <AlertCircle className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute top-2 left-2 flex space-x-2">
                        <Badge className={`${
                          announcement.priority === 'high' ? 'bg-red-500' :
                          announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        } text-white border-0`}>
                          {announcement.category}
                        </Badge>
                        <Badge className={`${
                          announcement.status === 'active' ? 'bg-green-100 text-green-800' :
                          announcement.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        } border-0`}>
                          {announcement.status === 'active' ? 'सक्रिय' :
                           announcement.status === 'completed' ? 'पूर्ण' : 'येत आहे'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{announcement.title}</h4>
                      <div className="flex items-center mb-2 text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-xs">{announcement.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{announcement.description}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingAnnouncement(announcement)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          संपादित
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={async () => {
                            if (!confirm('तुम्हाला खात्री आहे की तुम्ही ही सूचना हटवू इच्छिता?')) return;
                            
                            try {
                              const response = await fetch(`/api/admin/announcements/${announcement.id}`, {
                                method: 'DELETE',
                              });

                              if (response.ok) {
                                toast.success('सूचना हटवली');
                                fetchAnnouncements();
                              } else {
                                throw new Error('Delete failed');
                              }
                            } catch (error) {
                              console.error('Delete error:', error);
                              toast.error('हटवताना त्रुटी');
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* History Management Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">इतिहास व्यवस्थापन</h2>
            <p className="text-gray-600 mt-1">गावाचा इतिहास आणि टाइमलाइन व्यवस्थापन</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {historyCards.length} कार्ड
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {timelineItems.length} टाइमलाइन
            </Badge>
            <Button onClick={() => {
              if (activeHistoryTab === 'cards') {
                setEditingCard({
                  id: '',
                  title: '',
                  titleEn: '',
                  description: '',
                  descriptionEn: '',
                  gradient: 'from-amber-500 to-orange-600',
                  icon: 'BookOpen'
                });
                setIsAddingCard(true);
              } else {
                setEditingTimeline({
                  id: '',
                  year: '',
                  title: '',
                  titleEn: '',
                  description: '',
                  descriptionEn: '',
                  side: 'left'
                });
                setIsAddingTimeline(true);
              }
            }}>
              <Plus className="h-4 w-4 mr-2" />
              {activeHistoryTab === 'cards' ? 'नवीन कार्ड' : 'नवीन टाइमलाइन'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveHistoryTab('cards')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeHistoryTab === 'cards'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              इतिहास कार्ड ({historyCards.length})
            </button>
            <button
              onClick={() => setActiveHistoryTab('timeline')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeHistoryTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              टाइमलाइन ({timelineItems.length})
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeHistoryTab === 'cards' ? (
          <>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">लोड होत आहे...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyCards.map((card) => (
                  <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className={`h-32 bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                      <div className="text-center text-white">
                        <div className="text-3xl mb-2">
                          {getIconComponent(card.icon)}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{card.description}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCard(card);
                            setIsAddingCard(false);
                          }}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          संपादन
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">लोड होत आहे...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {timelineItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                              {item.year}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={item.side === 'left' ? 'default' : 'secondary'}>
                            {item.side === 'left' ? 'डावीकडे' : 'उजवीकडे'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingTimeline(item);
                              setIsAddingTimeline(false);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            संपादन
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTimeline(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {timelineItems.length === 0 && (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">कोणतेही टाइमलाइन आयटम नाहीत</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Edit Card Modal */}
        {editingCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {isAddingCard ? 'नवीन कार्ड जोडा' : 'कार्ड संपादित करा'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">शीर्षक (मराठी)</Label>
                    <Input
                      id="title"
                      value={editingCard.title}
                      onChange={(e) => setEditingCard({...editingCard, title: e.target.value})}
                      placeholder="ग्रामाचा इतिहास"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
                    <Input
                      id="titleEn"
                      value={editingCard.titleEn}
                      onChange={(e) => setEditingCard({...editingCard, titleEn: e.target.value})}
                      placeholder="Village History"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">वर्णन (मराठी)</Label>
                  <Textarea
                    id="description"
                    value={editingCard.description}
                    onChange={(e) => setEditingCard({...editingCard, description: e.target.value})}
                    placeholder="आमच्या गावाचा समृद्ध इतिहास आणि परंपरा"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingCard.descriptionEn}
                    onChange={(e) => setEditingCard({...editingCard, descriptionEn: e.target.value})}
                    placeholder="Rich history and traditions of our village"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gradient">ग्रेडिएंट</Label>
                    <select
                      id="gradient"
                      value={editingCard.gradient}
                      onChange={(e) => setEditingCard({...editingCard, gradient: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {gradientOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="icon">आयकॉन</Label>
                    <select
                      id="icon"
                      value={editingCard.icon}
                      onChange={(e) => setEditingCard({...editingCard, icon: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => {
                  setEditingCard(null);
                  setIsAddingCard(false);
                }}>
                  रद्द करा
                </Button>
                <Button onClick={handleSaveCard}>
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Timeline Modal */}
        {editingTimeline && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {isAddingTimeline ? 'नवीन टाइमलाइन आयटम जोडा' : 'टाइमलाइन आयटम संपादित करा'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">वर्ष</Label>
                    <Input
                      id="year"
                      value={editingTimeline.year}
                      onChange={(e) => setEditingTimeline({...editingTimeline, year: e.target.value})}
                      placeholder="1950"
                    />
                  </div>
                  <div>
                    <Label htmlFor="side">बाजू</Label>
                    <select
                      id="side"
                      value={editingTimeline.side}
                      onChange={(e) => setEditingTimeline({...editingTimeline, side: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="left">डावीकडे</option>
                      <option value="right">उजवीकडे</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timelineTitle">शीर्षक (मराठी)</Label>
                    <Input
                      id="timelineTitle"
                      value={editingTimeline.title}
                      onChange={(e) => setEditingTimeline({...editingTimeline, title: e.target.value})}
                      placeholder="गावाची स्थापना"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timelineTitleEn">शीर्षक (इंग्रजी)</Label>
                    <Input
                      id="timelineTitleEn"
                      value={editingTimeline.titleEn}
                      onChange={(e) => setEditingTimeline({...editingTimeline, titleEn: e.target.value})}
                      placeholder="Village Foundation"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="timelineDescription">वर्णन (मराठी)</Label>
                  <Textarea
                    id="timelineDescription"
                    value={editingTimeline.description}
                    onChange={(e) => setEditingTimeline({...editingTimeline, description: e.target.value})}
                    placeholder="आमच्या गावाची स्थापना आणि पहिले निवासी"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="timelineDescriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="timelineDescriptionEn"
                    value={editingTimeline.descriptionEn}
                    onChange={(e) => setEditingTimeline({...editingTimeline, descriptionEn: e.target.value})}
                    placeholder="Foundation of our village and first residents"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => {
                  setEditingTimeline(null);
                  setIsAddingTimeline(false);
                }}>
                  रद्द करा
                </Button>
                <Button onClick={handleSaveTimeline}>
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cultural Heritage Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">सांस्कृतिक वारसा</h2>
            <p className="text-gray-600 mt-1">सांस्कृतिक उत्सव आणि परंपरागत कला व्यवस्थापन</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {heritage.length} आयटम
            </Badge>
            <Button onClick={() => {
              setEditingHeritage({
                id: '',
                title: '',
                titleEn: '',
                description: '',
                descriptionEn: '',
                image: '',
                category: 'सांस्कृतिक'
              });
              setIsAddingHeritage(true);
            }} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              नवीन आयटम
            </Button>
          </div>
        </div>

        {isLoadingHeritage ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">लोड होत आहे...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heritage.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500">
                      सांस्कृतिक
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingHeritage(item);
                        setIsAddingHeritage(false);
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      संपादन
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteHeritage(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Heritage Modal */}
        {editingHeritage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>{isAddingHeritage ? 'नवीन आयटम जोडा' : 'आयटम संपादित करा'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heritageTitle">शीर्षक (मराठी)</Label>
                    <Input
                      id="heritageTitle"
                      value={editingHeritage.title}
                      onChange={(e) => setEditingHeritage({...editingHeritage, title: e.target.value})}
                      placeholder="गणेशोत्सव"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heritageTitleEn">शीर्षक (इंग्रजी)</Label>
                    <Input
                      id="heritageTitleEn"
                      value={editingHeritage.titleEn}
                      onChange={(e) => setEditingHeritage({...editingHeritage, titleEn: e.target.value})}
                      placeholder="Ganesh Festival"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heritageDescription">वर्णन (मराठी)</Label>
                    <Textarea
                      id="heritageDescription"
                      value={editingHeritage.description}
                      onChange={(e) => setEditingHeritage({...editingHeritage, description: e.target.value})}
                      placeholder="गावातील सर्वात मोठा सांस्कृतिक उत्सव"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="heritageDescriptionEn">वर्णन (इंग्रजी)</Label>
                    <Textarea
                      id="heritageDescriptionEn"
                      value={editingHeritage.descriptionEn}
                      onChange={(e) => setEditingHeritage({...editingHeritage, descriptionEn: e.target.value})}
                      placeholder="The biggest cultural festival of the village"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="heritageImage">प्रतिमा</Label>
                  <div className="mt-2">
                    {editingHeritage.image && (
                      <img
                        src={editingHeritage.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <input
                      type="file"
                      id="heritageImage"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setIsUploadingHeritageImage(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          const uploadResponse = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });
                          
                          if (uploadResponse.ok) {
                            const result = await uploadResponse.json();
                            setEditingHeritage(prev => prev ? { ...prev, image: result.imageUrl || result.url } : null);
                            toast.success('प्रतिमा अपलोड केली');
                          } else {
                            throw new Error('Upload failed');
                          }
                        } catch (err: any) {
                          console.error('Upload error:', err);
                          toast.error(err.message || 'अपलोड अयशस्वी');
                        } finally {
                          setIsUploadingHeritageImage(false);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="heritageImage"
                      className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">प्रतिमा अपलोड करा</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => {
                    setEditingHeritage(null);
                    setIsAddingHeritage(false);
                  }}>
                    रद्द करा
                  </Button>
                  <Button onClick={handleSaveHeritage} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    सेव्ह करा
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer Content Management Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Footer Content Management</h2>
            <p className="text-gray-600 mt-1">Manage footer description and social media links</p>
          </div>
        </div>

        {/* Footer Description */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Description</CardTitle>
            <CardDescription>
              Edit the description text that appears in the footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footerDescription">Description (Marathi)</Label>
                <Textarea
                  id="footerDescription"
                  value={footerContent.description}
                  onChange={(e) => setFooterContent({ ...footerContent, description: e.target.value })}
                  placeholder="Enter footer description..."
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Manage contact information that appears in the footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="officeName">Office Name</Label>
                <Input
                  id="officeName"
                  value={footerContent.officeName}
                  onChange={(e) => setFooterContent({ ...footerContent, officeName: e.target.value })}
                  placeholder="ग्रामपंचायत कार्यालय"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={footerContent.address}
                  onChange={(e) => setFooterContent({ ...footerContent, address: e.target.value })}
                  placeholder="गाव, तालुका, जिल्हा\nमहाराष्ट्र, भारत"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={footerContent.phone}
                    onChange={(e) => setFooterContent({ ...footerContent, phone: e.target.value })}
                    placeholder="+91 12345 67890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={footerContent.email}
                    onChange={(e) => setFooterContent({ ...footerContent, email: e.target.value })}
                    placeholder="info@grampanchayat.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={footerContent.website}
                  onChange={(e) => setFooterContent({ ...footerContent, website: e.target.value })}
                  placeholder="mahagp.in"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Manage social media links that appear in the footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {footerContent.socialMedia.map((link, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`platform-${index}`}>Platform</Label>
                      <Input
                        id={`platform-${index}`}
                        value={link.platform}
                        onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                        placeholder="facebook, twitter, instagram"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`url-${index}`}>URL</Label>
                      <Input
                        id={`url-${index}`}
                        value={link.url}
                        onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`icon-${index}`}>Icon</Label>
                      <Input
                        id={`icon-${index}`}
                        value={link.icon}
                        onChange={(e) => handleSocialMediaChange(index, 'icon', e.target.value)}
                        placeholder="Facebook, Twitter, Instagram"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSocialMediaLink(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addSocialMediaLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Social Media Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Government Branding */}
        <Card>
          <CardHeader>
            <CardTitle>सरकारी ब्रँडिंग (फुटर)</CardTitle>
            <CardDescription>
              फुटरमधील सरकारी लोगो आणि मजकूर व्यवस्थापन
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Satyamev Jayate Logo */}
              <div className="space-y-3">
                <Label>Satyamev Jayate लोगो</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input 
                      value={footerContent.footerSatyamevJayateLogoUrl || ''}
                      onChange={(e) => setFooterContent(prev => ({ ...prev, footerSatyamevJayateLogoUrl: e.target.value }))}
                      placeholder="/images/gov-logos/satyamev_jayate_logo.png" 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {uploadingFooter.satyamev ? 'अपलोड करत आहे...' : 'फाइल निवडा'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFooterFileUpload(file, 'satyamev');
                        }}
                        disabled={uploadingFooter.satyamev}
                      />
                    </label>
                    {footerContent.footerSatyamevJayateLogoUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFooterContent(prev => ({ ...prev, footerSatyamevJayateLogoUrl: '' }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {footerContent.footerSatyamevJayateLogoUrl && (
                  <div className="mt-2">
                    <div className="inline-block p-2 border rounded-lg bg-gray-50">
                      <img
                        src={footerContent.footerSatyamevJayateLogoUrl}
                        alt="Satyamev Jayate Preview"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Digital India Logo */}
              <div className="space-y-3">
                <Label>Digital India लोगो</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input 
                      value={footerContent.footerDigitalIndiaLogoUrl || ''}
                      onChange={(e) => setFooterContent(prev => ({ ...prev, footerDigitalIndiaLogoUrl: e.target.value }))}
                      placeholder="/images/gov-logos/digital-india.png" 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {uploadingFooter.digitalIndia ? 'अपलोड करत आहे...' : 'फाइल निवडा'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFooterFileUpload(file, 'digitalIndia');
                        }}
                        disabled={uploadingFooter.digitalIndia}
                      />
                    </label>
                    {footerContent.footerDigitalIndiaLogoUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFooterContent(prev => ({ ...prev, footerDigitalIndiaLogoUrl: '' }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {footerContent.footerDigitalIndiaLogoUrl && (
                  <div className="mt-2">
                    <div className="inline-block p-2 border rounded-lg bg-gray-50">
                      <img
                        src={footerContent.footerDigitalIndiaLogoUrl}
                        alt="Digital India Preview"
                        width={80}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Government Department Text */}
              <div className="space-y-2">
                <Label htmlFor="footerGovDeptText">विभाग मजकूर</Label>
                <Input
                  id="footerGovDeptText"
                  value={footerContent.footerGovDeptText || ''}
                  onChange={(e) => setFooterContent(prev => ({ ...prev, footerGovDeptText: e.target.value }))}
                  placeholder="शासन महाराष्ट्र • ग्रामीण विकास विभाग"
                />
                <p className="text-xs text-gray-500">हे मजकूर फुटरमधील सरकारी ब्रँडिंग विभागात दिसेल</p>
              </div>

              {/* Ownership Text */}
              <div className="space-y-2">
                <Label htmlFor="footerOwnershipText">मालकी मजकूर</Label>
                <Input
                  id="footerOwnershipText"
                  value={footerContent.footerOwnershipText || ''}
                  onChange={(e) => setFooterContent(prev => ({ ...prev, footerOwnershipText: e.target.value }))}
                  placeholder="या संकेतस्थळाचे मालक: ग्रामपंचायत कार्यालय"
                />
                <p className="text-xs text-gray-500">हे मजकूर फुटरमधील मालकी विभागात दिसेल</p>
              </div>

              {/* File Upload Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">फाइल अपलोड माहिती</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      • JPG, PNG, WebP स्वरूपातील प्रतिमा स्वीकारल्या जातात<br/>
                      • कमाल फाइल आकार: 5MB<br/>
                      • लोगो साठी शिफारस केलेले आकार: Satyamev Jayate (40x40px), Digital India (80x32px)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveFooter}
            disabled={isSavingFooter}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSavingFooter ? 'Saving...' : 'Save Footer Content'}
          </Button>
        </div>
      </div>

      {/* Village Info Form Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">गाव माहिती</h2>
          <p className="text-gray-600 mt-1">गावाची मुख्य माहिती आणि आकडेवारी व्यवस्थापन</p>
        </div>
        <VillageInfoForm />
      </div>
    </div>
  );
}
