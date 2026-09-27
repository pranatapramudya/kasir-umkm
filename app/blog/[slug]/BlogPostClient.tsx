'use client';

import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft, ChevronLeft, ArrowRight, Share2 } from 'lucide-react';

interface BlogPostClientProps {
  post: {
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    date: string;
    tags: string[];
    featured: boolean;
    content: string;
  };
  slug: string;
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLang = '';
  let inList = false;
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushCodeBlock = () => {
    if (codeBlockContent) {
      elements.push(
        <pre key={`code-${elements.length}`} className="bg-slate-900 text-green-300 p-4 rounded overflow-x-auto text-sm my-4">
          <code>{codeBlockContent.trim()}</code>
        </pre>
      );
      codeBlockContent = '';
      inCodeBlock = false;
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      const ListComponent = listType === 'ul' ? 'ul' : 'ol';
      elements.push(
        <ListComponent key={`list-${elements.length}`} className="ml-4 my-2 space-y-1 text-slate-900">
          {listItems.map((item, i) => (
            <li key={i} className="ml-4">{item}</li>
          ))}
        </ListComponent>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushList();
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
      } else {
        flushCodeBlock();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={i} className="text-3xl font-black text-slate-900 mt-8 mb-4">{line.slice(2)}</h1>);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-3">{line.slice(3)}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={i} className="text-xl font-bold text-slate-900 mt-6 mb-2">{line.slice(4)}</h3>);
      continue;
    }
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="min-w-full border border-slate-200 text-slate-900">
            <tbody>
              <tr className="bg-slate-100">
                {line.split('|').slice(1, -1).map((cell, ci) => (
                  <th key={ci} className="border border-slate-200 px-3 py-2 text-left font-medium">{cell.trim()}</th>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    if (line.match(/^[-*]\s+\[ \]/) || line.match(/^[-*]\s+\[x\]/)) {
      flushList();
      inList = true;
      listType = 'ul';
      listItems.push(line.replace(/^[-*]\s+\[[ x]\]\s*/, ''));
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(line.slice(2));
      continue;
    }
    if (line.match(/^\d+\.\s/)) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(line.replace(/^\d+\.\s/, ''));
      continue;
    }
    if (line.startsWith('> ')) {
      flushList();
      elements.push(<blockquote key={i} className="border-l-4 border-blue-500 pl-4 italic text-slate-800 my-4">{line.slice(2)}</blockquote>);
      continue;
    }
    if (line.startsWith('---')) {
      flushList();
      elements.push(<hr key={i} className="my-8 border-slate-200" />);
      continue;
    }
    if (line.trim() === '') {
      if (inList) {
        flushList();
      } else {
        elements.push(<div key={i} className="h-4" />);
      }
      continue;
    }

    if (inList) {
      flushList();
    }
    const processedLine = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code className="bg-slate-100 text-slate-900 px-1 rounded text-sm font-mono">$1</code>');
    elements.push(<p key={i} className="text-slate-900 leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: processedLine }} />);
  }

  flushCodeBlock();
  flushList();

  return <div className="max-w-none">{elements}</div>;
}

export default function BlogPostClient({ post, slug }: BlogPostClientProps) {
  const url = `https://www.pjtechumkm.com/blog/${slug}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link disalin ke clipboard!');
      });
    }
  };

  return (
    <article className="min-h-screen bg-white">
      <nav className="bg-slate-50 border-b border-slate-100" aria-label="Breadcrumb">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-slate-500 hover:text-slate-700">Beranda</Link></li>
            <li><ChevronLeft className="w-4 h-4 text-slate-400" /></li>
            <li><Link href="/blog" className="text-slate-500 hover:text-slate-700">Blog</Link></li>
            <li><ChevronLeft className="w-4 h-4 text-slate-400" /></li>
            <li><span className="text-slate-900 font-medium truncate max-w-[200px]">{post.category}</span></li>
          </ol>
        </div>
      </nav>

      <header className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{post.category}</span>
            <time className="text-sm text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm mb-8">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
            <div className="flex items-center gap-1">
              {post.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{tag}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Bagikan:</span>
            <button
              onClick={handleShare}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 flex items-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
              target="_blank" rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank" rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 24 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {renderMarkdown(post.content)}

        <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Siap Digitalisasi Bisnis Anda?</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">Coba PJTECH gratis 14 hari. Setup 5 menit. Fitur lengkap 4 vertikal. Support tim Indonesia.</p>
          <Link href="/sign-up?redirect_url=/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
            Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
          </Link>
        </div>
      </main>
    </article>
  );
}