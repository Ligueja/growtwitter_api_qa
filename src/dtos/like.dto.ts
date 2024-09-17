export interface CreateLikeDTO {
  userId: string;
  tweetId: string;
}

export interface GetLikedDTO {
  userId: string;
  tweetId: string;
}
