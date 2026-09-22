import { Link } from "react-router";
import PageHeader from "../components/page-header";
import Container from "../components/container";
import PendingPhoto from "../components/pending-photo";
import type { Route } from "./+types/blogpage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Blog | Machinery Ring Rwanda" }];
}

// Static for now — will read from the `blog_posts` table once the Blog admin exists.
const FEATURED_POST = {
  tag: "Women's participation",
  when: "January–March 2026",
  title: "Women's leadership training paves the way for digital skills",
  body: "Women's leadership and communication training in January was followed by Microsoft Word and Excel training in March, supporting participation and practical organisational skills across the Rings.",
};

const POSTS = [
  {
    tag: "Field days",
    when: "September 2024",
    title: "Field days bring machinery demonstrations to Mwendo and Kagomasi",
    body: "Field days took place in Mwendo on 4 September and Kagomasi on 5 September, part of the programme of machinery demonstrations and farmer engagement.",
  },
  {
    tag: "Field days",
    when: "January 2026",
    title: "A new round of field days continues practical learning",
    body: "Further field-day activities took place in Mwendo and Kagomasi on 8–9 January, continuing practical learning through the local Ring network.",
  },
];

export default function BlogPage() {
  return (
    <div>
      <PageHeader
        crumb="Blog"
        title="Blog"
        intro="Updates from local Rings, field days and training, drawn from our recorded activity in Gashora Sector, Bugesera District."
      />

      {/* Featured post */}
      <section className="bg-white">
        <Container className="pb-6 pt-14">
          <article className="grid overflow-hidden rounded-[20px] border border-line md:grid-cols-2">
            <PendingPhoto className="aspect-[16/11] md:aspect-auto" />
            <div className="flex flex-col gap-3.5 p-9">
              <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wide text-muted-2">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{FEATURED_POST.tag}</span>
                {FEATURED_POST.when}
              </span>
              <h2 className="font-display text-[27px] font-extrabold leading-tight text-ink">{FEATURED_POST.title}</h2>
              <p className="text-[15px] text-muted">{FEATURED_POST.body}</p>
            </div>
          </article>
        </Container>
      </section>

      {/* Post grid */}
      <section className="bg-[#F7F9F7]">
        <Container className="pb-16 pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {POSTS.map((post) => (
              <article key={post.title} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
                <PendingPhoto className="aspect-[16/10]" />
                <div className="flex flex-col gap-2 p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-2">
                    {post.tag} &middot; {post.when}
                  </span>
                  <h3 className="text-lg font-bold leading-snug text-ink">{post.title}</h3>
                  <p className="text-[14.5px] text-muted">{post.body}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-7 text-[13px] text-muted-2">
            More updates are added here as Ring activities happen. Earlier updates are also listed on{" "}
            <Link to="/our-work" className="font-medium text-brand-700 hover:text-brand-900">
              Our Work
            </Link>
            .
          </p>
        </Container>
      </section>
    </div>
  );
}
