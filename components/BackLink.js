import Link from "next/link";
import Image from "next/image";

export default function BackLink({ href, text }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-2 text-sm hover:text-primary-700"
      aria-label={text}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 8L2 12L6 16" />
        <path d="M2 12H22" />
      </svg>
      {text}
    </Link>
  );
}
