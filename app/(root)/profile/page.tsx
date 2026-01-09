'use client';

import { UserProfile } from '@/components/UserProfile';

const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Premium Member',
  image: undefined,
};

export default function ProfilePage() {
  return (
    <div className="py-8">
      <UserProfile user={mockUser} />
    </div>
  );
}
