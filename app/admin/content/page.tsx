import Link from 'next/link';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Content Management | AFYA Admin',
  description: 'Manage website content',
};

export default function ContentManagementPage() {
  const contentSections = [
    {
      title: 'Programs',
      description: 'Manage wellness programs, types, and descriptions',
      href: '/admin/content/programs',
      icon: '🏃',
    },
    {
      title: 'Testimonials',
      description: 'Review and manage client testimonials',
      href: '/admin/content/testimonials',
      icon: '💬',
    },
    {
      title: 'Impact Areas',
      description: 'Update impact area descriptions and metrics',
      href: '/admin/content/impact-areas',
      icon: '🎯',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-gray-600 mt-1">
          Manage website content and public-facing information
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="text-4xl mb-4">{section.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <p className="text-gray-600">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
