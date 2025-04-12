import './FAQModule.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import faqData from '../faqs.json';
import { FaSearch } from "react-icons/fa";
import ContentLoader from 'react-content-loader';
import axios from 'axios';
import { debounce } from 'lodash';
import LanguageSelect from './LanguageSelect';

const LoadingSkeleton = () => {
    return (
      <ContentLoader
        speed={1}
        width="85%"
        height={150}
        viewBox="0 0 1000 150"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        style={{ width: '85%', height: 'auto' }}
      >
        <rect x="0" y="0" rx="5" ry="5" width="1000" height="30" />
        <rect x="0" y="40" rx="5" ry="5" width="800" height="20" />
        <rect x="0" y="70" rx="5" ry="5" width="500" height="20" />
      </ContentLoader>
    );
};
  
const FAQModule = ({ setIsScrolled }) => {
    const [activeStaticQuestion, setActiveStaticQuestion] = useState(null);
    const [activeDynamicQuestion, setActiveDynamicQuestion] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Admissions");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [originalResults, setOriginalResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [translating, setTranslating] = useState(false);
    const faqContainerRef = useRef(null);

    const handleScroll = () => {
        if (faqContainerRef.current) {
          const scrollTop = faqContainerRef.current.scrollTop;
          if (scrollTop > 50) { // Threshold of 50px
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        }
    };
    
    useEffect(() => {
    const faqContainer = faqContainerRef.current;
    if (faqContainer) {
        faqContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
        if (faqContainer) {
        faqContainer.removeEventListener('scroll', handleScroll);
        }
    };
    }, []);
  
    const toggleStaticQuestion = (index) => {
      setActiveStaticQuestion(activeStaticQuestion === index ? null : index);
    };
  
    const toggleDynamicQuestion = (index) => {
      setActiveDynamicQuestion(activeDynamicQuestion === index ? null : index);
    };
  
    const handleCategoryChange = (category) => {
      setSelectedCategory(category);
      setActiveStaticQuestion(null);
    };
  
    // Debounced search handler
    const debouncedSearch = useCallback(
      debounce(async (value) => {
        if (value.length === 0) {
          setSearchResults([]);
          setOriginalResults([]);
          setError(null);
          setLoading(false);
          return;
        }
  
        setLoading(true);
  
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/search`, { query: value });
          const { detected_language, results } = response.data;
  
          setSelectedLanguage(detected_language);
  
          // Store original English FAQs
          const englishFAQs = results.map(faq => ({
            id: faq.id,
            score: faq.score,
            question: faq.original_question,
            answer: faq.original_answer,
            category: faq.category
          }));
          setOriginalResults(englishFAQs);
  
          // Set translated FAQs
          setSearchResults(results);
  
          setError(null);
        } catch (error) {
          console.error("Error fetching FAQs:", error);
          if (error.response) {
            setError(error.response.data.detail);
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
          setSearchResults([]);
          setOriginalResults([]);
        } finally {
          setLoading(false);
        }
      }, 300),
      []
    );
  
    const handleSearchChange = (e) => {
      const value = e.target.value;
      if (value.length <= 100) {
        setSearchTerm(value);
        debouncedSearch(value);
      } else {
        setSearchTerm(value.slice(0, 100));
        debouncedSearch(value.slice(0, 100));
        alert("Search term cannot exceed 100 characters.");
      }
    };
  
    // Determine whether to show the language container
    const shouldShowLanguageContainer = searchTerm.trim().length > 0;
  
    return (
        <div className='faq-container-root' ref={faqContainerRef}>
            <section className="faq-section">
                <h2 className="faq-section-title">Frequently Asked <span>Questions</span></h2>
        
                <div className="faq-section-para-container">
                <p>
                    Whether you're a prospective student looking for program details, a parent seeking
                    information about our curriculum, or a current student with inquiries about your studies,
                    we're here to help.
                </p>
                </div>
        
                {/* Search Bar */}
                <div className="search-bar-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    maxLength={100}
                />
                <button className="search-button">
                    <FaSearch style={{ fontSize: '22px', color: 'white' }} />
                </button>
        
                {/* Character Counter */}
                <div className="character-counter">
                    {searchTerm.length}/100
                </div>
                </div>
        
                {/* Language Selection Dropdown */}
                <div className={`language-selection-container ${shouldShowLanguageContainer ? 'visible' : 'hidden'}`}>
                <label htmlFor="language-select" className="language-label">Translate To:</label>
                <LanguageSelect 
                    selectedLanguage={selectedLanguage} 
                    setSelectedLanguage={setSelectedLanguage} 
                    originalResults={originalResults}
                    updateTranslatedResults={setSearchResults}
                    setTranslating={setTranslating}
                    translating={translating}
                />
                </div>
        
                <div className="content-container">
                {loading && (
                    <div className={`loading-skeleton ${loading ? 'visible' : 'hidden'}`}>
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    </div>
                )}
        
                {!loading && error && (
                    <div className="error-message">{error}</div>
                )}
        
                {!loading && !error && (
                    <>
                    {/* Dynamic FAQ Content */}
                    <div className={`faq-content-wrapper ${searchResults.length > 0 ? 'show' : 'hidden'}`}>
                        <div className="faq-content">
                        <div className="faq-title">
                            <h3>Search Results</h3>
                        </div>
                        <div className="faq-items">
                            {searchResults.map((item, index) => (
                            <div className={`faq-item ${activeDynamicQuestion === index ? 'open' : ''}`} key={`dynamic-${index}`}>
                                <div className="faq-question" onClick={() => toggleDynamicQuestion(index)}>
                                <h3>{item.question}</h3>
                                <span>{activeDynamicQuestion === index ? '-' : '+'}</span>
                                </div>
                                <div className="faq-answer">
                                <p>{item.answer}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
        
                    {/* Static FAQ Content */}
                    <div className={`faq-content-wrapper ${searchResults.length === 0 ? 'show' : 'hidden'}`}>
                        <div className="faq-categories">
                        {Object.keys(faqData).map((category) => (
                            <button
                            key={category}
                            className={selectedCategory === category ? "active" : ""}
                            onClick={() => handleCategoryChange(category)}
                            >
                            {category}
                            </button>
                        ))}
                        </div>
        
                        <div className="faq-content">
                        <div className="faq-title">
                            <h3>{selectedCategory}</h3>
                        </div>
                        <div className="faq-items">
                            {faqData[selectedCategory].map((item, index) => (
                            <div className={`faq-item ${activeStaticQuestion === index ? 'open' : ''}`} key={`static-${index}`}>
                                <div className="faq-question" onClick={() => toggleStaticQuestion(index)}>
                                <h3>{item.question}</h3>
                                <span>{activeStaticQuestion === index ? '-' : '+'}</span>
                                </div>
                                <div className="faq-answer">
                                <p>{item.answer}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </>
                )}
                </div>
            </section>
        </div>
    );
};

export default FAQModule;