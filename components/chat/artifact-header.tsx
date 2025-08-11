import { useDataStream } from "@/stores/use-data-stream";

export const ArtifactTitle = () => {
  const { dataStream } = useDataStream();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-primary">
        {dataStream.title?.title || "New Chat"}
      </h2>
    </div>
  );
};
