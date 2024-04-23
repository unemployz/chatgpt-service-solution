
import Head from 'next/head'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PlusCircle } from 'react-feather';

export default function Home() {
  const [username, setUsername] = useState(null as null|string);
  const [usernameFld, setUsernameFld] = useState("");

  const startNewChatTitle = "Type a Message and Submit to Start a New Conversation";

  const [historyListLoaded, setHistoryListLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [historyList, setHistoryList] = useState([] as any[]);
  const [msg, setMsg] = useState("");
  const [sessionTitle, setSessionTitle] = useState(startNewChatTitle);

  const [conversation, setConversation] = useState([] as any[]);

  const [sessionId, setSessionId] = useState(null as null|string);

  const loadHistoryList = async (username: string) => {
    var hs = await fetch('/api/history?userId=' + username);
    var h = await hs.json();
    setHistoryList([...h, {_id: null}]);
    setHistoryListLoaded(true);
  };

  const loadHistoryBySessionId = async (id: string, title: string) => {
    if (id === sessionId) return;
    if (id === null) {
      setConversation([]);
      setSessionId(null);
      setSessionTitle(startNewChatTitle);
      return;
    }
    setIsLoading(true)
    var cv = await fetch('/api/history/' + id + '?userId=' + username);
    var c = await cv.json();
    setConversation(c.history);
    setIsLoading(false);
    setSessionId(id);
    setSessionTitle(title);
  };

  const postMessage = async (message: string) => {
    setIsLoading(true);
    setMsg("");
    var url = sessionId ? '/api/chat/' + sessionId : '/api/chat';
    var msg = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({message: message, userId: username})
    });
    var m = await msg.json();
    if (!sessionId) {
      setHistoryList([{_id: m.sessionId, title: m.title}, ...historyList]);
      setSessionId(m.sessionId);
      setSessionTitle(m.title);
    }
    setConversation([...conversation, {
      input: message,
      output: m.response,
      timestamp: new Date().getTime()
    }]);
    setIsLoading(false);
  };

  const handleKeyUp = (e: any) => {
    if (e.key === 'Enter' && e.shiftKey) {
      postMessage(msg);
    }
  };

  function formatDate(timestamp: number) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var hour = date.getHours().toString().padStart(2, '0');
    var minute = date.getMinutes().toString().padStart(2, '0');
  
    return day + '/' + month + '/' + year + ' ' + hour + ':' + minute;
  }
  
  function onLogin (e: any) {
    e.preventDefault();
    setUsername(usernameFld);
  }

  useEffect(() => {
    if (username) {
      loadHistoryList(username);
      setConversation([]);
      setSessionId(null);
    }
  }, [username]);
  return (
    <>
      <Head>
        <title>cgpt</title>
        <meta name="description" content="cgpt" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {username !== null ? <div className="parent bg-slate-600 h-screen grid grid-cols-8">
        <section className="sidebar bg-slate-800 md:col-span-1 hidden sm:inline-flex flex-col h-screen">