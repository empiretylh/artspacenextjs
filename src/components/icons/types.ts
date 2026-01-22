import type { SVGProps } from "react";

type OmitSVGProps = Omit<
   SVGProps<SVGSVGElement>,
   "width" | "height" | "viewBox"
>;

export interface IconProps extends OmitSVGProps {
   /**
    * The width and height of the icon in pixels
    * @default 24
    */
   size?: number;
   /**
    * The color of the icon
    * @default 'currentColor'
    */
   color?: string;
   /**
    * The width of the stroke
    * @default 1.5
    */
   strokeWidth?: number;
   /**
    * The title of the icon for accessibility
    */
   title?: string;
}
