'use client';

import NewsSubmissionForm from '@/components/news/NewsSubmissionForm';

export default function NewsSubmitPage() {
  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <NewsSubmissionForm />
      </div>
    </div>
  );
}
