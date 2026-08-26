import { Link } from 'react-router-dom';

export function DummyPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-amazon-text mb-2">Dummy / Secondary Page</h1>
      <p className="text-gray-600 mb-4">
        This verifies multi-page client-side routing with react-router-dom.
      </p>
      <Link
        to="/"
        className="inline-block bg-amazon-yellow hover:bg-amazon-yellow-hover text-black text-sm font-medium py-2 px-4 rounded-full border border-yellow-500 shadow-sm transition"
      >
        &larr; Back to Home
      </Link>
    </div>
  );
}
