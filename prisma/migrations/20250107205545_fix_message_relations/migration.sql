-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isEdited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replyToId" INTEGER;

-- CreateTable
CREATE TABLE "MessageMention" (
    "messageId" INTEGER NOT NULL,
    "groupUserId" INTEGER NOT NULL,

    CONSTRAINT "MessageMention_pkey" PRIMARY KEY ("messageId","groupUserId")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMention" ADD CONSTRAINT "MessageMention_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageMention" ADD CONSTRAINT "MessageMention_groupUserId_fkey" FOREIGN KEY ("groupUserId") REFERENCES "GroupUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
