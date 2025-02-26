
interface NewsHeaderProps {
  title: string;
}

export const NewsHeader = ({
  title
}: NewsHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 border-b pb-4">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
  );
};

export default NewsHeader;

