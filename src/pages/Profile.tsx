import Template from "../components/Template";
import Details from "../components/Profile/Details";
import { ReactNode } from "react";

interface Props {
    active: string
    children: ReactNode
}

export default function Profile({active, children}: Props) {
  return (
    <Template heading={undefined}>
      <div className="flex flex-grow space-x-4">
        {children}
        <Details active={active} />
      </div>
    </Template>
  );
}
