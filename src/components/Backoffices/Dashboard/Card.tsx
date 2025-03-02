const Card = ({ icon, bgClass, title, value, borderLeft }: { icon: any; bgClass: string; title: string; value: string ;borderLeft?: boolean }) => {
  return (
    <div className={`flex gap-4 items-center px-5 py-3 ${borderLeft ? 'border-l-2 border-gray-300' : null}`}>
      <div className={`p-2 rounded-full ${bgClass}`}>{icon}</div>
      <div className="flex flex-col">
        <h5 className="text-xs text-gray-500">{title}</h5>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Card;
