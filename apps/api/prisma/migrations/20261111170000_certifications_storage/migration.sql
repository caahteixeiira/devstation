-- AlterTable
ALTER TABLE "ProjectImage" ADD COLUMN     "contentType" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "sizeBytes" INTEGER,
ADD COLUMN     "width" INTEGER,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Certification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "imagePath" TEXT,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "contentType" TEXT,
    "sizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "deleting" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageCleanup" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "notBefore" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StorageCleanup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CertificationToTechnology" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CertificationToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certification_imagePath_key" ON "Certification"("imagePath");

-- CreateIndex
CREATE INDEX "Certification_featured_order_issueDate_idx" ON "Certification"("featured", "order", "issueDate");

-- CreateIndex
CREATE UNIQUE INDEX "StorageCleanup_path_key" ON "StorageCleanup"("path");

-- CreateIndex
CREATE INDEX "StorageCleanup_notBefore_idx" ON "StorageCleanup"("notBefore");

-- CreateIndex
CREATE INDEX "_CertificationToTechnology_B_index" ON "_CertificationToTechnology"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectImage_imagePath_key" ON "ProjectImage"("imagePath");

-- AddForeignKey
ALTER TABLE "_CertificationToTechnology" ADD CONSTRAINT "_CertificationToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationToTechnology" ADD CONSTRAINT "_CertificationToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
