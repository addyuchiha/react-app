import Step from "./Step";

const HowToUse = () => {
  const steps = [
    {
      icon: (
        <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        className="w-12 h-12"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      ),
      heading: "Shooting Stars",
      text: "VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal."
    },
    {
      icon: (
        <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        className="w-12 h-12"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      ),
      heading: "Shooting Stars",
      text: "VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal."
    },
    {
      icon: (
        <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        className="w-12 h-12"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      ),
      heading: "Shooting Stars",
      text: "VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal."
    },
    {
      icon: (
        <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        className="w-12 h-12"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      ),
      heading: "Shooting Stars",
      text: "VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal."
    },
  ]
  return (
    <section id="usage">
      <h1 className="text-6xl font-bold text-center mt-24">How To Use</h1>
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        {steps.map((step, index) => <Step step={index + 1} icon={step.icon} heading={step.heading} text={step.text} />)}
      </div>
    </section>
  );
};

export default HowToUse;
