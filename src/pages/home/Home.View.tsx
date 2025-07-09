import type { JSX } from "react";
import Layout from "../components/layout";
type HomeViewProps = {
  RenderPage: () => JSX.Element;
};

const HomeView = ({ RenderPage }: HomeViewProps) => {
  return (
    <section className="relative w-full min-h-screen">
      <Layout>{RenderPage()}</Layout>
    </section>
  );
};

export default HomeView;
