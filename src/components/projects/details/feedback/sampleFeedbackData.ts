import { v4 as uuidv4 } from 'uuid';

export const feedbackData = [
  {
    id: uuidv4(),
    source: 'John Smith (Client)',
    date: '2023-06-15T10:30:00Z',
    type: 'feature',
    status: 'implemented',
    priority: 'high',
    title: 'Add ability to export transaction history',
    description: 'Users need to be able to export their transaction history to CSV or Excel format for financial record keeping.',
    response: 'Implemented in v1.2 with additional PDF export option.'
  },
  {
    id: uuidv4(),
    source: 'Sarah Chen (UX Tester)',
    date: '2023-07-02T14:45:00Z',
    type: 'ui',
    status: 'in-progress',
    priority: 'medium',
    title: 'Improve contrast on dashboard charts',
    description: 'The current color scheme on dashboard charts makes it difficult to distinguish between different data points, especially for users with color vision deficiencies.',
    response: 'We are redesigning the chart color palette with accessibility in mind. Should be available in the next release.'
  },
  {
    id: uuidv4(),
    source: 'Michael Wong (Beta Tester)',
    date: '2023-07-10T08:15:00Z',
    type: 'bug',
    status: 'new',
    priority: 'high',
    title: 'App crashes when processing large transactions',
    description: 'When attempting to process transactions over 10,000 units, the app consistently crashes. This needs to be fixed before release.',
  },
  {
    id: uuidv4(),
    source: 'Emma Davis (Product Manager)',
    date: '2023-07-15T11:20:00Z',
    type: 'feature',
    status: 'new',
    priority: 'medium',
    title: 'Add dark mode support',
    description: 'Many users are requesting a dark mode option for the app. This would be a good addition for the next feature update.',
  },
  {
    id: uuidv4(),
    source: 'Alex Johnson (Developer)',
    date: '2023-07-18T16:30:00Z',
    type: 'performance',
    status: 'in-progress',
    priority: 'medium',
    title: 'Optimize loading times for portfolio page',
    description: 'The portfolio page takes too long to load when users have many assets. We should implement lazy loading and optimize the data fetching.',
    response: 'Working on implementing virtualized lists and optimizing API calls.'
  },
  {
    id: uuidv4(),
    source: 'Lisa Park (Client)',
    date: '2023-07-20T09:45:00Z',
    type: 'feature',
    status: 'rejected',
    priority: 'low',
    title: 'Integrate with Instagram',
    description: 'It would be nice to have Instagram integration to share portfolio performance.',
    response: 'This feature is out of scope for the current project goals and raises security concerns.'
  },
  {
    id: uuidv4(),
    source: 'David Brown (QA Tester)',
    date: '2023-07-22T13:10:00Z',
    type: 'bug',
    status: 'implemented',
    priority: 'high',
    title: 'Authentication token not refreshing properly',
    description: 'Users are being logged out unexpectedly because the authentication token is not refreshing correctly.',
    response: 'Fixed in v1.2.1 by implementing a proper token refresh mechanism.'
  },
  {
    id: uuidv4(),
    source: 'Rachel Kim (UX Designer)',
    date: '2023-07-25T10:00:00Z',
    type: 'ui',
    status: 'new',
    priority: 'low',
    title: 'Redesign success notifications',
    description: 'The current success notifications don\'t stand out enough. They should be more noticeable to provide better feedback to users.',
  }
] as const; 