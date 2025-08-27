'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { getMessages, putMessage } from './actions';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

interface Message {
  _id: string;
  _creationTime: number;
  author: string;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const fetchedMessages = await getMessages();
      setMessages(fetchedMessages);
      setError(null);
    } catch (err) {
      setError('Failed to load messages. Please try again.');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      setIsLoading(true);
      await putMessage(newMessage);
      setNewMessage('');
      await fetchMessages(); // Refresh messages after sending
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Chat App</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Sign in to start chatting with your friends and colleagues.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/sign-in"
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="w-full py-2 px-4 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg text-center border border-gray-300 dark:border-gray-600 transition duration-200"
                >
                  Create Account
                </Link>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Secure, fast, and easy to use messaging platform</p>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
          <header className="p-4 bg-white dark:bg-gray-800 shadow">
            <h1 className="text-xl font-bold text-center">Chat App</h1>
          </header>

          <main className="flex-1 overflow-hidden flex flex-col p-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 && !isLoading ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message._id} className="flex flex-col">
                    <div className="flex items-end">
                      <div className="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-[80%]">
                        {message.content}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(message._creationTime)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.author}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                disabled={isLoading || !newMessage.trim()}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </main>
        </div>
      </SignedIn>
    </>
  );
}
