import { getCollectionBySlug, getAllCollectionMeta } from "@/lib/mdx";
import BackLink from "@/components/ui/back-link";

import { Stack, Params } from "@/types/cms";
import Listicle from "@/components/ui/list/listicle";

import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const sks = await getAllCollectionMeta("stack");

  return sks.map((sk) => ({
    slug: sk.slug,
  }));
}

const getPageContent = async (slug: string) => {
  const { meta, content }: { meta: Stack; content: any } =
    await getCollectionBySlug(slug, "stack");

  if (meta.status === "draft") {
    if (process.env.NODE_ENV !== "development") {
      return notFound();
    }
  }

  return { meta, content };
};

export async function generateMetadata({ params }: { params: Params }) {
  const { meta }: { meta: Stack } = await getPageContent(params.slug);
  return {
    title: `${meta.name} | Fei`,
    description: meta.seo_description,
    openGraph: {
      title: `${meta.name} | Fei`,
      description: meta.seo_description,
    },
  };
}

const Page = async ({ params }: { params: Params }) => {
  const { meta, content }: { meta: Stack; content: any } = await getPageContent(
    params.slug,
  );

  const stack = await getAllCollectionMeta("stack", 3, params.slug);

  return (
    <div className="flex flex-col gap-8">
      <BackLink href="/stack">返回</BackLink>
      <div className="flex flex-col gap-4 border-b border-ui-component-default pb-8">
        <h1 className="text-4xl font-medium">{meta.name}</h1>
      </div>
      <div className="container flex flex-col gap-6 py-4">{content}</div>

      {stack.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-medium">相关文章</span>
          <Listicle collection={stack} kind="stack" />
        </div>
      )}
    </div>
  );
};

export default Page;
