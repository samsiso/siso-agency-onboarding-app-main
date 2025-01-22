interface NewsCardMediaProps {
  imageUrl: string;
  title: string;
}

export const NewsCardMedia = ({ imageUrl, title }: NewsCardMediaProps) => {
  return (
    <div className="w-full sm:w-1/4 max-w-[300px] mx-auto sm:mx-0">
      <img
        src={imageUrl}
        alt={title}
        className="rounded-lg object-cover w-full aspect-video"
      />
    </div>
  );
};