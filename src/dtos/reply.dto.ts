export interface CreateReply {
  tweetId: string;
  content: string;
  userId: string;
}

export interface GetReplyById {
  tweetId: string;
  userId: string;
}
