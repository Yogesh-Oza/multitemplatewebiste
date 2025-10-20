import Image from 'next/image';

export default function TestImagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Digital India Logo</h2>
          <Image
            src="/images/gov-logos/digital-india.png"
            alt="Digital India"
            width={80}
            height={32}
            className="border"
            onError={(e) => {
              console.error('Digital India logo failed to load:', e);
            }}
            onLoad={() => {
              console.log('Digital India logo loaded successfully');
            }}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Satyamev Jayate Logo</h2>
          <Image
            src="/images/gov-logos/satyamev_jayate_logo.png"
            alt="Satyamev Jayate"
            width={32}
            height={32}
            className="border"
            onError={(e) => {
              console.error('Satyamev Jayate logo failed to load:', e);
            }}
            onLoad={() => {
              console.log('Satyamev Jayate logo loaded successfully');
            }}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Direct Image Links</h2>
          <p>Digital India: <a href="/images/gov-logos/digital-india.png" target="_blank" className="text-blue-500">/images/gov-logos/digital-india.png</a></p>
          <p>Satyamev Jayate: <a href="/images/gov-logos/satyamev_jayate_logo.png" target="_blank" className="text-blue-500">/images/gov-logos/satyamev_jayate_logo.png</a></p>
        </div>
      </div>
    </div>
  );
}
