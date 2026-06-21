export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <article
      className="max-w-3xl mx-auto leading-relaxed
        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2
        [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-2
        [&_p]:text-sm [&_p]:mb-3
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:text-sm [&_ul]:mb-3
        [&_li]:marker:text-[var(--muted)]
        [&_a]:underline"
    >
      {children}
    </article>
  )
}
