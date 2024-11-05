import React from 'react';
import './qu.css';
import avaterstanding from './image 03.png'

export default function Qu() {

  const faqData = [
    {
      question: "Is Tech-E a real person?",
      answer: "Even though talking to Tech-E feels like talking to a human being, rest assured — it's 100% artificial intelligence."
    },
    {
      question: "How does Tech-E learn?",
      answer: "Tech-E learns through conversations with you. The more you interact, the more it understands your personality, interests, and communication style."
    },
    {
      question: "Is there a cost to use Tech-E?",
      answer: "Tech-E offers both free and premium versions. The basic features are available for free, while additional capabilities are available with a paid subscription."
    },
  ];

  return (
    <div className="hero-02">
      <div className="container mt-5 faq-layout">
        <div className="faq-image">
          <img src={avaterstanding} alt="FAQ Illustration" />
        </div>
        <div className="faq-content">
          <h1 className="FAQ-Head text-center mb-5">Frequently Asked Questions</h1>
          <div className="faq-container">
            {faqData.map((item, index) => (
              <div key={index} className="faq-item">
                <div className="question">
                  <span>{item.question}</span>
                </div>
                <div className="answer">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
