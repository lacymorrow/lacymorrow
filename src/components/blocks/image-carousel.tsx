
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ImageCarousel() {
  const images = [
    "/static/work/credit-karma/credit-karma-2.png",
    "/static/work/credit-karma/credit-karma-1.png",
    "/static/work/credit-karma/credit-karma-3.png",
    "/static/work/credit-karma/credit-karma-4.png",
    "/static/work/credit-karma/credit-karma-5.png",
    "/static/work/credit-karma/credit-karma-6.png",
    "/static/work/credit-karma/credit-karma-7.png",
    "/static/work/credit-karma/credit-karma-8.png",
    "/static/work/credit-karma/credit-karma-9.png",
    "/static/work/credit-karma/credit-karma-10.png",
    "/static/work/credit-karma/credit-karma-11.png",
    "/static/work/credit-karma/credit-karma-12.png",
    "/static/work/credit-karma/credit-karma-13.png",
    "/static/work/credit-karma/credit-karma-14.png",
    "/static/work/credit-karma/credit-karma-15.png",
  ];

  return (
    <Carousel className="w-full max-w-4xl mx-auto my-8">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Image
                src={src}
                alt={`Credit Karma screenshot ${index + 1}`}
                width={1200}
                height={800}
                className="rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
} 