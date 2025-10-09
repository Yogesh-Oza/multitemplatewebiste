import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SocialMediaLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterContent {
  description: string;
  socialMedia: SocialMediaLink[];
  officeName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export function Footer() {
  const [footerContent, setFooterContent] = useState<FooterContent>({
    description: 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख. सर्वांसाठी विकास आणि समृद्धी.',
    socialMedia: [
      { platform: 'facebook', url: '#', icon: 'Facebook' },
      { platform: 'twitter', url: '#', icon: 'Twitter' },
      { platform: 'instagram', url: '#', icon: 'Instagram' },
      { platform: 'youtube', url: '#', icon: 'Youtube' }
    ],
    officeName: 'ग्रामपंचायत कार्यालय',
    address: 'गाव, तालुका, जिल्हा\nमहाराष्ट्र, भारत',
    phone: '+91 12345 67890',
    email: 'info@grampanchayat.com',
    website: 'digitalgp.in'
  });

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const fetchFooterContent = async () => {
    try {
      const response = await fetch('/api/footer-content');
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
            website: data.website || footerContent.website
          });
        }
      }
    } catch (error) {
      console.error('Error fetching footer content:', error);
    }
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
              <span className="text-xl font-bold">ग्रामपंचायत</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {footerContent.description}
            </p>
            <div className="flex space-x-4">
              {footerContent.socialMedia.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">द्रुत लिंक</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  आमच्याबद्दल
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-gray-300 hover:text-white transition-colors">
                  इतिहास
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-300 hover:text-white transition-colors">
                  कार्यक्रम
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">
                  गॅलरी
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  संपर्क
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">सेवा</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jama-kharch" className="text-gray-300 hover:text-white transition-colors">
                  जमा-खर्च
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="text-gray-300 hover:text-white transition-colors">
                  सूचना
                </Link>
              </li>
              <li>
                <Link href="/gov-programs" className="text-gray-300 hover:text-white transition-colors">
                  शासकीय योजना
                </Link>
              </li>
              <li>
                <Link href="/departments" className="text-gray-300 hover:text-white transition-colors">
                  विभाग
                </Link>
              </li>
              <li>
                <Link href="/amenities" className="text-gray-300 hover:text-white transition-colors">
                  सोई-सुविधा
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">संपर्क माहिती</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 whitespace-pre-line">
                    {footerContent.officeName}<br />
                    {footerContent.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">{footerContent.phone}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">{footerContent.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a 
                  href={`https://${footerContent.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {footerContent.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 ग्रामपंचायत. सर्व हक्क राखीव.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                गोपनीयता धोरण
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                वापराच्या अटी
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                साइटमॅप
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
