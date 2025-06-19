#!/usr/bin/env node

import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { exit } from 'process';

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize clients
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Get git commit information
 * @param {string} commitHash - The commit hash to process
 * @returns {object} - Commit data including hash, message, and diff
 */
function getCommitInfo(commitHash) {
  try {
    // Get commit message
    const commitMessage = execSync(
      `git log -1 --pretty=%B ${commitHash}`,
      { encoding: 'utf8' }
    ).trim();

    // Get commit diff (limited to avoid token limits)
    const commitDiff = execSync(
      `git show ${commitHash} --pretty=format: --name-status`,
      { encoding: 'utf8' }
    ).trim();

    // Get full diff for context (limit lines to avoid token overflow)
    const fullDiff = execSync(
      `git show ${commitHash} --pretty=format: -U3`,
      { encoding: 'utf8' }
    ).trim();

    return {
      hash: commitHash,
      message: commitMessage,
      fileChanges: commitDiff,
      diff: fullDiff.substring(0, 8000) // Limit to ~8k chars for OpenAI
    };
  } catch (error) {
    console.error('Error getting commit info:', error.message);
    throw error;
  }
}

/**
 * Generate summary and embeddings using OpenAI
 * @param {object} commitInfo - Commit information
 * @returns {object} - Summary and embedding
 */
async function generateSummaryAndEmbedding(commitInfo) {
  try {
    const prompt = `
Analyze this Git commit and provide a concise technical summary:

Commit Message: ${commitInfo.message}
File Changes: ${commitInfo.fileChanges}
Code Diff: ${commitInfo.diff}

Please provide a 2-3 sentence summary covering:
1. What was changed/added/removed
2. The technical impact or purpose
3. Any notable patterns or architectural decisions

Keep it technical but accessible.`;

    // Generate summary
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.3
    });

    const summary = summaryResponse.choices[0].message.content;

    // Generate embedding for semantic search
    const embeddingText = `${commitInfo.message} ${summary}`;
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: embeddingText,
    });

    return {
      summary,
      embedding: embeddingResponse.data[0].embedding
    };
  } catch (error) {
    console.error('Error generating summary/embedding:', error.message);
    throw error;
  }
}

/**
 * Store commit data in Supabase
 * @param {object} commitInfo - Commit information
 * @param {string} summary - Generated summary
 * @param {number[]} embedding - Generated embedding vector
 */
async function storeCommitData(commitInfo, summary, embedding) {
  try {
    const { data, error } = await supabase
      .from('brain_commits')
      .insert({
        commit_hash: commitInfo.hash,
        commit_message: commitInfo.message,
        summary: summary,
        embedding: embedding
      });

    if (error) {
      // Handle unique constraint violation (commit already processed)
      if (error.code === '23505') {
        console.log(`✓ Commit ${commitInfo.hash} already processed`);
        return;
      }
      throw error;
    }

    console.log(`✓ Commit ${commitInfo.hash} processed and stored`);
  } catch (error) {
    console.error('Error storing commit data:', error.message);
    throw error;
  }
}

/**
 * Main processing function
 * @param {string} commitHash - The commit hash to process
 */
async function processCommit(commitHash = 'HEAD') {
  try {
    console.log(`🔄 Processing commit: ${commitHash}`);

    // Validate environment variables
    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing required environment variables: OPENAI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
    }

    // Get actual commit hash if HEAD or short hash provided
    const fullHash = execSync(`git rev-parse ${commitHash}`, { encoding: 'utf8' }).trim();
    
    // Get commit information
    const commitInfo = getCommitInfo(fullHash);
    
    // Generate summary and embedding
    const { summary, embedding } = await generateSummaryAndEmbedding(commitInfo);
    
    // Store in Supabase
    await storeCommitData(commitInfo, summary, embedding);
    
    console.log('🎉 Commit processing complete!');
    
  } catch (error) {
    console.error('❌ Commit processing failed:', error.message);
    exit(1);
  }
}

// CLI interface
const commitHash = process.argv[2] || 'HEAD';
processCommit(commitHash); 