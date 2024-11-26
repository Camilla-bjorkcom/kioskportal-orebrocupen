import { SidebarTrigger } from './ui/sidebar';

interface PagesHeaderProps {
  pathname: string;
}

const PagesHeader = ({ pathname }: PagesHeaderProps) => {
  return (
    <div className="p-1 shadow w-full flex items-center mb-8">
      <SidebarTrigger />
      <h2>{pathname}</h2>
      <p className="mx-auto font-bold text-4xl">Örebro Cupen 2025</p>
    </div>
  );
};

export default PagesHeader;
