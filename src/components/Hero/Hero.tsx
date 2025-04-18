import Button from "../Button";
import HeroImages from "./HeroImages";

const Hero = () => {
  return (
    <section className="max-w-5xl mx-auto grid grid-cols-2 h-screen items-center text-textMain">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold">Lorem <span className="text-accent">ipsum</span> dolor sit amet.</h1>
        <span className="block">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam nam reiciendis, dicta magnam error voluptatem.
        </span>
        <div className="flex space-x-2">
          <Button children={undefined} color="accent" />
          <Button children="Learn More" color="primary" />
        </div>
      </div>
      <div className="flex justify-end items-center">
        <HeroImages />
      </div>
      <div className="absolute bottom-4 justify-self-center rounded-full bg-primary p-2 cursor-pointer animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6 text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
