import Sidebar from "./Template/Sidebar";

interface Props {
    heading: string
}

function Template({heading}: Props) {
  return (
    <div className="flex bg-bgLight">
      <Sidebar />
      <div className="w-full">
        <div>
            <span className="text-6xl font-bold">{heading}</span>
        </div>
      </div>
    </div>
  );
}

export default Template;
