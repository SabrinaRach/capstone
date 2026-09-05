import Link from "next/link";
import { useRouter } from "next/router";

const navigationItems = [
  {
    href: "/entries",
    label: "Entries",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-9A2.25 2.25 0 0 0 17.25 3h-10.5A2.25 2.25 0 0 0 4.5 5.25v13.5A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-1.5m-6-10.5h3m-3 3h3m-9 3h6"
        />
      </svg>
    ),
  },
  {
    href: "/categories",
    label: "Categories",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h4.19a2.25 2.25 0 0 1 1.59.66l1.06 1.06a2.25 2.25 0 0 0 1.59.66H18A2.25 2.25 0 0 1 20.25 9v8.25A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25V6.75Z"
        />
      </svg>
    ),
  },
];

export default function BottomNavigation() {
  const router = useRouter();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-secondary-100/80 bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-20 max-w-2xl items-center justify-around px-4">
        {navigationItems.map((item) => {
          const isActive =
            router.pathname === item.href ||
            router.pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-24 flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "text-primary-500"
                  : "text-secondary-500 hover:text-secondary-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
