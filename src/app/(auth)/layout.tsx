import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-svh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo />
        </div>
        <div className="relative z-20 mt-auto flex flex-col gap-5 py-6">
          <p className="text-lg">Transform Your Fashion Photography with AI</p>
          <p>
            Experience the future of fashion imagery with our AI-driven service.
            Upload a photo of your garment and generate lifelike on-model images
            in minutes.
          </p>
          <ul className="list-inside list-disc">
            Why AI Fashion?
            <li>
              Reduced time-to-market: Accelerate your product launch timelines.
            </li>
            <li>
              Cost-effective production: Starting from just a few cents per
              photo.
            </li>
            <li>
              Limitless model diversity: Customize model attributes such as
              gender, age, ethnicity, body type, and location.
            </li>
          </ul>
          <p>Some names that trusted us: eBay, Stitch Fix.</p>
        </div>
      </div>
      {children}
    </div>
  );
}
