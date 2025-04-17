
import React from 'react';
import { OutreachAccountCard } from './OutreachAccountCard';
import { OutreachAccount } from '@/types/outreach';

interface AccountsGridProps {
  accounts: OutreachAccount[];
  onEditAccount: (account: OutreachAccount) => void;
  platform?: 'instagram' | 'linkedin';
  industryFilter?: string;
}

export const AccountsGrid = ({ 
  accounts, 
  onEditAccount, 
  platform, 
  industryFilter 
}: AccountsGridProps) => {
  const filteredAccounts = accounts.filter(account => {
    if (platform && account.platform !== platform) return false;
    if (industryFilter && account.industry_focus !== industryFilter) return false;
    return true;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAccounts.map(account => (
        <OutreachAccountCard
          key={account.id}
          account={account}
          onEditClick={onEditAccount}
        />
      ))}
    </div>
  );
};
