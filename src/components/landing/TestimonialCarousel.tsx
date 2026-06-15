import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Rina & Adi",
    role: "Menikah Juni 2026",
    text: "Awalnya bingung banget rencana pernikahan — budget, venue, semuanya. Pakai dinikahin.com, dalam 10 menit udah dapet gambaran jelas. Langsung pede lanjut ke tahap berikutnya!",
    rating: 5,
  },
  {
    name: "Dina & Rizky",
    role: "Menikah Agustus 2026",
    text: "Dini-nya ramah banget! Kayak curhat sama temen yang ngerti banget soal wedding. Rekomendasinya juga akurat — sesuai budget dan gaya yang kami mau. Recommended!",
    rating: 5,
  },
  {
    name: "Sari & Andi",
    role: "Menikah Oktober 2026",
    text: "Fitur perbandingan-nya paling membantu. Bisa lihat harga, kapasitas, sama skor berdampingan. Akhirnya nemu yang pas tanpa stress. Gak nyangka serunya!",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Cerita <span className="text-[#D43F6F]">Pengantin</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Pasangan yang sudah terbantu mewujudkan pernikahan impian mereka.
          </p>
        </div>

        <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="basis-full md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 mx-2 border-2 border-border rounded-2xl h-full">
                  <Quote className="h-8 w-8 text-[#E8D5B7] mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#C9A84C] text-[#C9A84C]" />
                    ))}
                  </div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
