import { useState } from 'react';
import QuestionForm from '../components/QuestionForm';
import QuestionList from '../components/QuestionList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleQuestionSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-primary mb-12 text-center">Question Form App</h1>
        <QuestionForm onQuestionSaved={handleQuestionSaved} />
        <QuestionList refreshKey={refreshKey} />
      </div>
    </div>
  );
}
