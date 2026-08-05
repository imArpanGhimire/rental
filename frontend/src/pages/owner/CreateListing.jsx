import AppShell from "../../components/layout/AppShell.jsx";
import Sidebar from "../../components/layout/Sidebar.jsx";
import CreateListingForm from "../../features/listings/components/CreateListingForm.jsx";

const links = [
  { to: "/owner", label: "Overview" },
  { to: "/owner/listings", label: "My Listings" },
  { to: "/owner/listings/new", label: "Add Listing" },
];

export default function CreateListing() {
  return (
    <AppShell sidebar={<Sidebar links={links} />}>
      <h1 className="font-display text-3xl text-text mb-6">
        Add a new listing
      </h1>
      <CreateListingForm />
    </AppShell>
  );
}
