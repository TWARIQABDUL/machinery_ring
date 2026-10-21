import { Link } from "react-router";
import Container from "./container";

export default function PageHeader({
  crumb,
  title,
  intro,
}: {
  crumb: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="border-b border-line bg-cream">
      <Container className="flex flex-col gap-3.5 py-12 md:py-14">
        <span className="text-[13px] text-muted-2">
          <Link to="/" className="text-muted-2 hover:text-deep">
            Home
          </Link>
          &nbsp;/&nbsp;{crumb}
        </span>
        <h1 className="max-w-[16em] font-display text-3xl font-normal tracking-[-0.01em] text-ink md:text-4xl">{title}</h1>
        <p className="max-w-[42em] text-base text-muted md:text-[16.5px]">{intro}</p>
      </Container>
    </section>
  );
}
