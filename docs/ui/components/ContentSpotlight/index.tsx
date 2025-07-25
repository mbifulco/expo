import { mergeClasses } from '@expo/styleguide';
import { useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import { LightboxImage } from './LightboxImage';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const PLAYER_WIDTH = '100%';
const PLAYER_HEIGHT = '100%';

type ContentSpotlightProps = {
  alt?: string;
  src?: string;
  file?: string;
  caption?: string;
  controls?: any;
  loop?: boolean;
  className?: string;
  containerClassName?: string;
};

export function ContentSpotlight({
  alt,
  src,
  file,
  caption,
  controls,
  loop = true,
  className,
  containerClassName,
}: ContentSpotlightProps) {
  const [forceShowControls, setForceShowControls] = useState<boolean>();
  const isVideo = !!file;
  const playerRef = useRef(null);
  const isInView = useInView(playerRef);

  return (
    <figure
      className={mergeClasses(
        'my-5 cursor-pointer rounded-lg py-2.5 text-center',
        containerClassName,
        !isVideo && 'bg-subtle'
      )}
      onClick={() => {
        if (typeof controls === 'undefined' && !forceShowControls) {
          setForceShowControls(true);
        }
      }}>
      {src ? (
        <LightboxImage
          src={src}
          alt={alt}
          className={mergeClasses(
            'inline rounded-md transition-opacity duration-default ease-in-out hover:opacity-80',
            className
          )}
        />
      ) : isVideo ? (
        <div
          className="relative aspect-video overflow-hidden rounded-lg bg-palette-black"
          ref={playerRef}>
          <ReactPlayer
            url={`/static/videos/${file}`}
            className="react-player"
            width={PLAYER_WIDTH}
            height={PLAYER_HEIGHT}
            muted
            playing={isInView && !!file}
            controls={typeof controls === 'undefined' ? forceShowControls : controls}
            playsinline
            loop={loop}
          />
          <div
            className={mergeClasses(
              'pointer-events-none absolute inset-0 transition-opacity duration-500 max-md-gutters:hidden',
              isInView ? 'opacity-0' : 'opacity-70'
            )}
          />
        </div>
      ) : null}
      {caption && (
        <figcaption
          className={mergeClasses(
            'mt-3.5 cursor-text px-8 py-2 text-center text-xs text-secondary',
            isVideo && 'bg-transparent'
          )}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
