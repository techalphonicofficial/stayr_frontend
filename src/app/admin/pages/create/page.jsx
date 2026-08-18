import PageForm from '@/components/admin/cms/PageForm';

export const metadata = {
  title: 'Create Page | STAYR Admin',
};

export default function CreatePage() {
  return <PageForm isNew={true} />;
}
