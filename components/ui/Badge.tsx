interface Props {
  children: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "gray" | "orange";
}

const colors = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
  yellow: "bg-yellow-50 text-yellow-700",
  gray: "bg-gray-100 text-gray-700",
  orange: "bg-orange-50 text-orange-700",
};

export default function Badge({ children, color = "gray" }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}
