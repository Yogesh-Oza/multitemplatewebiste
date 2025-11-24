'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, School, Award, Trophy, Lightbulb, Users, Star, Phone, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  schoolsDemoData,
  scholarshipSchemesDemoData,
  studentAchievementsDemoData,
  careerGuidanceDemoData,
  nssActivitiesDemoData,
  youthSuccessStoriesDemoData,
  educationContactInfoDemoData,
  SchoolData,
  ScholarshipSchemeData,
  StudentAchievementData,
  CareerGuidanceData,
  NSSActivityData,
  YouthSuccessStoryData,
  EducationContactInfoData
} from '@/lib/demo-education-youth';

type TabType = 'schools' | 'scholarships' | 'achievements' | 'career' | 'nss' | 'youth' | 'contact';

const emptySchool: SchoolData = {
  name: '',
  nameEn: '',
  type: '',
  typeEn: '',
  students: 0,
  teachers: 0,
  classes: '',
  established: '',
  contact: '',
  address: '',
  addressEn: '',
  facilities: [],
  facilitiesEn: [],
  achievements: [],
  achievementsEn: [],
  order: 0,
  isActive: true
};

const emptyScholarship: ScholarshipSchemeData = {
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  amount: '',
  eligibility: '',
  eligibilityEn: '',
  lastDate: '',
  category: '',
  categoryEn: '',
  order: 0,
  isActive: true
};

const emptyAchievement: StudentAchievementData = {
  name: '',
  nameEn: '',
  class: '',
  classEn: '',
  achievement: '',
  achievementEn: '',
  year: '',
  category: '',
  categoryEn: '',
  school: '',
  schoolEn: '',
  order: 0,
  isActive: true
};

const emptyCareer: CareerGuidanceData = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  duration: '',
  durationEn: '',
  date: '',
  time: '',
  speaker: '',
  speakerEn: '',
  type: '',
  typeEn: '',
  order: 0,
  isActive: true
};

const emptyNSS: NSSActivityData = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  date: '',
  participants: 0,
  impact: '',
  impactEn: '',
  status: '',
  order: 0,
  isActive: true
};

const emptyYouth: YouthSuccessStoryData = {
  name: '',
  nameEn: '',
  age: 0,
  story: '',
  storyEn: '',
  achievement: '',
  achievementEn: '',
  current: '',
  currentEn: '',
  status: '',
  order: 0,
  isActive: true
};

const emptyContact: EducationContactInfoData = {
  section: 'education',
  officeName: '',
  officeNameEn: '',
  phone: '',
  address: '',
  addressEn: '',
  isActive: true
};

export default function EducationYouthAdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('schools');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [schools, setSchools] = useState<SchoolData[]>(schoolsDemoData);
  const [scholarships, setScholarships] = useState<ScholarshipSchemeData[]>(scholarshipSchemesDemoData);
  const [achievements, setAchievements] = useState<StudentAchievementData[]>(studentAchievementsDemoData);
  const [careerSessions, setCareerSessions] = useState<CareerGuidanceData[]>(careerGuidanceDemoData);
  const [nssActivities, setNssActivities] = useState<NSSActivityData[]>(nssActivitiesDemoData);
  const [youthStories, setYouthStories] = useState<YouthSuccessStoryData[]>(youthSuccessStoriesDemoData);
  const [contacts, setContacts] = useState<EducationContactInfoData[]>(educationContactInfoDemoData);
  
  const [isDemo, setIsDemo] = useState(true);
  
  // Modal states
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [scholarshipModalOpen, setScholarshipModalOpen] = useState(false);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [nssModalOpen, setNssModalOpen] = useState(false);
  const [youthModalOpen, setYouthModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  // Form states
  const [schoolForm, setSchoolForm] = useState<SchoolData>(emptySchool);
  const [scholarshipForm, setScholarshipForm] = useState<ScholarshipSchemeData>(emptyScholarship);
  const [achievementForm, setAchievementForm] = useState<StudentAchievementData>(emptyAchievement);
  const [careerForm, setCareerForm] = useState<CareerGuidanceData>(emptyCareer);
  const [nssForm, setNssForm] = useState<NSSActivityData>(emptyNSS);
  const [youthForm, setYouthForm] = useState<YouthSuccessStoryData>(emptyYouth);
  const [contactForm, setContactForm] = useState<EducationContactInfoData>(emptyContact);
  
  // Editing states
  const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);
  const [editingScholarship, setEditingScholarship] = useState<ScholarshipSchemeData | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<StudentAchievementData | null>(null);
  const [editingCareer, setEditingCareer] = useState<CareerGuidanceData | null>(null);
  const [editingNSS, setEditingNSS] = useState<NSSActivityData | null>(null);
  const [editingYouth, setEditingYouth] = useState<YouthSuccessStoryData | null>(null);
  const [editingContact, setEditingContact] = useState<EducationContactInfoData | null>(null);
  
  // Array input states
  const [facilityInput, setFacilityInput] = useState('');
  const [facilityEnInput, setFacilityEnInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [achievementEnInput, setAchievementEnInput] = useState('');
  
  // Image upload states
  const [isUploadingSchoolImage, setIsUploadingSchoolImage] = useState(false);
  const [isUploadingAchievementImage, setIsUploadingAchievementImage] = useState(false);
  const [isUploadingYouthImage, setIsUploadingYouthImage] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [schoolsRes, scholarshipsRes, achievementsRes, careerRes, nssRes, youthRes, contactsRes] = await Promise.all([
        fetch('/api/schools'),
        fetch('/api/scholarship-schemes'),
        fetch('/api/student-achievements'),
        fetch('/api/career-guidance'),
        fetch('/api/nss-activities'),
        fetch('/api/youth-success-stories'),
        fetch('/api/education-contact')
      ]);

      if (schoolsRes.ok) {
        const data = await schoolsRes.json();
        setSchools(data.schools?.length ? data.schools : schoolsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (scholarshipsRes.ok) {
        const data = await scholarshipsRes.json();
        setScholarships(data.schemes?.length ? data.schemes : scholarshipSchemesDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (achievementsRes.ok) {
        const data = await achievementsRes.json();
        setAchievements(data.achievements?.length ? data.achievements : studentAchievementsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (careerRes.ok) {
        const data = await careerRes.json();
        setCareerSessions(data.sessions?.length ? data.sessions : careerGuidanceDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (nssRes.ok) {
        const data = await nssRes.json();
        setNssActivities(data.activities?.length ? data.activities : nssActivitiesDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (youthRes.ok) {
        const data = await youthRes.json();
        setYouthStories(data.stories?.length ? data.stories : youthSuccessStoriesDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data.contacts?.length ? data.contacts : educationContactInfoDemoData);
        if (data.isDemo) setIsDemo(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('डेटा लोड करताना त्रुटी आली');
    } finally {
      setLoading(false);
    }
  };

  // School Management Functions
  const openSchoolModal = (school?: SchoolData) => {
    if (school) {
      setEditingSchool(school);
      setSchoolForm(school);
    } else {
      setEditingSchool(null);
      setSchoolForm(emptySchool);
    }
    setSchoolModalOpen(true);
  };

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingSchool ? 'PUT' : 'POST';
      const body = editingSchool ? { ...schoolForm, id: editingSchool.id } : schoolForm;

      const response = await fetch('/api/schools', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save school');

      toast.success(editingSchool ? 'शाळा अपडेट केली' : 'नवीन शाळा जोडली');
      setSchoolModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('शाळा जतन करताना त्रुटी आली');
    }
  };

  const handleSchoolDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('ही शाळा हटवायची आहे?')) return;

    try {
      const response = await fetch(`/api/schools?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('शाळा हटवली');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('शाळा हटवताना त्रुटी आली');
    }
  };

  const handleSchoolImageUpload = async (file: File) => {
    setIsUploadingSchoolImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'schools');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setSchoolForm(prev => ({ ...prev, imageUrl: data.url }));
      toast.success('प्रतिमा अपलोड केली');
    } catch (error) {
      console.error(error);
      toast.error('प्रतिमा अपलोड करताना त्रुटी आली');
    } finally {
      setIsUploadingSchoolImage(false);
    }
  };

  const addFacility = () => {
    if (facilityInput.trim() && facilityEnInput.trim()) {
      setSchoolForm(prev => ({
        ...prev,
        facilities: [...(prev.facilities || []), facilityInput.trim()],
        facilitiesEn: [...(prev.facilitiesEn || []), facilityEnInput.trim()]
      }));
      setFacilityInput('');
      setFacilityEnInput('');
    }
  };

  const removeFacility = (index: number) => {
    setSchoolForm(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
      facilitiesEn: prev.facilitiesEn.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim() && achievementEnInput.trim()) {
      setSchoolForm(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), achievementInput.trim()],
        achievementsEn: [...(prev.achievementsEn || []), achievementEnInput.trim()]
      }));
      setAchievementInput('');
      setAchievementEnInput('');
    }
  };

  const removeAchievement = (index: number) => {
    setSchoolForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
      achievementsEn: prev.achievementsEn.filter((_, i) => i !== index)
    }));
  };

  // Scholarship Management Functions
  const openScholarshipModal = (scholarship?: ScholarshipSchemeData) => {
    if (scholarship) {
      setEditingScholarship(scholarship);
      setScholarshipForm(scholarship);
    } else {
      setEditingScholarship(null);
      setScholarshipForm(emptyScholarship);
    }
    setScholarshipModalOpen(true);
  };

  const handleScholarshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingScholarship ? 'PUT' : 'POST';
      const body = editingScholarship ? { ...scholarshipForm, id: editingScholarship.id } : scholarshipForm;

      const response = await fetch('/api/scholarship-schemes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save scholarship');

      toast.success(editingScholarship ? 'शिष्यवृत्ती अपडेट केली' : 'नवीन शिष्यवृत्ती जोडली');
      setScholarshipModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('शिष्यवृत्ती जतन करताना त्रुटी आली');
    }
  };

  const handleScholarshipDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('ही शिष्यवृत्ती हटवायची आहे?')) return;

    try {
      const response = await fetch(`/api/scholarship-schemes?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('शिष्यवृत्ती हटवली');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('शिष्यवृत्ती हटवताना त्रुटी आली');
    }
  };

  // Achievement Management Functions
  const openAchievementModal = (achievement?: StudentAchievementData) => {
    if (achievement) {
      setEditingAchievement(achievement);
      setAchievementForm(achievement);
    } else {
      setEditingAchievement(null);
      setAchievementForm(emptyAchievement);
    }
    setAchievementModalOpen(true);
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAchievement ? 'PUT' : 'POST';
      const body = editingAchievement ? { ...achievementForm, id: editingAchievement.id } : achievementForm;

      const response = await fetch('/api/student-achievements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save achievement');

      toast.success(editingAchievement ? 'उपलब्धी अपडेट केली' : 'नवीन उपलब्धी जोडली');
      setAchievementModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('उपलब्धी जतन करताना त्रुटी आली');
    }
  };

  const handleAchievementDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('ही उपलब्धी हटवायची आहे?')) return;

    try {
      const response = await fetch(`/api/student-achievements?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('उपलब्धी हटवली');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('उपलब्धी हटवताना त्रुटी आली');
    }
  };

  const handleAchievementImageUpload = async (file: File) => {
    setIsUploadingAchievementImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'achievements');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setAchievementForm(prev => ({ ...prev, imageUrl: data.url }));
      toast.success('प्रतिमा अपलोड केली');
    } catch (error) {
      console.error(error);
      toast.error('प्रतिमा अपलोड करताना त्रुटी आली');
    } finally {
      setIsUploadingAchievementImage(false);
    }
  };

  // Career Guidance Management Functions
  const openCareerModal = (session?: CareerGuidanceData) => {
    if (session) {
      setEditingCareer(session);
      setCareerForm(session);
    } else {
      setEditingCareer(null);
      setCareerForm(emptyCareer);
    }
    setCareerModalOpen(true);
  };

  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCareer ? 'PUT' : 'POST';
      const body = editingCareer ? { ...careerForm, id: editingCareer.id } : careerForm;

      const response = await fetch('/api/career-guidance', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save session');

      toast.success(editingCareer ? 'करिअर मार्गदर्शन अपडेट केले' : 'नवीन करिअर मार्गदर्शन जोडले');
      setCareerModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('करिअर मार्गदर्शन जतन करताना त्रुटी आली');
    }
  };

  const handleCareerDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे करिअर मार्गदर्शन हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/career-guidance?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('करिअर मार्गदर्शन हटवले');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('करिअर मार्गदर्शन हटवताना त्रुटी आली');
    }
  };

  // NSS Activity Management Functions
  const openNSSModal = (activity?: NSSActivityData) => {
    if (activity) {
      setEditingNSS(activity);
      setNssForm(activity);
    } else {
      setEditingNSS(null);
      setNssForm(emptyNSS);
    }
    setNssModalOpen(true);
  };

  const handleNSSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingNSS ? 'PUT' : 'POST';
      const body = editingNSS ? { ...nssForm, id: editingNSS.id } : nssForm;

      const response = await fetch('/api/nss-activities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save activity');

      toast.success(editingNSS ? 'NSS उपक्रम अपडेट केला' : 'नवीन NSS उपक्रम जोडला');
      setNssModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('NSS उपक्रम जतन करताना त्रुटी आली');
    }
  };

  const handleNSSDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे NSS उपक्रम हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/nss-activities?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('NSS उपक्रम हटवला');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('NSS उपक्रम हटवताना त्रुटी आली');
    }
  };

  // Youth Success Story Management Functions
  const openYouthModal = (story?: YouthSuccessStoryData) => {
    if (story) {
      setEditingYouth(story);
      setYouthForm(story);
    } else {
      setEditingYouth(null);
      setYouthForm(emptyYouth);
    }
    setYouthModalOpen(true);
  };

  const handleYouthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingYouth ? 'PUT' : 'POST';
      const body = editingYouth ? { ...youthForm, id: editingYouth.id } : youthForm;

      const response = await fetch('/api/youth-success-stories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save story');

      toast.success(editingYouth ? 'यशोगाथा अपडेट केली' : 'नवीन यशोगाथा जोडली');
      setYouthModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('यशोगाथा जतन करताना त्रुटी आली');
    }
  };

  const handleYouthDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('ही यशोगाथा हटवायची आहे?')) return;

    try {
      const response = await fetch(`/api/youth-success-stories?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('यशोगाथा हटवली');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('यशोगाथा हटवताना त्रुटी आली');
    }
  };

  const handleYouthImageUpload = async (file: File) => {
    setIsUploadingYouthImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'youth');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setYouthForm(prev => ({ ...prev, imageUrl: data.url }));
      toast.success('प्रतिमा अपलोड केली');
    } catch (error) {
      console.error(error);
      toast.error('प्रतिमा अपलोड करताना त्रुटी आली');
    } finally {
      setIsUploadingYouthImage(false);
    }
  };

  // Contact Management Functions
  const openContactModal = (contact?: EducationContactInfoData) => {
    if (contact) {
      setEditingContact(contact);
      setContactForm(contact);
    } else {
      setEditingContact(null);
      setContactForm(emptyContact);
    }
    setContactModalOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = contactForm;

      const response = await fetch('/api/education-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save contact');

      toast.success(editingContact ? 'संपर्क अपडेट केला' : 'नवीन संपर्क जोडला');
      setContactModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('संपर्क जतन करताना त्रुटी आली');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'schools' as TabType, label: 'शाळा', icon: School },
    { id: 'scholarships' as TabType, label: 'शिष्यवृत्ती', icon: Award },
    { id: 'achievements' as TabType, label: 'उपलब्धी', icon: Trophy },
    { id: 'career' as TabType, label: 'करिअर मार्गदर्शन', icon: Lightbulb },
    { id: 'nss' as TabType, label: 'NSS उपक्रम', icon: Users },
    { id: 'youth' as TabType, label: 'युवक यशोगाथा', icon: Star },
    { id: 'contact' as TabType, label: 'संपर्क', icon: Phone }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">शिक्षण आणि युवक कोपरा</h1>
        <p className="text-gray-600 mt-2">
          शाळा, शिष्यवृत्ती, करिअर मार्गदर्शन आणि युवक उपक्रम व्यवस्थापन
        </p>
        {isDemo && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              सध्या तुम्ही डेमो डेटा पाहत आहात. माहिती जतन केल्यावर हे विभाग तुमच्या गावाच्या वास्तविक
              माहितीने भरले जाईल.
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content - Schools */}
      {activeTab === 'schools' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>शाळा</CardTitle>
                <CardDescription>शाळांची माहिती व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openSchoolModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन शाळा
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schools.map((school) => (
                <div key={school.id || school.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{school.name}</h4>
                    <p className="text-sm text-gray-600">{school.type} - {school.students} विद्यार्थी</p>
                    <Badge variant={school.isActive ? 'default' : 'secondary'} className="mt-2">
                      {school.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openSchoolModal(school)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSchoolDelete(school.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scholarships Tab */}
      {activeTab === 'scholarships' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>शिष्यवृत्ती योजना</CardTitle>
                <CardDescription>शिष्यवृत्ती योजना व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openScholarshipModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन शिष्यवृत्ती
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scholarships.map((scholarship) => (
                <div key={scholarship.id || scholarship.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{scholarship.name}</h4>
                    <p className="text-sm text-gray-600">{scholarship.amount}</p>
                    <Badge variant={scholarship.isActive ? 'default' : 'secondary'} className="mt-2">
                      {scholarship.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openScholarshipModal(scholarship)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleScholarshipDelete(scholarship.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>विद्यार्थी उपलब्धी</CardTitle>
                <CardDescription>विद्यार्थी उपलब्धी व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openAchievementModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन उपलब्धी
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id || achievement.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.achievement}</p>
                    <Badge variant={achievement.isActive ? 'default' : 'secondary'} className="mt-2">
                      {achievement.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openAchievementModal(achievement)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAchievementDelete(achievement.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career Guidance Tab */}
      {activeTab === 'career' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>करिअर मार्गदर्शन</CardTitle>
                <CardDescription>करिअर मार्गदर्शन सत्र व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openCareerModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन सत्र
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerSessions.map((session) => (
                <div key={session.id || session.title} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{session.title}</h4>
                    <p className="text-sm text-gray-600">{session.date} - {session.time}</p>
                    <Badge variant={session.isActive ? 'default' : 'secondary'} className="mt-2">
                      {session.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openCareerModal(session)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCareerDelete(session.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* NSS Activities Tab */}
      {activeTab === 'nss' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>NSS उपक्रम</CardTitle>
                <CardDescription>NSS उपक्रम व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openNSSModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन उपक्रम
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nssActivities.map((activity) => (
                <div key={activity.id || activity.title} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.date} - {activity.participants} सहभागी</p>
                    <Badge variant={activity.isActive ? 'default' : 'secondary'} className="mt-2">
                      {activity.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openNSSModal(activity)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleNSSDelete(activity.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Youth Success Stories Tab */}
      {activeTab === 'youth' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>युवक यशोगाथा</CardTitle>
                <CardDescription>युवक यशोगाथा व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openYouthModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन यशोगाथा
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {youthStories.map((story) => (
                <div key={story.id || story.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.achievement}</p>
                    <Badge variant={story.isActive ? 'default' : 'secondary'} className="mt-2">
                      {story.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openYouthModal(story)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleYouthDelete(story.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information Tab */}
      {activeTab === 'contact' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>संपर्क माहिती</CardTitle>
                <CardDescription>प्रत्येक विभागासाठी संपर्क माहिती व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openContactModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन संपर्क
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id || contact.section} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{contact.officeName}</h4>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    <Badge className="mt-2">{contact.section}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openContactModal(contact)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* School Modal */}
      {schoolModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingSchool ? 'शाळा संपादित करा' : 'नवीन शाळा जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setSchoolModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSchoolSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={schoolForm.name}
                      onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={schoolForm.nameEn}
                      onChange={(e) => setSchoolForm({ ...schoolForm, nameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>प्रकार (मराठी)</Label>
                    <Input
                      value={schoolForm.type}
                      onChange={(e) => setSchoolForm({ ...schoolForm, type: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रकार (English)</Label>
                    <Input
                      value={schoolForm.typeEn}
                      onChange={(e) => setSchoolForm({ ...schoolForm, typeEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label>विद्यार्थी</Label>
                    <Input
                      type="number"
                      value={schoolForm.students}
                      onChange={(e) => setSchoolForm({ ...schoolForm, students: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शिक्षक</Label>
                    <Input
                      type="number"
                      value={schoolForm.teachers}
                      onChange={(e) => setSchoolForm({ ...schoolForm, teachers: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वर्ग</Label>
                    <Input
                      value={schoolForm.classes}
                      onChange={(e) => setSchoolForm({ ...schoolForm, classes: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थापना वर्ष</Label>
                    <Input
                      value={schoolForm.established}
                      onChange={(e) => setSchoolForm({ ...schoolForm, established: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>संपर्क</Label>
                    <Input
                      value={schoolForm.contact}
                      onChange={(e) => setSchoolForm({ ...schoolForm, contact: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शाळा प्रतिमा URL (Optional)</Label>
                    <Input
                      value={schoolForm.imageUrl || ''}
                      onChange={(e) => setSchoolForm({ ...schoolForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <Label>पत्ता (मराठी)</Label>
                  <Textarea
                    value={schoolForm.address}
                    onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>पत्ता (English)</Label>
                  <Textarea
                    value={schoolForm.addressEn}
                    onChange={(e) => setSchoolForm({ ...schoolForm, addressEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>सुविधा</Label>
                  <div className="space-y-2">
                    {schoolForm.facilities?.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={facility} readOnly />
                        <Input value={schoolForm.facilitiesEn[index]} readOnly />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeFacility(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={facilityInput}
                        onChange={(e) => setFacilityInput(e.target.value)}
                        placeholder="सुविधा (मराठी)"
                      />
                      <Input
                        value={facilityEnInput}
                        onChange={(e) => setFacilityEnInput(e.target.value)}
                        placeholder="Facility (English)"
                      />
                      <Button type="button" onClick={addFacility}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>उपलब्धी</Label>
                  <div className="space-y-2">
                    {schoolForm.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={achievement} readOnly />
                        <Input value={schoolForm.achievementsEn[index]} readOnly />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeAchievement(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={achievementInput}
                        onChange={(e) => setAchievementInput(e.target.value)}
                        placeholder="उपलब्धी (मराठी)"
                      />
                      <Input
                        value={achievementEnInput}
                        onChange={(e) => setAchievementEnInput(e.target.value)}
                        placeholder="Achievement (English)"
                      />
                      <Button type="button" onClick={addAchievement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={schoolForm.isActive}
                      onChange={(e) => setSchoolForm({ ...schoolForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={schoolForm.order}
                      onChange={(e) => setSchoolForm({ ...schoolForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setSchoolModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Scholarship Modal */}
      {scholarshipModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingScholarship ? 'शिष्यवृत्ती संपादित करा' : 'नवीन शिष्यवृत्ती जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setScholarshipModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleScholarshipSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={scholarshipForm.name}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={scholarshipForm.nameEn}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, nameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={scholarshipForm.description}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={scholarshipForm.descriptionEn}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>रक्कम</Label>
                    <Input
                      value={scholarshipForm.amount}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शेवटची तारीख</Label>
                    <Input
                      type="date"
                      value={scholarshipForm.lastDate}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, lastDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>अर्ज URL (Optional)</Label>
                    <Input
                      value={scholarshipForm.applicationUrl || ''}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, applicationUrl: e.target.value })}
                      placeholder="https://example.com/apply"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वर्ग (मराठी)</Label>
                    <Input
                      value={scholarshipForm.category}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वर्ग (English)</Label>
                    <Input
                      value={scholarshipForm.categoryEn}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, categoryEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>पात्रता (मराठी)</Label>
                  <Textarea
                    value={scholarshipForm.eligibility}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, eligibility: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>पात्रता (English)</Label>
                  <Textarea
                    value={scholarshipForm.eligibilityEn}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, eligibilityEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scholarshipForm.isActive}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={scholarshipForm.order}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setScholarshipModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {achievementModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingAchievement ? 'उपलब्धी संपादित करा' : 'नवीन उपलब्धी जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setAchievementModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleAchievementSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={achievementForm.name}
                      onChange={(e) => setAchievementForm({ ...achievementForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={achievementForm.nameEn}
                      onChange={(e) => setAchievementForm({ ...achievementForm, nameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वर्ग (मराठी)</Label>
                    <Input
                      value={achievementForm.class}
                      onChange={(e) => setAchievementForm({ ...achievementForm, class: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वर्ग (English)</Label>
                    <Input
                      value={achievementForm.classEn}
                      onChange={(e) => setAchievementForm({ ...achievementForm, classEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वर्ष</Label>
                    <Input
                      value={achievementForm.year}
                      onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रतिमा URL (Optional)</Label>
                    <Input
                      value={achievementForm.imageUrl || ''}
                      onChange={(e) => setAchievementForm({ ...achievementForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शाळा (मराठी)</Label>
                    <Input
                      value={achievementForm.school}
                      onChange={(e) => setAchievementForm({ ...achievementForm, school: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शाळा (English)</Label>
                    <Input
                      value={achievementForm.schoolEn}
                      onChange={(e) => setAchievementForm({ ...achievementForm, schoolEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वर्ग (मराठी)</Label>
                    <Input
                      value={achievementForm.category}
                      onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वर्ग (English)</Label>
                    <Input
                      value={achievementForm.categoryEn}
                      onChange={(e) => setAchievementForm({ ...achievementForm, categoryEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>उपलब्धी (मराठी)</Label>
                  <Textarea
                    value={achievementForm.achievement}
                    onChange={(e) => setAchievementForm({ ...achievementForm, achievement: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>उपलब्धी (English)</Label>
                  <Textarea
                    value={achievementForm.achievementEn}
                    onChange={(e) => setAchievementForm({ ...achievementForm, achievementEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={achievementForm.isActive}
                      onChange={(e) => setAchievementForm({ ...achievementForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={achievementForm.order}
                      onChange={(e) => setAchievementForm({ ...achievementForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setAchievementModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Career Guidance Modal */}
      {careerModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingCareer ? 'करिअर मार्गदर्शन संपादित करा' : 'नवीन करिअर मार्गदर्शन जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setCareerModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleCareerSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={careerForm.title}
                      onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={careerForm.titleEn}
                      onChange={(e) => setCareerForm({ ...careerForm, titleEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={careerForm.description}
                    onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={careerForm.descriptionEn}
                    onChange={(e) => setCareerForm({ ...careerForm, descriptionEn: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>कालावधी (मराठी)</Label>
                    <Input
                      value={careerForm.duration}
                      onChange={(e) => setCareerForm({ ...careerForm, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>कालावधी (English)</Label>
                    <Input
                      value={careerForm.durationEn}
                      onChange={(e) => setCareerForm({ ...careerForm, durationEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>तारीख</Label>
                    <Input
                      type="date"
                      value={careerForm.date}
                      onChange={(e) => setCareerForm({ ...careerForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वेळ</Label>
                    <Input
                      value={careerForm.time}
                      onChange={(e) => setCareerForm({ ...careerForm, time: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नोंदणी URL (Optional)</Label>
                    <Input
                      value={careerForm.registrationUrl || ''}
                      onChange={(e) => setCareerForm({ ...careerForm, registrationUrl: e.target.value })}
                      placeholder="https://example.com/register"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वक्ता (मराठी)</Label>
                    <Input
                      value={careerForm.speaker}
                      onChange={(e) => setCareerForm({ ...careerForm, speaker: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वक्ता (English)</Label>
                    <Input
                      value={careerForm.speakerEn}
                      onChange={(e) => setCareerForm({ ...careerForm, speakerEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>प्रकार (मराठी)</Label>
                    <Input
                      value={careerForm.type}
                      onChange={(e) => setCareerForm({ ...careerForm, type: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रकार (English)</Label>
                    <Input
                      value={careerForm.typeEn}
                      onChange={(e) => setCareerForm({ ...careerForm, typeEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={careerForm.isActive}
                      onChange={(e) => setCareerForm({ ...careerForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={careerForm.order}
                      onChange={(e) => setCareerForm({ ...careerForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setCareerModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* NSS Activity Modal */}
      {nssModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingNSS ? 'NSS उपक्रम संपादित करा' : 'नवीन NSS उपक्रम जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setNssModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleNSSSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={nssForm.title}
                      onChange={(e) => setNssForm({ ...nssForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={nssForm.titleEn}
                      onChange={(e) => setNssForm({ ...nssForm, titleEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={nssForm.description}
                    onChange={(e) => setNssForm({ ...nssForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={nssForm.descriptionEn}
                    onChange={(e) => setNssForm({ ...nssForm, descriptionEn: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>तारीख</Label>
                    <Input
                      type="date"
                      value={nssForm.date}
                      onChange={(e) => setNssForm({ ...nssForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>सहभागी</Label>
                    <Input
                      type="number"
                      value={nssForm.participants}
                      onChange={(e) => setNssForm({ ...nssForm, participants: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थिती</Label>
                    <Input
                      value={nssForm.status}
                      onChange={(e) => setNssForm({ ...nssForm, status: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>परिणाम (मराठी)</Label>
                  <Textarea
                    value={nssForm.impact}
                    onChange={(e) => setNssForm({ ...nssForm, impact: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>परिणाम (English)</Label>
                  <Textarea
                    value={nssForm.impactEn}
                    onChange={(e) => setNssForm({ ...nssForm, impactEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={nssForm.isActive}
                      onChange={(e) => setNssForm({ ...nssForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={nssForm.order}
                      onChange={(e) => setNssForm({ ...nssForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setNssModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Youth Success Story Modal */}
      {youthModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingYouth ? 'यशोगाथा संपादित करा' : 'नवीन यशोगाथा जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setYouthModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleYouthSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={youthForm.name}
                      onChange={(e) => setYouthForm({ ...youthForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={youthForm.nameEn}
                      onChange={(e) => setYouthForm({ ...youthForm, nameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वय</Label>
                    <Input
                      type="number"
                      value={youthForm.age}
                      onChange={(e) => setYouthForm({ ...youthForm, age: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रतिमा URL (Optional)</Label>
                    <Input
                      value={youthForm.imageUrl || ''}
                      onChange={(e) => setYouthForm({ ...youthForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <Label>कथा (मराठी)</Label>
                  <Textarea
                    value={youthForm.story}
                    onChange={(e) => setYouthForm({ ...youthForm, story: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>कथा (English)</Label>
                  <Textarea
                    value={youthForm.storyEn}
                    onChange={(e) => setYouthForm({ ...youthForm, storyEn: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>उपलब्धी (मराठी)</Label>
                  <Input
                    value={youthForm.achievement}
                    onChange={(e) => setYouthForm({ ...youthForm, achievement: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>उपलब्धी (English)</Label>
                  <Input
                    value={youthForm.achievementEn}
                    onChange={(e) => setYouthForm({ ...youthForm, achievementEn: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>सध्याचे (मराठी)</Label>
                    <Input
                      value={youthForm.current}
                      onChange={(e) => setYouthForm({ ...youthForm, current: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>सध्याचे (English)</Label>
                    <Input
                      value={youthForm.currentEn}
                      onChange={(e) => setYouthForm({ ...youthForm, currentEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>स्थिती</Label>
                  <Input
                    value={youthForm.status}
                    onChange={(e) => setYouthForm({ ...youthForm, status: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={youthForm.isActive}
                      onChange={(e) => setYouthForm({ ...youthForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={youthForm.order}
                      onChange={(e) => setYouthForm({ ...youthForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setYouthModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingContact ? 'संपर्क संपादित करा' : 'नवीन संपर्क जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setContactModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Label>विभाग</Label>
                  <select
                    value={contactForm.section}
                    onChange={(e) => setContactForm({ ...contactForm, section: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="education">शिक्षण</option>
                    <option value="youth">युवक</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>कार्यालय नाव (मराठी)</Label>
                    <Input
                      value={contactForm.officeName}
                      onChange={(e) => setContactForm({ ...contactForm, officeName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>कार्यालय नाव (English)</Label>
                    <Input
                      value={contactForm.officeNameEn}
                      onChange={(e) => setContactForm({ ...contactForm, officeNameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>फोन</Label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>ईमेल (Optional)</Label>
                    <Input
                      type="email"
                      value={contactForm.email || ''}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>पत्ता (मराठी)</Label>
                  <Textarea
                    value={contactForm.address}
                    onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>पत्ता (English)</Label>
                  <Textarea
                    value={contactForm.addressEn}
                    onChange={(e) => setContactForm({ ...contactForm, addressEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactForm.isActive}
                    onChange={(e) => setContactForm({ ...contactForm, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label className="cursor-pointer">सक्रिय</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setContactModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


