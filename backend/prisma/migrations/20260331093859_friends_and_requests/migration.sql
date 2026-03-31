-- CreateEnum
CREATE TYPE "FriendReqStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "FriendReq" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "FriendReqStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendReq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL,
    "userId1" TEXT NOT NULL,
    "userId2" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FriendReq_receiverId_idx" ON "FriendReq"("receiverId");

-- CreateIndex
CREATE INDEX "FriendReq_senderId_idx" ON "FriendReq"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendReq_senderId_receiverId_key" ON "FriendReq"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Friend_userId1_idx" ON "Friend"("userId1");

-- CreateIndex
CREATE INDEX "Friend_userId2_idx" ON "Friend"("userId2");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_userId1_userId2_key" ON "Friend"("userId1", "userId2");

-- AddForeignKey
ALTER TABLE "FriendReq" ADD CONSTRAINT "FriendReq_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendReq" ADD CONSTRAINT "FriendReq_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
