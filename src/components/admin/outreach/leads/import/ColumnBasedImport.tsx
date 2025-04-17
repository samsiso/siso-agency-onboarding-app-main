
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useBulkImport } from '@/hooks/useBulkImport';
import { ImportProgress } from './ImportProgress';
import { ValidationErrors } from '../ValidationErrors';

export const ColumnBasedImport = () => {
  const [usernames, setUsernames] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [posts, setPosts] = useState('');
  const [fullNames, setFullNames] = useState('');
  const [bios, setBios] = useState('');
  const [profileUrls, setProfileUrls] = useState('');
  
  const {
    isProcessing,
    importProgress,
    validationErrors,
    processImport,
  } = useBulkImport();

  const handleImport = useCallback(async () => {
    // Split by newlines and remove empty lines
    const cleanAndSplit = (str: string) => str.split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const usernameList = cleanAndSplit(usernames);
    if (!usernameList.length) {
      toast.error('Please add at least one username');
      return;
    }

    const followersList = cleanAndSplit(followers);
    const followingList = cleanAndSplit(following);
    const postsList = cleanAndSplit(posts);
    const fullNamesList = cleanAndSplit(fullNames);
    const biosList = cleanAndSplit(bios);
    const profileUrlsList = cleanAndSplit(profileUrls);

    const maxLength = usernameList.length;

    // Convert strings to numbers or null for numeric fields
    const parseNumber = (str: string) => {
      const num = Number(str);
      return isNaN(num) ? null : num;
    };

    const leads = usernameList.map((username, index) => ({
      username,
      followers_count: followersList[index] ? parseNumber(followersList[index]) : null,
      following_count: followingList[index] ? parseNumber(followingList[index]) : null,
      posts_count: postsList[index] ? parseNumber(postsList[index]) : null,
      full_name: fullNamesList[index] || null,
      bio: biosList[index] || null,
      profile_url: profileUrlsList[index] || null,
    }));

    const success = await processImport(leads);
    if (success) {
      // Clear all inputs after successful import
      setUsernames('');
      setFollowers('');
      setFollowing('');
      setPosts('');
      setFullNames('');
      setBios('');
      setProfileUrls('');
    }
  }, [usernames, followers, following, posts, fullNames, bios, profileUrls, processImport]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="usernames" className="font-medium">
            Usernames (required)
          </Label>
          <Textarea
            id="usernames"
            placeholder="Enter usernames, one per line"
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="followers" className="font-medium">
            Followers Count
          </Label>
          <Textarea
            id="followers"
            placeholder="Enter follower counts, one per line"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="following" className="font-medium">
            Following Count
          </Label>
          <Textarea
            id="following"
            placeholder="Enter following counts, one per line"
            value={following}
            onChange={(e) => setFollowing(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="posts" className="font-medium">
            Posts Count
          </Label>
          <Textarea
            id="posts"
            placeholder="Enter post counts, one per line"
            value={posts}
            onChange={(e) => setPosts(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullNames" className="font-medium">
            Full Names
          </Label>
          <Textarea
            id="fullNames"
            placeholder="Enter full names, one per line"
            value={fullNames}
            onChange={(e) => setFullNames(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bios" className="font-medium">
            Bios
          </Label>
          <Textarea
            id="bios"
            placeholder="Enter bios, one per line"
            value={bios}
            onChange={(e) => setBios(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileUrls" className="font-medium">
            Profile URLs
          </Label>
          <Textarea
            id="profileUrls"
            placeholder="Enter profile URLs, one per line"
            value={profileUrls}
            onChange={(e) => setProfileUrls(e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      <ValidationErrors errors={validationErrors} />
      
      <ImportProgress 
        isProcessing={isProcessing}
        importProgress={importProgress}
      />

      <Button
        onClick={handleImport}
        disabled={isProcessing || !usernames.trim()}
        className="w-full"
      >
        Import Leads
      </Button>
    </div>
  );
};
