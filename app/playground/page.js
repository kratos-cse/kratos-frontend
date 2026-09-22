import CategoryLanding from "@/components/kratos/CategoryLanding";

export default function PlaygroundPage() {
  return (
    <CategoryLanding
      slug="playground"
      title="Playground"
      heading={<><span className="brand-red">PL</span><span className="brand-gold">A</span><span className="brand-red">YGROUND</span></>}
    />
  );
}
