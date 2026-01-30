import { SubmitForm } from '@/components/submit';

export const metadata = {
  title: 'Submit App - Tokamak App Hub',
  description: 'Submit your blockchain app to the Tokamak App Hub',
};

export default function SubmitPage() {
  return (
    <div className="container py-8">
      <SubmitForm />
    </div>
  );
}
