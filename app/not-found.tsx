import KButton from "@/components/shared/KButton";

export default function NotFound() {
  return (
    <section className="k-404" data-theme="light">
      <div className="container">
        <span className="why-section-label">+ PAGE NOT FOUND</span>
        <p className="k-404-code">404</p>
        <h1 className="why-main-title">
          <span className="k-muted">This page</span>
          <br />
          doesn&apos;t exist
        </h1>
        <div className="k-404-actions">
          <KButton href="/" label="Back to home" variant="accent" />
          <KButton href="/contact" label="Contact us" />
        </div>
      </div>
    </section>
  );
}
