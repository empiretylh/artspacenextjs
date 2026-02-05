import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';

interface AppImageProps extends ImageProps {
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  withoutContainer?: boolean;
}

const AppImage = ({ src, alt, containerStyle, containerClassName, withoutContainer = false, className, ...props }: AppImageProps) => {
  if (withoutContainer) return <Image src={src} alt={alt} {...props} />;

  return (
    <div style={containerStyle} className={cn("w-full h-full", !props.width && ("relative"), containerClassName)}>
      <Image
        src={src}
        alt={alt}
        fill={props.width === undefined && props.height === undefined}
        // className="object-cover"
        className={cn("w-full h-full object-cover duration-500", className)}
        {...props}
      />
    </div>
  );
};

export default AppImage;
