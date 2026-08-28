export interface ForumComment {
  id: string;
  authorName: string;
  authorTier: string;
  authorAvatar: string;
  isVerifiedReader: boolean;
  content: string;
  timestamp: string;
  likesCount: number;
  isLikedByUser?: boolean;
}

export interface ForumThread {
  id: string;
  bookId: string;
  bookTitle: string;
  category: 'Discussions' | 'Theories' | 'Character Analysis' | 'AI Explains Q&A';
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  authorTier: string;
  timestamp: string;
  likesCount: number;
  isLikedByUser?: boolean;
  viewsCount: number;
  comments: ForumComment[];
}
