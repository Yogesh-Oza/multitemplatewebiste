import { FacilitiesSection } from '@/components/sections/facilities-section';
import WaterSanitationSection from '@/components/sections/water-sanitation-section';
import RoadsLightingSection from '@/components/sections/roads-lighting-section';
import EducationHealthSection from '@/components/sections/education-health-section';
import GISInfrastructureMapSection from '@/components/sections/gis-infrastructure-map-section';
import SmartVillageDashboardSection from '@/components/sections/smart-village-dashboard-section';

export default function SubdomainAmenitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        {/* Government Logo Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <div className="text-2xl font-bold text-blue-600">पा</div>
          </div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="text-lg font-bold text-blue-600">सु</div>
          </div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div className="text-sm font-bold text-blue-600">वि</div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-white/20 text-white mr-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">पायाभूत</div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                ग्राम पायाभूत सुविधा आणि सुविधा
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Village Infrastructure & Facilities
            </p>
            <p className="text-lg mb-8 opacity-80">
              पाणीपुरवठा, स्वच्छता, रस्ते, शाळा, आरोग्य केंद्रे आणि इतर सुविधा
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>पाणीपुरवठा</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>रस्ते आणि दिवे</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span>शाळा आणि आरोग्य</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Village Dashboard Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SmartVillageDashboardSection />
        </div>
      </section>

      {/* Water Supply & Sanitation Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <WaterSanitationSection />
        </div>
      </section>

      {/* Roads & Street Lighting Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <RoadsLightingSection />
        </div>
      </section>

      {/* Education & Health Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <EducationHealthSection />
        </div>
      </section>

      {/* GIS Infrastructure Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <GISInfrastructureMapSection />
        </div>
      </section>

      {/* Basic Facilities Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <FacilitiesSection />
        </div>
      </section>

      {/* Government Compliance Footer */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-white/20">
                <div className="text-xl font-bold">महाराष्ट्र</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">महाराष्ट्र शासन</h3>
                <p className="text-lg opacity-90">Maharashtra Government</p>
              </div>
            </div>
            <p className="text-lg opacity-80 mb-4">
              सर्व पायाभूत सुविधा भारत सरकार आणि महाराष्ट्र शासनाच्या मार्गदर्शनाखाली विकसित
            </p>
            <p className="text-sm opacity-70">
              All infrastructure facilities developed under the guidance of Government of India and Maharashtra Government
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
