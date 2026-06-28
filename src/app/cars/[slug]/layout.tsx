import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

// Live-data page: render per-request so the build never depends on the DB.
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await db.vehicle.findUnique({
    where: { slug },
  });

  if (!vehicle) {
    return { title: "Vehicle Not Found" };
  }

  const photos: string[] = vehicle.photos ? JSON.parse(vehicle.photos) : [];

  return {
    title: `${vehicle.name} — Mighty Rides Kampala`,
    description: vehicle.description || `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale in Kampala, Uganda.`,
    alternates: { canonical: `/cars/${slug}` },
    openGraph: {
      title: `${vehicle.name} for Sale | Mighty Rides`,
      description: vehicle.description || undefined,
      images: photos.length ? [photos[0]] : undefined,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  try {
    const vehicles = await db.vehicle.findMany({
      where: {
        published: true,
        OR: [{ type: "SALE" }, { type: "BOTH" }],
      },
      select: { slug: true },
    });

    return vehicles.map((vehicle) => ({
      slug: vehicle.slug,
    }));
  } catch (error) {
    // Don't fail the build if the database is unreachable at build time;
    // these pages will be rendered on-demand instead.
    console.error("[generateStaticParams] cars/[slug] DB unavailable:", error);
    return [];
  }
}

export default function VehicleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
