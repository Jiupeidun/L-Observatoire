declare module "react-split-flap-effect" {
  import { ComponentType } from "react";

  export const Presets: {
    NUM: string;
    ALPHANUM: string;
  };

  export interface FlapDisplayProps {
    value: string;
    length: number;
    chars?: string;
    padChar?: string;
    padMode?: "auto" | "start" | "end";
    timing?: number;
    hinge?: boolean;
    className?: string;
    id?: string;
    css?: object;
    words?: string[];
    render?: (props: unknown) => React.ReactNode;
  }

  export const FlapDisplay: ComponentType<FlapDisplayProps>;
}
