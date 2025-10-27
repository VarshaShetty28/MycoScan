export default function AboutUs() {
  return (
    <section className="bg-[#f8f9fa] text-[#1f1f1f] px-6 py-16 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-6 tracking-tight">
          About Us
        </h2>

        <p className="text-lg md:text-xl leading-relaxed text-gray-800">
          At <span className="font-semibold text-purple-700">MycoScan</span>, we help you identify poisonous mushrooms quickly and easily. 
          Simply upload a photo of any mushroom, and our advanced technology will tell you whether it's safe or dangerous.
        </p>

        <p className="mt-6 text-lg md:text-xl leading-relaxed text-gray-800">
          Our mission is to offer a simple yet powerful tool for mushroom enthusiasts, hikers, foragers, and anyone curious about the natural world. 
          MycoScan analyzes visual data and predicts whether the mushroom is poisonous or safe to handle — 
          providing an essential safety measure for anyone engaging with mushrooms in their environment.
        </p>

        <p className="mt-6 text-lg md:text-xl leading-relaxed text-gray-800">
          Whether you're foraging or simply curious, rely on MycoScan to keep you safe with just a click. 
          <span className="font-semibold text-purple-700">Your safety is our top priority.</span>
        </p>
      </div>
    </section>
  );
}
