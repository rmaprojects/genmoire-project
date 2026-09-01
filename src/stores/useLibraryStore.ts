import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BookSummary, BookManifest } from '@/types/manifest';
import booksData from '@/data/books.json';
import aethelgardManifest from '@/data/manifests/chronicles-of-aethelgard.json';
import alchemistManifest from '@/data/manifests/the-alchemist.json';
import atomicHabitsManifest from '@/data/manifests/atomic-habits.json';
import fatePreludeManifest from '@/data/manifests/fate-stay-night-prelude.json';

const MANIFEST_REGISTRY: Record<string, BookManifest> = {
  'chronicles-of-aethelgard': aethelgardManifest as unknown as BookManifest,
  'the-alchemist': alchemistManifest as unknown as BookManifest,
  'atomic-habits': atomicHabitsManifest as unknown as BookManifest,
  'fate-stay-night-prelude': fatePreludeManifest as unknown as BookManifest,
};

const SMART_CODES: Record<string, string> = {
  '#VN-AETHEL-01': 'chronicles-of-aethelgard',
  '#VN-ALCHEM-02': 'the-alchemist',
  '#VN-ATOMIC-03': 'atomic-habits',
  '#VN-FATE-04': 'fate-stay-night-prelude',
};

export const useLibraryStore = defineStore('library', () => {
  const books = ref<BookSummary[]>(
    JSON.parse(localStorage.getItem('gm-library-books') || JSON.stringify(booksData))
  );

  const customManifests = ref<Record<string, BookManifest>>(
    JSON.parse(localStorage.getItem('gm-custom-manifests') || '{}')
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

  const saveCustomManifests = () => {
    localStorage.setItem('gm-custom-manifests', JSON.stringify(customManifests.value));
  };

  const getBookById = (id: string) => {
    return books.value.find(b => b.id === id);
  };

  const findBookByIsbn = (isbnInput: string): BookSummary | null => {
    const cleanIsbn = isbnInput.replace(/[-\s]/g, '').trim().toLowerCase();
    return books.value.find(b => b.isbn.replace(/[-\s]/g, '').toLowerCase() === cleanIsbn) || null;
  };

  const findBookByCodeOrIsbn = (query: string): { book: BookSummary | null; source: 'isbn' | 'smart_code' | 'title' | 'none' } => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return { book: null, source: 'none' };

    // 1. Check Smart Grimoire Codes (#VN-...)
    const upperQuery = cleanQuery.toUpperCase();
    if (SMART_CODES[upperQuery]) {
      const bookId = SMART_CODES[upperQuery];
      const matched = books.value.find(b => b.id === bookId);
      if (matched) return { book: matched, source: 'smart_code' };
    }

    // 2. Check direct ISBN match
    const byIsbn = findBookByIsbn(cleanQuery);
    if (byIsbn) return { book: byIsbn, source: 'isbn' };

    // 3. Check by ID or title match
    const lower = cleanQuery.toLowerCase();
    const byIdOrTitle = books.value.find(b => b.id.toLowerCase() === lower || b.title.toLowerCase().includes(lower));
    if (byIdOrTitle) return { book: byIdOrTitle, source: 'title' };

    return { book: null, source: 'none' };
  };

  const generateCustomManifest = (book: BookSummary, customParagraphs?: string[]): BookManifest => {
    const paragraphs = customParagraphs && customParagraphs.length > 0
      ? customParagraphs
      : [
          `Selamat datang di buku digital interaktif "${book.title}". Ini adalah awal dari sebuah petualangan sastra baru yang dirancang khusus untuk pengalaman membaca kinetik.`,
          book.synopsis || 'Kata demi kata terbentang di atas kanvas imajinasi, menyatu dalam harmoni visual dan narasi yang tenang.',
          'Setiap paragraf adalah langkah menuju kedalaman makna, membuka gerbang pengetahuan bagi para cendekiawan pembaca sejati.',
        ];

    const nodeIds: string[] = [];
    const nodes: BookManifest['nodes'] = {};

    paragraphs.forEach((pText, idx) => {
      const nodeId = `node-custom-${idx + 1}`;
      nodeIds.push(nodeId);
      nodes[nodeId] = {
        id: nodeId,
        text: pText,
        speaker: idx === 0 ? book.author : undefined,
        speakerTitle: idx === 0 ? 'Pengarang' : undefined,
        cgId: 'cg-custom-ambient',
        bgmId: 'bgm-custom-ambient',
        highlightedTerms: idx === 0 ? [book.title.split(' ')[0] || 'Genmoire'] : [],
      };
    });

    const manifest: BookManifest = {
      manifestId: `manifest-${book.id}`,
      bookId: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      synopsis: book.synopsis,
      genre: book.genres,
      tags: ['Koleksi Pribadi', 'BYOB', 'Kinetic Mode'],
      isbn: book.isbn,
      epubHash: 'custom-' + Date.now(),
      estimatedReadTimeMinutes: book.estimatedReadMinutes,
      totalChapters: 1,
      authorControl: {
        hasCustomAssets: false,
        allowsAiVisuals: true,
        supportsPureKineticMode: true,
      },
      pageChallenge: {
        question: `Buka halaman 1 buku ${book.title}, apa kata pertama?`,
        pageNumber: 1,
        expectedWord: paragraphs[0]?.split(' ')[0]?.toLowerCase() || 'selamat',
        hint: 'Kata pembuka buku.',
      },
      cgs: {
        'cg-custom-ambient': {
          id: 'cg-custom-ambient',
          url: book.coverUrl,
          alt: `Ilustrasi kanvas untuk ${book.title}`,
          prompt: `Cinematic artistic atmospheric lighting for ${book.title}`,
          isAiGenerated: true,
        },
      },
      bgms: {
        'bgm-custom-ambient': {
          id: 'bgm-custom-ambient',
          title: 'Ambient Library Sanctuary (Warm Piano)',
          url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
          loop: true,
          volume: 0.5,
        },
      },
      explains: {
        [book.title.split(' ')[0] || 'Genmoire']: {
          term: book.title.split(' ')[0] || 'Genmoire',
          contextType: 'plot',
          shortDefinition: `Istilah utama dalam semesta buku "${book.title}".`,
          inContextExplanation: `Frasa ini menjadi simbol inti perjalanan karakter dan dinamika narasi dalam karya "${book.title}".`,
          authorNote: 'Catatan terkurasi untuk buku pribadi.',
        },
      },
      chapters: [
        {
          id: 'ch-1',
          title: 'Bab I: Pembuka Kisah',
          order: 1,
          nodeIds,
        },
      ],
      nodes,
    };

    customManifests.value[book.id] = manifest;
    saveCustomManifests();
    return manifest;
  };

  const getManifestByBookId = (bookId: string): BookManifest | null => {
    if (MANIFEST_REGISTRY[bookId]) {
      return MANIFEST_REGISTRY[bookId];
    }
    if (customManifests.value[bookId]) {
      return customManifests.value[bookId];
    }
    const book = getBookById(bookId);
    if (book) {
      return generateCustomManifest(book);
    }
    return aethelgardManifest as unknown as BookManifest;
  };

  const getPageChallenge = (bookId: string) => {
    const manifest = getManifestByBookId(bookId);
    if (manifest && manifest.pageChallenge) {
      return manifest.pageChallenge;
    }
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
    return { success: false, message: 'ISBN tidak ditemukan di pangkalan data buku resmi.' };
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

  const verifyByEpubFile = (bookId: string, _fileName: string): boolean => {
    unlockBook(bookId);
    return true;
  };

  const submitEpubForReview = (
    fileName: string,
    data: {
      isbn?: string;
      title?: string;
      author?: string;
      synopsis?: string;
    }
  ): BookSummary => {
    const cleanTitle = data.title?.trim() || fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
    const bookId = `submitted-${Date.now()}`;

    const newBook: BookSummary = {
      id: bookId,
      title: formattedTitle,
      author: data.author?.trim() || 'Penulis / Pengunggah',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      synopsis: data.synopsis?.trim() || `Pengajuan adaptasi visual novel dari file "${fileName}". Sedang dalam proses kurasi oleh tim Genmoire (Estimasi persetujuan: 7x24 jam).`,
      genres: ['Pengajuan Baru', 'Menunggu Approval'],
      isbn: data.isbn?.trim() || `REQ-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedReadMinutes: 25,
      isUnlocked: false,
      isCustomAuthorMode: false,
      progressPercent: 0,
      currentChapterId: 'ch-1',
      lastReadDate: new Date().toISOString().split('T')[0],
    };

    books.value.unshift(newBook);
    saveBooks();

    generateCustomManifest(newBook);
    return newBook;
  };

  const toggleAuthorCustomMode = (bookId: string) => {
    const book = books.value.find(b => b.id === bookId);
    if (book) {
      book.isCustomAuthorMode = !book.isCustomAuthorMode;
      saveBooks();
    }
  };

  const simulateByobVerification = async (fileName: string): Promise<{ hash: string; matchedBook?: BookSummary }> => {
    const hash = 'md5-' + Math.random().toString(36).substring(2, 10);
    const matchedBook = books.value[0];
    return { hash, matchedBook };
  };

  return {
    books,
    activeFilter,
    searchQuery,
    recentlyReadBook,
    getBookById,
    findBookByIsbn,
    findBookByCodeOrIsbn,
    getManifestByBookId,
    getPageChallenge,
    generateCustomManifest,
    unlockBook,
    verifyIsbn,
    verifyPageChallenge,
    verifyByEpubFile,
    submitEpubForReview,
    simulateByobVerification,
    toggleAuthorCustomMode,
  };
});

