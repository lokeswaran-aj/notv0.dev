type Props = {
  level: number;
  children: React.ReactNode;
};

export const VerticalLine = (props: Props) => {
  const { level, children } = props;

  return (
    <div className="relative">
      {Array.from({ length: level }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px bg-gray-500"
          style={{ left: `${8 + i * 16 + 8}px` }}
        />
      ))}
      {children}
    </div>
  );
};
