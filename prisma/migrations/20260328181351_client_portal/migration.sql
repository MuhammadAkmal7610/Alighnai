-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'CLIENT';

-- CreateTable
CREATE TABLE "client_resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_intakes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_intakes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assessment_intakes_userId_idx" ON "assessment_intakes"("userId");

-- AddForeignKey
ALTER TABLE "assessment_intakes" ADD CONSTRAINT "assessment_intakes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
