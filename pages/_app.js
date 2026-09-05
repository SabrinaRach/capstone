import "@/styles/globals.css";
import Navigation from "../components/Navigation";

export default function App({ Component, pageProps }) {
  return (
    <div className="pb-20">
      <Component {...pageProps} />
      <Navigation />
    </div>
  );
}
