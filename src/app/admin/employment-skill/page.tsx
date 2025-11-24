'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Briefcase, FileText, GraduationCap, Users, Star, Phone, X, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  jobOpportunitiesDemoData,
  tendersDemoData,
  trainingProgramsDemoData,
  fpoGroupsDemoData,
  villageTalentsDemoData,
  employmentContactInfoDemoData,
  JobOpportunityData,
  TenderData,
  TrainingProgramData,
  FPOGroupData,
  VillageTalentData,
  EmploymentContactInfoData
} from '@/lib/demo-employment-skill';

type TabType = 'jobs' | 'tenders' | 'training' | 'fpo' | 'talent' | 'contact';

const emptyJob: JobOpportunityData = {
  title: '',
  titleEn: '',
  organization: '',
  organizationEn: '',
  location: '',
  locationEn: '',
  type: '',
  typeEn: '',
  salary: '',
  experience: '',
  experienceEn: '',
  education: '',
  educationEn: '',
  description: '',
  descriptionEn: '',
  requirements: [],
  requirementsEn: [],
  postedDate: '',
  lastDate: '',
  isUrgent: false,
  order: 0,
  isActive: true
};

const emptyTender: TenderData = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  value: '',
  lastDate: '',
  category: '',
  categoryEn: '',
  requirements: '',
  requirementsEn: '',
  order: 0,
  isActive: true
};

const emptyTraining: TrainingProgramData = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  duration: '',
  durationEn: '',
  fee: '',
  feeEn: '',
  instructor: '',
  instructorEn: '',
  startDate: '',
  seats: 0,
  enrolled: 0,
  order: 0,
  isActive: true
};

const emptyFPO: FPOGroupData = {
  name: '',
  nameEn: '',
  members: 0,
  established: '',
  contact: '',
  activities: [],
  activitiesEn: [],
  achievements: '',
  achievementsEn: '',
  order: 0,
  isActive: true
};

const emptyTalent: VillageTalentData = {
  name: '',
  nameEn: '',
  skill: '',
  skillEn: '',
  experience: '',
  experienceEn: '',
  rating: 0,
  contact: '',
  services: [],
  servicesEn: [],
  order: 0,
  isActive: true
};

const emptyContact: EmploymentContactInfoData = {
  section: 'general',
  officeName: '',
  officeNameEn: '',
  phone: '',
  address: '',
  addressEn: '',
  isActive: true
};

export default function EmploymentSkillAdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [jobs, setJobs] = useState<JobOpportunityData[]>(jobOpportunitiesDemoData);
  const [tenders, setTenders] = useState<TenderData[]>(tendersDemoData);
  const [programs, setPrograms] = useState<TrainingProgramData[]>(trainingProgramsDemoData);
  const [fpoGroups, setFpoGroups] = useState<FPOGroupData[]>(fpoGroupsDemoData);
  const [talents, setTalents] = useState<VillageTalentData[]>(villageTalentsDemoData);
  const [contacts, setContacts] = useState<EmploymentContactInfoData[]>(employmentContactInfoDemoData);
  
  const [isDemo, setIsDemo] = useState(true);
  
  // Modal states
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [tenderModalOpen, setTenderModalOpen] = useState(false);
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);
  const [fpoModalOpen, setFpoModalOpen] = useState(false);
  const [talentModalOpen, setTalentModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  // Form states
  const [jobForm, setJobForm] = useState<JobOpportunityData>(emptyJob);
  const [tenderForm, setTenderForm] = useState<TenderData>(emptyTender);
  const [trainingForm, setTrainingForm] = useState<TrainingProgramData>(emptyTraining);
  const [fpoForm, setFpoForm] = useState<FPOGroupData>(emptyFPO);
  const [talentForm, setTalentForm] = useState<VillageTalentData>(emptyTalent);
  const [contactForm, setContactForm] = useState<EmploymentContactInfoData>(emptyContact);
  
  // Editing states
  const [editingJob, setEditingJob] = useState<JobOpportunityData | null>(null);
  const [editingTender, setEditingTender] = useState<TenderData | null>(null);
  const [editingTraining, setEditingTraining] = useState<TrainingProgramData | null>(null);
  const [editingFPO, setEditingFPO] = useState<FPOGroupData | null>(null);
  const [editingTalent, setEditingTalent] = useState<VillageTalentData | null>(null);
  const [editingContact, setEditingContact] = useState<EmploymentContactInfoData | null>(null);
  
  // Array input states
  const [requirementInput, setRequirementInput] = useState('');
  const [requirementEnInput, setRequirementEnInput] = useState('');
  const [activityInput, setActivityInput] = useState('');
  const [activityEnInput, setActivityEnInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [serviceEnInput, setServiceEnInput] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [jobsRes, tendersRes, programsRes, fpoRes, talentsRes, contactsRes] = await Promise.all([
        fetch('/api/job-opportunities'),
        fetch('/api/tenders'),
        fetch('/api/training-programs'),
        fetch('/api/fpo-groups'),
        fetch('/api/village-talent'),
        fetch('/api/employment-contact')
      ]);

      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data.jobs?.length ? data.jobs : jobOpportunitiesDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (tendersRes.ok) {
        const data = await tendersRes.json();
        setTenders(data.tenders?.length ? data.tenders : tendersDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (programsRes.ok) {
        const data = await programsRes.json();
        setPrograms(data.programs?.length ? data.programs : trainingProgramsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (fpoRes.ok) {
        const data = await fpoRes.json();
        setFpoGroups(data.groups?.length ? data.groups : fpoGroupsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (talentsRes.ok) {
        const data = await talentsRes.json();
        setTalents(data.talents?.length ? data.talents : villageTalentsDemoData);
        if (data.isDemo) setIsDemo(true);
      }

      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data.contacts?.length ? data.contacts : employmentContactInfoDemoData);
        if (data.isDemo) setIsDemo(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('डेटा लोड करताना त्रुटी आली');
    } finally {
      setLoading(false);
    }
  };

  // Job Management Functions
  const openJobModal = (job?: JobOpportunityData) => {
    if (job) {
      setEditingJob(job);
      setJobForm(job);
    } else {
      setEditingJob(null);
      setJobForm(emptyJob);
    }
    setJobModalOpen(true);
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingJob ? 'PUT' : 'POST';
      const body = editingJob ? { ...jobForm, id: editingJob.id } : jobForm;

      const response = await fetch('/api/job-opportunities', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save job');

      toast.success(editingJob ? 'नोकरी अपडेट केली' : 'नवीन नोकरी जोडली');
      setJobModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('नोकरी जतन करताना त्रुटी आली');
    }
  };

  const handleJobDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('ही नोकरी हटवायची आहे?')) return;

    try {
      const response = await fetch(`/api/job-opportunities?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('नोकरी हटवली');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('नोकरी हटवताना त्रुटी आली');
    }
  };

  const addRequirement = () => {
    if (requirementInput.trim() && requirementEnInput.trim()) {
      setJobForm(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), requirementInput.trim()],
        requirementsEn: [...(prev.requirementsEn || []), requirementEnInput.trim()]
      }));
      setRequirementInput('');
      setRequirementEnInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setJobForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
      requirementsEn: prev.requirementsEn.filter((_, i) => i !== index)
    }));
  };

  // Tender Management Functions
  const openTenderModal = (tender?: TenderData) => {
    if (tender) {
      setEditingTender(tender);
      setTenderForm(tender);
    } else {
      setEditingTender(null);
      setTenderForm(emptyTender);
    }
    setTenderModalOpen(true);
  };

  const handleTenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTender ? 'PUT' : 'POST';
      const body = editingTender ? { ...tenderForm, id: editingTender.id } : tenderForm;

      const response = await fetch('/api/tenders', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save tender');

      toast.success(editingTender ? 'निविदा अपडेट केली' : 'नवीन निविदा जोडली');
      setTenderModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('निविदा जतन करताना त्रुटी आली');
    }
  };

  const handleTenderDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('ही निविदा हटवायची आहे?')) return;

    try {
      const response = await fetch(`/api/tenders?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('निविदा हटवली');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('निविदा हटवताना त्रुटी आली');
    }
  };

  // Training Program Management Functions
  const openTrainingModal = (program?: TrainingProgramData) => {
    if (program) {
      setEditingTraining(program);
      setTrainingForm(program);
    } else {
      setEditingTraining(null);
      setTrainingForm(emptyTraining);
    }
    setTrainingModalOpen(true);
  };

  const handleTrainingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTraining ? 'PUT' : 'POST';
      const body = editingTraining ? { ...trainingForm, id: editingTraining.id } : trainingForm;

      const response = await fetch('/api/training-programs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save program');

      toast.success(editingTraining ? 'प्रशिक्षण अपडेट केले' : 'नवीन प्रशिक्षण जोडले');
      setTrainingModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('प्रशिक्षण जतन करताना त्रुटी आली');
    }
  };

  const handleTrainingDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे प्रशिक्षण हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/training-programs?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('प्रशिक्षण हटवले');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('प्रशिक्षण हटवताना त्रुटी आली');
    }
  };

  // FPO Group Management Functions
  const openFPOModal = (group?: FPOGroupData) => {
    if (group) {
      setEditingFPO(group);
      setFpoForm(group);
    } else {
      setEditingFPO(null);
      setFpoForm(emptyFPO);
    }
    setFpoModalOpen(true);
  };

  const handleFPOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingFPO ? 'PUT' : 'POST';
      const body = editingFPO ? { ...fpoForm, id: editingFPO.id } : fpoForm;

      const response = await fetch('/api/fpo-groups', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save group');

      toast.success(editingFPO ? 'FPO गट अपडेट केला' : 'नवीन FPO गट जोडला');
      setFpoModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('FPO गट जतन करताना त्रुटी आली');
    }
  };

  const handleFPODelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हा FPO गट हटवायचा आहे?')) return;

    try {
      const response = await fetch(`/api/fpo-groups?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('FPO गट हटवला');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('FPO गट हटवताना त्रुटी आली');
    }
  };

  const addActivity = () => {
    if (activityInput.trim() && activityEnInput.trim()) {
      setFpoForm(prev => ({
        ...prev,
        activities: [...(prev.activities || []), activityInput.trim()],
        activitiesEn: [...(prev.activitiesEn || []), activityEnInput.trim()]
      }));
      setActivityInput('');
      setActivityEnInput('');
    }
  };

  const removeActivity = (index: number) => {
    setFpoForm(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
      activitiesEn: prev.activitiesEn.filter((_, i) => i !== index)
    }));
  };

  // Talent Management Functions
  const openTalentModal = (talent?: VillageTalentData) => {
    if (talent) {
      setEditingTalent(talent);
      setTalentForm(talent);
    } else {
      setEditingTalent(null);
      setTalentForm(emptyTalent);
    }
    setTalentModalOpen(true);
  };

  const handleTalentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTalent ? 'PUT' : 'POST';
      const body = editingTalent ? { ...talentForm, id: editingTalent.id } : talentForm;

      const response = await fetch('/api/village-talent', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save talent');

      toast.success(editingTalent ? 'टॅलेंट अपडेट केले' : 'नवीन टॅलेंट जोडले');
      setTalentModalOpen(false);
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('टॅलेंट जतन करताना त्रुटी आली');
    }
  };

  const handleTalentDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('हे टॅलेंट हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/village-talent?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('टॅलेंट हटवले');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('टॅलेंट हटवताना त्रुटी आली');
    }
  };

  const addService = () => {
    if (serviceInput.trim() && serviceEnInput.trim()) {
      setTalentForm(prev => ({
        ...prev,
        services: [...(prev.services || []), serviceInput.trim()],
        servicesEn: [...(prev.servicesEn || []), serviceEnInput.trim()]
      }));
      setServiceInput('');
      setServiceEnInput('');
    }
  };

  const removeService = (index: number) => {
    setTalentForm(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
      servicesEn: prev.servicesEn.filter((_, i) => i !== index)
    }));
  };

  // Contact Management Functions
  const openContactModal = (contact?: EmploymentContactInfoData) => {
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

      const response = await fetch('/api/employment-contact', {
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'jobs' as TabType, label: 'नोकरी संधी', icon: Briefcase },
    { id: 'tenders' as TabType, label: 'निविदा', icon: FileText },
    { id: 'training' as TabType, label: 'प्रशिक्षण', icon: GraduationCap },
    { id: 'fpo' as TabType, label: 'FPO गट', icon: Users },
    { id: 'talent' as TabType, label: 'टॅलेंट', icon: Star },
    { id: 'contact' as TabType, label: 'संपर्क', icon: Phone }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">रोजगार आणि कौशल्य विकास</h1>
        <p className="text-gray-600 mt-2">
          नोकऱ्या, निविदा, प्रशिक्षण, FPO गट आणि टॅलेंट व्यवस्थापन
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
                    ? 'border-blue-500 text-blue-600'
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

      {/* Tab Content - Jobs */}
      {activeTab === 'jobs' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>नोकरी संधी</CardTitle>
                <CardDescription>नोकरीच्या जाहिराती व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openJobModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन नोकरी
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id || job.title} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.organization}</p>
                    <div className="flex gap-2 mt-2">
                      {job.isUrgent && <Badge className="bg-red-100 text-red-700">तातडीचे</Badge>}
                      <Badge variant={job.isActive ? 'default' : 'secondary'}>
                        {job.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openJobModal(job)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleJobDelete(job.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Modal */}
      {jobModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingJob ? 'नोकरी संपादित करा' : 'नवीन नोकरी जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setJobModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleJobSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={jobForm.titleEn}
                      onChange={(e) => setJobForm({ ...jobForm, titleEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>संस्था (मराठी)</Label>
                    <Input
                      value={jobForm.organization}
                      onChange={(e) => setJobForm({ ...jobForm, organization: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>संस्था (English)</Label>
                    <Input
                      value={jobForm.organizationEn}
                      onChange={(e) => setJobForm({ ...jobForm, organizationEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>स्थान (मराठी)</Label>
                    <Input
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थान (English)</Label>
                    <Input
                      value={jobForm.locationEn}
                      onChange={(e) => setJobForm({ ...jobForm, locationEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>प्रकार (मराठी)</Label>
                    <Input
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रकार (English)</Label>
                    <Input
                      value={jobForm.typeEn}
                      onChange={(e) => setJobForm({ ...jobForm, typeEn: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>पगार</Label>
                    <Input
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>अनुभव (मराठी)</Label>
                    <Input
                      value={jobForm.experience}
                      onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>अनुभव (English)</Label>
                    <Input
                      value={jobForm.experienceEn}
                      onChange={(e) => setJobForm({ ...jobForm, experienceEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शिक्षण (मराठी)</Label>
                    <Input
                      value={jobForm.education}
                      onChange={(e) => setJobForm({ ...jobForm, education: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शिक्षण (English)</Label>
                    <Input
                      value={jobForm.educationEn}
                      onChange={(e) => setJobForm({ ...jobForm, educationEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={jobForm.descriptionEn}
                    onChange={(e) => setJobForm({ ...jobForm, descriptionEn: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>आवश्यकता</Label>
                  <div className="space-y-2">
                    {jobForm.requirements?.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={req} readOnly />
                        <Input value={jobForm.requirementsEn[index]} readOnly />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeRequirement(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        placeholder="आवश्यकता (मराठी)"
                      />
                      <Input
                        value={requirementEnInput}
                        onChange={(e) => setRequirementEnInput(e.target.value)}
                        placeholder="Requirement (English)"
                      />
                      <Button type="button" onClick={addRequirement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>पोस्ट तारीख</Label>
                    <Input
                      type="date"
                      value={jobForm.postedDate}
                      onChange={(e) => setJobForm({ ...jobForm, postedDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शेवटची तारीख</Label>
                    <Input
                      type="date"
                      value={jobForm.lastDate}
                      onChange={(e) => setJobForm({ ...jobForm, lastDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>अर्ज URL (Optional)</Label>
                    <Input
                      value={jobForm.applicationUrl || ''}
                      onChange={(e) => setJobForm({ ...jobForm, applicationUrl: e.target.value })}
                      placeholder="https://example.com/apply"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={jobForm.isUrgent}
                      onChange={(e) => setJobForm({ ...jobForm, isUrgent: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">तातडीचे</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={jobForm.isActive}
                      onChange={(e) => setJobForm({ ...jobForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={jobForm.order}
                      onChange={(e) => setJobForm({ ...jobForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setJobModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tenders Tab */}
      {activeTab === 'tenders' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>निविदा</CardTitle>
                <CardDescription>निविदा व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openTenderModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन निविदा
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenders.map((tender) => (
                <div key={tender.id || tender.title} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{tender.title}</h4>
                    <p className="text-sm text-gray-600">{tender.value} - {tender.category}</p>
                    <Badge variant={tender.isActive ? 'default' : 'secondary'} className="mt-2">
                      {tender.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openTenderModal(tender)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTenderDelete(tender.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Programs Tab */}
      {activeTab === 'training' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>प्रशिक्षण कार्यक्रम</CardTitle>
                <CardDescription>प्रशिक्षण कार्यक्रम व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openTrainingModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन प्रशिक्षण
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programs.map((program) => (
                <div key={program.id || program.title} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{program.title}</h4>
                    <p className="text-sm text-gray-600">{program.duration} - {program.fee}</p>
                    <p className="text-xs text-gray-500 mt-1">नोंदणी: {program.enrolled}/{program.seats}</p>
                    <Badge variant={program.isActive ? 'default' : 'secondary'} className="mt-2">
                      {program.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openTrainingModal(program)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTrainingDelete(program.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FPO Groups Tab */}
      {activeTab === 'fpo' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>FPO गट</CardTitle>
                <CardDescription>FPO आणि स्वयंसाहाय्य गट व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openFPOModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन गट
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fpoGroups.map((group) => (
                <div key={group.id || group.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{group.name}</h4>
                    <p className="text-sm text-gray-600">सदस्य: {group.members} | स्थापना: {group.established}</p>
                    <Badge variant={group.isActive ? 'default' : 'secondary'} className="mt-2">
                      {group.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openFPOModal(group)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleFPODelete(group.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Village Talent Tab */}
      {activeTab === 'talent' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>गाव टॅलेंट डायरेक्टरी</CardTitle>
                <CardDescription>स्थानिक कौशल्य व्यवस्थापित करा</CardDescription>
              </div>
              <Button onClick={() => openTalentModal()}>
                <Plus className="h-4 w-4 mr-2" />
                नवीन टॅलेंट
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {talents.map((talent) => (
                <div key={talent.id || talent.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{talent.name}</h4>
                    <p className="text-sm text-gray-600">{talent.skill} - {talent.experience}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{talent.rating}</span>
                    </div>
                    <Badge variant={talent.isActive ? 'default' : 'secondary'} className="mt-2">
                      {talent.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openTalentModal(talent)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTalentDelete(talent.id)} className="text-red-600">
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

      {/* Tender Modal */}
      {tenderModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingTender ? 'निविदा संपादित करा' : 'नवीन निविदा जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setTenderModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleTenderSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={tenderForm.title}
                      onChange={(e) => setTenderForm({ ...tenderForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={tenderForm.titleEn}
                      onChange={(e) => setTenderForm({ ...tenderForm, titleEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={tenderForm.description}
                    onChange={(e) => setTenderForm({ ...tenderForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={tenderForm.descriptionEn}
                    onChange={(e) => setTenderForm({ ...tenderForm, descriptionEn: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>मूल्य</Label>
                    <Input
                      value={tenderForm.value}
                      onChange={(e) => setTenderForm({ ...tenderForm, value: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शेवटची तारीख</Label>
                    <Input
                      type="date"
                      value={tenderForm.lastDate}
                      onChange={(e) => setTenderForm({ ...tenderForm, lastDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>निविदा URL (Optional)</Label>
                    <Input
                      value={tenderForm.tenderUrl || ''}
                      onChange={(e) => setTenderForm({ ...tenderForm, tenderUrl: e.target.value })}
                      placeholder="https://example.com/tender"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वर्ग (मराठी)</Label>
                    <Input
                      value={tenderForm.category}
                      onChange={(e) => setTenderForm({ ...tenderForm, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>वर्ग (English)</Label>
                    <Input
                      value={tenderForm.categoryEn}
                      onChange={(e) => setTenderForm({ ...tenderForm, categoryEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>आवश्यकता (मराठी)</Label>
                  <Textarea
                    value={tenderForm.requirements}
                    onChange={(e) => setTenderForm({ ...tenderForm, requirements: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>आवश्यकता (English)</Label>
                  <Textarea
                    value={tenderForm.requirementsEn}
                    onChange={(e) => setTenderForm({ ...tenderForm, requirementsEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tenderForm.isActive}
                      onChange={(e) => setTenderForm({ ...tenderForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={tenderForm.order}
                      onChange={(e) => setTenderForm({ ...tenderForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setTenderModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Training Modal */}
      {trainingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingTraining ? 'प्रशिक्षण संपादित करा' : 'नवीन प्रशिक्षण जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setTrainingModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleTrainingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={trainingForm.title}
                      onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={trainingForm.titleEn}
                      onChange={(e) => setTrainingForm({ ...trainingForm, titleEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={trainingForm.description}
                    onChange={(e) => setTrainingForm({ ...trainingForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={trainingForm.descriptionEn}
                    onChange={(e) => setTrainingForm({ ...trainingForm, descriptionEn: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>कालावधी (मराठी)</Label>
                    <Input
                      value={trainingForm.duration}
                      onChange={(e) => setTrainingForm({ ...trainingForm, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>कालावधी (English)</Label>
                    <Input
                      value={trainingForm.durationEn}
                      onChange={(e) => setTrainingForm({ ...trainingForm, durationEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शुल्क (मराठी)</Label>
                    <Input
                      value={trainingForm.fee}
                      onChange={(e) => setTrainingForm({ ...trainingForm, fee: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शुल्क (English)</Label>
                    <Input
                      value={trainingForm.feeEn}
                      onChange={(e) => setTrainingForm({ ...trainingForm, feeEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>प्रशिक्षक (मराठी)</Label>
                    <Input
                      value={trainingForm.instructor}
                      onChange={(e) => setTrainingForm({ ...trainingForm, instructor: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>प्रशिक्षक (English)</Label>
                    <Input
                      value={trainingForm.instructorEn}
                      onChange={(e) => setTrainingForm({ ...trainingForm, instructorEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label>सुरुवात तारीख</Label>
                    <Input
                      type="date"
                      value={trainingForm.startDate}
                      onChange={(e) => setTrainingForm({ ...trainingForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>जागा</Label>
                    <Input
                      type="number"
                      value={trainingForm.seats}
                      onChange={(e) => setTrainingForm({ ...trainingForm, seats: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नोंदणी</Label>
                    <Input
                      type="number"
                      value={trainingForm.enrolled}
                      onChange={(e) => setTrainingForm({ ...trainingForm, enrolled: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नोंदणी URL (Optional)</Label>
                    <Input
                      value={trainingForm.registrationUrl || ''}
                      onChange={(e) => setTrainingForm({ ...trainingForm, registrationUrl: e.target.value })}
                      placeholder="https://example.com/register"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={trainingForm.isActive}
                      onChange={(e) => setTrainingForm({ ...trainingForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={trainingForm.order}
                      onChange={(e) => setTrainingForm({ ...trainingForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setTrainingModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FPO Modal */}
      {fpoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingFPO ? 'FPO गट संपादित करा' : 'नवीन FPO गट जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setFpoModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleFPOSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={fpoForm.name}
                      onChange={(e) => setFpoForm({ ...fpoForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={fpoForm.nameEn}
                      onChange={(e) => setFpoForm({ ...fpoForm, nameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>सदस्य</Label>
                    <Input
                      type="number"
                      value={fpoForm.members}
                      onChange={(e) => setFpoForm({ ...fpoForm, members: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>स्थापना वर्ष</Label>
                    <Input
                      value={fpoForm.established}
                      onChange={(e) => setFpoForm({ ...fpoForm, established: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>संपर्क</Label>
                    <Input
                      value={fpoForm.contact}
                      onChange={(e) => setFpoForm({ ...fpoForm, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>ईमेल (Optional)</Label>
                  <Input
                    type="email"
                    value={fpoForm.email || ''}
                    onChange={(e) => setFpoForm({ ...fpoForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>क्रियाकलाप</Label>
                  <div className="space-y-2">
                    {fpoForm.activities?.map((activity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={activity} readOnly />
                        <Input value={fpoForm.activitiesEn[index]} readOnly />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeActivity(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={activityInput}
                        onChange={(e) => setActivityInput(e.target.value)}
                        placeholder="क्रियाकलाप (मराठी)"
                      />
                      <Input
                        value={activityEnInput}
                        onChange={(e) => setActivityEnInput(e.target.value)}
                        placeholder="Activity (English)"
                      />
                      <Button type="button" onClick={addActivity}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>उपलब्धी (मराठी)</Label>
                  <Textarea
                    value={fpoForm.achievements}
                    onChange={(e) => setFpoForm({ ...fpoForm, achievements: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>उपलब्धी (English)</Label>
                  <Textarea
                    value={fpoForm.achievementsEn}
                    onChange={(e) => setFpoForm({ ...fpoForm, achievementsEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>सामील व्हा URL (Optional)</Label>
                  <Input
                    value={fpoForm.joinUrl || ''}
                    onChange={(e) => setFpoForm({ ...fpoForm, joinUrl: e.target.value })}
                    placeholder="https://example.com/join"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fpoForm.isActive}
                      onChange={(e) => setFpoForm({ ...fpoForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={fpoForm.order}
                      onChange={(e) => setFpoForm({ ...fpoForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setFpoModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Talent Modal */}
      {talentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingTalent ? 'टॅलेंट संपादित करा' : 'नवीन टॅलेंट जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setTalentModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleTalentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={talentForm.name}
                      onChange={(e) => setTalentForm({ ...talentForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={talentForm.nameEn}
                      onChange={(e) => setTalentForm({ ...talentForm, nameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>कौशल्य (मराठी)</Label>
                    <Input
                      value={talentForm.skill}
                      onChange={(e) => setTalentForm({ ...talentForm, skill: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>कौशल्य (English)</Label>
                    <Input
                      value={talentForm.skillEn}
                      onChange={(e) => setTalentForm({ ...talentForm, skillEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>अनुभव (मराठी)</Label>
                    <Input
                      value={talentForm.experience}
                      onChange={(e) => setTalentForm({ ...talentForm, experience: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>अनुभव (English)</Label>
                    <Input
                      value={talentForm.experienceEn}
                      onChange={(e) => setTalentForm({ ...talentForm, experienceEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>रेटिंग (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={talentForm.rating}
                      onChange={(e) => setTalentForm({ ...talentForm, rating: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>संपर्क</Label>
                    <Input
                      value={talentForm.contact}
                      onChange={(e) => setTalentForm({ ...talentForm, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>सेवा</Label>
                  <div className="space-y-2">
                    {talentForm.services?.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={service} readOnly />
                        <Input value={talentForm.servicesEn[index]} readOnly />
                        <Button type="button" variant="outline" size="sm" onClick={() => removeService(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        placeholder="सेवा (मराठी)"
                      />
                      <Input
                        value={serviceEnInput}
                        onChange={(e) => setServiceEnInput(e.target.value)}
                        placeholder="Service (English)"
                      />
                      <Button type="button" onClick={addService}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={talentForm.isActive}
                      onChange={(e) => setTalentForm({ ...talentForm, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label className="cursor-pointer">सक्रिय</Label>
                  </div>
                  <div>
                    <Label>क्रमांक</Label>
                    <Input
                      type="number"
                      value={talentForm.order}
                      onChange={(e) => setTalentForm({ ...talentForm, order: Number(e.target.value) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setTalentModalOpen(false)}>
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
                    <option value="general">सामान्य</option>
                    <option value="jobs">नोकरी</option>
                    <option value="tenders">निविदा</option>
                    <option value="training">प्रशिक्षण</option>
                    <option value="fpo">FPO गट</option>
                    <option value="talent">टॅलेंट</option>
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

