import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ForumThread, ForumComment } from '@/types/forum';
import forumData from '@/data/forum.json';
import { useProfileStore } from './useProfileStore';

export const useForumStore = defineStore('forum', () => {
  const threads = ref<ForumThread[]>(
    JSON.parse(localStorage.getItem('gm-forum-threads') || JSON.stringify(forumData))
  );

  const activeCategory = ref<string>('All');
  const activeThreadId = ref<string | null>(threads.value[0]?.id || null);
  const isPostModalOpen = ref<boolean>(false);

  const profileStore = useProfileStore();

  const saveThreads = () => {
    localStorage.setItem('gm-forum-threads', JSON.stringify(threads.value));
  };

  const filteredThreads = computed(() => {
    if (activeCategory.value === 'All') return threads.value;
    return threads.value.filter(t => t.category === activeCategory.value);
  });

  const activeThread = computed(() => {
    return threads.value.find(t => t.id === activeThreadId.value) || null;
  });

  const selectThread = (threadId: string) => {
    activeThreadId.value = threadId;
    const thread = threads.value.find(t => t.id === threadId);
    if (thread) {
      thread.viewsCount += 1;
      saveThreads();
    }
  };

  const addComment = (threadId: string, content: string) => {
    const thread = threads.value.find(t => t.id === threadId);
    if (thread && content.trim()) {
      const newComment: ForumComment = {
        id: `comment-${Date.now()}`,
        authorName: 'Sang Pembaca (You)',
        authorTier: profileStore.currentTierInfo.title,
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ScholarYou',
        isVerifiedReader: true,
        content: content.trim(),
        timestamp: 'Baru saja',
        likesCount: 1,
        isLikedByUser: true,
      };
      thread.comments.push(newComment);
      saveThreads();
    }
  };

  const addThread = (data: { title: string; content: string; category: ForumThread['category']; bookTitle: string }) => {
    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      bookId: 'chronicles-of-aethelgard',
      bookTitle: data.bookTitle,
      category: data.category,
      title: data.title,
      content: data.content,
      authorName: 'Sang Pembaca (You)',
      authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ScholarYou',
      authorTier: profileStore.currentTierInfo.title,
      timestamp: 'Baru saja',
      likesCount: 1,
      isLikedByUser: true,
      viewsCount: 1,
      comments: [],
    };
    threads.value.unshift(newThread);
    activeThreadId.value = newThread.id;
    saveThreads();
    isPostModalOpen.value = false;
  };

  const toggleLikeThread = (threadId: string) => {
    const thread = threads.value.find(t => t.id === threadId);
    if (thread) {
      if (thread.isLikedByUser) {
        thread.likesCount -= 1;
        thread.isLikedByUser = false;
      } else {
        thread.likesCount += 1;
        thread.isLikedByUser = true;
      }
      saveThreads();
    }
  };

  const toggleLikeComment = (threadId: string, commentId: string) => {
    const thread = threads.value.find(t => t.id === threadId);
    if (thread) {
      const comment = thread.comments.find(c => c.id === commentId);
      if (comment) {
        if (comment.isLikedByUser) {
          comment.likesCount -= 1;
          comment.isLikedByUser = false;
        } else {
          comment.likesCount += 1;
          comment.isLikedByUser = true;
        }
        saveThreads();
      }
    }
  };

  return {
    threads,
    activeCategory,
    activeThreadId,
    activeThread,
    filteredThreads,
    isPostModalOpen,
    selectThread,
    addComment,
    addThread,
    toggleLikeThread,
    toggleLikeComment,
  };
});
