export default function Card(_a) {
    var title = _a.title, value = _a.value, icon = _a.icon;
    return (<div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>);
}
