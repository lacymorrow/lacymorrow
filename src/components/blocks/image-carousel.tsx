
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Zoom from 'react-medium-image-zoom'

import 'react-medium-image-zoom/dist/styles.css'

interface ImageCarouselProps {
  images: string[];
  altPrefix?: string;
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export function ImageCarousel({ 
  images, 
  altPrefix = "Image",
  className = "w-full max-w-4xl mx-auto my-8",
  imageWidth = 1200,
  imageHeight = 800
}: ImageCarouselProps) {
  return (
    <Carousel className={className}>
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Zoom>
              <div className="relative w-full" style={{ aspectRatio: `${imageWidth}/${imageHeight}` }}>
                <Image
                  src={src}
                  alt={`${altPrefix} ${index + 1}`}
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
              </Zoom>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
