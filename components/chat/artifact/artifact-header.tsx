import { useTitle } from "@/stores/use-title";

export const ArtifactTitle = () => {
  const title = useTitle((state) => state.title);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-primary">{title}</h2>
    </div>
  );
};
