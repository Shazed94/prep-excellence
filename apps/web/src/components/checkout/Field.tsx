export const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 transition-colors bg-white";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={label} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}
