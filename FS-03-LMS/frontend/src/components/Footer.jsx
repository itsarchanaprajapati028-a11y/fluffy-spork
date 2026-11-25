import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
    learn: [
      { label: 'Browse Courses', href: '/courses' },
      { label: 'Live Classes', href: '/live-classes' },
      { label: 'Become an Instructor', href: '/teach' },
      { label: 'Enterprise', href: '/enterprise' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Certificates', href: '/certificates' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  };
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="FS-03 LMS Home">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">FS-03 LMS</span>
            </Link>
            <p className="text-gray-600 text-sm mb-6 max-w-xs">
              Learn without limits. Access thousands of courses and live classes from expert instructors worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="YouTube">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 7.655 0 12 0 12s0 4.345.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 7.506.505 9.377.505s7.506 0 9.378-.505a3.015 3.015 0 0 0 2.122-2.136C24 16.345 24 12 24 12s0-4.345-.502-5.814zM12 17.25c-2.623 0-4.75-2.127-4.75-4.75s2.127-4.75 4.75-4.75 4.75 2.127 4.75 4.75-2.127 4.75-4.75 4.75zm0-7.5c-1.518 0-2.75 1.232-2.75 2.75s1.232 2.75 2.75 2.75 2.75-1.232 2.75-2.75-1.232-2.75-2.75-2.75zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Learn</h3>
            <ul className="space-y-2">
              {footerLinks.learn.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} FS-03 LMS. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Payment Methods:</span>
              <div className="flex items-center gap-2">
                <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 6.2V18c0 1.65-1.35 3-3 3H6.5c-1.65 0-3-1.35-3-3V6c0-1.65 1.35-3 3-3H12v2H6.5c-.83 0-1.5.67-1.5 1.5v12c0 .83.67 1.5 1.5 1.5H17.5c.83 0 1.5-.67 1.5-1.5V6.5c0-.83-.67-1.5-1.5-1.5h-5V6.2z"/></svg>
                <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 6.2V18c0 1.65-1.35 3-3 3H6.5c-1.65 0-3-1.35-3-3V6c0-1.65 1.35-3 3-3H12v2H6.5c-.83 0-1.5.67-1.5 1.5v12c0 .83.67 1.5 1.5 1.5H17.5c.83 0 1.5-.67 1.5-1.5V6.5c0-.83-.67-1.5-1.5-1.5h-5V6.2z"/></svg>
                <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 6.2V18c0 1.65-1.35 3-3 3H6.5c-1.65 0-3-1.35-3-3V6c0-1.65 1.35-3 3-3H12v2H6.5c-.83 0-1.5.67-1.5 1.5v12c0 .83.67 1.5 1.5 1.5H17.5c.83 0 1.5-.67 1.5-1.5V6.5c0-.83-.67-1.5-1.5-1.5h-5V6.2z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}