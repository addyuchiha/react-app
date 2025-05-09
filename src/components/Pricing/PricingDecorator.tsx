import { ReactNode } from "react";
import Pricing from "./Pricing";

interface Props {
  children: ReactNode;
}

function PricingDecorator({ children }: Props) {
  return (
    <div>
      <div className="absolute w-screen h-screen backdrop-blur z-20 flex flex-col justify-center items-center">
        <div className="w-full px-10">
          <Pricing noTitle={true} />
        </div>
      </div>
      <div className="z-10">
        {children}
      </div>
    </div>
  );
}

export default PricingDecorator;
