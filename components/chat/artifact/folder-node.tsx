import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TreeNodeType } from "@/types/data/code";
import { ChevronRight } from "lucide-react";
import { TreeNode } from "./tree-node";
import { VerticalLine } from "./vertical-line";

type Props = {
  node: TreeNodeType;
  level?: number;
};
export const FolderNode = (props: Props) => {
  const { node, level = 0 } = props;

  return (
    <VerticalLine level={level}>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2 font-normal relative hover:bg-secondary/30"
            style={{ paddingLeft: `${8 + level * 16}px` }}
          >
            <ChevronRight className="h-4 w-4 mr-1 transition-transform" />
            {node.name}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>
            {node.children?.map((childNode, index) => (
              <TreeNode key={index} node={childNode} level={level + 1} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </VerticalLine>
  );
};
