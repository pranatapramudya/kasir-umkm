export function ClientCachePurger() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            localStorage.clear();
            sessionStorage.clear();
          } catch(e) {}
        `
      }}
    />
  );
}
