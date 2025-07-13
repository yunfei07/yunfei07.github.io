import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEvernote,
// } from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import { getAllCollectionMeta } from "@/lib/mdx";
import ListContainer from "@/components/ui/list/list-container";
import Listicle from "@/components/ui/list/listicle";
// import NewsletterSignup from "@/components/ui/newsletter-signup";
// import Avatar from "@/components/ui/avatar";

export default async function Home() {
  // const drops = await getAllCollectionMeta("drops", 3);
  const stack = await getAllCollectionMeta("stack", 3);
  const letters = await getAllCollectionMeta("letters", 3);

  const ventures = [
    {
      name: "YouTube | Fei",
      description: "Aesthetic tech videos.",
      url: "https://youtube.com/",
    },
  ];

  const socials = [
    // {
    //   url: "https://caccamise.link/x",
    //   icon: faXTwitter,
    // },
  ];

  return (
    <>
      <main className="flex flex-col gap-16 md:gap-24">
        {/* <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-medium">欢迎来到我的个人网站</h1>
          <p>这是一个展示我作品和分享我想法的地方。</p>
        </div> */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">关于我</h2>
          <p>我是一名全栈开发工程师，专注于分享我的经验和见解。</p>
        </div>

        <ListContainer title="近期文章" description="记录我的经验和学习笔记">
          <Listicle collection={letters} kind="letters" />
        </ListContainer>

        <ListContainer title="技术栈" description="日常开发中使用的工具和技术">
          <Listicle collection={stack} kind="stack" />
        </ListContainer>

        {/* <div id="connect" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span>联系方式</span>
            <p>
              如果你想和我交流或合作，可以通过以下方式与我联系：
              <br />
              <FontAwesomeIcon
                icon={faEnvelope}
                className="mr-2 inline-block"
                width={16}
                height={16}
              />
              <Link
                className="hover:opacity-90"
                href="mailto:cole@yunfei07.github.io"
              >
                yangyunfei07@gmail.com
              </Link>{" "}
            </p>
          </div>

          <div className="flex gap-4">
            {socials.map((social) => (
              <Link
                href={social.url}
                key={social.url}
                className="flex h-12 w-12 items-center justify-center rounded-md border border-borders-non-interactive bg-sidebar-bg text-low-contrast-text hover:border-subtle-borders-interactive hover:bg-ui-component-default hover:text-high-contrast-text"
              >
                <FontAwesomeIcon width={20} icon={social.icon} />
              </Link>
            ))}
          </div>
        </div> */}
      </main>
    </>
  );
}
