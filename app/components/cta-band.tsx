import { Link } from "react-router";
import Container from "./container";

type Action = { label: string; to?: string; href?: string; variant?: "primary" | "secondary" };

const PRIMARY = "rounded-full bg-deep px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-forest";
const SECONDARY = "rounded-full border-[1.5px] border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-deep hover:bg-cream-2";

/** The cream "here's the ask, here's the button(s)" band used to close out a page. */
export default function CtaBand({ title, description, actions }: { title: React.ReactNode; description: string; actions: Action[] }) {
  return (
    <section className="bg-cream">
      <Container className="flex flex-wrap items-center justify-between gap-7 py-14">
        <div className="flex max-w-[34em] flex-col gap-2.5">
          <h2 className="font-display text-2xl font-normal text-ink md:text-[28px]">{title}</h2>
          <p className="text-base text-muted">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3.5">
          {actions.map((action) => {
            const className = action.variant === "secondary" ? SECONDARY : PRIMARY;
            return action.href ? (
              <a key={action.label} href={action.href} className={className}>
                {action.label}
              </a>
            ) : (
              <Link key={action.label} to={action.to!} className={className}>
                {action.label}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
