export default function StatCard({
  title,
  value = 0,
  color = "blue",
  loading = false,
}) {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    red: "text-red-600",
    gray: "text-gray-600",
  };

  const textColor = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <p className="mb-2 text-sm font-medium text-gray-500">
        {title}
      </p>

      {loading ? (
        <div className="h-8 w-24 rounded-lg bg-gray-200 animate-pulse" />
      ) : (
        <h2 className={`text-3xl font-bold ${textColor}`}>
          {value}
        </h2>
      )}
    </div>
  );
}
