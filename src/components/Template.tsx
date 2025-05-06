import { ReactNode } from "react";
import Sidebar from "./Template/Sidebar";

interface Props {
  heading: string | undefined;
  children: ReactNode;
}

function Template({ heading, children }: Props) {
  return (
    <div className="flex bg-bgLight">
      <Sidebar />
      <div className="w-full">
        <div className="p-4 pl-0 space-y-4 h-screen flex flex-col">
          {heading ? (
            <span className="text-6xl font-bold block">{heading}</span>
          ) : undefined}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Template;
