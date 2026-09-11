export interface DiscussionItem {
  id: string;
  materialId: string;
  materialTitle?: string;
  courseCode?: string;
  authorName: string;
  department: string;
  level: number;
  type: 'question' | 'solution';
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
  upvotes: number;
  isVerified?: boolean;
  createdAt: string;
}

export const BASELINE_DISCUSSIONS: Record<string, DiscussionItem[]> = {
  'default': [
    {
      id: 'disc-1',
      materialId: 'default',
      materialTitle: 'CSC 142 Past Question (2023/2024)',
      courseCode: 'CSC 142',
      authorName: 'CSC Level Rep',
      department: 'Computer Science',
      level: 200,
      type: 'solution',
      content: 'For Question 3(b) on time complexity: remember that binary search requires a sorted array first. The searching complexity is O(log n), but if the array is unsorted and you must sort it first, overall complexity becomes O(n log n).',
      codeSnippet: 'def binary_search(arr, target):\n    low = 0\n    high = len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1',
      codeLanguage: 'python',
      upvotes: 14,
      isVerified: true,
      createdAt: '2 hours ago'
    },
    {
      id: 'disc-2',
      materialId: 'default',
      materialTitle: 'CSC 142 Past Question (2023/2024)',
      courseCode: 'CSC 142',
      authorName: 'Amina S.',
      department: 'Software Engineering',
      level: 100,
      type: 'question',
      content: 'Can someone explain the marking scheme difference between Question 1 and Question 2? Do we need to write pseudo-code or complete syntax?',
      upvotes: 6,
      isVerified: false,
      createdAt: '1 day ago'
    }
  ],
  'mat-gst111': [
    {
      id: 'disc-gst-1',
      materialId: 'mat-gst111',
      materialTitle: 'GST 111 First Semester Past Questions & Comprehension Guide',
      courseCode: 'GST 111',
      authorName: 'Faculty Academic Officer',
      department: 'General Studies',
      level: 100,
      type: 'solution',
      content: 'Marking Guide for 2024 Section B (Concord & Sentence Structure): Note that with "neither...nor" and "either...or", the verb agrees with the subject closer to it (proximity rule). Example: Neither the lecturer nor the students were present.',
      upvotes: 28,
      isVerified: true,
      createdAt: '3 days ago'
    }
  ],
  'mat-swe142': [
    {
      id: 'disc-swe-1',
      materialId: 'mat-swe142',
      materialTitle: 'SWE 142 Software Engineering Principles Past Questions',
      courseCode: 'SWE 142',
      authorName: 'David O.',
      department: 'Software Engineering',
      level: 100,
      type: 'solution',
      content: 'Solution for Question 4 (Agile vs Waterfall): Highlight iterative delivery, client collaboration over contract negotiation, and response to change over following a rigid plan.',
      upvotes: 19,
      isVerified: true,
      createdAt: 'Yesterday'
    },
    {
      id: 'disc-swe-2',
      materialId: 'mat-swe142',
      materialTitle: 'SWE 142 Software Engineering Principles Past Questions',
      courseCode: 'SWE 142',
      authorName: 'Grace K.',
      department: 'Computer Science',
      level: 100,
      type: 'question',
      content: 'Does Dr. mark down if we don’t draw UML activity diagrams for the ATM case study in Question 2?',
      upvotes: 4,
      isVerified: false,
      createdAt: '5 hours ago'
    }
  ]
};

export function getDiscussionsForMaterial(materialId: string): DiscussionItem[] {
  if (typeof window === 'undefined') return BASELINE_DISCUSSIONS[materialId] || BASELINE_DISCUSSIONS.default || [];
  try {
    const raw = localStorage.getItem(`fci_disc_${materialId}`);
    if (raw) return JSON.parse(raw);
    return BASELINE_DISCUSSIONS[materialId] || BASELINE_DISCUSSIONS.default || [];
  } catch (e) {
    return BASELINE_DISCUSSIONS[materialId] || BASELINE_DISCUSSIONS.default || [];
  }
}

export function saveDiscussionsForMaterial(materialId: string, items: DiscussionItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`fci_disc_${materialId}`, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save discussions:', e);
  }
}

export function getAllDiscussions(): DiscussionItem[] {
  if (typeof window === 'undefined') {
    return Object.values(BASELINE_DISCUSSIONS).flat();
  }

  const allItems: DiscussionItem[] = [];
  const seenIds = new Set<string>();

  // First scan localStorage for all keys starting with fci_disc_
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('fci_disc_')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list: DiscussionItem[] = JSON.parse(raw);
          list.forEach(item => {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              allItems.push(item);
            }
          });
        }
      }
    }
  } catch (e) {
    console.warn('Error reading discussion storage keys:', e);
  }

  // Also include baseline items if not overridden
  Object.values(BASELINE_DISCUSSIONS).flat().forEach(item => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      allItems.push(item);
    }
  });

  return allItems;
}

export function verifyDiscussionSolution(materialId: string, id: string, verified: boolean): void {
  const list = getDiscussionsForMaterial(materialId);
  const updated = list.map(item => item.id === id ? { ...item, isVerified: verified } : item);
  saveDiscussionsForMaterial(materialId, updated);
}

export function deleteDiscussionItem(materialId: string, id: string): void {
  const list = getDiscussionsForMaterial(materialId);
  const updated = list.filter(item => item.id !== id);
  saveDiscussionsForMaterial(materialId, updated);
}

export function addOfficialDiscussion(
  materialId: string, 
  data: Omit<DiscussionItem, 'id' | 'materialId' | 'createdAt' | 'upvotes' | 'isVerified'>
): DiscussionItem {
  const list = getDiscussionsForMaterial(materialId);
  const newItem: DiscussionItem = {
    ...data,
    id: `official_${Date.now()}`,
    materialId,
    upvotes: 1,
    isVerified: true,
    createdAt: 'Just now'
  };
  saveDiscussionsForMaterial(materialId, [newItem, ...list]);
  return newItem;
}

