
import { Account, HandoverNote, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Mille',
    emoji: '👩‍💼',
    role: 'Staff Member'
  },
  {
    id: '2',
    name: 'Frederik',
    emoji: '👨‍💻',
    role: 'Staff Member'
  },
  {
    id: '3',
    name: 'Emma',
    emoji: '👩‍🔧',
    role: 'Manager'
  }
];

export const mockAccount: Account = {
  id: '1',
  name: '66 Guldsmeden',
  email: 'admin@guldsmeden.com',
  subscriptionTier: 'premium',
  users: mockUsers,
  currentUserId: '1'
};

// Get dates in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

export const mockNotes: HandoverNote[] = [
  {
    id: '1',
    userId: '1',
    priority: 'low',
    content: `Konference Øresundsbroen\n19. marts\n3 PAX\n\n- 08.30 - Morgen - Morgenmadsbuffet inklusiv kaffe, te, juice, vand.\n- 12.00 - Frokost - Økologisk frokost med 1 glas vinølvand. Fokus på kvalitet, smag og sundhed.\n- 13.00 - Eftermiddag - Kaffe, te, forskellige slags tørt & sødt.\n- 16.30 - Ved mødets afslutning byder vi på et glas vinøl og snacks i baren eller i vores hyggelige gårdhave.\n\nPayment done by C/N\nAwaiting allergies, times slots from C/N`,
    date: yesterday,
    isCompleted: false,
    createdAt: '2023-03-19T08:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    priority: 'low',
    content: '123: vand',
    date: yesterday,
    isCompleted: true,
    createdAt: '2023-03-19T09:00:00Z',
    completedAt: '2023-03-19T12:00:00Z'
  },
  {
    id: '3',
    userId: '2',
    priority: 'medium',
    content: '200 - er checket ud',
    date: yesterday,
    isCompleted: true,
    createdAt: '2023-03-19T14:00:00Z',
    completedAt: '2023-03-19T16:00:00Z'
  },
  {
    id: '4',
    userId: '2',
    priority: 'medium',
    content: '224 - på højre side af sengen virker stikkontakten/remoten ikke. Gæsten vender tilbage med hvornår hun er ude af værelset',
    date: yesterday,
    isCompleted: true,
    createdAt: '2023-03-19T15:00:00Z',
    completedAt: '2023-03-19T17:00:00Z',
    editedAt: '2023-03-19T15:30:00Z'
  },
  // Notes for today
  {
    id: '7',
    userId: '3',
    priority: 'high',
    content: 'Room 301 - Guest reported AC not working properly. Maintenance has been notified and will check during the day.',
    date: today,
    isCompleted: false,
    createdAt: '2023-03-20T07:30:00Z'
  },
  {
    id: '8',
    userId: '2',
    priority: 'medium',
    content: 'Breakfast service was short-staffed today. Please ensure adequate coverage for tomorrow morning as we have several group checkouts.',
    date: today,
    isCompleted: false,
    createdAt: '2023-03-20T10:15:00Z'
  },
  // Notes for tomorrow
  {
    id: '5',
    userId: '1',
    priority: 'medium',
    content: `20/3 Konference Dottir Nordic Design\n09 - 16\n6 PAX\n\nMeeting 895,- per person\n\n09.00 Coffee, tea, water & morning snack\n12.30 Lunch incl 1 drink\n14.00 Coffe, tea & cake\n16.00 Drink in the bar\n\npayment: on the day to reception\n\nAllergies: None`,
    date: tomorrow,
    isCompleted: false,
    createdAt: '2023-03-19T16:00:00Z'
  },
  {
    id: '6',
    userId: '1',
    priority: 'low',
    content: 'SENGE\n141',
    date: tomorrow,
    isCompleted: false,
    createdAt: '2023-03-19T16:30:00Z'
  }
];

export const getActiveUser = () => {
  const user = mockUsers.find(user => user.id === mockAccount.currentUserId);
  return user || mockUsers[0];
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
