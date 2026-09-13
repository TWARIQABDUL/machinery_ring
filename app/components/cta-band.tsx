import { Link } from "react-router";
import Container from "./container";

type Action = { label: string; to?: string; href?: string; variant?: "primary" | "secondary" };

const PRIMARY = "rounded-lg bg-brand-600 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-700";
const SECONDARY = "rounded-lg border-[1.5px] border-brand-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-brand-700 hover:bg-brand-50";

/** The light-green "here's the ask, here's the button(s)" band used to close out a page. */
export default function CtaBand({ title, description, actions }: { title: string; description: string; actions: Action[] }) {
  return (
    <section className="bg-brand-50">
      <Container className="flex flex-wrap items-center justify-between gap-7 py-14">
        <div className="flex max-w-[34em] flex-col gap-2.5">
          <h2 className="font-display text-2xl font-extrabold text-ink md:text-[28px]">{title}</h2>
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
