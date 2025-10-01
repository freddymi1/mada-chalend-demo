"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/client/ui/card";
import { Button } from "@/components/client/ui/button";
import { Armchair, Calendar, Eye, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "use-intl";
import { useClientCircuit } from "../providers/client/ClientCircuitProvider";
import { useEffect } from "react";
import { LoadingSpinner } from "./loading";

export function ToursSection() {
  const t = useTranslations("lng");

  const { addedCircuits, fetchCircuits, isLoading } = useClientCircuit();

  useEffect(() => {
    const loadCircuits = async () => {
      await fetchCircuits();
    };
    loadCircuits();
  }, []);

  return (
    <section id="circuits" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            {t("tours.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t("tours.description")}
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {addedCircuits.map((tour, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover-lift animate-fade-in"
                  style={{
                    animationDelay: `${0.2 + index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={tour?.itineraries[0]?.image || "/placeholder.svg"}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-balance">
                      {tour.title}
                    </CardTitle>
                    <div className="flex items-center justify-start gap-10">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{tour.duration}</span>
                      </div>
                      
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-pretty">
                      {tour.description}
                    </p>
                   
                    <div className="flex gap-2">
                      <Link href={`/circuits/${tour.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full hover-lift bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t("tours.viewDetails")}
                        </Button>
                      </Link>
                      <Link
                        href={`/reservation/circuit?circuit=${tour.id}`}
                        className="flex-1"
                      >
                        <Button className="w-full hover-glow">
                          {t("tours.book")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div
              className="text-center animate-bounce-in"
              style={{ animationDelay: "0.8s", animationFillMode: "both" }}
            >
              <Link href="/reservation">
                <Button size="lg" className="hover-lift hover-glow">
                  {t("tours.customTour")}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
