// 🚀 TELEGRAM BOT ENHANCED FEATURES
// Voice Responses + Notion API Integration

// 🎤 VOICE RESPONSE SYSTEM
class VoiceResponseSystem {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.voiceEnabled = process.env.VOICE_RESPONSES_ENABLED === 'true';
    this.defaultVoice = process.env.TTS_VOICE || 'Fritz-PlayAI'; // Default English voice
  }

  // Convert text to speech using Groq TTS (PlayAI Dialog)
  async textToSpeech(text, voice = null) {
    if (!this.voiceEnabled || !this.groqApiKey) {
      return null;
    }

    try {
      console.log('🎤 Converting text to speech with Groq TTS...');
      
      // Use provided voice or default
      const selectedVoice = voice || this.defaultVoice;
      
      const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'playai-tts', // Groq's TTS model
          input: text.substring(0, 10000), // Groq TTS limit is 10K characters
          voice: selectedVoice,
          response_format: 'mp3'
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq TTS API error: ${response.statusText}`);
      }

      return await response.buffer();
    } catch (error) {
      console.error('❌ Text-to-speech failed:', error.message);
      return null;
    }
  }

  // Get available Groq TTS voices
  getAvailableVoices() {
    return {
      english: [
        'Arista-PlayAI', 'Atlas-PlayAI', 'Basil-PlayAI', 'Briggs-PlayAI',
        'Calum-PlayAI', 'Celeste-PlayAI', 'Cheyenne-PlayAI', 'Chip-PlayAI',
        'Cillian-PlayAI', 'Deedee-PlayAI', 'Fritz-PlayAI', 'Gail-PlayAI',
        'Indigo-PlayAI', 'Mamaw-PlayAI', 'Mason-PlayAI', 'Mikail-PlayAI',
        'Mitch-PlayAI', 'Quinn-PlayAI', 'Thunder-PlayAI'
      ],
      arabic: [
        'Ahmad-PlayAI', 'Amira-PlayAI', 'Khalid-PlayAI', 'Nasser-PlayAI'
      ]
    };
  }

  // Detect if user prefers voice responses
  detectVoicePreference(message) {
    const voiceKeywords = [
      'voice', 'speak', 'say it', 'tell me', 'audio',
      'voice note', 'voice message', 'read it out', 'play audio'
    ];
    
    return voiceKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  // Auto-detect language and select appropriate voice
  detectLanguageAndVoice(text) {
    // Simple Arabic detection (can be enhanced)
    const arabicPattern = /[\u0600-\u06FF]/;
    
    if (arabicPattern.test(text)) {
      return {
        model: 'playai-tts-arabic',
        voice: 'Ahmad-PlayAI' // Default Arabic voice
      };
    } else {
      return {
        model: 'playai-tts',
        voice: this.defaultVoice // Default English voice
      };
    }
  }
}// 📝 NOTION API INTEGRATION
class NotionTaskManager {
  constructor() {
    this.notionApiKey = process.env.NOTION_API_KEY;
    this.databaseId = process.env.NOTION_DATABASE_ID;
    this.apiVersion = '2022-06-28';
  }

  // Get all tasks from Notion database
  async getTasks(status = null) {
    try {
      console.log('📝 Fetching tasks from Notion...');
      
      const filter = status ? {
        property: 'Status',
        select: {
          equals: status
        }
      } : {};

      const response = await fetch(`https://api.notion.com/v1/databases/${this.databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.notionApiKey}`,
          'Notion-Version': this.apiVersion,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: Object.keys(filter).length > 0 ? filter : undefined,
          sorts: [
            {
              property: 'Created',
              direction: 'descending'
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseNotionTasks(data.results);
    } catch (error) {
      console.error('❌ Failed to fetch Notion tasks:', error.message);
      throw error;
    }
  }  // Add new task to Notion database
  async addTask(taskData) {
    try {
      console.log('📝 Adding task to Notion...');
      
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.notionApiKey}`,
          'Notion-Version': this.apiVersion,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: {
            database_id: this.databaseId
          },
          properties: {
            'Name': {
              title: [
                {
                  text: {
                    content: taskData.title
                  }
                }
              ]
            },
            'Description': {
              rich_text: [
                {
                  text: {
                    content: taskData.description || ''
                  }
                }
              ]
            },
            'Status': {
              select: {
                name: taskData.status || 'Not Started'
              }
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        url: data.url,
        title: taskData.title
      };
    } catch (error) {
      console.error('❌ Failed to add Notion task:', error.message);
      throw error;
    }
  }  // Parse Notion API response to readable format
  parseNotionTasks(results) {
    return results.map(page => {
      const props = page.properties;
      
      return {
        id: page.id,
        url: page.url,
        title: props.Name?.title?.[0]?.text?.content || 'Untitled',
        description: props.Description?.rich_text?.[0]?.text?.content || '',
        status: props.Status?.select?.name || 'Not Started',
        priority: props.Priority?.select?.name || 'Medium',
        dueDate: props['Due Date']?.date?.start || null,
        created: props.Created?.date?.start || page.created_time
      };
    });
  }

  // Format tasks for display
  formatTasksForMessage(tasks, limit = 10) {
    if (tasks.length === 0) {
      return "📝 No tasks found in your Notion database.";
    }

    const taskList = tasks.slice(0, limit).map((task, index) => {
      const statusEmoji = this.getStatusEmoji(task.status);
      const priorityEmoji = this.getPriorityEmoji(task.priority);
      const dueDateText = task.dueDate ? `\n📅 Due: ${new Date(task.dueDate).toLocaleDateString()}` : '';
      
      return `${index + 1}. ${statusEmoji} **${task.title}**
${priorityEmoji} Priority: ${task.priority}${dueDateText}
📝 ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}`;
    }).join('\n\n');

    const totalCount = tasks.length > limit ? `\n\n📊 Showing ${limit} of ${tasks.length} tasks` : '';
    
    return `📝 **Your Notion Tasks:**\n\n${taskList}${totalCount}`;
  }

  // Get emoji for task status
  getStatusEmoji(status) {
    const statusEmojis = {
      'Not Started': '⏳',
      'In Progress': '🔄',
      'Completed': '✅',
      'On Hold': '⏸️',
      'Cancelled': '❌'
    };
    return statusEmojis[status] || '📝';
  }

  // Get emoji for task priority
  getPriorityEmoji(priority) {
    const priorityEmojis = {
      'Low': '🟢',
      'Medium': '🟡',
      'High': '🟠',
      'Urgent': '🔴'
    };
    return priorityEmojis[priority] || '⚪';
  }  // Detect task-related messages
  detectTaskIntent(message) {
    const taskKeywords = {
      read_tasks: ['my tasks', 'show tasks', 'list tasks', 'what tasks', 'tasks today', 'todo list'],
      add_task: ['add task', 'create task', 'new task', 'task:', 'todo:', 'reminder:'],
      complete_task: ['complete task', 'finish task', 'done task', 'mark complete'],
      update_task: ['update task', 'change task', 'modify task']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(taskKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }
    
    return null;
  }

  // Parse task from message
  parseTaskFromMessage(message) {
    // Extract task details from natural language
    const taskMatch = message.match(/(?:add task|create task|new task|task:|todo:|reminder:)\s*(.+?)(?:\s+(?:priority|due|deadline)|\s*$)/i);
    const title = taskMatch ? taskMatch[1].trim() : message.trim();
    
    // Extract priority
    const priorityMatch = message.match(/priority\s*(high|medium|low|urgent)/i);
    const priority = priorityMatch ? priorityMatch[1].charAt(0).toUpperCase() + priorityMatch[1].slice(1).toLowerCase() : 'Medium';
    
    return {
      title,
      priority,
      description: `Created via Telegram on ${new Date().toLocaleDateString()}`
    };
  }
}

module.exports = {
  VoiceResponseSystem,
  NotionTaskManager
};