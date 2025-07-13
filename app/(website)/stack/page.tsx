import { getAllCollectionMeta } from "@/lib/mdx";

import ListItem from "@/components/ui/list/list-item";

export default async function StackPage() {
  const stack = await getAllCollectionMeta("stack");

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-medium">工具与产品</h1>
        <p>介绍一些我日常使用的工具和产品。</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          {stack.map((item) => (
            <ListItem item={item} kind="stack" key={item.slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
