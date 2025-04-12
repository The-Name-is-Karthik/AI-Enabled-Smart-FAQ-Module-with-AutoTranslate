import './LanguageSelect.css';
import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';

// Custom LanguageSelect Component
const LanguageSelect = ({ selectedLanguage, setSelectedLanguage, originalResults, updateTranslatedResults, setTranslating, translating }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    const languages = ["English", "Hindi", "Spanish", "German"];
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
      console.log('Dropdown toggled: ', !isOpen); 
    };
  
    // Define a mapping from language names to language codes
    const languageCodes = {
      English: "en",
      Hindi: "hi",
      Spanish: "es",
      German: "de",
    };
  
    const handleLanguageSelect = async (language) => {
      if (language === selectedLanguage) {
        setIsOpen(false);
        return;
      }
  
      setSelectedLanguage(language);
      setIsOpen(false);
  
      if (!originalResults || originalResults.length === 0) {
        // No original results to translate
        return;
      }
  
      setTranslating(true);
  
      try {
        // Extract original English questions and answers
        const originalQuestions = originalResults.map(faq => faq.question);
        const originalAnswers = originalResults.map(faq => faq.answer);
  
        const textsToTranslate = [];
        originalQuestions.forEach((question, idx) => {
          textsToTranslate.push(question);
          textsToTranslate.push(originalAnswers[idx]);
        });
  
        const targetLanguageCode = languageCodes[language];
  
        if (!targetLanguageCode) {
          console.error("Unsupported language selected:", language);
          alert("Selected language is not supported.");
          return;
        }
  
        // Make API call to translate texts
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/translate`, {
          texts: textsToTranslate,
          target_language: targetLanguageCode
        });
  
        const translatedTexts = response.data.translated_texts;
  
        const newTranslatedResults = originalResults.map((faq, idx) => ({
          ...faq,
          question: translatedTexts[idx * 2],
          answer: translatedTexts[idx * 2 + 1]
        }));
  
        // Update the state with translated FAQs
        updateTranslatedResults(newTranslatedResults);
      } catch (error) {
        console.error("Error translating FAQs:", error);
        alert("Failed to translate FAQs. Please try again.");
      }
      finally {
        setTranslating(false);
      }
    };
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [dropdownRef]);
  
    return (
      <div className="language-select-container" ref={dropdownRef}>
        <button
          className="language-select-button"
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={translating}
        >
          {selectedLanguage}
          <span className={`arrow ${isOpen ? 'up' : 'down'}`}></span>
        </button>
        {isOpen && (
          <ul className="language-dropdown" role="listbox" aria-label="Language selection">
            {languages.map((language) => (
              <li
                key={language}
                onClick={() => handleLanguageSelect(language)}
                className="language-option"
                role="option"
                aria-selected={selectedLanguage === language}
              >
                {language}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default LanguageSelect;