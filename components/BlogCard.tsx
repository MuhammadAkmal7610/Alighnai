import Link from "next/link";

interface BlogCardProps {
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  slug: string;
}

export function BlogCard({ title, date, tag, excerpt, slug }: BlogCardProps) {
  return (
    <article className="flex flex-col rounded-btn border border-light-slate bg-white p-6">
      <div className="flex items-center gap-3 text-xs">
        <span className="rounded-btn bg-off-white px-2 py-1 font-medium text-deep-blue">
          {tag}
        </span>
        <time dateTime={date} className="text-slate">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">
        {excerpt}
      </p>
      <Link
        href={`/insights/${slug}`}
        className="mt-4 inline-block text-sm font-medium text-mid-blue hover:text-deep-blue transition-colors"
      >
        Read more &rarr;
      </Link>
    </article>
  );
}
