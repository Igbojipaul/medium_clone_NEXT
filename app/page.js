// app/page.jsx
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="bg-gray-400 h-[80vh] flex items-center ">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-20 px-6">
          {/* Text */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Write the next great story.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join millions of readers and writers on this platform—where ideas
              take flight.
            </p>
            <div className="flex space-x-4">
              <Link href="/register">
                <p className="border-2 border-black border-accent text-accent px-6 py-3 rounded-lg bg-black text-white hover:bg-accent hover:text-black hover:bg-transparent transition">
                  Get started
                </p>
              </Link>
              <Link href="/login">
                <p className="border-2 border-accent text-accent px-6 py-3 rounded-lg hover:bg-accent hover:text-white hover:bg-black hover:border-black transition">
                  Sign in
                </p>
              </Link>
            </div>
          </div>
          {/* Illustration */}
          <div className="flex justify-center">
            <Image
              src="/images/illustration.png"
              alt="Writing illustration"
              width={500}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            {
              title: "Publish anything",
              desc: "From personal essays to detailed tutorials—our editor handles it all.",
              icon: "/images/publish.png",
            },
            {
              title: "Engage with readers",
              desc: "Comments, highlights, and feedback tools to foster conversation.",
              icon: "/images/engage.png",
            },
            {
              title: "Grow your reach",
              desc: "Built-in SEO and sharing features help you find your audience.",
              icon: "/images/grow.png",
            },
          ].map((feat) => (
            <div key={feat.title} className="text-center">
              <div className="mx-auto mb-4 w-39 h-20">
                <Image
                  src={feat.icon}
                  alt={feat.title}
                  width={100}
                  height={64}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-gray-600">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 text-gray-700 text-sm">
          {[
            { title: "About", links: ["Our Story", "Team", "Careers"] },
            { title: "Help", links: ["Support", "Terms of Service", "Privacy Policy"] },
            { title: "Write", links: ["Guides", "Tips", "Best Practices"] },
            { title: "Community", links: ["Developers", "Partners", "Affiliates"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold mb-2">{col.title}</h4>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Pablo Slava. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
