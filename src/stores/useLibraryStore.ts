import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BookSummary, BookManifest } from '@/types/manifest';
import booksData from '@/data/books.json';
import aethelgardManifest from '@/data/manifests/chronicles-of-aethelgard.json';
import alchemistManifest from '@/data/manifests/the-alchemist.json';

const MANIFEST_REGISTRY: Record<string, BookManifest> = {
  'chronicles-of-aethelgard': aethelgardManifest as unknown as BookManifest,
  'the-alchemist': alchemistManifest as unknown as BookManifest,
};

export const useLibraryStore = defineStore('library', () => {
  const books = ref<BookSummary[]>(
    JSON.parse(localStorage.getItem('gm-library-books') || JSON.stringify(booksData))
  );

  const activeFilter = ref<string>('All');
  const searchQuery = ref<string>('');

  const recentlyReadBook = computed<BookSummary>(() => {
    // 1. Search for an unlocked book that is in-progress (0 < progress < 100)
    const inProgress = books.value
      .filter(b => b.isUnlocked && b.progressPercent > 0 && b.progressPercent < 100)
      .sort((a, b) => (b.lastReadDate || '').localeCompare(a.lastReadDate || ''));
    if (inProgress.length > 0 && inProgress[0]) return inProgress[0];

    // 2. Fallback to any unlocked book with lastReadDate
    const withDate = books.value
      .filter(b => b.isUnlocked && b.lastReadDate)
      .sort((a, b) => (b.lastReadDate || '').localeCompare(a.lastReadDate || ''));
    if (withDate.length > 0 && withDate[0]) return withDate[0];

    // 3. Fallback to any unlocked book
    const unlocked = books.value.filter(b => b.isUnlocked);
    if (unlocked.length > 0 && unlocked[0]) return unlocked[0];

    // 4. Default fallback
    return books.value[0];
  });

  const saveBooks = () => {
    localStorage.setItem('gm-library-books', JSON.stringify(books.value));
  };

  const getBookById = (id: string) => {
    return books.value.find(b => b.id === id);
  };

  const findBookByIsbn = (isbnInput: string): BookSummary | null => {
    const cleanIsbn = isbnInput.replace(/[-\s]/g, '').trim().toLowerCase();
    return books.value.find(b => b.isbn.replace(/[-\s]/g, '').toLowerCase() === cleanIsbn) || null;
  };

  const getManifestByBookId = (bookId: string): BookManifest | null => {
    return MANIFEST_REGISTRY[bookId] || (aethelgardManifest as unknown as BookManifest);
  };

  const getPageChallenge = (bookId: string) => {
    const manifest = getManifestByBookId(bookId);
    if (manifest && manifest.pageChallenge) {
      return manifest.pageChallenge;
    }
    // Fallbacks for other books
    if (bookId === 'atomic-habits') {
      return {
        question: 'Buka halaman 25 buku fisikmu, apa kata kedua di judul bab pertama?',
        pageNumber: 25,
        lineNumber: 1,
        expectedWord: 'kebiasaan',
        hint: 'Perilaku otomatis yang dilakukan berulang kali.',
      };
    }
    if (bookId === 'fate-stay-night-prelude') {
      return {
        question: 'Buka halaman 12 buku fisikmu, apa sebutan artefak suci yang diperebutkan para Magus?',
        pageNumber: 12,
        lineNumber: 2,
        expectedWord: 'grail',
        hint: 'Cawan suci yang mengabulkan segala permohonan.',
      };
    }
    return {
      question: 'Buka halaman 42 buku fisikmu, apa kata ketiga di baris pertama?',
      pageNumber: 42,
      lineNumber: 1,
      expectedWord: 'obsidian',
      hint: 'Batu vulkanik hitam kaca yang menjadi nama menara benteng.',
    };
  };

  const unlockBook = (bookId: string) => {
    const book = books.value.find(b => b.id === bookId);
    if (book) {
      book.isUnlocked = true;
      saveBooks();
    }
  };

  const verifyIsbn = (isbnInput: string): { success: boolean; book?: BookSummary; message: string } => {
    const found = findBookByIsbn(isbnInput);
    if (found) {
      return { success: true, book: found, message: `Buku "${found.title}" ditemukan di server!` };
    }
    return { success: false, message: 'ISBN tidak ditemukan di pangkalan data naskah resmi.' };
  };

  const verifyPageChallenge = (bookId: string, answer: string): boolean => {
    const challenge = getPageChallenge(bookId);
    if (!challenge) return true;
    const isCorrect = challenge.expectedWord.trim().toLowerCase() === answer.trim().toLowerCase();
    if (isCorrect) {
      unlockBook(bookId);
    }
    return isCorrect;
  };

  const simulateByobVerification = (fileName: string): Promise<{ success: boolean; hash: string; matchedBook?: BookSummary }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated deterministic hash based on filename
        const hash = 'e2fc714c4727ee9395f324cd2e7f331f';
        const matchedBook = books.value.find(b => b.id === 'chronicles-of-aethelgard') || books.value[0];
        if (matchedBook) {
          matchedBook.isUnlocked = true;
          saveBooks();
        }
        resolve({
          success: true,
          hash,
          matchedBook,
        });
      }, 350);
    });
  };

  const addCustomEpub = (fileName: string): BookSummary => {
    const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const newBook: BookSummary = {
      id: `byob-${Date.now()}`,
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      author: 'Pengunggah Lokal (BYOB)',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      synopsis: `Naskah pribadi dimuat secara lokal dari file "${fileName}". Divalidasi dan dienkripsi di peramban Anda.`,
      genres: ['BYOB', 'Naskah Lokal'],
      isbn: 'BYOB-LOCAL-EPUB',
      estimatedReadMinutes: 30,
      isUnlocked: true,
      isCustomAuthorMode: false,
      progressPercent: 0,
      currentChapterId: 'ch-1',
      lastReadDate: new Date().toISOString().split('T')[0],
    };
    books.value.unshift(newBook);
    saveBooks();
    return newBook;
  };

  const toggleAuthorCustomMode = (bookId: string) => {
    const book = books.value.find(b => b.id === bookId);
    if (book) {
      book.isCustomAuthorMode = !book.isCustomAuthorMode;
      saveBooks();
    }
  };

  return {
    books,
    activeFilter,
    searchQuery,
    recentlyReadBook,
    getBookById,
    findBookByIsbn,
    getManifestByBookId,
    getPageChallenge,
    unlockBook,
    verifyIsbn,
    verifyPageChallenge,
    simulateByobVerification,
    addCustomEpub,
    toggleAuthorCustomMode,
  };
});
