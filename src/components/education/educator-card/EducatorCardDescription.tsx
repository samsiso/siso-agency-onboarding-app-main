
interface EducatorCardDescriptionProps {
  description?: string;
}

export const EducatorCardDescription = ({ description }: EducatorCardDescriptionProps) => {
  if (!description) return null;

  return (
    <p className="text-sm text-siso-text/70 line-clamp-3 h-[4.5rem] group-hover:text-siso-text/90 transition-colors">
      {description}
    </p>
  );
};

