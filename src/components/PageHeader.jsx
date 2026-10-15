const PageHeader = ({ eyebrow, title, description }) => {
  return (
    <header className="mb-8">
      {eyebrow ? <p className="label-eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-2 text-section font-extrabold tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-[68ch] text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
};

export default PageHeader;
