export default function Footer() {
  return (
    <footer className="bg-[#0d0f1d] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base">
        {/* Column 1: About */}
        <div>
          <h3 className="text-purple-400 font-bold text-lg mb-2">MycoScan</h3>
          <p className="text-gray-300 leading-relaxed">
            AI-powered mushroom classification to ensure safe foraging and research.
            Built with deep learning for accuracy, speed, and trust.
          </p>
          <p className="text-gray-300 leading-relaxed">Built with ❤️ during College Project 2025</p>
        </div>

        {/* Column 2: Contact */}
        <div className="text-right">
          <h4 className="font-semibold text-purple-300 mb-2">Connect with Us</h4>
          <p className="text-gray-400">
            Email: <a href="mailto:contact@mycoscan.ai" className="hover:text-purple-200">contact@mycoscan.ai</a>
          </p>
          <p className="text-gray-400 mt-2">
            GitHub: <a href="#" className="hover:text-purple-200">MycoScan Project</a>
          </p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MycoScan. All rights reserved.
      </div>
    </footer>
  );
}