
interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function Card({ title, value, icon }: CardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
