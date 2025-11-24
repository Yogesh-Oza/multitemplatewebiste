'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  User, 
  Quote, 
  Calendar,
  MapPin,
  Award,
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import {
  beneficiaryStoriesDemoData,
  BeneficiaryStoryData
} from '@/lib/demo-schemes-beneficiary';

interface BeneficiaryStory {
  id: string;
  name: string;
  nameEn: string;
  age: number;
  scheme: string;
  schemeEn: string;
  story: string;
  storyEn: string;
  impact: string;
  impactEn: string;
  beforeImage: string;
  afterImage: string;
  location: string;
  locationEn: string;
  date: string;
  benefits: string[];
  rating: number;
  isStar: boolean;
}

interface BeneficiaryStoriesSectionProps {
  stories?: BeneficiaryStory[];
}

export default function BeneficiaryStoriesSection({ stories: propStories }: BeneficiaryStoriesSectionProps) {
  const [apiStories, setApiStories] = useState<BeneficiaryStoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/beneficiary-stories');
        if (response.ok) {
          const data = await response.json();
          setApiStories(data.stories || []);
          setIsDemo(Boolean(data.isDemo));
        } else {
          setError('माहिती लोड करण्यात अडचण आली');
        }
      } catch (err) {
        console.error(err);
        setError('माहिती लोड करण्यात अडचण आली');
      } finally {
        setLoading(false);
      }
    };

    if (!propStories || propStories.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [propStories]);

  // Demo data for when no stories are available
  const demoStories: BeneficiaryStory[] = [
    {
      id: 'story-1',
      name: 'सुनीता देवी',
      nameEn: 'Sunita Devi',
      age: 35,
      scheme: 'मनरेगा योजना',
      schemeEn: 'MGNREGA Scheme',
      story: 'मनरेगा योजनेमुळे माझे जीवन पूर्णपणे बदलले. मी आता स्वतंत्रपणे माझ्या कुटुंबाचा पोसणा करू शकते. या योजनेने मला आत्मविश्वास दिला आणि माझ्या मुलांच्या शिक्षणासाठी पैसे जमा करणे शक्य झाले.',
      storyEn: 'MGNREGA scheme completely changed my life. I can now independently support my family. This scheme gave me confidence and made it possible to save money for my children\'s education.',
      impact: 'मासिक उत्पन्न ८००० रुपये वाढले, मुलांच्या शिक्षणासाठी पैसे जमा केले',
      impactEn: 'Monthly income increased by Rs. 8000, saved money for children\'s education',
      beforeImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=face',
      afterImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
      location: 'वॉर्ड क्र. १, ग्रामपंचायत',
      locationEn: 'Ward No. 1, Gram Panchayat',
      date: '2024-01-15',
      benefits: ['नियमित रोजगार', 'सामाजिक सुरक्षा', 'आत्मविश्वास वाढ'],
      rating: 5,
      isStar: true
    },
    {
      id: 'story-2',
      name: 'रामदास पाटील',
      nameEn: 'Ramdas Patil',
      age: 42,
      scheme: 'पीएम आवास योजना',
      schemeEn: 'PM Awas Yojana',
      story: 'पीएम आवास योजनेमुळे मला स्वतःचे घर मिळाले. २० वर्षे किराय्याच्या घरात राहिल्यानंतर आता माझे स्वतःचे घर आहे. माझ्या कुटुंबाला सुरक्षित वातावरण मिळाले.',
      storyEn: 'PM Awas Yojana gave me my own house. After living in rented house for 20 years, now I have my own house. My family got a secure environment.',
      impact: 'स्वतःचे घर मिळाले, किराया बचत १५००० रुपये/महिना',
      impactEn: 'Got own house, rent saving Rs. 15000/month',
      beforeImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
      afterImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
      location: 'वॉर्ड क्र. ३, ग्रामपंचायत',
      locationEn: 'Ward No. 3, Gram Panchayat',
      date: '2024-02-20',
      benefits: ['स्वतःचे घर', 'किराया बचत', 'कुटुंब सुरक्षा'],
      rating: 5,
      isStar: true
    },
    {
      id: 'story-3',
      name: 'कविता शिंदे',
      nameEn: 'Kavita Shinde',
      age: 28,
      scheme: 'स्वयं सहायता गट योजना',
      schemeEn: 'Self Help Group Scheme',
      story: 'स्वयं सहायता गटामुळे मी छोटे व्यवसाय सुरू करू शकले. मी आता माझ्या गावात छोटे किराणा दुकान चालवते. या योजनेने मला आर्थिक स्वातंत्र्य मिळाले.',
      storyEn: 'Self Help Group helped me start a small business. I now run a small grocery shop in my village. This scheme gave me financial independence.',
      impact: 'छोटे व्यवसाय सुरू केले, मासिक नफा १२००० रुपये',
      impactEn: 'Started small business, monthly profit Rs. 12000',
      beforeImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face',
      afterImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
      location: 'वॉर्ड क्र. २, ग्रामपंचायत',
      locationEn: 'Ward No. 2, Gram Panchayat',
      date: '2024-03-10',
      benefits: ['व्यवसाय सुरुवात', 'आर्थिक स्वातंत्र्य', 'सामाजिक स्थान'],
      rating: 4,
      isStar: true
    }
  ];

  // Transform API stories to component format
  const transformStories = (apiStories: BeneficiaryStoryData[]): BeneficiaryStory[] => {
    return apiStories
      .filter((s) => s.isActive)
      .map((s) => ({
        id: s.id || '',
        name: s.name,
        nameEn: s.nameEn,
        age: s.age,
        scheme: s.scheme,
        schemeEn: s.schemeEn,
        story: s.story,
        storyEn: s.storyEn,
        impact: s.impact,
        impactEn: s.impactEn,
        beforeImage: s.beforeImage,
        afterImage: s.afterImage,
        location: s.location,
        locationEn: s.locationEn,
        date: s.date,
        benefits: Array.isArray(s.benefits) ? s.benefits : [],
        rating: s.rating,
        isStar: s.isStar
      }));
  };

  // Determine which stories to use
  let displayStories: BeneficiaryStory[];
  let showDemoBadge = false;

  if (propStories && propStories.length > 0) {
    displayStories = propStories;
  } else if (apiStories.length > 0) {
    displayStories = transformStories(apiStories);
    showDemoBadge = isDemo;
  } else {
    displayStories = demoStories;
    showDemoBadge = true;
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-yellow-100">
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            स्टार लाभार्थी कथा
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Star Beneficiary Stories
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          योजनांच्या माध्यमातून जीवन बदलणाऱ्या लाभार्थ्यांच्या प्रेरणादायी कथा. 
          त्यांच्या संघर्ष, यश आणि सामाजिक बदलाच्या अनुभवांची मालिका.
        </p>
        {showDemoBadge && (
          <p className="text-xs text-blue-600 bg-white/80 px-3 py-1 inline-flex rounded-full border border-blue-100 mt-4">
            डेमो डेटा - प्रशासनामधून अपडेट करा
          </p>
        )}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {displayStories.map((story, index) => (
          <Card key={story.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
            {/* Star Badge */}
            {story.isStar && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  स्टार
                </Badge>
              </div>
            )}

            {/* Before/After Images */}
            <div className="relative h-48 bg-gradient-to-r from-blue-100 to-indigo-200">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 relative">
                  <img
                    src={story.beforeImage}
                    alt={`${story.name} - पूर्वी`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-red-500 text-white text-xs">पूर्वी</Badge>
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <img
                    src={story.afterImage}
                    alt={`${story.name} - नंतर`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-green-500 text-white text-xs">नंतर</Badge>
                  </div>
                </div>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {story.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{story.nameEn}</p>
                  <p className="text-xs text-gray-400">वय: {story.age} वर्षे</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-700">
                  {story.scheme}
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < story.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Story */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Quote className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-gray-700">कथा</h4>
                </div>
                <p className="text-sm text-gray-600 line-clamp-4">
                  {story.story}
                </p>
              </div>

              {/* Impact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-gray-700">परिणाम</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {story.impact}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <h4 className="font-semibold text-gray-700">लाभ</h4>
                </div>
                <div className="flex flex-wrap gap-1">
                  {story.benefits.map((benefit, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Location & Date */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{story.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(story.date).toLocaleDateString('mr-IN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                आपली कथा सांगा
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              जर तुम्हीही योजनांचा लाभ घेतला असेल तर तुमची कथा आमच्याशी सामायिक करा. 
              तुमचा अनुभव इतरांसाठी प्रेरणा ठरेल.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Users className="h-4 w-4 mr-2" />
                माझी कथा सांगा
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <DollarSign className="h-4 w-4 mr-2" />
                योजना लाभ घ्या
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
