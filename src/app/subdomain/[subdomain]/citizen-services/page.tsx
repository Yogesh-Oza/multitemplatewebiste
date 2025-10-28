import { CertificateServicesSection } from '@/components/sections/certificate-services-section';
import { ComplaintResolutionSection } from '@/components/sections/complaint-resolution-section';
import { FeedbackNotificationsSection } from '@/components/sections/feedback-notifications-section';
import { OnlineTaxPaymentSection } from '@/components/sections/online-tax-payment-section';
import { LatestNewsThoughtSection } from '@/components/sections/latest-news-thought-section';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  CreditCard, 
  QrCode,
  Building,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function SubdomainCitizenServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20 relative overflow-hidden">
        {/* Government Logo Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <Users className="h-10 w-10 text-green-600" />
          </div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-green-600" />
          </div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <QrCode className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-white/20 text-white mr-4 backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                नागरिक सेवा आणि फॉर्म्स
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Citizen Services & Forms
            </p>
            <p className="text-lg mb-8 opacity-80">
              सर्व नागरिक सेवा आणि फॉर्म्स एकाच ठिकाणी - सोयीस्कर आणि पारदर्शक
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <FileText className="h-5 w-5 mr-2" />
                <span>प्रमाणपत्रे</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span>तक्रार निवारण</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <CreditCard className="h-5 w-5 mr-2" />
                <span>ऑनलाइन पेमेंट</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <QrCode className="h-5 w-5 mr-2" />
                <span>क्यूआर कोड</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Thought for the Day */}
      <LatestNewsThoughtSection />

      {/* Certificate Services */}
      <CertificateServicesSection />

      {/* Complaint Resolution Portal */}
      <ComplaintResolutionSection />

      {/* Feedback and Notifications */}
      <FeedbackNotificationsSection />

      {/* Online Tax Payment with QR Code */}
      <OnlineTaxPaymentSection />

      {/* Government Compliance Footer */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-white/20">
                <Building className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">महाराष्ट्र शासन</h3>
                <p className="text-lg opacity-90">Maharashtra Government</p>
              </div>
            </div>
            <p className="text-lg opacity-80 mb-4">
              सर्व नागरिक सेवा भारत सरकार आणि महाराष्ट्र शासनाच्या मार्गदर्शनाखाली सुविधाजनकपणे उपलब्ध
            </p>
            <p className="text-sm opacity-70">
              All citizen services are conveniently available under the guidance of Government of India and Maharashtra Government
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
