export default function TestCSS() {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">CSS Test</h1>
      <p className="text-lg">If you can see this with blue background and white text, CSS is working!</p>
      <div className="mt-4 p-4 bg-red-500 rounded-lg">
        <p>This should have red background and rounded corners</p>
      </div>
    </div>
  );
}
