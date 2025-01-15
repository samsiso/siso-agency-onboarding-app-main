export const Hero = () => {
  return (
    <div className="relative mb-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-siso-text-bold mb-6">
          Welcome to
          <span className="block bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
            SISO Agency Resources
          </span>
        </h1>
        <p className="text-xl text-siso-text mb-8">
          Discover the tools to build your own vision. Your gateway to innovation and success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 bg-gradient-to-r from-siso-red to-siso-orange text-white rounded-lg font-medium hover:opacity-90 transition-opacity animate-glow">
            Get Started
          </button>
          <button className="px-8 py-3 border border-siso-text/20 text-siso-text-bold rounded-lg font-medium hover:bg-siso-text/5 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};