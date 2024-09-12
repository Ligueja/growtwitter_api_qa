/*
  Warnings:

  - You are about to drop the column `tweetId` on the `replys` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `replys` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `tweets` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tweets` table. All the data in the column will be lost.
  - You are about to drop the column `auth_token` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tweet_reply_id]` on the table `replys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tweet_original_id` to the `replys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tweet_reply_id` to the `replys` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replys" DROP CONSTRAINT "replys_tweetId_fkey";

-- DropForeignKey
ALTER TABLE "replys" DROP CONSTRAINT "replys_userId_fkey";

-- AlterTable
ALTER TABLE "replys" DROP COLUMN "tweetId",
DROP COLUMN "userId",
ADD COLUMN     "tweet_original_id" UUID NOT NULL,
ADD COLUMN     "tweet_reply_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "tweets" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "auth_token";

-- CreateTable
CREATE TABLE "followers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "follower_id" UUID NOT NULL,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "replys_tweet_reply_id_key" ON "replys"("tweet_reply_id");

-- AddForeignKey
ALTER TABLE "replys" ADD CONSTRAINT "replys_tweet_original_id_fkey" FOREIGN KEY ("tweet_original_id") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replys" ADD CONSTRAINT "replys_tweet_reply_id_fkey" FOREIGN KEY ("tweet_reply_id") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
