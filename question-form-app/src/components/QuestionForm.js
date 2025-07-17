import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

export default function QuestionForm({ onQuestionSaved }) {
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [formData, setFormData] = useState({
    sectionId: '',
    subsectionId: '',
    questionText: '',
    questionType: 'single',
    options: [{ text: '', marks: 0, image: '' }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/sections')
      .then((res) => res.json())
      .then((data) => {
        console.log('Sections:', data);
        setSections(data);
      })
      .catch((err) => {
        console.error('Fetch sections error:', err);
        setError('Failed to load sections. Please check database connection.');
      });
  }, []);

  useEffect(() => {
    if (formData.sectionId) {
      fetch(`/api/subsections?sectionId=${formData.sectionId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Subsections:', data);
          setSubsections(data);
          setFormData({ ...formData, subsectionId: '' });
        })
        .catch((err) => {
          console.error('Fetch subsections error:', err);
          setError('Failed to load subsections. Please check database connection.');
        });
    } else {
      setSubsections([]);
      setFormData({ ...formData, subsectionId: '' });
    }
  }, [formData.sectionId]);

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', marks: 0, image: '' }],
    });
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length > 1) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleImageUpload = (index, url) => {
    const newOptions = [...formData.options];
    newOptions[index].image = url;
    setFormData({ ...formData, options: newOptions });
  };

  const openCloudinaryWidget = (index) => {
    if (!window.cloudinary) {
      setError('Cloudinary widget not loaded. Please check network or refresh the page.');
      return;
    }
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'question_form',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log('Image uploaded:', result.info.secure_url);
          handleImageUpload(index, result.info.secure_url);
        } else if (error) {
          console.error('Cloudinary upload error:', error);
          setError('Image upload failed. Please check Cloudinary configuration or try again.');
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.sectionId || !formData.subsectionId || !formData.questionText) {
      setError('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }
    for (const option of formData.options) {
      if (!option.text || isNaN(option.marks)) {
        setError('All options must have text and valid marks.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await axios.post('/api/questions', {
        sectionId: parseInt(formData.sectionId),
        subsectionId: parseInt(formData.subsectionId),
        questionText: formData.questionText,
        questionType: formData.questionType,
        options: formData.options,
      });
      if (response.status === 200) {
        setFormData({
          sectionId: '',
          subsectionId: '',
          questionText: '',
          questionType: 'single',
          options: [{ text: '', marks: 0, image: '' }],
        });
        if (onQuestionSaved) onQuestionSaved();
        alert('Question saved successfully!');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError(`Error saving question: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card p-8 rounded-2xl shadow-custom max-w-4xl mx-auto my-12 animate-scale-in">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">Create New Question</h2>
      {error && (
        <div className="bg-error/10 text-error p-4 rounded-lg mb-8 text-center animate-fade-in">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-text mb-3">Section</label>
          <select
            value={formData.sectionId}
            onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition duration-300 bg-background"
            required
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text mb-3">Subsection</label>
          <select
            value={formData.subsectionId}
            onChange={(e) => setFormData({ ...formData, subsectionId: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition duration-300 bg-background"
            required
            disabled={!formData.sectionId}
          >
            <option value="">Select Subsection</option>
            {subsections.map((subsection) => (
              <option key={subsection.id} value={subsection.id}>
                {subsection.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text mb-3">Question Text</label>
          <textarea
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition duration-300 bg-background"
            required
            placeholder="Enter your question"
            rows="5"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text mb-3">Question Type</label>
          <select
            value={formData.questionType}
            onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition duration-300 bg-background"
          >
            <option value="single">Single Choice</option>
            <option value="multi">Multiple Choice</option>
          </select>
        </div>

        {formData.options.map((option, index) => (
          <div key={index} className="p-6 border border-gray-200 rounded-lg bg-background animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">Option {index + 1}</h3>
              {formData.options.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-error hover:text-red-700 transition duration-200"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-text mb-3">Option Text</label>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition duration-300 bg-white"
                  required
                  placeholder="Enter option text"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-3">Marks</label>
                <input
                  type="number"
                  value={option.marks}
                  onChange={(e) => handleOptionChange(index, 'marks', e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition duration-300 bg-white"
                  required
                  placeholder="Enter marks"
                  step="0.1"
                />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-text mb-3">Option Image (Optional)</label>
                <button
                  type="button"
                  onClick={() => openCloudinaryWidget(index)}
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                >
                  Upload Image
                </button>
                {option.image && (
                  <div className="mt-3">
                    <img src={option.image} alt="Option" className="h-32 w-auto rounded-lg shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={handleAddOption}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <PlusIcon className="w-6 h-6 mr-2" /> Add Option
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-secondary text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </form>
    </div>
  );
}
