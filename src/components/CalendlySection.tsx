import { useEffect } from 'react';

const CalendlySection = () => {
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="consultation" className="pb-2 pt-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Schedule Your Free Consultation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Speak with our relocation specialists to create your personalized South Florida escape plan
          </p>
        </div>

        {/* Calendly inline widget */}
        <div
          className="calendly-inline-widget h-[600px] md:h-[700px]"
          data-url="https://calendly.com/d/ctfv-d8m-2gh"
          style={{ minWidth: '320px' }}
        />
      </div>
    </section>
  );
};

export default CalendlySection;
