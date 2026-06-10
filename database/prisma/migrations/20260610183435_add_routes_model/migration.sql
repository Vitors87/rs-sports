-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sportId" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "elevationGain" INTEGER,
    "durationMin" INTEGER,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT DEFAULT 'Chile',
    "difficulty" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
