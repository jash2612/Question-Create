import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function QuestionList({ refreshKey }) {
  const [questions, setQuestions] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Questions:', data);
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please check database connection.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await axios.delete(`/api/questions?id=${id}`);
      if (res.status === 200) {
        setQuestions(questions.filter((q) => q.id !== id));
        alert('Question deleted successfully!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(`Error deleting question: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [refreshKey]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">Saved Questions</h2>
      {error && (
        <div className="bg-error/10 text-error p-4 rounded-lg mb-8 text-center animate-fade-in">
          {error}
        </div>
      )}
      {questions.length === 0 ? (
        <p className="text-text text-center">No questions saved yet.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-6 border border-gray-200 rounded-xl bg-card shadow-custom hover:shadow-lg transition duration-300 animate-scale-in"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-text">{question.text}</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-error hover:text-red-700 transition duration-200"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => toggleExpand(question.id)}
                    className="text-primary hover:text-blue-700"
                  >
                    {expanded[question.id] ? (
                      <ChevronUpIcon className="w-6 h-6" />
                    ) : (
                      <ChevronDownIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
              {expanded[question.id] && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-text">
                    <span className="font-medium">Section:</span> {question.section.name} |{' '}
                    <span className="font-medium">Subsection:</span> {question.subsection.name} |{' '}
                    <span className="font-medium">Type:</span> {question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                  </p>
                  <div>
                    <h4 className="text-sm font-medium text-text">Options:</h4>
                    <ul className="list-disc pl-6 mt-2 space-y-3">
                      {question.options.map((option, index) => (
                        <li key={index} className="text-sm text-text">
                          {option.text} <span className="text-gray-500">(Marks: {option.marks})</span>
                          {option.image && (
                            <div className="mt-2">
                              <img src={option.image} alt="Option" className="h-24 w-auto rounded-lg shadow-sm" />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
