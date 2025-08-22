export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-gray-400 leading-relaxed mb-4">
        At EDUpath, we value your privacy. This Privacy Policy explains how we
        collect, use, and safeguard your information when you use our services.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <p className="text-gray-400 mb-4">
        We may collect personal data such as your name, email, and uploaded PDFs.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Data</h2>
      <p className="text-gray-400 mb-4">
        Data is used solely to provide AI-powered summaries, recommendations,
        and insights.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Security</h2>
      <p className="text-gray-400 mb-4">
        We take reasonable precautions to protect your data, but no online
        service is 100% secure.
      </p>
      <p className="text-gray-400 mt-8">
        For questions, contact us at{" "}
        <a href="mailto:yagnesh.codes@gmail.com" className="text-gray-300 underline">
          yagnesh.codes@gmail.com
        </a>.
      </p>
    </div>
  );
}
