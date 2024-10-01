export interface CreateReply {
  tweetOriginalId: string;
  content: string;
  userId: string;
}

export interface GetReplyById {
  tweetId: string;
  userId: string;
}
