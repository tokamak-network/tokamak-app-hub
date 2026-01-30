import { CreateRepoForm } from "@/components/create-repo/CreateRepoForm";

export const metadata = {
  title: "Create Repository - Tokamak App Hub",
  description: "Create a new repository in the Tokamak Network organization",
};

export default function CreateRepoPage() {
  return (
    <div className="container py-8">
      <CreateRepoForm />
    </div>
  );
}
