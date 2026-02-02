import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';

interface AppImageProps extends ImageProps {
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

const AppImage = ({ src, alt, containerStyle, containerClassName, ...props }: AppImageProps) => {
  return (
    <div style={containerStyle} className={cn(!props.width && ("relative w-full h-full"), containerClassName)}>
      <Image
        src={src}
        alt={alt}
        fill={props.width === undefined && props.height === undefined}
        // className="object-cover"
        className={"w-full h-full object-cover transition-opacity duration-500"}
        {...props}
      />
    </div>
  );
};

export default AppImage;
