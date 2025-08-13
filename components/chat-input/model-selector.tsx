import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AI_MODELS, Model } from "@/lib/models";
import { useModel } from "@/stores/use-model";
import { useMemo } from "react";

export const ModelSelector = () => {
  const { model, setModel } = useModel();
  const modelGroups = useMemo(() => {
    const byProvider: Record<string, Model[]> = {};
    for (const m of AI_MODELS) {
      const key = m.provider ?? "Models";
      byProvider[key] = byProvider[key] || [];
      byProvider[key].push(m);
    }
    return byProvider;
  }, [AI_MODELS]);

  return (
    <Select
      value={model}
      onValueChange={setModel}
      required
      defaultValue={AI_MODELS[0].id}
    >
      <SelectTrigger className="rounded-2xl focus-visible:ring-0 focus-visible:border-secondary dark:bg-background bg-background">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent
        className="max-h-[300px] w-[200px] overflow-y-auto bg-background dark:bg-background"
        position="popper"
        align="start"
      >
        {Object.entries(modelGroups).map(([provider, models]) => (
          <SelectGroup key={provider}>
            <SelectLabel>{provider}</SelectLabel>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.model}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
