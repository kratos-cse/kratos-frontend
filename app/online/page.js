import CategoryLanding from "@/components/kratos/CategoryLanding";

export default function OnlinePage() {
  return (
    <CategoryLanding
      slug="online"
      title="Online"
      heading={<><span className="brand-red">ON</span><span className="brand-gold">L</span><span className="brand-red">INE</span></>}
    />
  );
}
