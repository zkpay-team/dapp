import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ChatBubbleLeftIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export const navigation = [
  { name: 'Wallet', href: '/', icon: ShieldCheckIcon, current: false },
  { name: 'Send', href: '/send', icon: ArrowUpRightIcon, current: false },
  { name: 'Receive', href: '/receive', icon: ArrowDownLeftIcon, current: false },
  { name: 'Groups', href: '/groups', icon: UserGroupIcon, current: false },
  { name: 'Chat', href: '/messaging', icon: ChatBubbleLeftIcon, current: false },
];
