import { ReactNode } from "react";

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="animate-fade-in">{children}</div>
);

export default PageWrapper;
