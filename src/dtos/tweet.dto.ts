import { TweetType } from "@prisma/client";

export interface CreateTweetDTO {
  userId: string;
  content: string;
}

export interface ListTweetsInputDTO {
  userId: string;
}

export interface ListTweetsOutputDTO {
  type: TweetType;
  userId: string;
  user: {
    name: string;
    username: string;
  };

  Like: {
    id: string;
    userId: string;
    tweetId: string;
    user: {
      username: string;
    };
  }[];
}

export interface UpdateTweetInputDTO {
  id: string;
  content: string;
  userId: string;
}

export interface DeleteTweetInputDTO {
  id: string;
  userId: string;
}
