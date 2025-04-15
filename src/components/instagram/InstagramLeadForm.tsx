
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInstagramLeads } from '@/hooks/useInstagramLeads';

export const InstagramLeadForm = () => {
  const [username, setUsername] = useState('');
  const { addLead } = useInstagramLeads();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    await addLead.mutateAsync({ username });
    setUsername('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end mb-4">
      <div className="flex-1">
        <Input
          placeholder="Instagram username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <Button type="submit" variant="default">
        Add Lead
      </Button>
    </form>
  );
};
