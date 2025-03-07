import UserList from '../components/UserList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          User Management Dashboard
        </h1>
        <UserList />
      </div>
    </main>
  );
}
