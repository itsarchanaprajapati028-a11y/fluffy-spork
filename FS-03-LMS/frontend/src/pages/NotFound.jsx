import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { HomeIcon, SearchIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <SearchIcon className="h-12 w-12 text-gray-400" />
        </div>
        
        <div>
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-gray-600">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved or doesn't exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
        
        <div className="pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Or search for what you need:
          </p>
          <form className="mt-4" action="/courses" method="GET">
            <div className="flex gap-2">
              <input
                type="search"
                name="search"
                placeholder="Search courses..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoComplete="off"
              />
              <Button type="submit" className="px-4 py-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NotFound;