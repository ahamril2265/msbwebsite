import Image from "next/image";

// Two-column layout for sign-in / sign-up pages.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="container-x grid min-h-[75vh] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
      <div className="relative hidden h-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-brandSoft to-page lg:block">
        <Image src={encodeURI("/Products/Carry Bag/B1316.png")} alt="" fill sizes="600px" className="object-contain p-16" />
        <div className="absolute inset-x-8 bottom-8 rounded-2xl bg-surface/95 p-5 shadow-card">
          <div className="font-display font-bold">Packaging for shops & restaurants</div>
          <p className="mt-1 text-sm">Track orders, reorder faster and get bulk pricing with a Mustawa account.</p>
        </div>
      </div>
    </main>
  );
}
