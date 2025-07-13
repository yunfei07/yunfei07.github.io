import { getAllCollectionMeta } from "@/lib/mdx";
import NewsletterSignup from "@/components/ui/newsletter-signup";
import ListItem from "@/components/ui/list/list-item";

export default async function LettersPage() {
  const letters = await getAllCollectionMeta("letters");

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-medium">
         文章
        </h1>
        <p>
          思考是我的抵抗，创造是我的乐趣。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-medium">往期文章</span>

        <div className="flex flex-col">
          {letters.map((letter) => (
            <ListItem item={letter} kind="letters" key={letter.slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
