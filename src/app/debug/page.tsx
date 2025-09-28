export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">CSS Debug Page</h1>
        
        {/* Test Tailwind Classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Blue Card</h2>
            <p>This should have blue background</p>
          </div>
          
          <div className="bg-green-500 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Green Card</h2>
            <p>This should have green background</p>
          </div>
          
          <div className="bg-purple-500 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Purple Card</h2>
            <p>This should have purple background</p>
          </div>
        </div>

        {/* Test Gradients */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Gradient Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Blue to Purple</h3>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Green to Teal</h3>
            </div>
          </div>
        </div>

        {/* Test Animations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Animation Tests</h2>
          <div className="flex space-x-4">
            <div className="bg-red-500 text-white p-4 rounded-lg animate-bounce">
              Bounce
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded-lg animate-pulse">
              Pulse
            </div>
            <div className="bg-indigo-500 text-white p-4 rounded-lg hover:scale-110 transition-transform">
              Hover Scale
            </div>
          </div>
        </div>

        {/* Test Typography */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Typography Tests</h2>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Heading 1</h1>
            <h2 className="text-3xl font-semibold text-gray-800">Heading 2</h2>
            <h3 className="text-2xl font-medium text-gray-700">Heading 3</h3>
            <p className="text-lg text-gray-600">This is a paragraph with larger text</p>
            <p className="text-base text-gray-500">This is normal paragraph text</p>
            <p className="text-sm text-gray-400">This is small text</p>
          </div>
        </div>

        {/* Test Marathi Text */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Marathi Text Test</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">ग्रामपंचायत</h3>
            <p className="text-gray-700 mb-4">आमच्या गावात स्वागत आहे</p>
            <p className="text-gray-600">एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख</p>
          </div>
        </div>

        {/* Test Responsive Design */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Responsive Test</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-pink-500 text-white p-4 rounded text-center">1</div>
            <div className="bg-pink-500 text-white p-4 rounded text-center">2</div>
            <div className="bg-pink-500 text-white p-4 rounded text-center">3</div>
            <div className="bg-pink-500 text-white p-4 rounded text-center">4</div>
          </div>
        </div>
      </div>
    </div>
  );
}
