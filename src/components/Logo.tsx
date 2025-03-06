function LogoImage(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 80" {...props}>
      <path
        fill="currentColor"
        stroke="currentColor"
        d="M11 75zm1-4zm-2 0v2-2zm3-4v1-1zm-2-1v2-2zm3-2v1-1zm1-3v1-1zM9 0 8 1H7L6 2v2L5 5 4 4V3L3 4v1l1 1h1V5l1-1 1 1v1l1 1v4l-1 1v1l-1 1H5l-1 1H2l-1 1H0v4l1 1v1l1 1v1l2 2v1l2 2-1 1v2l-3 3v1l-1 1 1 1-2 2v3l1 1v1l-1 1v4l1 1v6l1 1v5-3l1-1 1 1v9-6l1-1v-2l1-1v-3l1-1v-1l1-1 1 1v2l-1 1v3l-1 1v3l-1 1v9-8l1-1v-3l1-1v-2l1-1v-2l1-1v-2l1-1 1 1v3l-1 1v2l-1 1v3l-1 1v4l-1 1v10l1 1v-2l-1-1v-8l1-1v-4l1-1v-2l1-1v-3l1-1v-2l1-1v-2l1-1 1 1v3l-1 1v3l-1 1v2l-1 1v2-2l1-1v-2l1-1v-2l1-1v-3l1-1v-2l1-1v-3l1-1 1 1v4l-1 1v3l-1 1v2l-1 1v2-2l1-1v-1l1-1v-1l1-1v-2l1-1v-2l1-1v-8l-1-1v-1l-1-1h-1l-2-2 1-1h1l-1-1v-2l-1-1v-5l1-1v-5l-2-2h-3l-2-2v-1l-1-1 2-2h2V2l-1-1h-1l-1-1H9z"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="flex max-h-full items-center gap-2">
      <LogoImage className="h-[40px]" />
      <div className="flex flex-col leading-none">
        <h1 className="text-md font-bold tracking-normal">Fashion AI</h1>
        <p className="text-xs font-light tracking-tight">Tooploox demo</p>
      </div>
    </div>
  );
}
