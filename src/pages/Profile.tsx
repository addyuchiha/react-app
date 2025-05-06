import Template from "../components/Template";
import List from "../components/Profile/List";
import Details from "../components/Profile/Details";

export default function Profile() {
  return (
    <Template heading={undefined}>
      <div className="flex flex-grow space-x-4">
        <List />
        <Details />
      </div>
    </Template>
  );
}
