import React, { useState, useEffect, useMemo } from 'react';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  pubDate: string;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface NewsPageProps {
  allNews: NewsItem[];
  categories: Category[];
  colorClasses: Record<string, string>;
}

const NewsPage: React.FC<NewsPageProps> = ({ allNews, categories, colorClasses }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');

  // Get URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || '';
    const query = urlParams.get('q') || '';
    
    setCurrentCategory(category);
    setSearchQuery(query);
    setSearchInput(query);
  }, []);

  // Helper functions
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getCategoryColor = (categoryId: string): string => {
    const foundCategory = categories.find(cat => cat.id === categoryId);
    return foundCategory ? foundCategory.color : "gray";
  };

  const getCategoryName = (categoryId: string): string => {
    const foundCategory = categories.find(cat => cat.id === categoryId);
    return foundCategory ? foundCategory.name : "Uncategorized";
  };

  // Filter news based on current category and search query
  const filteredNews = useMemo(() => {
    let filtered = [...allNews];
    
    // Apply category filter
    if (currentCategory) {
      filtered = filtered.filter(news => news.category === currentCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(query) || 
        news.excerpt.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [allNews, currentCategory, searchQuery]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const url = new URL(window.location.href);
    if (categoryId) {
      url.searchParams.set('category', categoryId);
    } else {
      url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url.toString());
    setCurrentCategory(categoryId);
  };

  // Handle search
  const handleSearch = () => {
    const query = searchInput.trim();
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url.toString());
    setSearchQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              {currentCategory 
                ? `Berita - ${getCategoryName(currentCategory)}`
                : 'Berita & Pengumuman'
              }
            </h1>
            <p className="text-lg text-green-100">
              Informasi terbaru seputar kegiatan, prestasi, dan pengumuman penting dari Pondok Pesantren Nurul Islam
            </p>
          </div>
        </div>
      </section>
      
      {/* News Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Kategori</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left block px-4 py-2 rounded-lg transition-colors ${
                        !currentCategory ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      Semua Berita
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full text-left block px-4 py-2 rounded-lg transition-colors ${
                          currentCategory === cat.id 
                            ? colorClasses[cat.color]
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Cari Berita</h2>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Kata kunci..." 
                    className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {/* Category title if filtered */}
              {currentCategory && (
                <div className="mb-8 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Kategori: <span>{getCategoryName(currentCategory)}</span>
                  </h2>
                  <p className="text-gray-600">Menampilkan {filteredNews.length} artikel</p>
                </div>
              )}
              
              {/* News Grid */}
              {filteredNews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {filteredNews.map((news) => {
                    const categoryColorClass = colorClasses[getCategoryColor(news.category)];
                    
                    return (
                      <article key={news.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img 
                          alt={news.title} 
                          className="w-full h-48 object-cover"
                          src={`https://placehold.co/600x400/009688/FFFFFF?text=${encodeURIComponent(news.title)}`} 
                          // TODO: Fix image source when available
                          // src={news.image} 
                          // onError={(e) => {
                          //   const target = e.target as HTMLImageElement;
                          //   target.src = `https://placehold.co/600x400/009688/FFFFFF?text=${encodeURIComponent(news.title)}`;
                          //   target.classList.add('placeholder-img');
                          // }}
                        />
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColorClass}`}>
                              {getCategoryName(news.category)}
                            </span>
                            <time className="text-sm text-gray-500">{formatDate(news.pubDate)}</time>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                            <a href={`/berita/${news.slug}`} className="hover:text-green-600 transition-colors">
                              {news.title}
                            </a>
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{news.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Oleh: {news.author}</span>
                            <a href={`/berita/${news.slug}`} className="text-green-600 font-medium hover:text-green-700 transition-colors inline-flex items-center">
                              Baca Selengkapnya
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* No Results */
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Tidak Ada Berita</h3>
                  <p className="text-gray-600">Belum ada berita untuk kategori ini. Silakan pilih kategori lain atau kembali ke semua berita.</p>
                  <button 
                    onClick={() => {
                      handleCategoryChange('');
                      setSearchQuery('');
                      setSearchInput('');
                    }}
                    className="mt-4 inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Lihat Semua Berita
                  </button>
                </div>
              )}
              
              {/* Pagination - Show if there are many results */}
              {filteredNews.length > 10 && (
                <div className="mt-12 flex justify-center">
                  <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button aria-current="page" className="relative inline-flex items-center px-4 py-2 border border-green-500 bg-green-50 text-sm font-medium text-green-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Dapatkan Update Berita Terbaru</h2>
            <p className="mb-6 text-green-100">Berlangganan newsletter kami untuk mendapatkan informasi terkini seputar kegiatan dan pengumuman penting</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsPage;