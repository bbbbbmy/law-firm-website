-- CreateTable
CREATE TABLE "careers_contents" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "bannerTitle" TEXT NOT NULL,
    "bannerSubtitle" TEXT NOT NULL,
    "bannerQuote" TEXT NOT NULL,
    "introTitle" TEXT NOT NULL,
    "introContent" TEXT NOT NULL,
    "environmentTitle" TEXT NOT NULL,
    "environmentLabel" TEXT NOT NULL,
    "environmentContent" TEXT NOT NULL,
    "environmentImageUrl" TEXT,
    "supportTitle" TEXT NOT NULL,
    "supportLabel" TEXT NOT NULL,
    "supportLead" TEXT NOT NULL,
    "creationTitle" TEXT NOT NULL,
    "creationLabel" TEXT NOT NULL,
    "creationContent" TEXT NOT NULL,
    "invitationTitle" TEXT NOT NULL,
    "invitationLabel" TEXT NOT NULL,
    "invitationContent" TEXT NOT NULL,
    "jobsTitle" TEXT NOT NULL,
    "contactTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "careers_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers_cards" (
    "id" TEXT NOT NULL,
    "careersId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "careers_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers_jobs" (
    "id" TEXT NOT NULL,
    "careersId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "duties" TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "careers_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "careers_contents_language_key" ON "careers_contents"("language");

-- CreateIndex
CREATE UNIQUE INDEX "careers_cards_careersId_sortOrder_key" ON "careers_cards"("careersId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "careers_jobs_careersId_sortOrder_key" ON "careers_jobs"("careersId", "sortOrder");

-- AddForeignKey
ALTER TABLE "careers_cards" ADD CONSTRAINT "careers_cards_careersId_fkey" FOREIGN KEY ("careersId") REFERENCES "careers_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "careers_jobs" ADD CONSTRAINT "careers_jobs_careersId_fkey" FOREIGN KEY ("careersId") REFERENCES "careers_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;